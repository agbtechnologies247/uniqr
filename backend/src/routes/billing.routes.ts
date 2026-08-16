import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { validateBody, createOrderSchema, verifyPaymentSchema } from '../middleware/validate.js';

export const billingRouter = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

// POST /api/v1/billing/create-order
billingRouter.post('/create-order', validateBody(createOrderSchema), async (req: Request, res: Response) => {
  try {
    const { planId, amount } = req.body;
    const amountInPaise = Math.round(Number(amount) * 100);

    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
      try {
        const response = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
              planId: planId || 'pro',
              gst_percent: '18%',
              statutory_tax: 'GST_INVOICING',
              payment_method: 'UPI_FIRST'
            }
          })
        });
        const orderData = await response.json();

        if (response.ok && orderData.id) {
          return res.json({
            success: true,
            keyId: RAZORPAY_KEY_ID,
            orderId: orderData.id,
            amount: amountInPaise,
            currency: 'INR'
          });
        } else {
          console.warn('[RAZORPAY ORDERS API INFO]', orderData);
        }
      } catch (err: any) {
        console.error('[RAZORPAY ORDER API ERROR]', err.message);
      }
    }

    // Direct checkout without order_id (Razorpay accepts direct standard checkout)
    return res.json({
      success: true,
      keyId: RAZORPAY_KEY_ID || 'rzp_live_TQ4RXmcwF6YO6G',
      amount: amountInPaise,
      currency: 'INR'
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'CREATE_ORDER_FAILED', message: err.message });
  }
});

// POST /api/v1/billing/verify-payment
billingRouter.post('/verify-payment', validateBody(verifyPaymentSchema), async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (RAZORPAY_KEY_SECRET && razorpay_signature) {
      const generatedSig = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSig !== razorpay_signature) {
        return res.status(400).json({ error: 'INVALID_SIGNATURE', message: 'Payment verification failed. HMAC signature mismatch.' });
      }
    }

    console.log(`[RAZORPAY SUCCESS] Upgraded to plan ${planId} via payment ${razorpay_payment_id}`);

    res.json({
      success: true,
      status: 'PLAN_ACTIVATED',
      planId: planId || 'pro',
      paymentId: razorpay_payment_id,
      activatedAt: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: 'VERIFICATION_FAILED', message: err.message });
  }
});
