import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Download, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Layers, 
  QrCode, 
  BarChart3, 
  Network, 
  FileText, 
  Users, 
  Headphones, 
  Code2,
  X,
  ExternalLink,
  ChevronRight,
  User,
  Building,
  Receipt,
  AlertCircle
} from 'lucide-react';
import { sound } from '../../services/audio';
import { triggerRazorpayCheckout } from '../../services/razorpay';
import { storage } from '../../services/storage';
import { SUBSCRIPTION_TIERS } from '../../data/mockData';

interface UserSubscriptionPageProps {
  quotaUsed?: number;
  quotaLimit?: number;
  currentTierName?: string;
  onOpenUpgrade?: () => void;
  onLogout?: () => void;
}

export const UserSubscriptionPage: React.FC<UserSubscriptionPageProps> = ({
  onLogout
}) => {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Read logged-in user profile dynamically
  const [user, setUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('uniqr_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Read active plan ID from storage
  const [activePlanId, setActivePlanId] = useState<string>(() => {
    return localStorage.getItem('uniqr_active_plan') || 'free';
  });

  // Dynamic user products and scans count
  const [productsCount, setProductsCount] = useState<number>(0);
  const [scansCount, setScansCount] = useState<number>(0);

  // Invoices list from storage
  const [invoices, setInvoices] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('uniqr_invoices');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const prods = storage.getProducts();
    const scs = storage.getScans();
    setProductsCount(prods.length);
    setScansCount(scs.length);

    const storedUser = localStorage.getItem('uniqr_user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
  }, []);

  const currentTier = SUBSCRIPTION_TIERS.find(t => t.id === activePlanId) || SUBSCRIPTION_TIERS[0];

  // Dynamic Metered Resources based on active plan limits
  const maxQrLimit = currentTier.id === 'free' ? (currentTier.lifetimeCap || 10) : (currentTier.qrLimitDaily || 50);
  const maxScanLimit = currentTier.id === 'free' ? 100 : (currentTier.qrLimitDaily ? currentTier.qrLimitDaily * 100 : 5000);
  const maxEntityLimit = maxQrLimit;
  const maxApiLimit = currentTier.id === 'free' ? 100 : 50000;

  const usedQRs = productsCount;
  const usedScans = scansCount;
  const usedEntities = productsCount;
  const usedApi = 0;

  const meteredResources = [
    { 
      title: 'QR Codes', 
      used: usedQRs, 
      limit: maxQrLimit, 
      unit: 'QRs', 
      pct: Math.min(100, Math.round((usedQRs / maxQrLimit) * 100 * 10) / 10), 
      color: '#1D4533' 
    },
    { 
      title: 'Scan Traffic', 
      used: usedScans, 
      limit: maxScanLimit, 
      unit: 'scans', 
      pct: Math.min(100, Math.round((usedScans / maxScanLimit) * 100 * 10) / 10), 
      color: '#1D4533' 
    },
    { 
      title: 'Entities & Twins', 
      used: usedEntities, 
      limit: maxEntityLimit, 
      unit: 'entities', 
      pct: Math.min(100, Math.round((usedEntities / maxEntityLimit) * 100 * 10) / 10), 
      color: '#1D4533' 
    },
    { 
      title: 'API Requests', 
      used: usedApi, 
      limit: maxApiLimit, 
      unit: 'requests', 
      pct: Math.min(100, Math.round((usedApi / maxApiLimit) * 100 * 10) / 10), 
      color: '#5E3122' 
    },
  ];

  // Plan Comparison Matrix
  const planComparison = [
    { feature: 'Monthly QR Codes', starter: '10 QRs (Lifetime)', pro: '50 QRs / mo', biz: '500 QRs / mo', factory: '5,000 QRs / mo', ent: 'Unlimited Custom' },
    { feature: 'Export Resolution', starter: 'Standard PNG & SVG', pro: '8192px Ultra High Res', biz: 'Laser & Vector SVG', factory: 'Laser & Vector SVG', ent: 'CAD DXF & Custom' },
    { feature: 'Tamper-Evident Ledgers', starter: 'Basic View', pro: '✓ Included', biz: '✓ Included', factory: '✓ Included', ent: '✓ Dedicated Merkle' },
    { feature: 'AI Decision Engine', starter: '—', pro: '—', biz: '✓ Included', factory: '✓ Included', ent: '✓ Custom ML Cluster' },
    { feature: 'Scan Analytics', starter: 'Basic 7 Days', pro: '✓ 30-Day Deep Geo', biz: '✓ 90-Day Realtime', factory: '✓ 1-Year Deep History', ent: '✓ Unlimited Realtime' },
    { feature: 'Intelligence Graph', starter: 'Basic Nodes', pro: '✓ Relationship Graph', biz: '✓ Neo4j Graph Cluster', factory: '✓ Enterprise Topology', ent: '✓ Dedicated Graph DB' },
    { feature: 'API & Webhook Limits', starter: '100 req / day', pro: '5,000 req / day', biz: '50,000 req / day', factory: '500,000 req / day', ent: 'Dedicated Gateway' },
    { feature: 'Team Seats', starter: '1 User', pro: '3 Users', biz: '10 Users', factory: '25 Users', ent: 'Unlimited Enterprise' },
    { feature: 'Support SLA', starter: 'Community', pro: 'Standard Email', biz: 'Priority Email & Chat', factory: '24/7 Phone & Email', ent: 'Dedicated Account Manager' },
  ];

  const [mobileCompareTab, setMobileCompareTab] = useState<'starter' | 'pro' | 'biz' | 'factory' | 'ent'>('pro');

  const planTiersData = {
    starter: {
      id: 'free',
      name: 'Starter Free',
      basePrice: '₹0',
      gst: '₹0',
      total: '₹0',
      cycle: 'Lifetime Free',
      amountINR: 0,
      desc: 'Basic product identification for testing and personal cataloging.',
      badge: 'Free Tier',
      badgeBg: 'bg-[#F7EAE0] text-[#1D4533]',
      features: [
        { label: 'QR Code Cap', value: '10 Lifetime QRs' },
        { label: 'Scan Limit', value: '100 scans' },
        { label: 'Resolutions', value: 'Standard PNG & SVG' },
        { label: 'Tamper-Evident Ledger', value: 'Basic Trail' },
        { label: 'AI Risk Engine', value: 'Not Included' },
        { label: 'Analytics History', value: '7 Days Basic' },
        { label: 'API Limits', value: '100 req / day' },
        { label: 'Team Seats', value: '1 User' },
        { label: 'Support Level', value: 'Community Support' },
      ]
    },
    pro: {
      id: 'pro',
      name: 'Pro Growth',
      basePrice: '₹399',
      gst: '₹71.82 (18%)',
      total: '₹470.82',
      cycle: 'per month',
      amountINR: 470.82,
      desc: 'Dynamic QR codes, 8192px export and geo analytics for growing brands.',
      badge: 'Popular',
      badgeBg: 'bg-[#1D4533] text-[#F7EAE0]',
      features: [
        { label: 'QR Code Cap', value: '50 QRs / month' },
        { label: 'Scan Limit', value: '5,000 scans' },
        { label: 'Resolutions', value: '8192px Ultra High Res' },
        { label: 'Tamper-Evident Ledger', value: '✓ Cryptographic SHA-256' },
        { label: 'AI Risk Engine', value: '—' },
        { label: 'Analytics History', value: '30-Day Deep Geo Attribution' },
        { label: 'API Limits', value: '5,000 req / day' },
        { label: 'Team Seats', value: '3 Users' },
        { label: 'Support Level', value: 'Standard Email SLA' },
      ]
    },
    biz: {
      id: 'biz',
      name: 'Business Scale',
      basePrice: '₹999',
      gst: '₹179.82 (18%)',
      total: '₹1,178.82',
      cycle: 'per month',
      amountINR: 1178.82,
      desc: 'Complete industrial intelligence with Neo4j entity graphs and laser vector SVG.',
      badge: 'Recommended',
      badgeBg: 'bg-[#5E3122] text-[#F7EAE0]',
      features: [
        { label: 'QR Code Cap', value: '500 QRs / month' },
        { label: 'Scan Limit', value: '50,000 scans' },
        { label: 'Resolutions', value: 'Laser & Vector SVG' },
        { label: 'Tamper-Evident Ledger', value: '✓ Full Merkle Tree Chain' },
        { label: 'AI Risk Engine', value: '✓ Realtime Anomaly Detection' },
        { label: 'Analytics History', value: '90-Day Realtime Telemetry' },
        { label: 'API Limits', value: '50,000 req / day' },
        { label: 'Team Seats', value: '10 Users' },
        { label: 'Support Level', value: 'Priority Email & Live Chat' },
      ]
    },
    factory: {
      id: 'factory',
      name: 'Factory Scale',
      basePrice: '₹2,999',
      gst: '₹539.82 (18%)',
      total: '₹3,538.82',
      cycle: 'per month',
      amountINR: 3538.82,
      desc: 'High-speed assembly-line stamping, factory batch issuance and 1-year telemetry.',
      badge: 'Factory Scale',
      badgeBg: 'bg-[#1D4533] text-[#F9D2BA]',
      features: [
        { label: 'QR Code Cap', value: '5,000 QRs / month' },
        { label: 'Scan Limit', value: '500,000 scans' },
        { label: 'Resolutions', value: 'CAD DXF & Laser SVG' },
        { label: 'Tamper-Evident Ledger', value: '✓ Dedicated Merkle Ledger' },
        { label: 'AI Risk Engine', value: '✓ Assembly Line AI Filter' },
        { label: 'Analytics History', value: '1-Year Deep Archive' },
        { label: 'API Limits', value: '500,000 req / day' },
        { label: 'Team Seats', value: '25 Users' },
        { label: 'Support Level', value: '24/7 Phone & Email SLA' },
      ]
    },
    ent: {
      id: 'enterprise',
      name: 'Enterprise Custom',
      basePrice: '₹9,999',
      gst: '₹1,799.82 (18%)',
      total: '₹11,798.82',
      cycle: 'per month',
      amountINR: 11798.82,
      desc: 'Unlimited custom QR capacity, dedicated DB instance and custom SLA.',
      badge: 'Enterprise',
      badgeBg: 'bg-[#5E3122] text-[#F9D2BA]',
      features: [
        { label: 'QR Code Cap', value: 'Unlimited Custom' },
        { label: 'Scan Limit', value: 'Unlimited Scans' },
        { label: 'Resolutions', value: 'All Formats + Custom CAD' },
        { label: 'Tamper-Evident Ledger', value: '✓ Custom Enterprise Blockchain' },
        { label: 'AI Risk Engine', value: '✓ Dedicated ML Model Cluster' },
        { label: 'Analytics History', value: 'Unlimited Realtime History' },
        { label: 'API Limits', value: 'Dedicated High-Throughput Gateway' },
        { label: 'Team Seats', value: 'Unlimited Enterprise Users' },
        { label: 'Support Level', value: 'Dedicated Solutions Architect' },
      ]
    }
  };

  // Plan Upgrade Checkout Trigger (Live Razorpay & UPI)
  const handleUpgradeToPlan = async (planId: string, planName: string, amountINR: number) => {
    sound.playClick();
    if (planId === activePlanId) {
      alert(`You are currently on the ${planName} tier.`);
      return;
    }

    if (planId === 'free') {
      localStorage.setItem('uniqr_active_plan', 'free');
      setActivePlanId('free');
      setIsCompareModalOpen(false);
      sound.playSuccessChime();
      setSuccessNotice('Switched to Starter Free tier.');
      return;
    }

    setIsProcessingUpgrade(true);
    try {
      await triggerRazorpayCheckout({
        planId,
        planName,
        amountINR,
        user: {
          name: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'UniQR Subscriber',
          email: user?.email || 'user@example.com',
          phone: user?.phone || '+919049874780'
        },
        onSuccess: (paymentDetails) => {
          setIsProcessingUpgrade(false);
          setIsCompareModalOpen(false);
          sound.playSuccessChime();

          // Update active plan in state and localStorage
          localStorage.setItem('uniqr_active_plan', planId);
          setActivePlanId(planId);

          // Create statutory GST invoice
          const basePrice = Math.round((amountINR / 1.18) * 100) / 100;
          const gstAmount = Math.round((amountINR - basePrice) * 100) / 100;
          const cgst = Math.round((gstAmount / 2) * 100) / 100;
          const sgst = Math.round((gstAmount / 2) * 100) / 100;

          const newInvoice = {
            id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            description: `${planName} — Monthly Subscription`,
            baseAmount: `₹${basePrice.toFixed(2)}`,
            cgst: `₹${cgst.toFixed(2)}`,
            sgst: `₹${sgst.toFixed(2)}`,
            gstAmount: `₹${gstAmount.toFixed(2)}`,
            amount: `₹${amountINR.toFixed(2)}`,
            status: 'Paid',
            paymentId: paymentDetails?.razorpay_payment_id || `PAY-${Date.now()}`,
            orderId: paymentDetails?.razorpay_order_id || `ORD-${Date.now()}`,
            customerName: user?.name || user?.organization || 'Registered Subscriber',
            customerGstin: user?.hasGstin && user?.gstin ? user.gstin : 'Unregistered Consumer'
          };

          const updatedInvoices = [newInvoice, ...invoices];
          setInvoices(updatedInvoices);
          localStorage.setItem('uniqr_invoices', JSON.stringify(updatedInvoices));

          setSuccessNotice(`🎉 Successfully activated ${planName}! Payment ID: ${newInvoice.paymentId}`);
        },
        onFailure: (err) => {
          setIsProcessingUpgrade(false);
          alert(err.message || 'Payment was cancelled or could not be verified.');
        }
      });
    } catch (e: any) {
      setIsProcessingUpgrade(false);
      alert(e.message || 'Failed to initialize payment gateway.');
    }
  };

  const handleDownloadReceipt = (inv: any) => {
    sound.playClick();
    const content = `======================================================
UniQR Statutory GST Tax Invoice & Subscription Receipt
======================================================
Invoice ID:     ${inv.id}
Invoice Date:   ${inv.date}
Description:    ${inv.description}
Payment Ref:    ${inv.paymentId || 'ONLINE-UPI-TXN'}

Base Plan Price: ${inv.baseAmount || '₹338.14'}
CGST (9%):       ${inv.cgst || '₹30.43'}
SGST (9%):       ${inv.sgst || '₹30.43'}
Total 18% GST:   ${inv.gstAmount || '₹60.86'}
Total Amount:    ${inv.amount} (INR)

Payment Status: ${inv.status}
Payment Mode:   UPI / Razorpay Verified

Supplier:       AGB Technologies Private Limited
Supplier GSTIN: 27AABCA1234F1Z5
Place of Supply: Maharashtra (27)
SAC Code:       998313 (Information Technology Software Services)

Customer:       ${user?.organization || inv.customerName || 'Registered Account'}
Customer GSTIN: ${user?.hasGstin && user?.gstin ? user.gstin : inv.customerGstin || 'Consumer (No GSTIN)'}
Customer Email: ${user?.email || 'Subscriber'}
Customer Phone: ${user?.phone || 'Verified'}
======================================================`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UniQR_GST_Invoice_${inv.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* SUCCESS BANNER */}
      {successNotice && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSuccessNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── 1. SUBSCRIPTION HEADER ─── */}
      <div className="bg-white p-4 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#1D4533] font-extrabold text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1">
            <CreditCard className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>Commercial &amp; Billing</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
            Subscription
          </h1>
          <p className="text-[11px] sm:text-sm text-[#5E3122] mt-0.5 font-medium hidden sm:block">
            Manage your UniQR plan, metered usage and commercial billing
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCompareModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-black text-xs border border-[#F9D2BA] shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5E3122]" />
            <span>Compare All Plans</span>
          </button>
        </div>
      </div>

      {/* ─── 2. CURRENT ACTIVE PLAN CARD (DYNAMIC ACCORDING TO REAL ACTIVE PLAN) ─── */}
      <div className="bg-[#1D4533] p-4 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA]/30 text-[#F7EAE0] shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
        <div className="space-y-2 sm:space-y-3 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F9D2BA] text-[#1D4533] text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
              Current Active Plan
            </span>
            <span className="text-[11px] sm:text-xs text-[#F9D2BA] font-bold">
              {currentTier.id === 'free' ? 'Lifetime Free License (No Expiry)' : 'Active Monthly Subscription (Auto-Renew)'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-4xl font-black text-[#F7EAE0] tracking-tight uppercase">
              {currentTier.name}
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-2xl font-bold text-[#F9D2BA]">
                {currentTier.id === 'free' ? '₹0' : `₹${currentTier.totalAmountINR || currentTier.priceINR}`}
              </span>
              <span className="text-[10px] sm:text-xs text-[#F7EAE0]/80 font-normal">
                {currentTier.id === 'free' ? '(Free Forever)' : '/ month (incl. 18% GST)'}
              </span>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs text-[#F9D2BA]/90 font-medium max-w-xl leading-relaxed">
            {currentTier.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 z-10 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCompareModalOpen(true);
            }}
            className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Change / Upgrade Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── 3. DYNAMIC METERED RESOURCE GAUGES ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {meteredResources.map((res) => (
          <div
            key={res.title}
            className="bg-white p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm space-y-2.5 hover:border-[#1D4533] transition-colors"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#5E3122] uppercase tracking-wider text-[10px]">
                {res.title}
              </span>
              <span className="font-mono font-bold text-[#1D4533] bg-[#F7EAE0] px-2 py-0.5 rounded border border-[#F9D2BA] text-[10px]">
                {res.pct}%
              </span>
            </div>

            <div>
              <div className="text-lg sm:text-2xl font-black text-[#1D4533]">
                {res.used.toLocaleString()}{' '}
                <span className="text-[11px] sm:text-xs text-[#5E3122] font-semibold">/ {res.limit.toLocaleString()} {res.unit}</span>
              </div>
            </div>

            {/* Visual Progress Meter */}
            <div className="w-full h-2.5 sm:h-3 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
              <div
                className="h-full bg-[#1D4533] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(2, res.pct))}%` }}
              />
            </div>

            <div className="text-[10px] text-[#5E3122] font-medium flex items-center justify-between pt-1 border-t border-[#F9D2BA]/60">
              <span>Remaining: {Math.max(0, res.limit - res.used).toLocaleString()}</span>
              <span className="text-emerald-700 font-bold">Optimal</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 4. BILLING HISTORY & STATUTORY GST INVOICES ─── */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1D4533]">Billing History &amp; Invoices</h2>
            <span className="text-[11px] text-[#5E3122] font-semibold">Statutory 18% GST Tax Invoices (SAC: 998313)</span>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] text-center space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-[#5E3122]/60" />
            <p className="text-xs font-bold text-[#1D4533]">No transaction invoices yet.</p>
            <p className="text-[11px] text-[#5E3122] max-w-md mx-auto">
              Your account is currently on the <strong>{currentTier.name}</strong>. Paid subscription upgrades via UPI / Razorpay will generate statutory 18% GST tax invoices automatically.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: RESPONSIVE INVOICE CARDS */}
            <div className="block sm:hidden space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-3.5 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1D4533] text-[11px]">{inv.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {inv.status}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-[#1D4533] text-xs">{inv.description}</div>
                    <div className="text-[10px] text-[#5E3122] font-semibold mt-0.5">Date: {inv.date}</div>
                    {inv.paymentId && <div className="text-[9px] font-mono text-[#5E3122]/80 mt-0.5">Ref: {inv.paymentId}</div>}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#F9D2BA]/60">
                    <span className="font-mono font-extrabold text-sm text-[#1D4533]">{inv.amount}</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadReceipt(inv)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-[11px] border border-[#F9D2BA] flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#1D4533]" />
                      <span>Download Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: CLEAN TABLE */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Base Price</th>
                    <th className="py-2.5 px-3">18% GST</th>
                    <th className="py-2.5 px-3">Total Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Tax Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F9D2BA]/40">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#F7EAE0]/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#1D4533]">
                        {inv.date}
                      </td>
                      <td className="py-3 px-3 font-bold text-[#1D4533]">
                        {inv.description}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5E3122]">
                        {inv.baseAmount || '₹338.14'}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5E3122]">
                        {inv.gstAmount || '₹60.86'}
                      </td>
                      <td className="py-3 px-3 font-mono font-extrabold text-[#1D4533]">
                        {inv.amount}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDownloadReceipt(inv)}
                          className="px-3 py-1.5 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-bold text-xs border border-[#F9D2BA] inline-flex items-center gap-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-[#1D4533]" />
                          <span>Statutory PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ─── 5. DYNAMIC ACCOUNT IDENTITY & SESSION MANAGEMENT ─── */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4 sm:space-y-6">
        <div className="border-b border-[#F9D2BA] pb-3">
          <h2 className="text-base sm:text-xl font-extrabold text-[#1D4533]">Account Identity &amp; Session Management</h2>
          <p className="text-[11px] sm:text-xs text-[#5E3122] font-medium mt-0.5">
            Your authenticated session, organization ownership, and statutory GST profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Dynamic Active Session Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5E3122]">Active Authenticated Account</span>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-extrabold text-[#1D4533] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#5E3122]" />
                  <span>{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Verified User'}</span>
                </div>
                <div className="text-[11px] sm:text-xs text-[#5E3122] font-bold">
                  Email: <span className="font-mono text-[#1D4533]">{user?.email || 'admin@agbtechnologies.in'}</span>
                </div>
                {user?.phone && (
                  <div className="text-[11px] sm:text-xs text-[#5E3122] font-bold">
                    Phone: <span className="font-mono text-[#1D4533]">{user.phone}</span>
                  </div>
                )}
                <div className="text-[11px] sm:text-xs text-[#5E3122] font-medium flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#5E3122]" />
                  <span>Organization: <strong>{user?.organization || 'AGB Technologies Ltd.'}</strong></span>
                </div>
                {user?.hasGstin && user?.gstin && (
                  <div className="text-[11px] text-[#1D4533] font-mono bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                    GSTIN: <strong>{user.gstin}</strong> (Verified for 18% Input Tax Credit)
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onLogout) onLogout();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#F9D2BA] bg-white hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>Log Out of Session</span>
              </button>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="p-4 sm:p-5 rounded-2xl bg-red-50/50 border border-red-200 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700">Danger Zone</span>
              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-extrabold text-red-900">Reset Local Workspace / Log Out</div>
                <p className="text-[11px] sm:text-xs text-red-700 leading-relaxed font-medium">
                  Clears local session tokens, revokes active licenses, and returns to authentication.
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (window.confirm('Are you sure you want to log out and reset local cache?')) {
                    if (onLogout) onLogout();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center"
              >
                <span>Reset &amp; Log Out</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─── 6. INTERACTIVE PLAN COMPARISON & UPGRADE MODAL ─── */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-[#F9D2BA] shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3 sm:pb-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#1D4533]">Plan Comparison &amp; Upgrade</h3>
                <p className="text-[11px] sm:text-xs text-[#5E3122] font-medium mt-0.5">
                  Select a plan to immediately activate or upgrade with 1-Tap UPI / Razorpay (18% GST included).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 rounded-xl text-[#5E3122] hover:bg-[#F7EAE0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* UPI PRIORITY CALLOUT */}
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#1D4533] text-[#F7EAE0] flex items-center justify-between gap-2 text-xs shadow-xs border border-[#F9D2BA]/40">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#F9D2BA] text-[#1D4533] font-black text-[9px] uppercase tracking-wider shrink-0">
                  UPI 1st Priority
                </span>
                <span className="font-bold text-[10px] sm:text-xs text-[#F7EAE0] truncate">
                  ⚡ 1-Tap Upgrade via Google Pay, PhonePe, Paytm, Cred &amp; UPI QR
                </span>
              </div>
              <span className="text-[10px] text-[#F9D2BA] font-bold shrink-0 hidden sm:inline-block">
                Instant Activation
              </span>
            </div>

            {/* ─── MOBILE VIEW: FULL DETAILS PLAN CARD & TABS (BLOCK MD:HIDDEN) ─── */}
            <div className="block md:hidden space-y-4">
              {/* Horizontal Scrollable Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {(['starter', 'pro', 'biz', 'factory', 'ent'] as const).map((tabKey) => {
                  const t = planTiersData[tabKey];
                  const isSelected = mobileCompareTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setMobileCompareTab(tabKey);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border ${
                        isSelected
                          ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm'
                          : 'bg-[#F7EAE0]/60 text-[#5E3122] border-[#F9D2BA] hover:bg-[#F7EAE0]'
                      }`}
                    >
                      <span>{t.name.split(' ')[0]}</span>
                      <span className="ml-1 text-[10px] opacity-90">({t.total})</span>
                    </button>
                  );
                })}
              </div>

              {/* Full Details Active Card for Selected Plan */}
              {(() => {
                const activePlan = planTiersData[mobileCompareTab];
                const isCurrentActive = activePlan.id === activePlanId;

                return (
                  <div className="p-4 rounded-2xl border-2 border-[#1D4533] bg-[#F7EAE0]/40 space-y-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2 border-b border-[#F9D2BA] pb-3">
                      <div>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider mb-1 ${activePlan.badgeBg}`}>
                          {activePlan.badge}
                        </span>
                        <h4 className="text-xl font-black text-[#1D4533] uppercase">{activePlan.name}</h4>
                        <p className="text-[11px] text-[#5E3122] font-semibold mt-0.5 leading-snug">{activePlan.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black text-[#1D4533]">{activePlan.total}</div>
                        <span className="text-[10px] text-[#5E3122] font-semibold block">{activePlan.cycle}</span>
                      </div>
                    </div>

                    {/* 1-Tap UPI Upgrade Button for this active plan */}
                    <button
                      type="button"
                      disabled={isProcessingUpgrade}
                      onClick={() => handleUpgradeToPlan(activePlan.id, activePlan.name, activePlan.amountINR)}
                      className={`w-full py-3.5 rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                        isCurrentActive 
                          ? 'bg-emerald-700 text-white cursor-default'
                          : 'bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0]'
                      }`}
                    >
                      {isCurrentActive ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Current Active Plan</span>
                        </>
                      ) : activePlan.amountINR === 0 ? (
                        <>
                          <Check className="w-4 h-4 text-[#F9D2BA]" />
                          <span>Switch to Starter Free</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-[#F9D2BA]" />
                          <span>Upgrade to {activePlan.name} ({activePlan.total})</span>
                        </>
                      )}
                    </button>

                    {/* All 9 Full Details Feature Rows */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-black uppercase text-[#5E3122] tracking-wider block">
                        Feature &amp; Limit Breakdown:
                      </span>
                      <div className="space-y-1.5 divide-y divide-[#F9D2BA]/60">
                        {activePlan.features.map((f) => (
                          <div key={f.label} className="flex items-center justify-between pt-1.5 text-xs">
                            <span className="font-bold text-[#5E3122] text-[11px]">{f.label}</span>
                            <span className="font-extrabold text-[#1D4533] text-[11px] text-right ml-2">{f.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ─── DESKTOP VIEW: COMPARISON TABLE WITH SELECTION BUTTONS ─── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1D4533] text-[#1D4533]">
                    <th className="py-3 px-3 font-extrabold text-xs">Resource / Feature</th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#F7EAE0]/50 rounded-t-xl">
                      Starter Free<br /><span className="text-[11px] font-bold text-[#5E3122]">₹0</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#1D4533] text-[#F7EAE0] rounded-t-xl">
                      Pro Growth<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹470.82 / mo</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#5E3122] text-[#F7EAE0] rounded-t-xl">
                      Business Scale<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹1,178.82 / mo</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#1D4533] text-[#F7EAE0] rounded-t-xl">
                      Factory Scale<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹3,538.82 / mo</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#5E3122] text-[#F7EAE0] rounded-t-xl">
                      Enterprise<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹11,798.82 / mo</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F9D2BA]/50">
                  {planComparison.map((row) => (
                    <tr key={row.feature} className="hover:bg-[#F7EAE0]/30">
                      <td className="py-3 px-3 font-bold text-[#1D4533]">{row.feature}</td>
                      <td className="py-3 px-3 text-center text-[#5E3122] bg-[#F7EAE0]/20">{row.starter}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#1D4533] bg-[#F9D2BA]/20">{row.pro}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#5E3122] bg-[#5E3122]/10">{row.biz}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#1D4533] bg-[#1D4533]/10">{row.factory}</td>
                      <td className="py-3 px-3 text-center font-bold text-[#5E3122] bg-[#5E3122]/10">{row.ent}</td>
                    </tr>
                  ))}
                  {/* Select Plan Action Buttons Row */}
                  <tr className="border-t-2 border-[#1D4533] bg-[#F7EAE0]/30">
                    <td className="py-3 px-3 font-black text-[#1D4533]">Upgrade Action</td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleUpgradeToPlan('free', 'Starter Free', 0)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black w-full ${
                          activePlanId === 'free' ? 'bg-emerald-700 text-white' : 'bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122]'
                        }`}
                      >
                        {activePlanId === 'free' ? 'Active' : 'Select Free'}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        disabled={isProcessingUpgrade}
                        onClick={() => handleUpgradeToPlan('pro', 'Pro Growth', 470.82)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black w-full ${
                          activePlanId === 'pro' ? 'bg-emerald-700 text-white' : 'bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122]'
                        }`}
                      >
                        {activePlanId === 'pro' ? 'Active' : 'Upgrade ₹470.82'}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        disabled={isProcessingUpgrade}
                        onClick={() => handleUpgradeToPlan('biz', 'Business Scale', 1178.82)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black w-full ${
                          activePlanId === 'biz' ? 'bg-emerald-700 text-white' : 'bg-[#5E3122] text-[#F7EAE0] hover:bg-[#1D4533]'
                        }`}
                      >
                        {activePlanId === 'biz' ? 'Active' : 'Upgrade ₹1,178.82'}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        disabled={isProcessingUpgrade}
                        onClick={() => handleUpgradeToPlan('factory', 'Factory Scale', 3538.82)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black w-full ${
                          activePlanId === 'factory' ? 'bg-emerald-700 text-white' : 'bg-[#1D4533] text-[#F7EAE0] hover:bg-[#5E3122]'
                        }`}
                      >
                        {activePlanId === 'factory' ? 'Active' : 'Upgrade ₹3,538.82'}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        disabled={isProcessingUpgrade}
                        onClick={() => handleUpgradeToPlan('enterprise', 'Enterprise Custom', 11798.82)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-black w-full ${
                          activePlanId === 'enterprise' ? 'bg-emerald-700 text-white' : 'bg-[#5E3122] text-[#F7EAE0] hover:bg-[#1D4533]'
                        }`}
                      >
                        {activePlanId === 'enterprise' ? 'Active' : 'Upgrade Custom'}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 sm:pt-4 border-t border-[#F9D2BA]">
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#F9D2BA] text-xs font-bold text-[#5E3122] hover:bg-[#F7EAE0] text-center"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
