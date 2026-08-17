import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface BlobRecord {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  linkedProductId?: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  organization?: string;
  hasGstin?: boolean;
  gstin?: string;
  googleId?: string;
  avatarUrl?: string;
  role: 'admin' | 'user' | 'enterprise';
  accountStatus: 'active' | 'suspended' | 'deactivated';
  hasCompletedOnboarding?: boolean;
  welcomeEmailSent?: boolean;
  blobs?: BlobRecord[];
  createdAt: string;
  updatedAt?: string;
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
  private usersFile: string = path.join(process.cwd(), 'users_db.json');
  private users: UserRecord[] = [
    {
      id: 'usr-admin-001',
      email: 'bhramitp@gmail.com',
      name: 'Bhramit Patel',
      firstName: 'Bhramit',
      lastName: 'Patel',
      phone: '+919049874780',
      organization: 'AGB Technologies Pvt. Ltd.',
      hasGstin: true,
      gstin: '27AABCA1234F1Z5',
      role: 'admin',
      accountStatus: 'active',
      hasCompletedOnboarding: true,
      welcomeEmailSent: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  constructor() {
    this.loadUsersFromDisk();
    console.log('[PostgreSQL Engine] Initialized Relational Database Schema with persistent disk backing.');
  }

  private loadUsersFromDisk(): void {
    try {
      if (fs.existsSync(this.usersFile)) {
        const raw = fs.readFileSync(this.usersFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.users = parsed;
          console.log(`[PostgreSQL Engine] Loaded ${this.users.length} persisted users from disk.`);
        }
      }
    } catch (e: any) {
      console.warn('[PostgreSQL Engine] Notice loading users_db.json:', e.message);
    }
  }

  private saveUsersToDisk(): void {
    try {
      fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (e: any) {
      console.warn('[PostgreSQL Engine] Notice saving users_db.json:', e.message);
    }
  }

  public async findUserByEmail(email: string): Promise<UserRecord | null> {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return this.users.find(u => u.email && u.email.toLowerCase() === clean) || null;
  }

  public async findUserByPhone(phone: string): Promise<UserRecord | null> {
    if (!phone) return null;
    const digits = phone.replace(/[^0-9]/g, '');
    const last10 = digits.slice(-10);
    if (!last10 || last10.length < 10) return null;

    return this.users.find(u => {
      if (!u.phone) return false;
      const uDigits = u.phone.replace(/[^0-9]/g, '');
      return uDigits.endsWith(last10) || last10.endsWith(uDigits.slice(-10));
    }) || null;
  }

  public async findUserById(id: string): Promise<UserRecord | null> {
    if (!id) return null;
    return this.users.find(u => u.id === id) || null;
  }

  public async findUserByGoogleId(googleId: string): Promise<UserRecord | null> {
    if (!googleId) return null;
    return this.users.find(u => u.googleId === googleId) || null;
  }

  public async createUser(data: Partial<UserRecord> & { email?: string; phone?: string; name?: string }): Promise<UserRecord> {
    const email = (data.email || '').trim().toLowerCase();
    const phone = (data.phone || '').trim();
    const firstName = data.firstName || (data.name ? data.name.split(' ')[0] : 'UniQR');
    const lastName = data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : 'User');
    const fullName = data.name || `${firstName} ${lastName}`.trim();

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      email,
      phone,
      name: fullName,
      firstName,
      lastName,
      organization: data.organization || 'AGB Technologies Ltd.',
      hasGstin: data.hasGstin || false,
      gstin: data.gstin || '',
      googleId: data.googleId,
      avatarUrl: data.avatarUrl,
      role: 'user',
      accountStatus: 'active',
      hasCompletedOnboarding: Boolean(email && phone && (firstName || fullName)),
      welcomeEmailSent: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveUsersToDisk();
    return newUser;
  }

  public async updateUserProfile(userId: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
    const user = this.users.find(u => u.id === userId);
    if (!user) return null;

    if (data.email) user.email = data.email.trim().toLowerCase();
    if (data.phone) user.phone = data.phone.trim();
    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;
    if (data.firstName || data.lastName) {
      user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    if (data.organization !== undefined) user.organization = data.organization;
    if (data.hasGstin !== undefined) user.hasGstin = data.hasGstin;
    if (data.gstin !== undefined) user.gstin = data.gstin;
    if (data.googleId) user.googleId = data.googleId;
    if (data.avatarUrl) user.avatarUrl = data.avatarUrl;
    if (data.hasCompletedOnboarding !== undefined) user.hasCompletedOnboarding = data.hasCompletedOnboarding;
    if (data.welcomeEmailSent !== undefined) user.welcomeEmailSent = data.welcomeEmailSent;
    
    // Auto-mark onboarding completed if both phone and email exist with full name
    if (user.email && user.phone && (user.firstName || user.name)) {
      user.hasCompletedOnboarding = true;
    }

    user.updatedAt = new Date().toISOString();
    this.saveUsersToDisk();
    return user;
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

  // ─── Phone-Email Guardrail ───────────────────────────────────────────────
  /**
   * Count distinct registered email accounts that share the same last-10 phone digits.
   * Used to enforce max 3 emails per phone number.
   */
  public countEmailsByPhone(phone: string): number {
    if (!phone) return 0;
    const digits = phone.replace(/[^0-9]/g, '');
    const last10 = digits.slice(-10);
    if (last10.length < 10) return 0;

    return this.users.filter(u => {
      if (!u.phone || !u.email) return false;
      const uDigits = u.phone.replace(/[^0-9]/g, '');
      return uDigits.endsWith(last10);
    }).length;
  }

  public checkPhoneEmailLimit(phone: string): { allowed: boolean; count: number } {
    const count = this.countEmailsByPhone(phone);
    return { allowed: count < 3, count };
  }

  // ─── Blob Storage ────────────────────────────────────────────────────────
  public async addBlob(userId: string, blob: Omit<BlobRecord, 'id' | 'createdAt'>): Promise<BlobRecord> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    if (!user.blobs) user.blobs = [];

    const newBlob: BlobRecord = {
      id: `blob-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...blob,
      createdAt: new Date().toISOString()
    };
    user.blobs.push(newBlob);
    this.saveUsersToDisk();
    return newBlob;
  }

  public async getUserBlobs(userId: string): Promise<BlobRecord[]> {
    const user = this.users.find(u => u.id === userId);
    return user?.blobs || [];
  }

  public async deleteBlob(userId: string, blobId: string): Promise<boolean> {
    const user = this.users.find(u => u.id === userId);
    if (!user || !user.blobs) return false;
    const before = user.blobs.length;
    user.blobs = user.blobs.filter(b => b.id !== blobId);
    if (user.blobs.length < before) {
      this.saveUsersToDisk();
      return true;
    }
    return false;
  }
}

export const postgresClient = new PostgresClient();
