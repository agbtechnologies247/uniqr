import crypto from 'crypto';
import { postgresClient, SessionRecord, UserRecord } from '../db/postgresClient.js';
import { redisClient } from '../db/redisClient.js';

export interface SessionContext {
  token: string;
  tokenHash: string;
  sessionRecord: SessionRecord;
  user: UserRecord;
}

class SessionEngine {
  public hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  public generateRawToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create new session & set HttpOnly cookie
  public async createSession(
    user: UserRecord,
    ipAddress: string,
    userAgent: string
  ): Promise<{ rawToken: string; session: SessionRecord }> {
    const rawToken = this.generateRawToken();
    const tokenHash = this.hashToken(rawToken);

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days idle

    // Parse Device Name from User-Agent
    let deviceName = 'Desktop Browser';
    if (/android/i.test(userAgent)) deviceName = 'Android Mobile App';
    else if (/iphone|ipad/i.test(userAgent)) deviceName = 'iOS Safari';
    else if (/macintosh/i.test(userAgent)) fontName: deviceName = 'Chrome — macOS';
    else if (/windows/i.test(userAgent)) deviceName = 'Chrome — Windows';

    const sessionRecord: SessionRecord = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      sessionTokenHash: tokenHash,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      lastUsedAt: now.toISOString(),
      ipAddress,
      userAgent,
      deviceName,
      revokedAt: null
    };

    await postgresClient.createSession(sessionRecord);
    redisClient.set(`session:${tokenHash}`, { user, sessionRecord }, 7 * 24 * 60 * 60);

    return { rawToken, session: sessionRecord };
  }

  // Validate incoming HttpOnly cookie token
  public async validateSessionToken(rawToken: string): Promise<SessionContext | null> {
    if (!rawToken) return null;
    const tokenHash = this.hashToken(rawToken);

    // 1. Fast Redis cache lookup
    const cached = redisClient.get<{ user: UserRecord; sessionRecord: SessionRecord }>(`session:${tokenHash}`);
    if (cached) {
      return {
        token: rawToken,
        tokenHash,
        sessionRecord: cached.sessionRecord,
        user: cached.user
      };
    }

    // 2. DB fallback
    const session = await postgresClient.findSessionByHash(tokenHash);
    if (!session) return null;

    const user = {
      id: session.userId,
      email: 'agbtechnologies247@gmail.com',
      name: 'AGB User',
      role: 'user' as const,
      accountStatus: 'active' as const,
      createdAt: session.createdAt
    };

    redisClient.set(`session:${tokenHash}`, { user, sessionRecord: session }, 3600);

    return {
      token: rawToken,
      tokenHash,
      sessionRecord: session,
      user
    };
  }

  // Session Rotation on Login / Privilege Change
  public async rotateSession(
    currentRawToken: string | null,
    user: UserRecord,
    ipAddress: string,
    userAgent: string
  ): Promise<{ rawToken: string; session: SessionRecord }> {
    if (currentRawToken) {
      const oldHash = this.hashToken(currentRawToken);
      redisClient.del(`session:${oldHash}`);
    }
    return this.createSession(user, ipAddress, userAgent);
  }
}

export const sessionEngine = new SessionEngine();
