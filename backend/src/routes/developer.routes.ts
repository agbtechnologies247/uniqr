import { Router, Request, Response } from 'express';
import { eventBus } from '../domains/events/eventBus.js';

export function createDeveloperRouter(db: any, saveDatabase: (db: any) => void, getOrCreateProduct: (qr: string) => any) {
  const router = Router();

  // GET /api/v1/keys
  router.get('/keys', (req: Request, res: Response) => {
    db.apiKeys = db.apiKeys || [];
    res.json(db.apiKeys);
  });

  // POST /api/v1/keys
  router.post('/keys', (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'API Key name required' });
    }

    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: `key-${Date.now()}`,
      name,
      keySecret: `uq_live_${randomHex}`,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    db.apiKeys = db.apiKeys || [];
    db.apiKeys.unshift(newKey);
    saveDatabase(db);

    res.json({ status: 'SUCCESS', key: newKey });
  });

  // DELETE /api/v1/keys/:id
  router.delete('/keys/:id', (req: Request, res: Response) => {
    const id = String(req.params.id);
    db.apiKeys = (db.apiKeys || []).filter((k: any) => k.id !== id);
    saveDatabase(db);
    res.json({ status: 'SUCCESS', message: `API Key ${id} revoked.` });
  });

  // GET /api/v1/events (Event Bus History)
  router.get('/events', (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 50;
    const history = eventBus.getEventHistory(limit);
    res.json({ total: history.length, events: history });
  });

  // GET /api/v1/graph
  router.get('/graph', (req: Request, res: Response) => {
    const nodes = db.products.map((p: any) => ({
      id: p.id,
      label: p.name,
      type: 'Product',
      details: { SKU: p.sku, Category: p.category }
    }));

    const links: any[] = [];
    db.products.forEach((p: any) => {
      if (p.connectedApps && Array.isArray(p.connectedApps)) {
        p.connectedApps.forEach((app: string) => {
          const appId = `app-${app.toLowerCase().replace(/\s+/g, '')}`;
          links.push({ source: p.id, target: appId, relation: 'CONNECTED_TO' });
        });
      }
    });

    res.json({ nodes, links });
  });

  // GET /api/v1/openapi.json
  router.get('/openapi.json', (req: Request, res: Response) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'UniQR Enterprise Platform API',
        version: '1.0.0',
        description: 'Production REST API endpoints for UniQR Digital Identity platform.'
      },
      servers: [{ url: 'https://uniqr.agbtechnologies.in/api/v1' }],
      paths: {
        '/health': { get: { summary: 'Cluster Health Check', responses: { '200': { description: 'Healthy' } } } },
        '/auth/login': { post: { summary: 'HttpOnly Cookie Login' } },
        '/auth/send-otp': { post: { summary: 'Dispatch 6-Digit OTP' } },
        '/auth/verify-otp': { post: { summary: 'Verify OTP & Set Cookie' } },
        '/details/{qr}': { get: { summary: 'Public Product Passport' } },
        '/resolve/{qr}': { get: { summary: 'Universal QR Resolution' } },
        '/products': { get: { summary: 'List Products' }, post: { summary: 'Create Product' } },
        '/trail/{qr}': { get: { summary: 'Get Tamper-Evident Trail' } },
        '/trail/{qr}/append': { post: { summary: 'Append SHA-256 Trail Block' } }
      }
    });
  });

  // GET /api/v1/export/highres/:qr
  router.get('/export/highres/:qr', (req: Request, res: Response) => {
    const qr = String(req.params.qr);
    const dpi = Number(req.query.dpi) || 600;
    const product = getOrCreateProduct(qr);

    res.json({
      qr: product.uniqrCode,
      format: 'PNG',
      resolution: `${dpi} DPI`,
      dimensions: '2400x2400 px',
      printReady: true,
      downloadUrl: `https://uniqr.agbtechnologies.in/api/v1/resolve/${product.uniqrCode}`
    });
  });

  // GET /api/v1/export/vector/:qr
  router.get('/export/vector/:qr', (req: Request, res: Response) => {
    const qr = String(req.params.qr);
    const product = getOrCreateProduct(qr);

    res.json({
      qr: product.uniqrCode,
      format: 'SVG / DXF',
      vectorEngine: 'UniQR Precision Laser Vector Generator',
      dxfCompatible: true,
      cadLayers: ['QR_CUT_LAYER', 'BRAND_HEADER_LAYER', 'TEXT_LABEL_LAYER'],
      downloadUrl: `https://uniqr.agbtechnologies.in/api/v1/resolve/${product.uniqrCode}`
    });
  });

  return router;
}
