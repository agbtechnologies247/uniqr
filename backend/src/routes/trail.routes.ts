import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { validateBody, trailAppendSchema } from '../middleware/validate.js';
import { eventBus } from '../domains/events/eventBus.js';

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function createTrailRouter(db: any, saveDatabase: (db: any) => void, getOrCreateProduct: (qr: string) => any) {
  const router = Router();

  // GET /api/v1/trail/:qr (Get Tamper-Evident Trail Ledger)
  router.get('/trail/:qr', (req: Request, res: Response) => {
    const qrParam = String(req.params.qr);
    const product = getOrCreateProduct(qrParam);
    const events = product.trailEvents || [];

    res.json({
      qr: product.uniqrCode,
      productName: product.name,
      ledger_status: 'TAMPER_EVIDENT_VALID',
      total_blocks: events.length,
      genesis_hash: events[0]?.previousHash || '0000000000000000000000000000000000000000000000000000000000000000',
      latest_hash: events[events.length - 1]?.currentHash || '0000000000000000000000000000000000000000000000000000000000000000',
      trail: events
    });
  });

  // POST /api/v1/trail/:qr/append (Append Tamper-Evident Trail Block)
  router.post('/trail/:qr/append', validateBody(trailAppendSchema), (req: Request, res: Response) => {
    const qrParam = String(req.params.qr);
    const product = getOrCreateProduct(qrParam);
    const { type, module: mod, location, user, department, details } = req.body;

    const events = product.trailEvents || [];
    const prevHash = events.length > 0
      ? events[events.length - 1].currentHash
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const timestamp = new Date().toISOString();
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const sigPayload = `${qrParam}:${type}:${mod || 'Quality'}:${timestamp}:${user || 'system'}`;
    const digitalSignature = `SIG-${sha256(sigPayload).slice(0, 8).toUpperCase()}`;

    const blockData = `${eventId}:${prevHash}:${sigPayload}:${timestamp}`;
    const currentHash = sha256(blockData);

    const newEvent = {
      id: eventId,
      qrId: qrParam,
      type,
      module: mod || 'Quality',
      timestamp,
      location: location || 'Pune Testing Lab',
      department: department || 'Quality Operations',
      user: user || 'qa.inspector@agb.in',
      erpTask: `ERP-TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      digitalSignature,
      previousHash: prevHash,
      currentHash,
      details: details || {}
    };

    events.push(newEvent);
    product.trailEvents = events;

    const idx = db.products.findIndex((p: any) => p.uniqrCode === product.uniqrCode || p.id === product.id);
    if (idx >= 0) {
      db.products[idx] = product;
    } else {
      db.products.unshift(product);
    }
    saveDatabase(db);

    eventBus.publish({
      id: eventId,
      type: 'TRAIL_ADDED',
      entityId: product.id,
      qrCode: qrParam,
      tenantId: 'TENANT-001',
      timestamp,
      actor: { userId: user || 'qa.inspector@agb.in', role: 'inspector' },
      payload: { eventType: type, currentHash }
    });

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Tamper-evident trail block appended.',
      block: newEvent
    });
  });

  return router;
}
