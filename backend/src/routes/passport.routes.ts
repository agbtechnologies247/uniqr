import { Router, Request, Response } from 'express';
import fs from 'fs';

/**
 * Passport Config API Routes
 *
 * GET  /api/v1/passport-config         → Get the user's global passport config
 * PUT  /api/v1/passport-config         → Save/update the user's global passport config
 */
export function createPassportRouter(dataFilePath: string) {
  const router = Router();

  // Helper: read db.json
  const readDb = (): any => {
    try {
      return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    } catch {
      return { products: [], users: {}, passportConfigs: {} };
    }
  };

  // Helper: write db.json
  const writeDb = (data: any): void => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  };

  // GET /api/v1/passport-config
  router.get('/passport-config', (req: Request, res: Response) => {
    const db = readDb();
    const configs = db.passportConfigs || {};

    // For now, use a default user key (in production, extract from JWT/session)
    const userKey = (req.headers['x-user-email'] as string) || 'default';
    const userConfig = configs[userKey];

    if (userConfig) {
      return res.json({ success: true, config: userConfig });
    }

    return res.json({ success: true, config: null, message: 'No custom passport config found. Using default.' });
  });

  // PUT /api/v1/passport-config
  router.put('/passport-config', (req: Request, res: Response) => {
    const db = readDb();
    if (!db.passportConfigs) {
      db.passportConfigs = {};
    }

    const userKey = (req.headers['x-user-email'] as string) || 'default';
    const configBody = req.body;

    if (!configBody || typeof configBody !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid passport config payload.' });
    }

    // Store the config
    db.passportConfigs[userKey] = {
      ...configBody,
      updatedAt: new Date().toISOString(),
    };

    writeDb(db);

    return res.json({
      success: true,
      message: 'Passport configuration saved successfully.',
      config: db.passportConfigs[userKey],
    });
  });

  return router;
}
