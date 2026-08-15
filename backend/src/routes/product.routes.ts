import { Router, Request, Response } from 'express';
import { validateBody, productSchema } from '../middleware/validate.js';
import { eventBus } from '../domains/events/eventBus.js';

export function createProductRouter(db: any, saveDatabase: (db: any) => void, getOrCreateProduct: (qr: string) => any) {
  const router = Router();

  // GET /api/v1/products
  router.get('/products', (req: Request, res: Response) => {
    res.json(db.products);
  });

  // POST /api/v1/products (Realtime Product Sync & Save)
  router.post('/products', validateBody(productSchema), (req: Request, res: Response) => {
    const product = req.body;

    const idx = db.products.findIndex((p: any) => p.id === product.id || p.uniqrCode === product.uniqrCode);
    if (idx >= 0) {
      db.products[idx] = { ...db.products[idx], ...product, updatedAt: new Date().toISOString() };
    } else {
      product.createdAt = product.createdAt || new Date().toISOString();
      product.updatedAt = new Date().toISOString();
      db.products.unshift(product);
    }

    saveDatabase(db);

    eventBus.publish({
      id: `evt-${Date.now()}`,
      type: idx >= 0 ? 'ENTITY_UPDATED' : 'ENTITY_CREATED',
      entityId: product.id,
      qrCode: product.uniqrCode,
      tenantId: 'TENANT-001',
      timestamp: new Date().toISOString(),
      actor: { userId: 'usr-admin-001', role: 'admin' },
      payload: { name: product.name, sku: product.sku }
    });

    res.status(201).json({ status: 'SUCCESS', product });
  });

  // DELETE /api/v1/products/:id
  router.delete('/products/:id', (req: Request, res: Response) => {
    const id = String(req.params.id);
    const initialCount = db.products.length;
    db.products = db.products.filter((p: any) => p.id !== id && p.uniqrCode !== id);

    if (db.products.length < initialCount) {
      saveDatabase(db);
      res.json({ status: 'SUCCESS', message: `Product ${id} deleted.` });
    } else {
      res.status(404).json({ error: 'PRODUCT_NOT_FOUND', message: `Product ${id} not found.` });
    }
  });

  // POST /api/v1/products/bulk (Batch Product Import)
  router.post('/products/bulk', (req: Request, res: Response) => {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Array of products required in request body.' });
    }

    let importedCount = 0;
    products.forEach(p => {
      if (p.uniqrCode && p.name) {
        const idx = db.products.findIndex((existing: any) => existing.uniqrCode === p.uniqrCode);
        const fullProd = {
          id: p.id || `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          uniqrCode: p.uniqrCode,
          name: p.name,
          sku: p.sku || p.uniqrCode,
          brand: p.brand || 'UniQR Industrial',
          manufacturer: p.manufacturer || 'AGB Technologies',
          description: p.description || '',
          category: p.category || 'General',
          hsn: p.hsn || '',
          gst: p.gst || 18,
          batchNumber: p.batchNumber || 'BATCH-BULK',
          serialNumber: p.serialNumber || p.uniqrCode,
          mfgDate: p.mfgDate || new Date().toISOString().split('T')[0],
          expDate: p.expDate || '',
          warrantyMonths: p.warrantyMonths || 12,
          customFields: p.customFields || {},
          builderSections: p.builderSections || [],
          trailEvents: p.trailEvents || [],
          status: p.status || 'Active',
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          connectedApps: p.connectedApps || []
        };

        if (idx >= 0) {
          db.products[idx] = { ...db.products[idx], ...fullProd };
        } else {
          db.products.unshift(fullProd);
        }
        importedCount++;
      }
    });

    saveDatabase(db);
    res.json({ status: 'SUCCESS', importedCount, totalProducts: db.products.length });
  });

  // DELETE /api/v1/products/bulk (Bulk Product Purge)
  router.delete('/products/bulk', (req: Request, res: Response) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Array of IDs required.' });
    }

    const initial = db.products.length;
    db.products = db.products.filter((p: any) => !ids.includes(p.id) && !ids.includes(p.uniqrCode));
    const deletedCount = initial - db.products.length;
    saveDatabase(db);

    res.json({ status: 'SUCCESS', deletedCount });
  });

  // GET /api/v1/products/:qr/schema
  router.get('/products/:qr/schema', (req: Request, res: Response) => {
    const qr = String(req.params.qr);
    const product = getOrCreateProduct(qr);

    res.json({
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: `${product.name} Schema`,
      type: 'object',
      properties: {
        uniqrCode: { type: 'string', const: product.uniqrCode },
        name: { type: 'string', const: product.name },
        sku: { type: 'string', const: product.sku },
        brand: { type: 'string', const: product.brand },
        category: { type: 'string', const: product.category },
        warrantyMonths: { type: 'number', const: product.warrantyMonths },
        customFields: { type: 'object' }
      },
      required: ['uniqrCode', 'name', 'sku']
    });
  });

  // GET /api/v1/details/:qr
  router.get('/details/:qr', (req: Request, res: Response) => {
    const qrParam = String(req.params.qr);
    const product = getOrCreateProduct(qrParam);

    const publicDetails = {
      qr: product.uniqrCode,
      id: product.id,
      product: product.name,
      name: product.name,
      description: product.description,
      brand: product.brand,
      manufacturer: product.manufacturer,
      category: product.category,
      model: product.sku,
      sku: product.sku,
      serial: product.serialNumber,
      batch: product.batchNumber,
      mfg_date: product.mfgDate,
      expiry: product.expDate,
      warranty: `${product.warrantyMonths} Months Active`,
      warrantyMonths: product.warrantyMonths,
      hsn: product.hsn,
      gst_percent: product.gst,
      images: product.imageUrl ? [product.imageUrl] : [],
      certifications: ["ISO 9001", "UniQR Authenticated Twin"],
      public_fields: product.customFields || {},
      customFields: product.customFields || {},
      builderSections: product.builderSections || [],
      connectedApps: product.connectedApps || ['Enterprise ERP', 'Asset Tracking'],
      status: product.status || 'Active',
      rawProduct: product
    };

    res.json(publicDetails);
  });

  return router;
}
