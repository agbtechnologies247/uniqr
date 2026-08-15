import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Generic Express middleware to validate req.body against a Zod schema
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details: errors
      });
    }
    req.body = result.data;
    next();
  };
}

// ---- Validation Schemas ----

export const sendOtpSchema = z.object({
  target: z.string().min(3, 'Target email or phone is required'),
  channel: z.enum(['email', 'phone']).optional().default('email')
});

export const verifyOtpSchema = z.object({
  target: z.string().min(3, 'Target email or phone is required'),
  code: z.string().length(6, '6-digit OTP code required')
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address required')
});

export const productSchema = z.object({
  id: z.string().optional(),
  uniqrCode: z.string().min(1, 'uniqrCode is required'),
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().optional().default(''),
  brand: z.string().optional().default('AGB Industrial Equipment Pvt. Ltd.'),
  manufacturer: z.string().optional().default('AGB Industrial Equipment Pvt. Ltd.'),
  description: z.string().optional().default(''),
  category: z.string().optional().default('General'),
  hsn: z.string().optional().default(''),
  gst: z.number().optional().default(18),
  batchNumber: z.string().optional().default(''),
  serialNumber: z.string().optional().default(''),
  mfgDate: z.string().optional().default(''),
  expDate: z.string().optional().default(''),
  warrantyMonths: z.number().optional().default(0),
  customFields: z.record(z.any()).optional().default({}),
  builderSections: z.array(z.any()).optional().default([]),
  trailEvents: z.array(z.any()).optional().default([]),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  location: z.string().optional().default(''),
  supplier: z.string().optional().default(''),
  status: z.string().optional().default('Active'),
  connectedApps: z.array(z.string()).optional().default([]),
  entityType: z.string().optional().default('product'),
  entityCode: z.string().optional(),
  identityNumber: z.string().optional(),
  organization: z.string().optional(),
  domainData: z.record(z.any()).optional().default({}),
  qrPurpose: z.string().optional().default('authentication'),
  relationships: z.array(z.any()).optional().default([]),
  scanBehavior: z.record(z.any()).optional()
});

export const trailAppendSchema = z.object({
  type: z.string().min(1, 'Event type is required'),
  module: z.enum(['Manufacturing', 'Quality', 'Logistics', 'Sales', 'Service', 'Custom']).optional().default('Quality'),
  location: z.string().optional().default('Pune Testing Lab'),
  user: z.string().optional().default('qa.inspector@agb.in'),
  department: z.string().optional().default('Quality Operations'),
  details: z.record(z.any()).optional().default({})
});

export const createOrderSchema = z.object({
  planId: z.string().optional().default('pro'),
  amount: z.number().positive('Amount must be greater than 0')
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().optional(),
  planId: z.string().optional().default('pro')
});

export const scanIngestSchema = z.object({
  uniqrCode: z.string().min(1, 'uniqrCode is required'),
  productName: z.string().optional(),
  country: z.string().optional().default('India'),
  city: z.string().optional().default('Bengaluru'),
  device: z.string().optional().default('Mobile'),
  os: z.string().optional().default('Android 15'),
  browser: z.string().optional().default('Chrome Mobile'),
  referral: z.string().optional().default('Camera Scan'),
  appSource: z.string().optional().default('Web Camera'),
  isRepeat: z.boolean().optional().default(false)
});
