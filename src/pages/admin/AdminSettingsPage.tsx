// BK-IC Admin System Settings & Demo Reset
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { 
  RotateCcw, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Mail,
  Send,
  RefreshCw,
  Copy,
  Check,
  Inbox,
  Trash2,
  Clock,
  KeyRound,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface SmtpStatusState {
  isConfigured: boolean;
  source: string;
  host: string;
  port: number;
  user: string;
  from: string;
}

interface OutboxItem {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  htmlContent: string;
  resetLink?: string;
  tempPassword?: string;
  type: 'password_reset' | 'account_invitation' | 'verification' | 'test' | 'temporary_password';
  sentAt: string;
  expiresAt?: string;
  status: 'delivered' | 'failed';
  deliveryMethod?: 'smtp' | 'outbox_fallback';
  deliveryError?: string;
}

export const AdminSettingsPage: React.FC = () => {
  const { siteSettings, resetToDefaultData, cleanTestData } = useApp();
  const [resetDone, setResetDone] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  // SMTP & Outbox states
  const [smtpStatus, setSmtpStatus] = useState<SmtpStatusState | null>(null);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [loadingOutbox, setLoadingOutbox] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial SMTP status & outbox
  const loadSmtpAndOutbox = async () => {
    try {
      const statusRes = await api.auth.getSmtpStatus();
      if (statusRes.success) {
        setSmtpStatus(statusRes);
      }
    } catch {
      // Ignored if non-admin or failed
    }

    setLoadingOutbox(true);
    try {
      const outboxRes = await api.auth.getEmailOutbox();
      if (outboxRes.success && Array.isArray(outboxRes.emails)) {
        setOutbox(outboxRes.emails);
      }
    } catch {
      // Ignored
    } finally {
      setLoadingOutbox(false);
    }
  };

  useEffect(() => {
    loadSmtpAndOutbox();
  }, []);

  const handleTestSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTo.trim()) return;

    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await api.auth.testSmtp({ to: testEmailTo.trim() });
      setTestResult({
        success: res.success,
        message: res.message
      });
      loadSmtpAndOutbox();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Lỗi khi gửi email kiểm tra kết nối SMTP.'
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleClearOutbox = async () => {
    if (window.confirm('Bạn có chắc chắn muốn làm sạch toàn bộ danh sách Hộp thư Hệ thống nội bộ?')) {
      try {
        await api.auth.clearEmailOutbox();
        setOutbox([]);
      } catch (err: any) {
        alert(err.message || 'Không thể làm sạch hộp thư');
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('CẢNH BÁO: Thao tác này sẽ đặt lại toàn bộ cơ sở dữ liệu về trạng thái mẫu ban đầu (theo Quyết định ra mắt ngày 04/04/2026). Bạn có chắc chắn muốn tiếp tục?')) {
      resetToDefaultData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  const handleCleanTestData = async () => {
    if (window.confirm('XÁC NHẬN: Bạn có chắc chắn muốn dọn dẹp sạch toàn bộ tài khoản thử nghiệm và các buổi họp giả lập? Hệ thống sẽ bảo toàn tài khoản Quản trị viên Master Admin và cấu hình website.')) {
      setIsCleaning(true);
      try {
        await cleanTestData();
        setResetDone(true);
        setTimeout(() => setResetDone(false), 3000);
      } catch (err: any) {
        alert(err.message || 'Lỗi khi dọn dẹp dữ liệu');
      } finally {
        setIsCleaning(false);
      }
    }
  };

  const handleDownloadBackup = () => {
    const backup = {
      siteSettings,
      exportedAt: new Date().toISOString(),
      platform: 'BK-IC Digital Hub'
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bkic_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOutbox = outbox.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.to.toLowerCase().includes(q) ||
      item.recipientName.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Cấu hình Hệ thống & Quản trị Dữ liệu
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Thiết lập máy chủ email, quản trị Hộp thư Hệ thống, tham số điểm danh QR và công cụ dữ liệu.
        </p>
      </div>

      {resetDone && (
        <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-4 text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Đã hoàn tất khôi phục dữ liệu ban đầu!</span>
        </div>
      )}

      {/* SECTION: Email SMTP & System Outbox */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <Mail className="h-4 w-4" />
              <span>Máy chủ Gửi Thư (SMTP) & Hộp thư Hệ thống</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Phát hành thư xác nhận email sinh viên, thư mời gia nhập và khôi phục mật khẩu tài khoản.
            </p>
          </div>

          <button
            onClick={loadSmtpAndOutbox}
            disabled={loadingOutbox}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingOutbox ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Status & Anti-Bounce Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-400 block">Trạng thái Kết nối SMTP:</span>
              <div className="flex items-center gap-2 mt-1">
                {smtpStatus?.isConfigured ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400">Đang hoạt động (Active)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">Chưa cấu hình tài khoản gửi</span>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 space-y-0.5">
              <div>Máy chủ: <strong className="text-slate-200">{smtpStatus?.host || 'smtp.gmail.com'}:{smtpStatus?.port || 587}</strong></div>
              <div>Người gửi: <strong className="text-slate-200">{smtpStatus?.user || 'Hệ thống'}</strong></div>
            </div>
          </div>

          <div className="md:col-span-2 p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed text-[11.5px]">
              <strong className="text-blue-300 font-semibold block">Cơ chế Bảo vệ & Chống Bị chặn Thư (Anti-Bounce Protection):</strong>
              <p className="text-slate-300">
                • <strong>Người dùng thật:</strong> Sinh viên đăng ký tài khoản hoặc yêu cầu Đặt lại Mật khẩu với email thật sẽ được chuyển phát thư trực tiếp qua máy chủ SMTP (Gmail).
              </p>
              <p className="text-slate-300">
                • <strong>Email thử nghiệm nội bộ:</strong> Các email kiểm thử tự động (tiền tố <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">resend.*</code>, <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">test.*</code>, <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-300">recovery.*</code>) được tự động chặn và lưu an toàn vào <em>Hộp thư Hệ thống bên dưới</em>, tuyệt đối không gửi ra ngoài để ngăn Google Mailer-Daemon báo lỗi 550 Recipient Blocked.
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-slate-300 space-y-1.5">
                <div className="text-amber-300 font-semibold">
                  • Lưu ý đường truyền khi triển khai trên Render (Gói Free Web Service):
                </div>
                <p className="text-slate-300">
                  Render Free chặn toàn bộ các cổng SMTP (25, 465, 587) dẫn đến lỗi <em>Connection timeout</em> khi kết nối thẳng tới <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200">smtp.gmail.com</code>. Để khắc phục, bạn có 3 giải pháp:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>
                    <strong className="text-emerald-300">Cách 1 (Khuyên dùng - Không cần tên miền riêng):</strong> Thêm biến môi trường <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-200">BREVO_API_KEY</code> (miễn phí 300 email/ngày tại <em>brevo.com</em>). Brevo cho phép dùng trực tiếp địa chỉ <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-200">@gmail.com</code> để gửi đến <strong>mọi sinh viên</strong> qua cổng HTTPS 443 mà không cần mua tên miền riêng.
                  </li>
                  <li>
                    <strong className="text-sky-300">Cách 2 (Resend API):</strong> Thêm biến môi trường <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-200">RESEND_API_KEY</code>. Lưu ý: Khi chưa xác thực tên miền riêng, Resend chỉ cho phép gửi thử nghiệm từ <code className="bg-slate-800 px-1 py-0.5 rounded text-sky-200">onboarding@resend.dev</code> đến <strong>chính email bạn đã dùng để đăng ký tài khoản Resend</strong>. Để gửi đến mọi sinh viên (@dut.udn.vn), bạn cần thêm và xác thực domain tại <em>resend.com/domains</em>.
                  </li>
                  <li>
                    <strong className="text-indigo-300">Cách 3 (Nâng cấp Render):</strong> Nâng cấp dịch vụ web Render lên gói Starter ($7/tháng) để Render mở toàn bộ các cổng SMTP 465/587, khi đó gửi qua Gmail SMTP bình thường.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Send Test Email Form */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
          <form onSubmit={handleTestSmtp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Gửi email kiểm tra đường truyền SMTP đến hộp thư thật của bạn:
              </label>
              <input
                type="email"
                required
                placeholder="Nhập email thật nhận thử nghiệm (VD: your.name@gmail.com hoặc sinhvien@dut.udn.vn)"
                value={testEmailTo}
                onChange={e => setTestEmailTo(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={sendingTest || !testEmailTo.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition sm:mt-5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{sendingTest ? 'Đang gửi...' : 'Gửi Thử Nghiệm'}</span>
            </button>
          </form>

          {testResult && (
            <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
              testResult.success 
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Outbox Viewer */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Danh sách Thư Hệ thống ({outbox.length} thư gần nhất)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tìm theo email, tên, tiêu đề..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
              />
              {outbox.length > 0 && (
                <button
                  onClick={handleClearOutbox}
                  title="Xóa lịch sử thư hệ thống"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {filteredOutbox.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-800/30 border border-dashed border-slate-700/60 text-xs text-slate-500">
              Chưa có thư nào được ghi nhận trong phiên hiện tại.
            </div>
          ) : (
            <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-slate-950/40 overflow-hidden max-h-[380px] overflow-y-auto">
              {filteredOutbox.map(mail => {
                const isSmtp = mail.deliveryMethod === 'smtp';
                const actionLink = mail.resetLink;
                const tempPw = mail.tempPassword;

                return (
                  <div key={mail.id} className="p-4 hover:bg-slate-800/30 transition text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mail.type === 'verification'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : mail.type === 'temporary_password'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : mail.type === 'account_invitation'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {mail.type === 'verification' && 'Xác thực Email'}
                          {mail.type === 'temporary_password' && 'Mật khẩu Tạm thời'}
                          {mail.type === 'password_reset' && 'Đặt lại Mật khẩu'}
                          {mail.type === 'account_invitation' && 'Thư mời Gia nhập'}
                          {mail.type === 'test' && 'Thư thử nghiệm'}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          isSmtp
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                        }`}>
                          {isSmtp ? '✓ Đã chuyển phát qua SMTP' : 'ℹ Lưu an toàn nội bộ (Test/Fallback)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(mail.sentAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-white">
                          {mail.recipientName} <span className="text-slate-400 font-mono text-[11px]">({mail.to})</span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {mail.subject}
                        </div>
                      </div>

                      {/* Quick copy buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        {tempPw && (
                          <button
                            onClick={() => copyToClipboard(tempPw, `pw-${mail.id}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition"
                          >
                            {copiedId === `pw-${mail.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <KeyRound className="h-3 w-3" />}
                            <span>{copiedId === `pw-${mail.id}` ? 'Đã chép mật khẩu!' : `MK tạm: ${tempPw}`}</span>
                          </button>
                        )}

                        {actionLink && (
                          <button
                            onClick={() => copyToClipboard(actionLink, `link-${mail.id}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-medium transition"
                          >
                            {copiedId === `link-${mail.id}` ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedId === `link-${mail.id}` ? 'Đã sao chép link!' : 'Chép Liên kết'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {mail.deliveryError && (
                      <div className="text-[10.5px] text-slate-400 bg-slate-900/80 p-2 rounded-lg font-mono border border-slate-800">
                        {mail.deliveryError}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Security & Architecture (Section 13) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>Kiến trúc Phân quyền & Bảo mật (RBAC)</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Hệ thống triển khai 6 cấp độ quyền nghiêm ngặt: <em>Guest · Applicant · Member · Leader · Club Administrator · System Administrator</em>. Thành viên chỉ được xem và đánh giá trong phạm vi ban chuyên trách hoặc hồ sơ cá nhân.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Chế độ vận hành:</span>
            <span className="font-semibold text-emerald-400">Hệ thống Vận hành Chính thức (Production Hub)</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Cơ chế lưu trữ:</span>
            <span className="font-semibold text-white">Server-Authoritative Persistent Engine (PBKDF2, Backup Rotation, REST API)</span>
          </div>
        </div>
      </div>

      {/* Section 2: QR Algorithm & Attendance parameters */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
          <QrCode className="h-4 w-4" />
          <span>Thuật toán Điểm danh QR Xoay vòng (Dynamic Token)</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Mỗi mã QR sinh ra gắn liền với một Time-Window Slot và định danh phiên. Mã tự động xoay sau mỗi 20–30 giây để ngăn chặn việc chụp ảnh chia sẻ từ xa. Cổng điểm danh tự động đóng sau khi hết giờ.
        </p>

        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span>Thời gian xoay vòng QR mặc định:</span>
            <span className="font-mono font-bold text-blue-400">20 giây / token</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Dung sai trễ mạng (Tolerance Window):</span>
            <span className="font-mono font-bold text-blue-400">1 chu kỳ liền trước (±20s)</span>
          </div>
        </div>
      </div>

      {/* Section 3: Reset & Data Backup (Section 18) */}
      <div className="rounded-3xl border border-red-500/30 bg-red-950/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4" />
          <span>Quản trị Dữ liệu & Đặt lại Hệ thống</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Bạn có thể xuất tệp sao lưu JSON lưu trữ dữ liệu câu lạc bộ hoặc làm sạch hệ thống về trạng thái ban đầu sạch (chỉ giữ lại tài khoản Quản trị viên Master Admin) khi cần thiết.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Tải tệp Sao lưu (JSON)</span>
          </button>

          <button
            onClick={handleCleanTestData}
            disabled={isCleaning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-600 hover:text-white transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            <span>{isCleaning ? 'Đang dọn dẹp...' : 'Dọn dẹp sạch Dữ liệu & Buổi họp thử nghiệm'}</span>
          </button>

          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold hover:bg-red-600 hover:text-white transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Đặt lại Toàn bộ Dữ liệu về Mặc định</span>
          </button>
        </div>
      </div>
    </div>
  );
};
