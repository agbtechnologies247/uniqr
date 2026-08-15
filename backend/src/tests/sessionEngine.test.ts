import { describe, it, expect } from 'vitest';
import { sessionEngine } from '../domains/auth/sessionEngine.js';

describe('SessionEngine', () => {
  it('generates raw token and produces consistent SHA-256 hash', () => {
    const rawToken = sessionEngine.generateRawToken();
    expect(rawToken).toBeDefined();
    expect(typeof rawToken).toBe('string');
    expect(rawToken.length).toBeGreaterThan(10);

    const hash1 = sessionEngine.hashToken(rawToken);
    const hash2 = sessionEngine.hashToken(rawToken);
    expect(hash1).toBe(hash2);
  });

  it('creates and validates a session for a test user', async () => {
    const mockUser = {
      id: 'usr-test-101',
      email: 'unit.test@agbtechnologies.com',
      name: 'Test User',
      role: 'user' as const,
      accountStatus: 'active' as const,
      createdAt: new Date().toISOString()
    };

    const sessionResult = await sessionEngine.createSession(mockUser, '127.0.0.1', 'Vitest Agent');
    expect(sessionResult).toHaveProperty('rawToken');
    expect(sessionResult).toHaveProperty('session');

    const validatedContext = await sessionEngine.validateSessionToken(sessionResult.rawToken);
    expect(validatedContext).not.toBeNull();
    expect(validatedContext?.user.email).toBe('unit.test@agbtechnologies.com');
  });
});
