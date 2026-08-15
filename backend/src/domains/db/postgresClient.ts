import crypto from 'crypto';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'enterprise';
  accountStatus: 'active' | 'suspended' | 'deactivated';
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  sessionTokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  ipAddress: string;
  userAgent: string;
  deviceName: string;
  revokedAt?: string | null;
  revokedReason?: string | null;
}

export interface QrIdentityRecord {
  id: string; // internal UUID
  publicSlug: string; // uq_7Kx9P2...
  secretCredential: string;
  visibilityPolicy: 'PUBLIC' | 'PRIVATE' | 'AUTHENTICATED' | 'PASSWORD' | 'TIME_LIMITED' | 'LOCATION_RESTRICTED';
  productName: string;
  sku: string;
  customFields: Record<string, any>;
  createdAt: string;
}

class PostgresClient {
  private sessions: SessionRecord[] = [];
  private users: UserRecord[] = [
    {
      id: 'usr-admin-001',
      email: 'bhramitp@gmail.com',
      name: 'Bhramit Patel (AGB Admin)',
      role: 'admin',
      accountStatus: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  constructor() {
    console.log('[PostgreSQL Engine] Initialized Relational Database Schema.');
  }

  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public async createUser(email: string, name?: string): Promise<UserRecord> {
    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      role: 'user',
      accountStatus: 'active',
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  public async createSession(session: SessionRecord): Promise<SessionRecord> {
    this.sessions.unshift(session);
    return session;
  }

  public async findSessionByHash(tokenHash: string): Promise<SessionRecord | null> {
    const session = this.sessions.find(s => s.sessionTokenHash === tokenHash && !s.revokedAt);
    if (!session) return null;

    // Check expiration (7d idle or 30d absolute)
    if (new Date(session.expiresAt) < new Date()) {
      session.revokedAt = new Date().toISOString();
      session.revokedReason = 'EXPIRED';
      return null;
    }

    session.lastUsedAt = new Date().toISOString();
    return session;
  }

  public async getUserSessions(userId: string): Promise<SessionRecord[]> {
    return this.sessions.filter(s => s.userId === userId && !s.revokedAt);
  }

  public async revokeSession(sessionId: string, reason = 'USER_REVOKED'): Promise<boolean> {
    const sess = this.sessions.find(s => s.id === sessionId);
    if (sess) {
      sess.revokedAt = new Date().toISOString();
      sess.revokedReason = reason;
      return true;
    }
    return false;
  }

  public async revokeAllOtherSessions(userId: string, currentSessionId: string): Promise<number> {
    let count = 0;
    for (const sess of this.sessions) {
      if (sess.userId === userId && sess.id !== currentSessionId && !sess.revokedAt) {
        sess.revokedAt = new Date().toISOString();
        sess.revokedReason = 'REVOKED_ALL_OTHER_DEVICES';
        count++;
      }
    }
    return count;
  }
}

export const postgresClient = new PostgresClient();
