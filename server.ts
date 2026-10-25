// BK-IC Digital Hub - Fullstack Express Server
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Route imports
import { authRouter } from './server/routes/auth.ts';
import { membersRouter } from './server/routes/members.ts';
import { sessionsRouter } from './server/routes/sessions.ts';
import { attendanceRouter } from './server/routes/attendance.ts';
import { feedbackRouter } from './server/routes/feedback.ts';
import { tasksRouter } from './server/routes/tasks.ts';
import { evaluationsRouter } from './server/routes/evaluations.ts';
import { notificationsRouter } from './server/routes/notifications.ts';
import { reportsRouter } from './server/routes/reports.ts';
import { auditRouter } from './server/routes/audit.ts';
import { cmsRouter } from './server/routes/cms.ts';
import { db } from './server/db.ts';
import { authenticateUser } from './server/middleware/auth.ts';
import { syncSessionsLifecycle } from './server/timeUtils.ts';
import { sanitizeSmtpHost, sanitizeSmtpUser, sanitizeSmtpPass } from './server/services/emailService.ts';

dotenv.config();

if (process.env.SMTP_HOST) {
  process.env.SMTP_HOST = sanitizeSmtpHost(process.env.SMTP_HOST);
}
if (process.env.SMTP_USER) {
  process.env.SMTP_USER = sanitizeSmtpUser(process.env.SMTP_USER);
}
if (process.env.SMTP_PASS) {
  process.env.SMTP_PASS = sanitizeSmtpPass(process.env.SMTP_PASS);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProduction = process.env.NODE_ENV === 'production';

  // Trust proxy for secure cookies and reverse proxies (Nginx, Caddy, Cloudflare, Traefik, Cloud Run)
  app.set('trust proxy', 1);

  // CORS Configuration - Restrict origins in production, support APP_URL and CORS_ORIGIN
  const allowedOrigins = [
    process.env.APP_URL?.replace(/\/$/, ''),
    process.env.VITE_APP_URL?.replace(/\/$/, ''),
    ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim().replace(/\/$/, '')) : [])
  ].filter(Boolean) as string[];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // In development, allow localhost origins
      if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    },
    credentials: true
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // System Health Check Endpoint (Public for Cloud Run / uptime monitors)
  app.get('/api/health', (req, res) => {
    const store = db.get();
    res.json({
      status: 'ok',
      service: 'BK-IC Digital Hub Fullstack API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptimeSec: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      timezone: 'Asia/Ho_Chi_Minh',
      database: {
        status: 'healthy',
        usersCount: store.users?.length || 0,
        sessionsCount: store.sessions?.length || 0,
        attendanceCount: store.attendance?.length || 0,
        unitsCount: store.units?.length || 0
      }
    });
  });

  // Global Session and Authentication Resolver
  app.use(authenticateUser);

  // Authentication & Account Routes
  app.use('/api/auth', authRouter);

  // Requirement P0.3 & Requirement 4: Backend enforcement - Block business APIs if user is in recovery session
  app.use('/api', (req, res, next) => {
    // Skip public site settings and CMS read-only queries
    if (
      req.path === '/site-settings' ||
      req.path === '/system/time' ||
      req.path === '/public/projects' ||
      req.path === '/public/events' ||
      req.path === '/public/news' ||
      req.path === '/applications' ||
      req.path.startsWith('/attendance/session-info')
    ) {
      return next();
    }

    if (req.session?.isRecoverySession || req.user?.mustChangePassword || req.user?.isRecoverySession) {
      return res.status(403).json({
        success: false,
        code: 'MUST_CHANGE_PASSWORD',
        message:
          'Bạn đang trong phiên đăng nhập khôi phục bằng mật khẩu tạm thời. Vui lòng hoàn tất việc đặt mật khẩu mới trước khi truy cập bất kỳ tính năng nghiệp vụ nào của hệ thống.'
      });
    }
    next();
  });

  app.use('/api/members', membersRouter);
  app.use('/api/sessions', sessionsRouter);
  app.use('/api/attendance', attendanceRouter);
  app.use('/api/feedback', feedbackRouter);
  app.use('/api/tasks', tasksRouter);
  app.use('/api/evaluations', evaluationsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/reports', reportsRouter);
  app.use('/api/audit-logs', auditRouter);
  app.use('/api', cmsRouter);

  // Guard: Any unmatched /api/* route returns clean JSON 404 instead of SPA HTML
  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      code: 'API_ENDPOINT_NOT_FOUND',
      message: `Đường dẫn API "${req.method} ${req.originalUrl}" không tồn tại trên hệ thống.`
    });
  });

  // Frontend Serving: Vite middleware in Dev, Static pre-built files in Prod
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[BK-IC Server] Vite development middleware mounted.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { maxAge: '1d', index: false }));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[BK-IC Server] Serving static production build from /dist with SPA fallback.');
  }

  // Global Error Handler - Prevents stack trace leak in production
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[BK-IC Server] Unhandled error:', err.message || err);
    res.status(err.status || 500).json({
      success: false,
      message: isProduction ? 'Đã xảy ra lỗi máy chủ nội bộ. Vui lòng liên hệ Quản trị viên.' : (err.message || 'Lỗi hệ thống')
    });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BK-IC Server] Running on http://0.0.0.0:${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`);
    console.log(`[BK-IC Server] Health endpoint: http://0.0.0.0:${PORT}/api/health`);
  });

  // Synchronize training session status and attendance lifecycle on server startup
  const initialStore = db.get();
  if (syncSessionsLifecycle(initialStore)) {
    db.save();
    console.log('[BK-IC Server] Initial training sessions lifecycle synchronized.');
  }

  // Autonomous background lifecycle scheduler (runs every 20 seconds)
  // Ensures session states (scheduled -> ongoing -> ended) and attendance (open -> closed)
  // transition automatically on time even if no user opens or refreshes the page.
  const lifecycleInterval = setInterval(() => {
    try {
      const store = db.get();
      if (syncSessionsLifecycle(store)) {
        db.save();
      }
    } catch (err) {
      console.error('[BK-IC Server] Lifecycle scheduler error:', err);
    }
  }, 20000);

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`[BK-IC Server] Received ${signal}. Saving database and shutting down gracefully...`);
    clearInterval(lifecycleInterval);
    db.save();
    db.createBackup();
    server.close(() => {
      console.log('[BK-IC Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch(err => {
  console.error('[BK-IC Server] Failed to start:', err);
  process.exit(1);
});
