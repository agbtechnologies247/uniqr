export interface RedisScanSession {
  scanId: string;
  qrSlug: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
}

class RedisClient {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();
  private rateLimitMap: Map<string, number[]> = new Map();

  constructor() {
    console.log('[Redis Engine] Initialized Ephemeral Session & Sliding Window Rate Limit Store.');
  }

  public set(key: string, value: any, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  public get<T = any>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  public del(key: string): void {
    this.cache.delete(key);
  }

  // Sliding Window Rate Limiter (IP-Level Security against Automated Web Scrapers)
  public checkRateLimit(ip: string, limit = 60, windowSeconds = 60): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const timestamps = (this.rateLimitMap.get(ip) || []).filter(ts => now - ts < windowMs);

    if (timestamps.length >= limit) {
      const oldest = timestamps[0];
      return {
        allowed: false,
        remaining: 0,
        resetMs: Math.max(0, windowMs - (now - oldest))
      };
    }

    timestamps.push(now);
    this.rateLimitMap.set(ip, timestamps);

    return {
      allowed: true,
      remaining: limit - timestamps.length,
      resetMs: windowMs
    };
  }

  // Anonymous Public Scan Session (30 Min TTL)
  public createPublicScanSession(qrSlug: string, ip: string, userAgent: string): string {
    const scanId = `scan_sess_${Math.random().toString(36).substring(2, 12)}`;
    const sessionData: RedisScanSession = {
      scanId,
      qrSlug,
      ip,
      userAgent,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1800 * 1000).toISOString()
    };
    this.set(`scan:${scanId}`, sessionData, 1800); // 30 minutes TTL
    return scanId;
  }
}

export const redisClient = new RedisClient();
