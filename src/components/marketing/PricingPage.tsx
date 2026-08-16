import React from 'react';
import { 
  Check, Zap, ShieldCheck, CreditCard, Sparkles, Building2, MessageSquare, ArrowRight, Lock
} from 'lucide-react';
import { Footer } from '../layout/Footer';
import { sound } from '../../services/audio';
import { triggerRazorpayCheckout } from '../../services/razorpay';

interface PricingPageProps {
  onNavigate: (tab: string) => void;
  onOpenUpgrade: () => void;
  onOpenContactSales: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onOpenUpgrade, onOpenContactSales }) => {
  
  const handlePay = (planId: string, planName: string, amount: number) => {
    sound.playClick();
    triggerRazorpayCheckout({
      planId,
      planName: `${planName} (incl. 18% GST)`,
      amountINR: amount,
      onSuccess: (paymentId) => {
        alert(`Payment successful (${paymentId})! ${planName} plan is now active with 18% GST invoice.`);
        onNavigate('app');
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col justify-between selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* PRICING HEADER */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl mx-auto w-full flex-1">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
            <span>Universal Pricing Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#1D4533] tracking-tight">
            Standardized Plans Built for Scale
          </h1>

          <p className="text-sm sm:text-base text-[#5E3122] font-semibold leading-relaxed">
            Choose the right tier for your product catalog — backed by instant Razorpay UPI Checkout and statutory 18% GST tax invoices.
          </p>

          {/* UPI Priority Callout */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1D4533] text-[#F7EAE0] text-xs font-bold shadow-sm border border-[#F9D2BA]/40">
            <span className="px-2 py-0.5 rounded-lg bg-[#F9D2BA] text-[#1D4533] font-black text-[9px] uppercase tracking-wider">
              UPI 1st Priority
            </span>
            <span>⚡ Instant Payment via GPay, PhonePe, Paytm, Cred &amp; UPI QR</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate('subscription');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-[#F9D2BA] text-[#1D4533] border border-[#F9D2BA] font-extrabold text-xs shadow-sm transition-all"
            >
              <CreditCard className="w-4 h-4 text-[#1D4533]" />
              <span>Open My Billing &amp; Subscription Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5 PRICING CARDS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          
          {/* TIER 1: STARTER FREE */}
          <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                Starter Free
              </span>
              <div>
                <div className="text-3xl font-black text-[#1D4533]">₹0</div>
                <div className="text-[11px] text-[#5E3122] font-semibold mt-0.5">Lifetime Free (GST Exempt)</div>
              </div>

              <ul className="space-y-2 text-xs text-[#5E3122] font-semibold border-t border-[#F9D2BA] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Up to 10 Active Product QRs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Standard PNG &amp; SVG Exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Basic Product Identity Passport</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('app');
              }}
              className="w-full py-3 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs border border-[#F9D2BA] transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* TIER 2: PRO GROWTH */}
          <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                Pro Growth
              </span>
              <div>
                <div className="text-3xl font-black text-[#1D4533]">₹399</div>
                <div className="text-[11px] text-[#5E3122] font-semibold mt-0.5">+ 18% GST (₹71.82)</div>
                <div className="text-xs font-black text-[#1D4533] mt-1">Total: ₹470.82 / mo</div>
              </div>

              <ul className="space-y-2 text-xs text-[#5E3122] font-semibold border-t border-[#F9D2BA] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Up to 50 Product QRs / Mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>8192px Ultra High Res Exports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Tamper-Evident Trail Ledgers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>GST Registered Invoicing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePay('pro', 'Pro Growth', 470.82)}
              className="w-full py-3 rounded-xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#F9D2BA]" />
              <span>Pay ₹470.82 via UPI</span>
            </button>
          </div>

          {/* TIER 3: BUSINESS SCALE (POPULAR) */}
          <div className="bg-[#1D4533] text-[#F7EAE0] p-6 rounded-3xl border-2 border-[#F9D2BA] shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#F9D2BA] text-[#1D4533] text-[9px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#5E3122] text-[#F9D2BA] font-extrabold text-[10px] uppercase border border-[#F9D2BA]/30">
                Business Scale
              </span>
              <div>
                <div className="text-3xl font-black text-white">₹999</div>
                <div className="text-[11px] text-[#F7EAE0]/80 font-semibold mt-0.5">+ 18% GST (₹179.82)</div>
                <div className="text-xs font-black text-[#F9D2BA] mt-1">Total: ₹1,178.82 / mo</div>
              </div>

              <ul className="space-y-2 text-xs text-[#F7EAE0]/90 font-semibold border-t border-[#F9D2BA]/30 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F9D2BA] shrink-0" />
                  <span>Up to 500 Product QRs / Mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F9D2BA] shrink-0" />
                  <span>Laser / Vector Engraving SVG</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F9D2BA] shrink-0" />
                  <span>AI Decision Engine &amp; ML</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#F9D2BA] shrink-0" />
                  <span>GST Registered Invoicing</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePay('business', 'Business Scale', 1178.82)}
              className="w-full py-3 rounded-xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#1D4533]" />
              <span>Pay ₹1,178.82 via UPI</span>
            </button>
          </div>

          {/* TIER 4: FACTORY SCALE */}
          <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                Factory Scale
              </span>
              <div>
                <div className="text-3xl font-black text-[#1D4533]">₹2,999</div>
                <div className="text-[11px] text-[#5E3122] font-semibold mt-0.5">+ 18% GST (₹539.82)</div>
                <div className="text-xs font-black text-[#1D4533] mt-1">Total: ₹3,538.82 / mo</div>
              </div>

              <ul className="space-y-2 text-xs text-[#5E3122] font-semibold border-t border-[#F9D2BA] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Up to 5,000 Product QRs / Mo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Laser / Vector Engraving SVG</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>AI Decision Engine &amp; ML</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>24/7 Phone &amp; Email SLA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePay('factory', 'Factory Scale', 3538.82)}
              className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-[#F9D2BA]" />
              <span>Pay ₹3,538.82 via UPI</span>
            </button>
          </div>

          {/* TIER 5: ENTERPRISE CUSTOM */}
          <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                Enterprise Custom
              </span>
              <div>
                <div className="text-2xl font-black text-[#1D4533]">Custom</div>
                <div className="text-[11px] text-[#5E3122] font-semibold mt-0.5">Contact Sales</div>
              </div>

              <ul className="space-y-2 text-xs text-[#5E3122] font-semibold border-t border-[#F9D2BA] pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Unlimited Product Identifiers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Dedicated Enterprise ERP Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#1D4533] shrink-0" />
                  <span>Custom Domain &amp; SLA Guarantee</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onOpenContactSales();
              }}
              className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Sales</span>
            </button>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <Footer onNavigate={onNavigate} onOpenContactSales={onOpenContactSales} />

    </div>
  );
};
