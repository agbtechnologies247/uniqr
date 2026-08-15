import { Router, Request, Response } from 'express';
import { redisClient } from '../domains/db/redisClient.js';
import { validateBody, scanIngestSchema } from '../middleware/validate.js';

export function createAnalyticsRouter(db: any, saveDatabase: (db: any) => void) {
  const router = Router();

  // POST /api/v1/scans (Real-Time Scan Event Ingestion)
  router.post('/scans', validateBody(scanIngestSchema), (req: Request, res: Response) => {
    const scanEvent = req.body;
    scanEvent.id = scanEvent.id || `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    scanEvent.timestamp = scanEvent.timestamp || new Date().toISOString();

    db.scans = db.scans || [];
    db.scans.unshift(scanEvent);

    if (db.scans.length > 500) {
      db.scans = db.scans.slice(0, 500);
    }
    saveDatabase(db);

    res.json({ status: 'SUCCESS', scanId: scanEvent.id });
  });

  // GET /api/v1/analytics/summary
  router.get('/analytics/summary', (req: Request, res: Response) => {
    const scans = db.scans || [];
    const totalScans = scans.length;
    const totalProducts = db.products.length;
    const activeProducts = db.products.filter((p: any) => p.status === 'Active').length;

    const deviceCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    scans.forEach((s: any) => {
      const dev = s.device || 'Unknown Mobile';
      const city = s.city || 'Pune';
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    res.json({
      status: 'SUCCESS',
      summary: {
        totalScans,
        totalProducts,
        activeProducts,
        topDevice: Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mobile Scanner',
        topCity: Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Pune',
        deviceBreakdown: deviceCounts,
        cityBreakdown: cityCounts,
        recentScans: scans.slice(0, 10)
      }
    });
  });

  // GET /api/v1/ip-quota (IP Quota Check)
  router.get('/ip-quota', (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const limit = redisClient.checkRateLimit(clientIp, 60, 60);

    res.json({
      ip: clientIp,
      scansLastMinute: 60 - limit.remaining,
      maxAllowedPerMinute: 60,
      remaining: limit.remaining,
      allowed: limit.allowed,
      resetMs: limit.resetMs
    });
  });

  return router;
}
