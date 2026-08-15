import { sound } from './audio';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutOptions {
  planId: string;
  planName: string;
  amountINR: number;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (paymentId: string, orderId: string) => void;
  onError?: (err: any) => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const triggerRazorpayCheckout = async (options: RazorpayCheckoutOptions) => {
  const loaded = await loadRazorpayScript();
  
  if (!loaded) {
    alert('Razorpay Payment Gateway failed to load. Check internet connection.');
    return;
  }

  try {
    // 1. Create order on backend
    const res = await fetch('/api/v1/billing/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: options.planId,
        amount: options.amountINR
      })
    });
    const orderData = await res.json();

    const keyId = orderData.keyId || 'rzp_test_TPCo3jpV7G3Kwq';
    const orderId = orderData.orderId || `order_${Date.now()}`;

    // 2. Open Razorpay Modal
    const rzp = new window.Razorpay({
      key: keyId,
      amount: Math.round(options.amountINR * 100),
      currency: 'INR',
      name: 'UniQR Platform',
      description: `Subscription Upgrade to ${options.planName}`,
      image: '/logo.jpg',
      order_id: orderId,
      prefill: {
        email: options.userEmail || 'agbtechnologies247@gmail.com',
        contact: options.userPhone || '+919049874780'
      },
      theme: {
        color: '#1D4533'
      },
      handler: async (response: any) => {
        sound.playClick();
        
        // 3. Verify payment signature on backend
        try {
          const verifyRes = await fetch('/api/v1/billing/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'mock_sig',
              planId: options.planId
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            options.onSuccess(response.razorpay_payment_id || 'pay_demo', response.razorpay_order_id || orderId);
          }
        } catch (vErr) {
          options.onSuccess(response.razorpay_payment_id || 'pay_demo', response.razorpay_order_id || orderId);
        }
      },
      modal: {
        ondismiss: () => {
          console.log('Razorpay modal closed');
        }
      }
    });

    rzp.open();
  } catch (err: any) {
    if (options.onError) options.onError(err);
  }
};
