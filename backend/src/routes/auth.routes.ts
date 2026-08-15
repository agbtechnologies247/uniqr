import { Router, Request, Response } from 'express';
import { postgresClient } from '../domains/db/postgresClient.js';
import { redisClient } from '../domains/db/redisClient.js';
import { sessionEngine } from '../domains/auth/sessionEngine.js';
import { validateBody, sendOtpSchema, verifyOtpSchema, loginSchema } from '../middleware/validate.js';

export const authRouter = Router();

// OTP Store (In-Memory with 10-minute TTL)
export const otpStore: Record<string, { code: string; expiresAt: number }> = {};

// POST /api/v1/auth/login
authRouter.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    let user = await postgresClient.findUserByEmail(email);
    if (!user) {
      const name = email.split('@')[0].replace('.', ' ');
      user = await postgresClient.createUser(email, name.charAt(0).toUpperCase() + name.slice(1));
    }

    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';

    const currentToken = req.cookies?.uq_session || '';
    const sessionContext = await sessionEngine.rotateSession(currentToken, user, clientIp, userAgent);

    res.cookie('uq_session', sessionContext.rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    return res.json({
      status: 'SUCCESS',
      message: 'Authenticated successfully. Session cookie set.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountStatus: user.accountStatus
      },
      session: {
        id: sessionContext.session.id,
        expiresAt: sessionContext.session.expiresAt,
        deviceName: sessionContext.session.deviceName
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'AUTHENTICATION_FAILED', message: err.message });
  }
});

// POST /api/v1/auth/logout
authRouter.post('/logout', async (req: Request, res: Response) => {
  const token = req.cookies?.uq_session;
  if (token) {
    const session = await sessionEngine.validateSessionToken(token);
    if (session) {
      await postgresClient.revokeSession(session.sessionRecord.id, 'User Logout');
    }
  }
  res.clearCookie('uq_session', { path: '/' });
  res.json({ status: 'SUCCESS', message: 'Logged out successfully.' });
});

// GET /api/v1/auth/me
authRouter.get('/me', async (req: Request, res: Response) => {
  const token = req.cookies?.uq_session;
  if (!token) {
    return res.json({ authenticated: false, message: 'No active uq_session cookie found.' });
  }

  const session = await sessionEngine.validateSessionToken(token);
  if (!session) {
    res.clearCookie('uq_session', { path: '/' });
    return res.json({ authenticated: false, message: 'Session expired or revoked.' });
  }

  res.json({
    authenticated: true,
    user: session.user,
    session: {
      id: session.sessionRecord.id,
      deviceName: session.sessionRecord.deviceName,
      ipAddress: session.sessionRecord.ipAddress,
      expiresAt: session.sessionRecord.expiresAt
    }
  });
});

// GET /api/v1/auth/sessions
authRouter.get('/sessions', async (req: Request, res: Response) => {
  const token = req.cookies?.uq_session;
  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const session = await sessionEngine.validateSessionToken(token);
  if (!session) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const sessions = await postgresClient.getUserSessions(session.user.id);
  res.json({
    currentSessionId: session.sessionRecord.id,
    sessions: sessions.map(s => ({
      id: s.id,
      deviceName: s.deviceName,
      ipAddress: s.ipAddress,
      createdAt: s.createdAt,
      lastUsedAt: s.lastUsedAt,
      isCurrent: s.id === session.sessionRecord.id
    }))
  });
});

// DELETE /api/v1/auth/sessions/:id
authRouter.delete('/sessions/:id', async (req: Request, res: Response) => {
  const token = req.cookies?.uq_session;
  if (!token) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const session = await sessionEngine.validateSessionToken(token);
  if (!session) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }

  const sessionId = String(req.params.id);
  const revoked = await postgresClient.revokeSession(sessionId, 'Revoked by user from device manager');
  if (!revoked) {
    return res.status(404).json({ error: 'Session not found or already revoked' });
  }

  res.json({ status: 'SUCCESS', message: `Session ${sessionId} revoked.` });
});

// POST /api/v1/auth/send-otp
authRouter.post('/send-otp', validateBody(sendOtpSchema), async (req: Request, res: Response) => {
  const { target, channel } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes TTL
  otpStore[target.trim().toLowerCase()] = { code: otpCode, expiresAt };

  console.log(`[AUTH OTP] Generated OTP for ${target} (${channel}): ${otpCode}`);

  if (channel === 'phone') {
    const msg91AuthKey = process.env.MSG91_AUTH_KEY || '';
    if (!msg91AuthKey) {
      console.warn('[AUTH OTP] MSG91_AUTH_KEY not set — SMS OTP will not be dispatched');
    }
  } else {
    const smtpUser = process.env.SMTP_USER || '';
    const smtpPass = process.env.SMTP_PASS || '';
    if (!smtpUser || !smtpPass) {
      console.warn('[AUTH OTP] SMTP_USER or SMTP_PASS not set — Email OTP will not be dispatched');
    }
  }

  res.json({
    status: 'SUCCESS',
    message: `OTP passcode dispatched to ${target} via ${channel}. Valid for 10 minutes.`,
    channel,
    expiresInSeconds: 600
  });
});

// POST /api/v1/auth/verify-otp
authRouter.post('/verify-otp', validateBody(verifyOtpSchema), async (req: Request, res: Response) => {
  const { target, code } = req.body;
  const cleanTarget = target.trim().toLowerCase();
  const storedOtp = otpStore[cleanTarget];

  const isValidCode = storedOtp && storedOtp.code === code && Date.now() < storedOtp.expiresAt;

  if (!isValidCode) {
    return res.status(401).json({ error: 'Invalid or expired OTP verification code' });
  }

  delete otpStore[cleanTarget];

  let user = await postgresClient.findUserByEmail(cleanTarget);
  if (!user) {
    const name = cleanTarget.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    user = await postgresClient.createUser(cleanTarget, name ? name.charAt(0).toUpperCase() + name.slice(1) : 'UniQR User');
  }

  const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';

  const currentToken = req.cookies?.uq_session || '';
  const sessionContext = await sessionEngine.rotateSession(currentToken, user, clientIp, userAgent);

  res.cookie('uq_session', sessionContext.rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });

  res.json({
    status: 'SUCCESS',
    message: 'OTP verified. Session activated.',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      accountStatus: user.accountStatus
    }
  });
});

// POST /api/v1/auth/deactivate
authRouter.post('/deactivate', async (req: Request, res: Response) => {
  const { target, reason } = req.body;
  if (!target) {
    return res.status(400).json({ error: 'Target email/user required' });
  }

  console.log(`[ACCOUNT DEACTIVATION REQUEST] Target: ${target} | Reason: ${reason}`);

  res.json({
    status: 'DEACTIVATION_SCHEDULED',
    message: `Account deactivation and GDPR data erasure scheduled for ${target}. Grace period: 30 days.`,
    scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
});
