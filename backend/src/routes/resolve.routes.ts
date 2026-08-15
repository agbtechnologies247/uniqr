import { Router, Request, Response } from 'express';
import { UNIVERSAL_SEED_DATA, DEMO_COMPANY_NAME } from '../domains/entities/universalSeedData.js';
import { redisClient } from '../domains/db/redisClient.js';
import { qrAccessPolicyEngine } from '../domains/qr/qrAccessPolicyEngine.js';
import { aiDecisionEngine } from '../domains/ai/aiDecisionEngine.js';
import { eventBus } from '../domains/events/eventBus.js';

export function createResolveRouter(getOrCreateProduct: (qr: string) => any) {
  const router = Router();

  // GET /api/v1/universal (List all Universal QR Seed Objects)
  router.get('/universal', (req: Request, res: Response) => {
    res.json({
      total: UNIVERSAL_SEED_DATA.length,
      company: DEMO_COMPANY_NAME,
      objects: UNIVERSAL_SEED_DATA
    });
  });

  // GET /api/v1/resolve/:qr (Universal QR Resolution Engine)
  router.get('/resolve/:qr', (req: Request, res: Response) => {
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const rateLimit = redisClient.checkRateLimit(clientIp, 60, 60);
    res.setHeader('X-RateLimit-Limit', '60');
    res.setHeader('X-RateLimit-Remaining', String(rateLimit.remaining));

    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: 'TOO_MANY_REQUESTS',
        message: 'Scan rate limit exceeded (max 60 scans/min). Please try again shortly.',
        resetMs: rateLimit.resetMs
      });
    }

    const qrParam = String(req.params.qr).trim();
    const matched = UNIVERSAL_SEED_DATA.find(
      o => o.qr_id.toLowerCase() === qrParam.toLowerCase() ||
           o.identity?.serial_number?.toLowerCase() === qrParam.toLowerCase()
    );

    if (matched) {
      const relatedObjects = UNIVERSAL_SEED_DATA.filter(
        r => matched.relationships.includes(r.qr_id)
      );

      const scanId = redisClient.createPublicScanSession(matched.qr_id, clientIp, req.headers['user-agent'] || 'Scanner');

      return res.json({
        scan_id: scanId,
        qr_id: matched.qr_id,
        type: matched.type,
        status: matched.status,
        versioning: matched.versioning,
        identity: matched.identity,
        attributes: matched.attributes || {},
        commercial: matched.commercial || {},
        contact: matched.contact || {},
        location: matched.location || {},
        installation: matched.installation || {},
        coverage: matched.coverage || {},
        translations: matched.translations || {},
        checks: matched.checks || [],
        steps: matched.steps || [],
        sections: matched.sections || [],
        related_entities: relatedObjects.map(r => ({
          qr_id: r.qr_id,
          type: r.type,
          name: r.identity?.name || r.identity?.title || r.qr_id
        })),
        timestamp: new Date().toISOString()
      });
    }

    // Fallback look up in db.json
    const fallbackProd = getOrCreateProduct(qrParam);
    return res.json({
      scan_id: `scan_${Date.now()}`,
      qr_id: fallbackProd.uniqrCode,
      type: fallbackProd.category === 'Unregistered' ? 'unregistered' : 'product',
      status: fallbackProd.status,
      versioning: { enabled: true, current_version: 1 },
      identity: { name: fallbackProd.name, sku: fallbackProd.sku, model: fallbackProd.category },
      related_entities: [],
      timestamp: new Date().toISOString()
    });
  });

  // GET /api/v1/q/:token (Public QR Scan Gateway)
  router.get('/q/:token', (req: Request, res: Response) => {
    const token = String(req.params.token);
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || 'Unknown Mobile';
    const isAuth = !!req.cookies?.uq_session;

    const product = getOrCreateProduct(token);

    const policyEval = qrAccessPolicyEngine.evaluateAccess(
      token,
      'PUBLIC',
      isAuth,
      clientIp,
      userAgent
    );

    res.cookie('uq_scan', policyEval.scanSessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000
    });

    eventBus.publish({
      id: `evt-${Date.now()}`,
      type: 'QR_SCANNED',
      entityId: product.id,
      qrCode: product.uniqrCode,
      tenantId: 'TENANT-001',
      timestamp: new Date().toISOString(),
      actor: { userId: isAuth ? 'authenticated-user' : 'public-scanner', role: isAuth ? 'user' : 'anonymous' },
      payload: { ip: clientIp, userAgent, scanSessionId: policyEval.scanSessionId }
    });

    const aiResponse = aiDecisionEngine.buildPersonaResponse(
      {
        qrId: token,
        entityId: product.id,
        timestamp: new Date().toISOString(),
        userRole: isAuth ? 'technician' : 'customer'
      },
      {
        operatingHours: 4200,
        lastFailureDays: 180,
        warrantyMonths: product.warrantyMonths || 24,
        productName: product.name
      }
    );

    res.json({
      token,
      entityId: product.id,
      name: product.name,
      policyResult: policyEval,
      aiResponse
    });
  });

  return router;
}
