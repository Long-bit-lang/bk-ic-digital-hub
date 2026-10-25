import nodemailer, { type Transporter } from 'nodemailer';
import { db } from '../db.ts';
import type { SmtpConfig } from '../../src/types/index.ts';

export interface OutboxEmail {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  resetLink?: string;
  verificationLink?: string;
  tempPassword?: string;
  type: 'password_reset' | 'account_invitation' | 'verification' | 'test' | 'temporary_password';
  sentAt: string;
  expiresAt?: string;
  status: 'delivered' | 'failed';
  deliveryMethod?: 'smtp' | 'outbox_fallback';
  deliveryError?: string;
}

// In-memory & test outbox (most recent 50 emails)
const emailOutbox: OutboxEmail[] = [];

export function getEmailOutbox(): OutboxEmail[] {
  return [...emailOutbox];
}

export function clearEmailOutbox(): void {
  emailOutbox.length = 0;
}

/**
 * Robust sanitization for SMTP host strings.
 * Automatically cleans accidental copy-paste artifacts such as:
 * - Trailing "Sao chép", "Copy", etc.
 * - Leading/trailing whitespace
 * - URL schemes (smtp://, https://)
 * - Appended port numbers (:587)
 */
export function sanitizeSmtpHost(rawHost: unknown): string {
  if (!rawHost || typeof rawHost !== 'string') return 'smtp.gmail.com';
  let host = rawHost.trim();
  // Strip url schemes if present (e.g. smtp://, https://)
  host = host.replace(/^[a-zA-Z]+:\/\//, '');
  // Strip port if present in host string (e.g. smtp.gmail.com:587)
  host = host.split(':')[0].trim();
  // Match standard hostname (letters, numbers, dots, hyphens)
  const domainMatch = host.match(/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+)/);
  if (domainMatch) {
    return domainMatch[1];
  }
  // Fallback: take first whitespace-delimited word
  return host.split(/\s+/)[0] || 'smtp.gmail.com';
}

export function sanitizeSmtpPort(rawPort: unknown, isSecure: boolean = false): number {
  if (typeof rawPort === 'number' && !isNaN(rawPort) && rawPort > 0) return rawPort;
  if (typeof rawPort === 'string') {
    const num = parseInt(rawPort.replace(/[^\d]/g, ''), 10);
    if (!isNaN(num) && num > 0) return num;
  }
  return isSecure ? 465 : 587;
}

export function sanitizeSmtpUser(rawUser: unknown): string {
  if (!rawUser || typeof rawUser !== 'string') return '';
  return rawUser.trim().split(/\s+/)[0];
}

export function sanitizeSmtpPass(rawPass: unknown): string {
  if (!rawPass || typeof rawPass !== 'string') return '';
  const cleaned = rawPass.replace(/Sao chép|copy/gi, '').trim();
  const noSpace = cleaned.replace(/[\s-]+/g, '');
  if (/^[a-zA-Z]{16}$/.test(noSpace)) {
    return noSpace;
  }
  return cleaned;
}

export function isPlaceholderValue(val: unknown): boolean {
  if (!val || typeof val !== 'string') return true;
  const lower = val.trim().toLowerCase();
  const placeholders = [
    'example@dut.udn.vn',
    'your_secure_smtp_app_password',
    'your_smtp_app_password',
    'your_password_here',
    'smtp.example.com',
    'example.com',
    'change_me',
    'placeholder'
  ];
  return placeholders.some(p => lower.includes(p));
}

// Transporter caching and connection pooling
let cachedTransporter: Transporter | null = null;
let cachedTransporterKey = '';

function getOrCreateTransporter(key: string, createFn: () => Transporter): Transporter {
  if (cachedTransporter && cachedTransporterKey === key) {
    return cachedTransporter;
  }
  if (cachedTransporter) {
    try {
      cachedTransporter.close();
    } catch (_) {}
  }
  cachedTransporter = createFn();
  cachedTransporterKey = key;
  return cachedTransporter;
}

/**
 * Converts HTML email templates into a clean plain-text version for RFC-compliant
 * multipart/alternative MIME emails. This significantly lowers anti-spam score in
 * Gmail, Outlook, and academic email servers.
 */
export function htmlToPlainText(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '$2: $1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n\s+\n/g, '\n\n')
    .trim();
}

// Determine active SMTP configuration
export function getActiveSmtpConfig(): {
  isConfigured: boolean;
  transporter: Transporter | null;
  from: string;
  source: 'env' | 'db' | 'resend' | 'brevo' | 'none';
  host?: string;
  port?: number;
  user?: string;
  provider?: 'smtp' | 'resend' | 'brevo';
  resendApiKey?: string;
  brevoApiKey?: string;
  replyTo?: string;
} {
  // 0. Check Brevo API (Recommended for sending from @gmail.com to ANY recipient over Port 443 HTTPS without custom domain)
  const rawBrevoKey = process.env.BREVO_API_KEY;
  if (rawBrevoKey && !isPlaceholderValue(rawBrevoKey)) {
    const brevoKey = rawBrevoKey.trim();
    const brevoSender = (process.env.SMTP_USER || process.env.BREVO_SENDER_EMAIL || 'hoanglong280907@gmail.com').trim();
    const brevoName = (process.env.SMTP_FROM_NAME || 'BK-IC Digital Hub').trim();
    return {
      isConfigured: true,
      transporter: null,
      from: `"${brevoName}" <${brevoSender}>`,
      source: 'brevo',
      provider: 'brevo',
      host: 'api.brevo.com (HTTPS Port 443)',
      port: 443,
      user: brevoSender,
      brevoApiKey: brevoKey,
      replyTo: brevoSender
    };
  }

  // 0.5. Check Resend API (Recommended for Render Free tier over port 443 HTTPS)
  const rawResendKey = process.env.RESEND_API_KEY;
  if (rawResendKey && !isPlaceholderValue(rawResendKey)) {
    const resendKey = rawResendKey.trim();
    let resendFrom = (process.env.SMTP_FROM || '').trim();
    const match = resendFrom.match(/<([^>]+)>/);
    const emailInFrom = match ? match[1].toLowerCase() : resendFrom.toLowerCase();

    // Resend strictly forbids sending from public webmail domains (@gmail.com, @yahoo.com, etc.)
    // If not using a verified custom domain, default to Resend onboarding sandbox domain
    const isPublicWebmail = !emailInFrom || /@(gmail\.com|googlemail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com|icloud\.com)$/i.test(emailInFrom);
    if (isPublicWebmail) {
      resendFrom = 'BK-IC Digital Hub <onboarding@resend.dev>';
    }

    const replyToEmail = (process.env.SMTP_USER || (match ? match[1] : resendFrom) || 'hoanglong280907@gmail.com').trim();

    return {
      isConfigured: true,
      transporter: null,
      from: resendFrom,
      source: 'resend',
      provider: 'resend',
      host: 'api.resend.com (HTTPS Port 443)',
      port: 443,
      user: 'Resend API Key',
      resendApiKey: resendKey,
      replyTo: replyToEmail
    };
  }

  // 1. Check environment variables
  const rawEnvHost = process.env.SMTP_HOST;
  const rawEnvUser = process.env.SMTP_USER;
  const rawEnvPass = process.env.SMTP_PASS;

  if (rawEnvUser && rawEnvPass) {
    const envUser = sanitizeSmtpUser(rawEnvUser);
    const envPass = sanitizeSmtpPass(rawEnvPass);
    const envHost = sanitizeSmtpHost(rawEnvHost);
    const envSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';
    const envPort = sanitizeSmtpPort(process.env.SMTP_PORT, envSecure);

    const isPlaceholder = isPlaceholderValue(envUser) || isPlaceholderValue(envPass) || isPlaceholderValue(envHost);
    if (isPlaceholder) {
      return {
        isConfigured: false,
        transporter: null,
        from: '"BK-IC Digital Hub" <no-reply@dut.udn.vn>',
        source: 'none'
      };
    }

    // Sync back sanitized values to process.env to prevent issues elsewhere
    process.env.SMTP_HOST = envHost;
    process.env.SMTP_USER = envUser;

    try {
      const cacheKey = `env:${envHost}:${envPort}:${envSecure}:${envUser}:${envPass}`;
      const transporter = getOrCreateTransporter(cacheKey, () =>
        nodemailer.createTransport({
          host: envHost,
          port: envPort,
          secure: envSecure,
          auth: {
            user: envUser,
            pass: envPass
          },
          family: 4,
          pool: true,
          maxConnections: 3,
          maxMessages: 100,
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000
        } as any)
      );
      return {
        isConfigured: true,
        transporter,
        from: process.env.SMTP_FROM || `"BK-IC Digital Hub" <${envUser}>`,
        source: 'env',
        provider: 'smtp',
        host: envHost,
        port: envPort,
        user: envUser
      };
    } catch (err) {
      console.warn('[EmailService] Failed to create env SMTP transporter:', err);
    }
  }

  // 2. Check DB siteSettings.smtpConfig
  try {
    const store = db.get();
    const dbConfig = store.siteSettings?.smtpConfig;
    if (dbConfig && dbConfig.enabled && dbConfig.user && dbConfig.pass) {
      const dbHost = sanitizeSmtpHost(dbConfig.host);
      const dbSecure = Boolean(dbConfig.secure) || dbConfig.port === 465;
      const dbPort = sanitizeSmtpPort(dbConfig.port, dbSecure);
      const dbUser = sanitizeSmtpUser(dbConfig.user);
      const dbPass = sanitizeSmtpPass(dbConfig.pass);

      const cacheKey = `db:${dbHost}:${dbPort}:${dbSecure}:${dbUser}:${dbPass}`;
      const transporter = getOrCreateTransporter(cacheKey, () =>
        nodemailer.createTransport({
          host: dbHost,
          port: dbPort,
          secure: dbSecure,
          auth: {
            user: dbUser,
            pass: dbPass
          },
          pool: true,
          maxConnections: 3,
          maxMessages: 100,
          connectionTimeout: 15000,
          greetingTimeout: 15000,
          socketTimeout: 20000
        })
      );
      return {
        isConfigured: true,
        transporter,
        from: `"${dbConfig.fromName || 'BK-IC Digital Hub'}" <${dbConfig.fromEmail || dbUser}>`,
        source: 'db',
        host: dbHost,
        port: dbPort,
        user: dbUser
      };
    }
  } catch (err) {
    console.warn('[EmailService] Failed to read DB SMTP settings:', err);
  }

  return {
    isConfigured: false,
    transporter: null,
    from: '"BK-IC Digital Hub" <no-reply@dut.udn.vn>',
    source: 'none'
  };
}

// Standard RFC 5322 compliant email format validation
export function isValidEmailFormat(email: unknown): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // RFC 5322 compatible regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

// Checks if an address is synthetic, a test address, or a reserved test domain (RFC 2606 / RFC 6761)
export function isSyntheticOrTestEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return true;
  const normalized = email.trim().toLowerCase();
  const [localPart, domain] = normalized.split('@');
  if (!localPart || !domain) return true;

  // 1. Reserved test domains (RFC 2606 / RFC 6761)
  if (
    domain.endsWith('.test') ||
    domain.endsWith('.local') ||
    domain.endsWith('.localhost') ||
    domain.endsWith('.invalid') ||
    domain.endsWith('.example') ||
    domain === 'example.com' ||
    domain === 'example.org' ||
    domain === 'example.net' ||
    domain === 'test.com'
  ) {
    return true;
  }

  // 2. Synthetic patterns strictly in automated test suite environment (NODE_ENV === 'test')
  if (process.env.NODE_ENV === 'test') {
    if (
      /^(resend|test|tester|recovery|ratelimit|fake|mock|dummy|sample|demo|temp|nonatt|nonexistent|disabled|stranger|spoof|exploit)[\.\-_0-9]/i.test(localPart) ||
      /^(resend|test|tester|fake|mock|dummy|sample|demo|temp|nonexistent)$/i.test(localPart) ||
      localPart.startsWith('test.') ||
      localPart.startsWith('pic.mem.') ||
      localPart.startsWith('test.mem.') ||
      localPart.startsWith('member.test') ||
      localPart.startsWith('user.test') ||
      localPart.startsWith('admin.test') ||
      /^(member|bn|bdh|btv)\.\d+/i.test(localPart) ||
      localPart.includes('.test.') ||
      localPart.endsWith('.test') ||
      localPart.includes('fake') ||
      localPart.includes('dummy') ||
      localPart.includes('nonexistent')
    ) {
      return true;
    }
  }

  return false;
}

export type DeliveryCategory =
  | 'smtp_accepted'
  | 'smtp_rejected'
  | 'invalid_address'
  | 'smtp_connection_auth_error'
  | 'outbox_only';

export interface DispatchEmailResult {
  success: boolean;
  emailId: string;
  status: 'delivered' | 'failed';
  deliveryMethod: 'smtp' | 'outbox_fallback';
  deliveryCategory: DeliveryCategory;
  message: string;
  deliveryError?: string;
  messageId?: string;
}

export interface DispatchOptions {
  id?: string;
  to: string;
  recipientName?: string;
  subject: string;
  htmlContent?: string;
  html?: string;
  type: OutboxEmail['type'];
  resetLink?: string;
  verificationLink?: string;
  tempPassword?: string;
  expiresAt?: string;
}

/**
 * Core email dispatcher with strict recipient validation, Nodemailer result inspection,
 * safe logging, and explicit error categorization.
 */
export async function dispatchEmail(options: DispatchOptions): Promise<DispatchEmailResult> {
  const id = options.id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const to = options.to;
  const recipientName = options.recipientName || '';
  const subject = options.subject;
  const htmlContent = options.htmlContent || options.html || '';
  const type = options.type;
  const resetLink = options.resetLink;
  const verificationLink = options.verificationLink || (options.type === 'verification' ? options.resetLink : undefined);
  const tempPassword = options.tempPassword;
  const expiresAt = options.expiresAt;
  const normalizedTo = (to || '').trim().toLowerCase();

  // 1. Strict Recipient Validation (Requirement 2 & 4)
  if (!isValidEmailFormat(normalizedTo)) {
    const deliveryError = 'Gửi thất bại do địa chỉ không hợp lệ: Địa chỉ email người nhận sai cú pháp hoặc rỗng.';
    const outboxEntry: OutboxEmail = {
      id,
      to: normalizedTo || '(empty)',
      recipientName,
      subject,
      htmlContent,
      resetLink,
      verificationLink,
      tempPassword,
      type,
      sentAt: new Date().toISOString(),
      expiresAt,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryError
    };
    emailOutbox.unshift(outboxEntry);
    if (emailOutbox.length > 50) emailOutbox.pop();

    console.warn(`[EmailService] ✗ Rejected delivery due to invalid recipient format: "${to}"`);
    return {
      success: false,
      emailId: id,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryCategory: 'invalid_address',
      message: `Địa chỉ email người nhận "${to}" không đúng định dạng hợp lệ.`,
      deliveryError
    };
  }

  // 2. Reserved Test / Synthetic Domains (RFC 2606 & RFC 6761)
  // Safely intercept test domains or synthetic addresses so live SMTP does not attempt external delivery
  if (isSyntheticOrTestEmail(normalizedTo)) {
    const note = `Địa chỉ thử nghiệm nội bộ (${normalizedTo}) - lưu trữ vào Hộp thư thử nghiệm (Admin Outbox), không phát tán qua máy chủ SMTP bên ngoài.`;
    const outboxEntry: OutboxEmail = {
      id,
      to: normalizedTo,
      recipientName,
      subject,
      htmlContent,
      resetLink,
      verificationLink,
      tempPassword,
      type,
      sentAt: new Date().toISOString(),
      expiresAt,
      status: 'delivered',
      deliveryMethod: 'outbox_fallback',
      deliveryError: note
    };
    emailOutbox.unshift(outboxEntry);
    if (emailOutbox.length > 50) emailOutbox.pop();

    console.log(`[EmailService] ℹ Intercepted synthetic/test recipient ${normalizedTo} -> Admin Outbox fallback.`);
    return {
      success: true,
      emailId: id,
      status: 'delivered',
      deliveryMethod: 'outbox_fallback',
      deliveryCategory: 'outbox_only',
      message: `Đã phát hành thông tin và lưu an toàn vào Hộp thư thử nghiệm cho địa chỉ thử nghiệm: ${normalizedTo}.`
    };
  }

  // 3. Check active configuration
  const smtp = getActiveSmtpConfig();
  if (!smtp.isConfigured) {
    const deliveryError = 'Chưa cấu hình tài khoản gửi thư (như Brevo API Key hoặc Gmail App Password). Thư đã được lưu vào Hộp thư thử nghiệm nội bộ.';
    const outboxEntry: OutboxEmail = {
      id,
      to: normalizedTo,
      recipientName,
      subject,
      htmlContent,
      resetLink,
      verificationLink,
      tempPassword,
      type,
      sentAt: new Date().toISOString(),
      expiresAt,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryError
    };
    emailOutbox.unshift(outboxEntry);
    if (emailOutbox.length > 50) emailOutbox.pop();

    console.log(`[EmailService] ℹ No active email service configured -> message stored in Admin Outbox for ${normalizedTo}`);
    return {
      success: false,
      emailId: id,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryCategory: 'outbox_only',
      message: `Máy chủ gửi thư chưa được kích hoạt. Thư đã được lưu trữ an toàn trong Hộp thư Quản trị (Admin Outbox).`,
      deliveryError
    };
  }

  // 3.5. If Brevo HTTP API is configured, dispatch via HTTPS (Port 443 - works on Render Free & supports @gmail.com)
  if (smtp.provider === 'brevo' && smtp.brevoApiKey) {
    try {
      const plainText = htmlToPlainText(htmlContent);
      const rawFrom = smtp.from;
      const match = rawFrom.match(/^(?:"?([^"]*)"?\s)?(?:<([^>]+)>)?$/);
      const senderName = (match && match[1]) ? match[1].trim() : 'BK-IC Digital Hub';
      const senderEmail = (match && match[2]) ? match[2].trim() : (smtp.user || 'hoanglong280907@gmail.com');

      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': smtp.brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail
          },
          to: [
            {
              email: normalizedTo,
              name: recipientName || normalizedTo
            }
          ],
          replyTo: {
            email: smtp.replyTo || senderEmail,
            name: senderName
          },
          subject,
          htmlContent,
          textContent: plainText
        })
      });

      const brevoData = await brevoRes.json();
      if (!brevoRes.ok) {
        const rawErrMsg = brevoData?.message || `HTTP ${brevoRes.status}`;
        if (/sender.*not.*verified|unverified/i.test(rawErrMsg)) {
          throw new Error(`Email người gửi "${senderEmail}" chưa được xác minh trên Brevo. Vui lòng vào trang Brevo -> Senders & IP -> thêm email "${senderEmail}" và bấm link xác nhận gửi về hộp thư Gmail.`);
        }
        throw new Error(rawErrMsg);
      }

      const outboxEntry: OutboxEmail = {
        id,
        to: normalizedTo,
        recipientName,
        subject,
        htmlContent,
        resetLink,
        verificationLink,
        tempPassword,
        type,
        sentAt: new Date().toISOString(),
        expiresAt,
        status: 'delivered',
        deliveryMethod: 'smtp'
      };
      emailOutbox.unshift(outboxEntry);
      if (emailOutbox.length > 50) emailOutbox.pop();

      console.log(`[EmailService] ✓ Brevo HTTP API accepted email for delivery to ${normalizedTo} (MessageId: ${brevoData?.messageId})`);
      return {
        success: true,
        emailId: id,
        status: 'delivered',
        deliveryMethod: 'smtp',
        deliveryCategory: 'smtp_accepted',
        message: `Email đã được gửi thành công qua dịch vụ Brevo HTTP API (Port 443) đến ${normalizedTo}.`,
        messageId: brevoData?.messageId
      };
    } catch (err: any) {
      console.warn(`[EmailService] ✗ Brevo API delivery failed for ${normalizedTo}:`, err?.message || err);
      const deliveryError = `Gửi qua Brevo API thất bại: ${err?.message || err}`;
      const outboxEntry: OutboxEmail = {
        id,
        to: normalizedTo,
        recipientName,
        subject,
        htmlContent,
        resetLink,
        verificationLink,
        tempPassword,
        type,
        sentAt: new Date().toISOString(),
        expiresAt,
        status: 'failed',
        deliveryMethod: 'outbox_fallback',
        deliveryError
      };
      emailOutbox.unshift(outboxEntry);
      if (emailOutbox.length > 50) emailOutbox.pop();

      return {
        success: false,
        emailId: id,
        status: 'failed',
        deliveryMethod: 'outbox_fallback',
        deliveryCategory: 'smtp_connection_auth_error',
        message: `Không thể gửi qua Brevo API: ${err?.message || 'Lỗi kết nối'}.`,
        deliveryError
      };
    }
  }

  // 3.6. If Resend HTTP API is configured, dispatch via HTTPS (Port 443 - works on Render Free)
  if (smtp.provider === 'resend' && smtp.resendApiKey) {
    try {
      let resendFrom = smtp.from;
      const fromMatch = resendFrom.match(/<([^>]+)>/);
      const emailInFrom = fromMatch ? fromMatch[1].toLowerCase() : resendFrom.toLowerCase();
      if (/@(gmail\.com|googlemail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com|icloud\.com)$/i.test(emailInFrom)) {
        resendFrom = 'BK-IC Digital Hub <onboarding@resend.dev>';
      }

      const plainText = htmlToPlainText(htmlContent);
      const payload: any = {
        from: resendFrom,
        to: [normalizedTo],
        subject,
        html: htmlContent,
        text: plainText
      };
      if (smtp.replyTo) {
        payload.reply_to = [smtp.replyTo];
      }

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${smtp.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const resendData = await resendRes.json();
      if (!resendRes.ok) {
        const rawErrMsg = resendData?.message || resendData?.error?.message || `HTTP ${resendRes.status}`;
        if (/domain is not verified/i.test(rawErrMsg)) {
          throw new Error(`Tên miền người gửi chưa được xác thực trên Resend. Khi chưa có domain riêng, Resend yêu cầu gửi từ địa chỉ mặc định "BK-IC Digital Hub <onboarding@resend.dev>". Để gửi bằng domain riêng, vui lòng thêm và xác thực domain tại https://resend.com/domains.`);
        }
        if (/only send testing emails to your own email/i.test(rawErrMsg)) {
          const ownerMatch = rawErrMsg.match(/\(([^)]+)\)/);
          const ownerEmail = ownerMatch ? ownerMatch[1] : 'email chủ tài khoản Resend';
          throw new Error(`Giới hạn chế độ thử nghiệm Resend: Vì chưa xác thực tên miền riêng trên Resend, bạn chỉ có thể gửi thử nghiệm đến CHÍNH email đã dùng đăng ký tài khoản Resend (${ownerEmail}). Để gửi đến sinh viên hoặc email khác (@dut.udn.vn), bạn cần xác thực tên miền tại https://resend.com/domains HOẶC chuyển sang dùng BREVO_API_KEY (gửi đến mọi email không cần tên miền).`);
        }
        throw new Error(rawErrMsg);
      }

      const outboxEntry: OutboxEmail = {
        id,
        to: normalizedTo,
        recipientName,
        subject,
        htmlContent,
        resetLink,
        verificationLink,
        tempPassword,
        type,
        sentAt: new Date().toISOString(),
        expiresAt,
        status: 'delivered',
        deliveryMethod: 'smtp'
      };
      emailOutbox.unshift(outboxEntry);
      if (emailOutbox.length > 50) emailOutbox.pop();

      console.log(`[EmailService] ✓ Resend HTTP API accepted email for delivery to ${normalizedTo} (Id: ${resendData?.id})`);
      return {
        success: true,
        emailId: id,
        status: 'delivered',
        deliveryMethod: 'smtp',
        deliveryCategory: 'smtp_accepted',
        message: `Email đã được gửi thành công qua dịch vụ Resend HTTP API (Port 443) đến ${normalizedTo}.`,
        messageId: resendData?.id
      };
    } catch (err: any) {
      console.warn(`[EmailService] ✗ Resend API delivery failed for ${normalizedTo}:`, err?.message || err);
      const deliveryError = `Gửi qua Resend API thất bại: ${err?.message || err}`;
      const outboxEntry: OutboxEmail = {
        id,
        to: normalizedTo,
        recipientName,
        subject,
        htmlContent,
        resetLink,
        verificationLink,
        tempPassword,
        type,
        sentAt: new Date().toISOString(),
        expiresAt,
        status: 'failed',
        deliveryMethod: 'outbox_fallback',
        deliveryError
      };
      emailOutbox.unshift(outboxEntry);
      if (emailOutbox.length > 50) emailOutbox.pop();

      return {
        success: false,
        emailId: id,
        status: 'failed',
        deliveryMethod: 'outbox_fallback',
        deliveryCategory: 'smtp_connection_auth_error',
        message: `Không thể gửi qua Resend API: ${err?.message || 'Lỗi kết nối'}.`,
        deliveryError
      };
    }
  }

  if (!smtp.transporter) {
    return {
      success: false,
      emailId: id,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryCategory: 'outbox_only',
      message: 'Chưa cấu hình bộ gửi thư SMTP hợp lệ.',
      deliveryError: 'Transporter null'
    };
  }

  // 4. Real SMTP Transmission via Nodemailer (Requirements 4)
  try {
    // Determine clean envelope and sender address
    const rawFrom = smtp.from;
    const fromAddressMatch = rawFrom.match(/<([^>]+)>/);
    const fromEmail = fromAddressMatch ? fromAddressMatch[1] : (smtp.user || rawFrom);
    const envelopeFrom = (smtp.user || fromEmail).trim();
    const plainText = htmlToPlainText(htmlContent);

    const info = await smtp.transporter.sendMail({
      from: rawFrom,
      to: normalizedTo,
      replyTo: fromEmail,
      subject,
      text: plainText,
      html: htmlContent,
      envelope: {
        from: envelopeFrom,
        to: [normalizedTo]
      }
    });

    const rejectedList = Array.isArray(info.rejected) ? info.rejected : [];
    const acceptedList = Array.isArray(info.accepted) ? info.accepted : [];

    // Check if recipient was rejected by the SMTP server
    if (rejectedList.includes(normalizedTo) || (acceptedList.length === 0 && rejectedList.length > 0)) {
      const deliveryError = `Có người nhận bị từ chối bởi máy chủ SMTP: ${rejectedList.join(', ')}. Mã phản hồi máy chủ: ${info.response || '550 Recipient rejected'}`;
      const outboxEntry: OutboxEmail = {
        id,
        to: normalizedTo,
        recipientName,
        subject,
        htmlContent,
        resetLink,
        verificationLink,
        tempPassword,
        type,
        sentAt: new Date().toISOString(),
        expiresAt,
        status: 'failed',
        deliveryMethod: 'smtp',
        deliveryError
      };
      emailOutbox.unshift(outboxEntry);
      if (emailOutbox.length > 50) emailOutbox.pop();

      console.warn(`[EmailService] ✗ SMTP recipient rejected by server: ${normalizedTo}`);
      return {
        success: false,
        emailId: id,
        status: 'failed',
        deliveryMethod: 'smtp',
        deliveryCategory: 'smtp_rejected',
        message: `Máy chủ gửi thư (SMTP) đã từ chối địa chỉ người nhận "${normalizedTo}". Vui lòng kiểm tra lại địa chỉ email đã đăng ký của bạn.`,
        deliveryError,
        messageId: info.messageId
      };
    }

    // SMTP Accepted the message (Requirement 4: Do NOT claim it has landed in inbox, only that SMTP accepted it)
    const outboxEntry: OutboxEmail = {
      id,
      to: normalizedTo,
      recipientName,
      subject,
      htmlContent,
      resetLink,
      verificationLink,
      tempPassword,
      type,
      sentAt: new Date().toISOString(),
      expiresAt,
      status: 'delivered',
      deliveryMethod: 'smtp'
    };
    emailOutbox.unshift(outboxEntry);
    if (emailOutbox.length > 50) emailOutbox.pop();

    console.log(`[EmailService] ✓ SMTP accepted email for delivery to ${normalizedTo} (MessageId: ${info.messageId})`);
    return {
      success: true,
      emailId: id,
      status: 'delivered',
      deliveryMethod: 'smtp',
      deliveryCategory: 'smtp_accepted',
      message: `Máy chủ gửi thư (SMTP) đã chấp nhận tiếp nhận chuyển phát email đến địa chỉ ${normalizedTo}. (Thời gian thư vào Hộp thư đến hoặc Thư rác phụ thuộc vào máy chủ hòm thư người nhận).`,
      messageId: info.messageId
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const errCode = err?.code || '';
    let deliveryCategory: DeliveryCategory;
    let deliveryError: string;
    let friendlyMessage: string;

    if (errCode === 'EAUTH' || /auth|login|credential|password|535/i.test(errMsg)) {
      deliveryCategory = 'smtp_connection_auth_error';
      deliveryError = `Gửi thất bại do kết nối hoặc xác thực SMTP: Thông tin đăng nhập SMTP không chính xác (${errCode || 'EAUTH'}). Lưu ý: Đối với tài khoản Gmail cá nhân, bắt buộc phải bật Xác minh 2 bước và tạo 'Mật khẩu ứng dụng' (App Password) gồm 16 chữ cái tại https://myaccount.google.com/apppasswords. Không dùng mật khẩu đăng nhập cá nhân thông thường.`;
      friendlyMessage = 'Không thể xác thực với máy chủ gửi thư SMTP. Vui lòng kiểm tra lại Mật khẩu ứng dụng (Google App Password 16 chữ cái) trong cấu hình SMTP.';
    } else if (errCode === 'ECONNREFUSED' || errCode === 'ETIMEDOUT' || errCode === 'ENOTFOUND' || /connect|timeout|dns/i.test(errMsg)) {
      deliveryCategory = 'smtp_connection_auth_error';
      const isTimeout = /timeout|etimedout/i.test(errMsg);
      deliveryError = isTimeout
        ? 'Gửi thất bại do kết nối hoặc xác thực SMTP: Connection timeout. (Lưu ý: Nền tảng hosting Render gói Free Web Service chặn toàn bộ cổng SMTP 25, 465, 587. Để gửi thư trên Render Free, hãy sử dụng biến môi trường RESEND_API_KEY qua cổng HTTPS 443 hoặc nâng cấp gói Render trả phí).'
        : `Gửi thất bại do kết nối hoặc xác thực SMTP: Không thể kết nối tới máy chủ gửi thư (${errCode || 'Network error'}).`;
      friendlyMessage = isTimeout
        ? 'Kết nối máy chủ SMTP bị quá hạn (Connection timeout). Nếu bạn đang triển khai trên Render Free, nền tảng này chặn các cổng SMTP 25/465/587. Giải pháp: Thêm biến RESEND_API_KEY để gửi qua cổng HTTPS 443 miễn phí hoặc nâng cấp gói Render.'
        : 'Không thể kết nối đến máy chủ gửi thư SMTP. Vui lòng kiểm tra đường truyền mạng hoặc cấu hình máy chủ.';
    } else if (/recipient|address|550|553|syntax|user unknown/i.test(errMsg)) {
      deliveryCategory = 'smtp_rejected';
      deliveryError = `Có người nhận bị từ chối: Địa chỉ không tồn tại hoặc bị chặn trên hệ thống máy chủ (${errMsg}).`;
      friendlyMessage = `Máy chủ gửi thư từ chối chuyển phát tới địa chỉ "${normalizedTo}".`;
    } else {
      deliveryCategory = 'smtp_connection_auth_error';
      deliveryError = `Gửi thất bại do lỗi máy chủ SMTP: ${errMsg}`;
      friendlyMessage = 'Lỗi không xác định khi gửi thư qua máy chủ SMTP. Thư đã được lưu lại trong Hộp thư thử nghiệm.';
    }

    const outboxEntry: OutboxEmail = {
      id,
      to: normalizedTo,
      recipientName,
      subject,
      htmlContent,
      resetLink,
      verificationLink,
      tempPassword,
      type,
      sentAt: new Date().toISOString(),
      expiresAt,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryError
    };
    emailOutbox.unshift(outboxEntry);
    if (emailOutbox.length > 50) emailOutbox.pop();

    console.warn(`[EmailService] ⚠ SMTP delivery attempt for ${normalizedTo} encountered issue (${deliveryError}). Safely preserved in Admin Outbox fallback.`);
    return {
      success: false,
      emailId: id,
      status: 'failed',
      deliveryMethod: 'outbox_fallback',
      deliveryCategory,
      message: friendlyMessage,
      deliveryError
    };
  }
}

export interface SendResetEmailParams {
  to: string;
  fullName: string;
  resetLink: string;
  expiresAt: string;
}

export async function sendPasswordResetEmail({
  to,
  fullName,
  resetLink,
  expiresAt
}: SendResetEmailParams): Promise<DispatchEmailResult> {
  const emailId = `mail-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const expiresDateStr = new Date(expiresAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const subject = '[BK-IC Digital Hub] Yêu cầu thiết lập lại mật khẩu tài khoản sinh viên';

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .brand-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
    .badge { background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; display: inline-block; }
    h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 8px 0; }
    .btn { display: inline-block; background-color: #245BFA; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 20px 0; }
    .btn:hover { background-color: #1d4ed8; }
    .security-notice { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px; margin: 20px 0; font-size: 12px; color: #991b1b; line-height: 1.5; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 11px; color: #64748b; word-break: break-all; margin-top: 16px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand-header">
      <span class="badge">BK-IC DIGITAL HUB · ĐH BÁCH KHOA ĐHĐN</span>
    </div>
    
    <h2>Yêu cầu Đặt lại Mật khẩu</h2>
    
    <p>Xin chào <strong>${fullName}</strong>,</p>
    
    <p>Hệ thống Quản lý Hoạt động & Thành viên Câu lạc bộ Sáng tạo Khởi nghiệp Trường Đại học Bách khoa (BK-IC) vừa nhận được yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email sinh viên <strong>${to}</strong>.</p>
    
    <p>Để hoàn tất việc thiết lập mật khẩu mới, vui lòng nhấn vào nút xác nhận bên dưới:</p>
    
    <div style="text-align: center;">
      <a href="${resetLink}" class="btn" target="_blank">Đặt lại Mật khẩu Mới</a>
    </div>

    <div class="security-notice">
      <strong>Lưu ý bảo mật quan trọng:</strong><br/>
      • Liên kết này chỉ có hiệu lực trong vòng <strong>15 phút</strong> (hết hạn lúc: ${expiresDateStr}) và <strong>chỉ sử dụng được 01 lần</strong>.<br/>
      • Mật khẩu mới cần tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.<br/>
      • Quản trị viên và Ban Thành viên không bao giờ yêu cầu cung cấp mật khẩu.<br/>
      • Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email. Mật khẩu hiện tại của bạn vẫn an toàn tuyệt đối.
    </div>

    <p style="font-size: 12px; color: #64748b;">Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết bảo mật sau vào trình duyệt:</p>
    <div class="meta-box">${resetLink}</div>

    <div class="footer">
      © ${new Date().getFullYear()} BK-IC Digital Hub · CLB Khởi nghiệp và Đổi mới sáng tạo<br/>
      Trường Đại học Bách khoa – Đại học Đà Nẵng · 54 Nguyễn Lương Bằng, TP. Đà Nẵng
    </div>
  </div>
</body>
</html>
  `.trim();

  return dispatchEmail({
    id: emailId,
    to,
    recipientName: fullName,
    subject,
    htmlContent,
    type: 'password_reset',
    resetLink,
    expiresAt
  });
}

export interface SendAccountVerificationEmailParams {
  to: string;
  fullName: string;
  studentId: string;
  verificationLink: string;
  expiresAt: string;
}

export async function sendAccountVerificationEmail({
  to,
  fullName,
  studentId,
  verificationLink,
  expiresAt
}: SendAccountVerificationEmailParams): Promise<DispatchEmailResult> {
  const emailId = `mail-ver-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const expiresDateStr = new Date(expiresAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const subject = '[BK-IC Digital Hub] Thư xác nhận đăng ký tài khoản thành viên BK-IC';

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .brand-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
    .badge { background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; display: inline-block; }
    h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 8px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 16px 0; background: #f8fafc; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; font-size: 13px; }
    .info-table td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; }
    .info-table td:first-child { font-weight: 600; color: #475569; width: 35%; }
    .info-table td:last-child { color: #0f172a; font-weight: 500; }
    .btn { display: inline-block; background-color: #245BFA; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 20px 0; }
    .btn:hover { background-color: #1d4ed8; }
    .security-notice { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px; margin: 20px 0; font-size: 12px; color: #166534; line-height: 1.5; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 11px; color: #64748b; word-break: break-all; margin-top: 16px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand-header">
      <span class="badge">BK-IC DIGITAL HUB · ĐH BÁCH KHOA ĐHĐN</span>
    </div>
    
    <h2>Xác Nhận Đăng Ký Tài Khoản</h2>
    
    <p>Xin chào <strong>${fullName}</strong>,</p>
    
    <p>Cảm ơn bạn đã đăng ký tham gia Câu lạc bộ Sáng tạo Khởi nghiệp Trường Đại học Bách khoa – ĐHĐN (BK-IC). Dưới đây là thông tin đăng ký tài khoản của bạn trên Cổng BK-IC Digital Hub:</p>
    
    <table class="info-table">
      <tr>
        <td>Họ và tên:</td>
        <td><strong>${fullName}</strong></td>
      </tr>
      <tr>
        <td>Mã số sinh viên (MSSV):</td>
        <td><strong>${studentId}</strong></td>
      </tr>
      <tr>
        <td>Email sinh viên:</td>
        <td><strong>${to}</strong></td>
      </tr>
      <tr>
        <td>Thời điểm tạo:</td>
        <td>${new Date().toLocaleString('vi-VN')}</td>
      </tr>
    </table>
    
    <p>Để hoàn tất việc xác minh quyền sở hữu hòm thư và kích hoạt tài khoản của bạn, vui lòng bấm vào nút xác nhận bên dưới:</p>
    
    <div style="text-align: center;">
      <a href="${verificationLink}" class="btn" target="_blank">Xác Nhận Kích Hoạt Email</a>
    </div>

    <div class="security-notice">
      <strong>Lưu ý xác thực:</strong><br/>
      • Liên kết này có hiệu lực trong vòng <strong>24 giờ</strong> (hết hạn lúc: ${expiresDateStr}).<br/>
      • Sau khi xác nhận email, bạn có thể tham gia ứng tuyển các ban chuyên môn và theo dõi lịch sinh hoạt.<br/>
      • Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email.
    </div>

    <p style="font-size: 12px; color: #64748b;">Nếu nút trên không hoạt động, bạn có thể sao chép và dán liên kết sau vào trình duyệt:</p>
    <div class="meta-box">${verificationLink}</div>

    <div class="footer">
      © ${new Date().getFullYear()} BK-IC Digital Hub · CLB Khởi nghiệp và Đổi mới sáng tạo<br/>
      Trường Đại học Bách khoa – Đại học Đà Nẵng · 54 Nguyễn Lương Bằng, TP. Đà Nẵng
    </div>
  </div>
</body>
</html>
  `.trim();

  return dispatchEmail({
    id: emailId,
    to,
    recipientName: fullName,
    subject,
    htmlContent,
    type: 'verification',
    verificationLink,
    resetLink: verificationLink,
    expiresAt
  });
}


export interface SendTemporaryPasswordEmailParams {
  to: string;
  fullName: string;
  tempPassword: string;
  expiresAt: string;
  loginUrl: string;
}

export async function sendTemporaryPasswordEmail({
  to,
  fullName,
  tempPassword,
  expiresAt,
  loginUrl
}: SendTemporaryPasswordEmailParams): Promise<DispatchEmailResult> {
  const emailId = `mail-tpw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const expiresDateStr = new Date(expiresAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const subject = '[BK-IC Digital Hub] Mật khẩu tạm thời khôi phục tài khoản thành viên';

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .badge { background: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; display: inline-block; }
    h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 8px 0; }
    .temp-pw-box { background: #0f172a; color: #38bdf8; font-size: 24px; font-weight: 800; letter-spacing: 3px; padding: 18px 24px; border-radius: 12px; font-family: 'Courier New', Courier, monospace; text-align: center; border: 1px solid #334155; margin: 20px 0; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 16px 0; text-align: center; }
    .steps-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 18px 0; font-size: 13px; color: #166534; }
    .warning-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; margin: 18px 0; font-size: 12px; color: #92400e; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div style="margin-bottom: 20px;">
      <span class="badge">KHÔI PHỤC MẬT KHẨU TÀI KHOẢN</span>
    </div>
    
    <h2>Mật khẩu Tạm thời BK-IC Digital Hub</h2>
    
    <p>Kính gửi bạn <strong>${fullName}</strong>,</p>
    
    <p>Hệ thống nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với địa chỉ email sinh viên <strong>${to}</strong>.</p>
    
    <p>Dưới đây là mật khẩu tạm thời an toàn được tạo tự động phía máy chủ:</p>
    
    <div class="temp-pw-box">
      ${tempPassword}
    </div>

    <div class="steps-box">
      <strong>Quy trình đăng nhập và đổi mật khẩu bắt buộc:</strong>
      <ol style="margin: 8px 0 0 0; padding-left: 20px; line-height: 1.6;">
        <li>Truy cập Cổng Đăng nhập BK-IC Digital Hub.</li>
        <li>Đăng nhập với email <strong>${to}</strong> và <strong>mật khẩu tạm thời</strong> ở trên.</li>
        <li>Hệ thống sẽ lập tức chuyển bạn sang màn hình <strong>"Đặt mật khẩu mới"</strong> bắt buộc.</li>
        <li>Thiết lập mật khẩu mới (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt) để mở khóa toàn bộ quyền truy cập.</li>
      </ol>
    </div>

    <div style="text-align: center;">
      <a href="${loginUrl}" class="btn" target="_blank">Đến Trang Đăng Nhập Ngay</a>
    </div>

    <div class="warning-box">
      <strong>Lưu ý bảo mật quan trọng:</strong>
      <ul style="margin: 6px 0 0 0; padding-left: 20px; line-height: 1.5;">
        <li>Mật khẩu tạm thời chỉ có hiệu lực trong <strong>15 phút</strong> (hết hạn lúc ${expiresDateStr}).</li>
        <li>Chỉ có thể sử dụng cho <strong>duy nhất 01 lần đăng nhập khôi phục</strong>.</li>
        <li>Tuyệt đối <strong>không chia sẻ</strong> mật khẩu này cho bất kỳ ai, kể cả Ban Điều hành hay Quản trị viên.</li>
        <li>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng liên hệ ngay với Ban Chủ nhiệm CLB qua email <a href="mailto:bcn.bkic@dut.udn.vn" style="color: #b45309; font-weight: bold;">bcn.bkic@dut.udn.vn</a> để bảo vệ tài khoản.</li>
      </ul>
    </div>

    <div class="footer">
      BK-IC Digital Hub · Câu lạc bộ Sáng tạo Khởi nghiệp Trường Đại học Bách khoa – Đại học Đà Nẵng<br/>
      Email phát tự động, vui lòng không phản hồi trực tiếp vào thư này.
    </div>
  </div>
</body>
</html>
  `.trim();

  return dispatchEmail({
    id: emailId,
    to,
    recipientName: fullName,
    subject,
    htmlContent,
    type: 'temporary_password',
    tempPassword,
    expiresAt
  });
}

export interface SendInviteEmailParams {
  to: string;
  fullName: string;
  inviteLink: string;
  expiresAt: string;
  unitName: string;
  roleName: string;
}

export async function sendAccountInviteEmail({
  to,
  fullName,
  inviteLink,
  expiresAt,
  unitName,
  roleName
}: SendInviteEmailParams): Promise<DispatchEmailResult> {
  const emailId = `mail-inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const expiresDateStr = new Date(expiresAt).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const subject = '[BK-IC Digital Hub] Thư mời kích hoạt tài khoản & thiết lập mật khẩu';

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .badge { background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; display: inline-block; }
    h2 { font-size: 20px; font-weight: 800; color: #0f172a; margin: 16px 0 8px 0; }
    p { font-size: 14px; line-height: 1.6; color: #475569; margin: 8px 0; }
    .btn { display: inline-block; background-color: #059669; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 20px 0; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; font-family: monospace; font-size: 11px; color: #64748b; word-break: break-all; margin-top: 16px; }
    .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <div style="margin-bottom: 20px;">
      <span class="badge">THƯ MỜI THÀNH VIÊN CHÍNH THỨC</span>
    </div>
    
    <h2>Kích hoạt Tài khoản Thành viên BK-IC</h2>
    
    <p>Kính gửi bạn <strong>${fullName}</strong>,</p>
    
    <p>Ban Chủ nhiệm Câu lạc bộ Sáng tạo Khởi nghiệp Trường Đại học Bách khoa – ĐHĐN trân trọng thông báo bạn đã được cấp quyền tham gia <strong>${unitName}</strong> với vai trò <strong>${roleName}</strong> trên Cổng BK-IC Digital Hub.</p>
    
    <p>Để đảm bảo an toàn thông tin, hệ thống không cấp mật khẩu mặc định dễ đoán. Vui lòng bấm nút bên dưới để tự thiết lập mật khẩu cá nhân cho tài khoản <strong>${to}</strong>:</p>
    
    <div style="text-align: center;">
      <a href="${inviteLink}" class="btn" target="_blank">Thiết lập Mật khẩu Tài khoản</a>
    </div>

    <p style="font-size: 12px; color: #64748b;">Thời hạn liên kết: 15 phút (${expiresDateStr}). Không chia sẻ liên kết này cho người khác.</p>
    <div class="meta-box">${inviteLink}</div>

    <div class="footer">
      BK-IC Digital Hub · Trường Đại học Bách khoa – Đại học Đà Nẵng
    </div>
  </div>
</body>
</html>
  `.trim();

  return dispatchEmail({
    id: emailId,
    to,
    recipientName: fullName,
    subject,
    htmlContent,
    type: 'account_invitation',
    resetLink: inviteLink,
    expiresAt
  });
}

// Send test email to verify SMTP configuration
export async function sendTestSmtpEmail(
  to: string,
  customConfig?: SmtpConfig
): Promise<{ success: boolean; message: string; deliveryCategory?: DeliveryCategory }> {
  const normalizedTo = (to || '').trim().toLowerCase();

  // Validate format (Requirement 4: Gửi thất bại do địa chỉ không hợp lệ)
  if (!isValidEmailFormat(normalizedTo)) {
    return {
      success: false,
      deliveryCategory: 'invalid_address',
      message: 'Gửi thất bại do địa chỉ không hợp lệ: Địa chỉ email người nhận sai cú pháp.'
    };
  }

  let transporter: Transporter | null = null;
  let from = '"BK-IC Digital Hub" <no-reply@dut.udn.vn>';

  if (customConfig && customConfig.user && customConfig.pass) {
    const cleanHost = sanitizeSmtpHost(customConfig.host);
    const cleanSecure = Boolean(customConfig.secure) || customConfig.port === 465;
    const cleanPort = sanitizeSmtpPort(customConfig.port, cleanSecure);
    const cleanUser = sanitizeSmtpUser(customConfig.user);
    const cleanPass = sanitizeSmtpPass(customConfig.pass);

    transporter = nodemailer.createTransport({
      host: cleanHost,
      port: cleanPort,
      secure: cleanSecure,
      auth: {
        user: cleanUser,
        pass: cleanPass
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
    from = `"${customConfig.fromName || 'BK-IC Digital Hub'}" <${customConfig.fromEmail || cleanUser}>`;
  } else {
    const active = getActiveSmtpConfig();
    if (active.provider === 'brevo' && active.brevoApiKey) {
      try {
        const testHtml = `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; border-radius: 12px; max-width: 500px;">
            <h3 style="color: #059669;">✓ Kết nối Brevo HTTP API thành công!</h3>
            <p>Xin chào,</p>
            <p>Hệ thống <strong>BK-IC Digital Hub</strong> đã kết nối thành công với dịch vụ Brevo HTTP API qua cổng 443 (HTTPS). Email thử nghiệm đã được phát hành thành công tới <strong>${normalizedTo}</strong>.</p>
            <div style="margin-top: 16px; font-size: 12px; color: #64748b;">
              Thời gian gửi: ${new Date().toLocaleString('vi-VN')}<br/>
              Người gửi: ${active.from}
            </div>
          </div>
        `.trim();
        const testPlain = htmlToPlainText(testHtml);

        const rawFrom = active.from;
        const match = rawFrom.match(/^(?:"?([^"]*)"?\s)?(?:<([^>]+)>)?$/);
        const senderName = (match && match[1]) ? match[1].trim() : 'BK-IC Digital Hub';
        const senderEmail = (match && match[2]) ? match[2].trim() : (active.user || 'hoanglong280907@gmail.com');

        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': active.brevoApiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: {
              name: senderName,
              email: senderEmail
            },
            to: [
              {
                email: normalizedTo,
                name: normalizedTo
              }
            ],
            subject: '[BK-IC Digital Hub] Thư kiểm tra kết nối email qua Brevo HTTP API thành công',
            htmlContent: testHtml,
            textContent: testPlain
          })
        });

        const resData = await brevoRes.json();
        if (!brevoRes.ok) {
          const rawErrMsg = resData?.message || `HTTP ${brevoRes.status}`;
          if (/sender.*not.*verified|unverified/i.test(rawErrMsg)) {
            throw new Error(`Email người gửi "${senderEmail}" chưa được xác minh trên Brevo. Vui lòng vào trang Brevo -> Senders & IP -> thêm email "${senderEmail}" và bấm link xác nhận gửi về hộp thư Gmail.`);
          }
          throw new Error(rawErrMsg);
        }

        return {
          success: true,
          deliveryCategory: 'smtp_accepted',
          message: `Dịch vụ Brevo HTTP API (Port 443) đã gửi thư kiểm tra thành công tới "${normalizedTo}".`
        };
      } catch (err: any) {
        return {
          success: false,
          deliveryCategory: 'smtp_connection_auth_error',
          message: `Gửi qua Brevo API thất bại: ${err?.message || err}`
        };
      }
    }

    if (active.provider === 'resend' && active.resendApiKey) {
      try {
        let resendFrom = active.from;
        const fromMatch = resendFrom.match(/<([^>]+)>/);
        const emailInFrom = fromMatch ? fromMatch[1].toLowerCase() : resendFrom.toLowerCase();
        if (/@(gmail\.com|googlemail\.com|yahoo\.com|hotmail\.com|outlook\.com|live\.com|icloud\.com)$/i.test(emailInFrom)) {
          resendFrom = 'BK-IC Digital Hub <onboarding@resend.dev>';
        }

        const testHtml = `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; border-radius: 12px; max-width: 500px;">
            <h3 style="color: #059669;">✓ Kết nối Resend HTTP API thành công!</h3>
            <p>Xin chào,</p>
            <p>Hệ thống <strong>BK-IC Digital Hub</strong> đã kết nối thành công với dịch vụ Resend HTTP API qua cổng 443 (HTTPS). Email thử nghiệm đã được phát hành thành công tới <strong>${normalizedTo}</strong>.</p>
            <div style="margin-top: 16px; font-size: 12px; color: #64748b;">
              Thời gian gửi: ${new Date().toLocaleString('vi-VN')}<br/>
              Người gửi: ${resendFrom}
            </div>
          </div>
        `.trim();
        const testPlain = htmlToPlainText(testHtml);

        const payload: any = {
          from: resendFrom,
          to: [normalizedTo],
          subject: '[BK-IC Digital Hub] Thư kiểm tra kết nối email qua Resend HTTP API thành công',
          html: testHtml,
          text: testPlain
        };
        if (active.replyTo) {
          payload.reply_to = [active.replyTo];
        }

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${active.resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const resData = await resendRes.json();
        if (!resendRes.ok) {
          const rawErrMsg = resData?.message || resData?.error?.message || `HTTP ${resendRes.status}`;
          if (/domain is not verified/i.test(rawErrMsg)) {
            throw new Error(`Tên miền người gửi chưa được xác thực trên Resend. Khi chưa có domain riêng, Resend yêu cầu gửi từ địa chỉ mặc định "BK-IC Digital Hub <onboarding@resend.dev>". Để gửi bằng domain riêng, vui lòng thêm và xác thực domain tại https://resend.com/domains.`);
          }
          if (/only send testing emails to your own email/i.test(rawErrMsg)) {
            const ownerMatch = rawErrMsg.match(/\(([^)]+)\)/);
            const ownerEmail = ownerMatch ? ownerMatch[1] : 'email chủ tài khoản Resend';
            throw new Error(`Giới hạn chế độ thử nghiệm Resend: Vì chưa xác thực tên miền riêng trên Resend, bạn chỉ có thể gửi thử nghiệm đến CHÍNH email đã dùng đăng ký tài khoản Resend (${ownerEmail}). Để gửi đến sinh viên hoặc email khác (@dut.udn.vn), bạn cần xác thực tên miền tại https://resend.com/domains HOẶC chuyển sang dùng BREVO_API_KEY (gửi đến mọi email không cần tên miền).`);
          }
          throw new Error(rawErrMsg);
        }
        return {
          success: true,
          deliveryCategory: 'smtp_accepted',
          message: `Dịch vụ Resend HTTP API (Port 443) đã gửi thư kiểm tra thành công tới "${normalizedTo}".`
        };
      } catch (err: any) {
        return {
          success: false,
          deliveryCategory: 'smtp_connection_auth_error',
          message: `Gửi qua Resend API thất bại: ${err?.message || err}`
        };
      }
    }
    transporter = active.transporter;
    from = active.from;
  }

  if (!transporter) {
    return {
      success: false,
      deliveryCategory: 'smtp_connection_auth_error',
      message: 'Chưa có thông tin cấu hình máy chủ SMTP (Email hoặc Mật khẩu ứng dụng đang trống).'
    };
  }

  try {
    await transporter.verify();

    const fromAddressMatch = from.match(/<([^>]+)>/);
    const fromEmail = fromAddressMatch ? fromAddressMatch[1] : (customConfig?.user || from);
    const envelopeFrom = (customConfig?.user || fromEmail).trim();
    const testHtml = `
        <div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; border-radius: 12px; max-width: 500px;">
          <h3 style="color: #059669;">✓ Kết nối SMTP thành công!</h3>
          <p>Xin chào,</p>
          <p>Hệ thống <strong>BK-IC Digital Hub</strong> đã kết nối thành công với máy chủ gửi thư SMTP của bạn. Máy chủ đã chấp nhận tiếp nhận email thử nghiệm gửi tới <strong>${normalizedTo}</strong>.</p>
          <div style="margin-top: 16px; font-size: 12px; color: #64748b;">
            Thời gian gửi: ${new Date().toLocaleString('vi-VN')}<br/>
            Người gửi: ${from}
          </div>
        </div>
      `.trim();
    const testPlain = htmlToPlainText(testHtml);

    const info = await transporter.sendMail({
      from,
      to: normalizedTo,
      replyTo: fromEmail,
      subject: '[BK-IC Digital Hub] Thư kiểm tra kết nối máy chủ gửi email SMTP thành công',
      text: testPlain,
      html: testHtml,
      envelope: {
        from: envelopeFrom,
        to: [normalizedTo]
      }
    });

    const rejectedList = Array.isArray(info.rejected) ? info.rejected : [];
    if (rejectedList.includes(normalizedTo)) {
      return {
        success: false,
        deliveryCategory: 'smtp_rejected',
        message: `Có người nhận bị từ chối bởi máy chủ SMTP: ${normalizedTo}. Mã phản hồi máy chủ: ${info.response || '550 Recipient rejected'}`
      };
    }

    return {
      success: true,
      deliveryCategory: 'smtp_accepted',
      message: `Máy chủ SMTP đã chấp nhận chuyển phát email thử nghiệm tới "${normalizedTo}".`
    };
  } catch (err: any) {
    console.warn('[EmailService] Test SMTP check returned error:', err?.message || err);
    const errMsg = err?.message || String(err);
    const errCode = err?.code || '';

    let deliveryCategory: DeliveryCategory = 'smtp_connection_auth_error';
    if (/recipient|address|550|553/i.test(errMsg)) {
      deliveryCategory = 'smtp_rejected';
      return {
        success: false,
        deliveryCategory,
        message: `Có người nhận bị từ chối: ${errMsg}`
      };
    }

    if (/timeout|etimedout/i.test(errMsg)) {
      return {
        success: false,
        deliveryCategory: 'smtp_connection_auth_error',
        message: 'Gửi thất bại do kết nối hoặc xác thực SMTP: Connection timeout. (Nguyên nhân: Hosting Render gói Free chặn toàn bộ các cổng SMTP 25, 465, 587. Để gửi email khi deploy trên Render Free, hãy sử dụng biến môi trường RESEND_API_KEY để gửi qua cổng HTTPS 443, hoặc nâng cấp gói Render trả phí, hoặc kiểm tra khi chạy cục bộ localhost).'
      };
    }

    return {
      success: false,
      deliveryCategory,
      message: `Gửi thất bại do kết nối hoặc xác thực SMTP: ${errMsg || errCode || 'Không thể xác thực tài khoản'}.`
    };
  }
}
