import React, { useState } from 'react';
import { X, Check, Zap, CreditCard, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUBSCRIPTION_TIERS } from '../../data/mockData';
import { storage } from '../../services/storage';
import { triggerRazorpayCheckout } from '../../services/razorpay';
import { sound } from '../../services/audio';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpgrade: () => void;
  onOpenContactSales?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccessUpgrade,
  onOpenContactSales
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('business');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const activePlan = SUBSCRIPTION_TIERS.find(t => t.id === selectedPlanId) || SUBSCRIPTION_TIERS[1];

  const handlePayAndUpgrade = () => {
    if (selectedPlanId === 'enterprise') {
      onClose();
      if (onOpenContactSales) onOpenContactSales();
      return;
    }

    if (activePlan.priceINR === 0) {
      storage.updateSubscription(selectedPlanId);
      onSuccessUpgrade();
      onClose();
      return;
    }

    setIsProcessing(true);
    sound.playClick();

    triggerRazorpayCheckout({
      planId: activePlan.id,
      planName: activePlan.name,
      amountINR: activePlan.priceINR,
      onSuccess: () => {
        storage.updateSubscription(activePlan.id);
        setIsProcessing(false);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onSuccessUpgrade();
        onClose();
      },
      onError: () => {
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5E3122]/60 backdrop-blur-md overflow-y-auto selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      <div className="bg-white w-full max-w-4xl p-6 sm:p-8 rounded-3xl border-2 border-[#F9D2BA] shadow-2xl relative my-8 text-[#5E3122]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#F9D2BA]">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="UniQR Logo" className="w-10 h-10 rounded-2xl border border-[#F9D2BA] object-cover shadow-md" />
            <div>
              <h2 className="font-extrabold text-xl text-[#1D4533]">Standardized Subscription Tiers</h2>
              <p className="text-xs text-[#5E3122] font-semibold">Select your plan — powered by Instant Razorpay Checkout</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7EAE0] text-[#1D4533] flex items-center justify-center hover:bg-[#F9D2BA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* UPI PRIORITY CALLOUT BANNER */}
        <div className="mt-4 p-3 rounded-2xl bg-[#1D4533] text-[#F7EAE0] flex items-center justify-between gap-3 text-xs shadow-xs border border-[#F9D2BA]/40">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-[#F9D2BA] text-[#1D4533] font-black text-[9px] uppercase tracking-wider shrink-0">
              UPI 1st Priority
            </span>
            <span className="font-bold text-[11px] text-[#F7EAE0] truncate">
              Instant checkout via Google Pay, PhonePe, Paytm, Cred &amp; UPI QR
            </span>
          </div>
          <span className="text-[10px] text-[#F9D2BA] font-bold shrink-0 hidden sm:inline-block">
            Highest Success Rate
          </span>
        </div>

        {/* 5 PLAN CARDS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 py-6">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedPlanId(tier.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative ${
                selectedPlanId === tier.id
                  ? 'border-[#1D4533] bg-[#F7EAE0] ring-2 ring-[#1D4533] shadow-md'
                  : 'border-[#F9D2BA] bg-white hover:border-[#1D4533]'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[8px] font-black uppercase">
                  Popular
                </span>
              )}

              <div className="space-y-2">
                <span className="font-black text-xs text-[#1D4533] block">{tier.name}</span>
                <div className="text-xl font-black text-[#1D4533]">
                  {tier.priceINR === 0 ? (tier.id === 'enterprise' ? 'Custom' : '₹0') : `₹${tier.priceINR}`}
                  <span className="text-[9px] text-[#5E3122] font-semibold block">{tier.priceINR === 0 && tier.id === 'free' ? 'Lifetime Free' : 'per month'}</span>
                </div>

                <ul className="space-y-1 text-[10px] text-[#5E3122] font-medium border-t border-[#F9D2BA] pt-2">
                  {tier.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-[#1D4533] shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`w-4 h-4 rounded-full border flex items-center justify-center mx-auto ${
                selectedPlanId === tier.id ? 'border-[#1D4533] bg-[#1D4533]' : 'border-[#F9D2BA]'
              }`}>
                {selectedPlanId === tier.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          ))}
        </div>

        {/* PAY ACTION FOOTER */}
        <div className="p-4 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-[#1D4533]">
            Selected Plan: <strong className="font-extrabold uppercase">{activePlan.name}</strong> ({activePlan.priceINR === 0 ? (activePlan.id === 'enterprise' ? 'Custom Pricing' : '₹0 Free') : `₹${activePlan.priceINR}/month`})
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#5E3122] hover:text-[#1D4533]"
            >
              Cancel
            </button>

            <button
              onClick={handlePayAndUpgrade}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#F9D2BA]" />
                  <span>{activePlan.id === 'enterprise' ? 'Contact Enterprise Sales' : `Pay ₹${activePlan.priceINR} via UPI / Razorpay`}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
