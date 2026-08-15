import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { sound } from '../../services/audio';
import { triggerRazorpayCheckout } from '../../services/razorpay';

interface UserSubscriptionPageProps {
  quotaUsed?: number;
  quotaLimit?: number;
  currentTierName?: string;
  onOpenUpgrade?: () => void;
  onLogout?: () => void;
}

export const UserSubscriptionPage: React.FC<UserSubscriptionPageProps> = ({
  quotaUsed = 2481,
  quotaLimit = 5000,
  currentTierName = 'Professional',
  onOpenUpgrade,
  onLogout
}) => {
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);

  // Metered Resources data
  const meteredResources = [
    { title: 'QR Codes', used: 2481, limit: 5000, unit: 'QRs', pct: 49.6, color: '#1D4533' },
    { title: 'Scan Traffic', used: 18293, limit: 50000, unit: 'scans', pct: 36.5, color: '#1D4533' },
    { title: 'Entities & Twins', used: 12482, limit: 25000, unit: 'entities', pct: 49.9, color: '#1D4533' },
    { title: 'API Requests', used: 42821, limit: 100000, unit: 'requests', pct: 42.8, color: '#5E3122' },
  ];

  // Plan features checklist
  const planFeatures = [
    { text: 'Dynamic QR Codes & Instant Redirection', enabled: true },
    { text: 'Scan Analytics & Geographic Attribution', enabled: true },
    { text: 'Neo4j Intelligence Graph & Entity Ecosystem', enabled: true },
    { text: 'REST API & Webhooks Access', enabled: true },
    { text: 'Compliance & Tamper-Evident Ledger Reports', enabled: true },
    { text: '10 Team Members with Role-Based Access', enabled: true },
    { text: 'Custom Domain (uqr.to / Brand URL)', enabled: true },
    { text: 'Priority 24/7 SLA Engineering Support', enabled: true },
  ];

  // Billing history
  const billingInvoices = [
    { id: 'INV-2026-08', date: '15 Aug 2026', description: 'Pro Growth Plan — Monthly Subscription', amount: '₹399', status: 'Paid', receiptUrl: '#' },
    { id: 'INV-2026-07', date: '15 Jul 2026', description: 'Pro Growth Plan — Monthly Subscription', amount: '₹399', status: 'Paid', receiptUrl: '#' },
    { id: 'INV-2026-06', date: '15 Jun 2026', description: 'Pro Growth Plan — Monthly Subscription', amount: '₹399', status: 'Paid', receiptUrl: '#' },
    { id: 'INV-2026-05', date: '15 May 2026', description: 'Pro Growth Plan — Monthly Subscription', amount: '₹399', status: 'Paid', receiptUrl: '#' },
  ];

  // Plan Comparison Matrix matching SUBSCRIPTION_TIERS accurately
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

  const handleUpgradeToEnterprise = async () => {
    sound.playClick();
    setIsProcessingUpgrade(true);
    try {
      await triggerRazorpayCheckout({
        planId: 'plan_enterprise_annual',
        planName: 'Enterprise Plan',
        amountINR: 9999,
        userEmail: 'admin@agbtechnologies.com',
        userPhone: '9876543210',
        onSuccess: (paymentId, orderId) => {
          setIsProcessingUpgrade(false);
          setIsCompareModalOpen(false);
          sound.playSuccessChime();
          alert(`Upgraded to Enterprise! Payment ID: ${paymentId}`);
        },
        onError: () => {
          setIsProcessingUpgrade(false);
        }
      });
    } catch (e) {
      setIsProcessingUpgrade(false);
      alert('Payment initialized.');
    }
  };

  const handleDownloadReceipt = (inv: typeof billingInvoices[0]) => {
    sound.playClick();
    const content = `UniQR Tax Invoice\nInvoice ID: ${inv.id}\nDate: ${inv.date}\nDescription: ${inv.description}\nAmount Paid: ${inv.amount}\nStatus: ${inv.status}\nCustomer: AGB Technologies Pvt. Ltd.\nGSTIN: 27AABCA1234F1Z5`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UniQR_Invoice_${inv.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── 1. SUBSCRIPTION HEADER ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1D4533] font-extrabold text-xs uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4 text-[#F9D2BA]" />
            <span>Commercial &amp; Billing Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D4533] tracking-tight">
            Subscription
          </h1>
          <p className="text-xs sm:text-sm text-[#5E3122] mt-0.5 font-medium">
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
            className="px-4 py-2.5 rounded-2xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs border border-[#F9D2BA] shadow-sm transition-all"
          >
            Compare All Plans
          </button>
        </div>
      </div>

      {/* ─── 2. CURRENT PLAN CARD ─── */}
      <div className="bg-[#1D4533] p-6 sm:p-8 rounded-3xl border border-[#F9D2BA]/30 text-[#F7EAE0] shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#F9D2BA] text-[#1D4533] text-[10px] font-black uppercase tracking-wider">
              Current Active Plan
            </span>
            <span className="text-xs text-[#F9D2BA] font-bold">
              Renews on 15 September 2026 (Auto-Renew Active)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F7EAE0] tracking-tight uppercase">
              {currentTierName}
            </h2>
            <span className="text-xl sm:text-2xl font-bold text-[#F9D2BA]">
              ₹2,499 <span className="text-xs text-[#F7EAE0]/80 font-normal">/ month</span>
            </span>
          </div>

          <p className="text-xs text-[#F9D2BA]/90 font-medium max-w-xl">
            Complete platform access with 5,000 dynamic QR codes, 50,000 monthly scans, 25,000 entity twin passports, and REST API access.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCompareModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-black text-xs transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>Change / Upgrade Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              alert('Redirecting to secure Razorpay Customer Billing Portal...');
            }}
            className="px-4 py-3 rounded-2xl bg-[#5E3122] hover:bg-[#5E3122]/80 text-[#F7EAE0] font-bold text-xs border border-[#F9D2BA]/30 transition-all text-center"
          >
            Manage Payment Methods
          </button>
        </div>
      </div>

      {/* ─── 3. HIGH-VISIBILITY METERED RESOURCE GAUGES ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {meteredResources.map((res) => (
          <div
            key={res.title}
            className="bg-white p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-3 hover:border-[#1D4533] transition-colors"
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
              <div className="text-xl sm:text-2xl font-black text-[#1D4533]">
                {res.used.toLocaleString()}{' '}
                <span className="text-xs text-[#5E3122] font-semibold">/ {res.limit.toLocaleString()} {res.unit}</span>
              </div>
            </div>

            {/* Visual Progress Meter */}
            <div className="w-full h-3 bg-[#F7EAE0] rounded-full overflow-hidden border border-[#F9D2BA]">
              <div
                className="h-full bg-[#1D4533] rounded-full transition-all duration-500"
                style={{ width: `${res.pct}%` }}
              />
            </div>

            <div className="text-[10px] text-[#5E3122] font-medium flex items-center justify-between pt-1 border-t border-[#F9D2BA]/60">
              <span>Remaining: {(res.limit - res.used).toLocaleString()}</span>
              <span className="text-emerald-700 font-bold">Optimal</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 4. PLAN FEATURES CHECKLIST ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#1D4533]">Included Plan Features</h2>
            <p className="text-xs text-[#5E3122] font-medium mt-0.5">
              Everything activated on your active Professional tier license
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsCompareModalOpen(true);
            }}
            className="text-xs font-extrabold text-[#1D4533] hover:text-[#5E3122] flex items-center gap-1 underline"
          >
            <span>Compare Features Across All Tiers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {planFeatures.map((feat) => (
            <div
              key={feat.text}
              className="p-3.5 rounded-2xl bg-[#F7EAE0]/50 border border-[#F9D2BA] flex items-start gap-2.5 text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#1D4533] text-[#F7EAE0] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#F9D2BA]" />
              </div>
              <span className="font-bold text-[#1D4533] leading-snug">
                {feat.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 5. BILLING HISTORY INVOICE TABLE ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
          <h2 className="text-lg font-extrabold text-[#1D4533]">Billing History &amp; Invoices</h2>
          <span className="text-xs text-[#5E3122] font-semibold">GST Registered Invoices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F9D2BA] text-[#5E3122] font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F9D2BA]/40">
              {billingInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#F7EAE0]/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#1D4533]">
                    {inv.date}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#1D4533]">
                    {inv.description}
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
                      <span>PDF Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. ACCOUNT SESSION & DANGER ZONE (LOG OUT & DELETE ACCOUNT) ─── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm space-y-6">
        <div className="border-b border-[#F9D2BA] pb-3">
          <h2 className="text-xl font-extrabold text-[#1D4533]">Account Identity &amp; Session Management</h2>
          <p className="text-xs text-[#5E3122] font-medium mt-0.5">
            Manage your authenticated session, enterprise organization profile, or close your UniQR account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Session Card */}
          <div className="p-5 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#5E3122]">Active Session</span>
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-[#1D4533]">admin@agbtechnologies.in</div>
                <div className="text-xs text-[#5E3122] font-medium">Organization: AGB Industrial Equipment Ltd.</div>
                <div className="text-[10px] text-[#5E3122]/80 font-mono">Last login: Today from Pune, IN (Chrome / Windows)</div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onLogout) onLogout();
                }}
                className="px-5 py-2.5 rounded-xl border border-[#F9D2BA] bg-white hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all"
              >
                <span>Log Out of Session</span>
              </button>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700">Danger Zone</span>
              <div className="space-y-1">
                <div className="text-sm font-extrabold text-red-900">Delete Organization Account</div>
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  Permanently revokes all active API keys, deletes entity passports, and terminates subscription licenses. This action cannot be reversed.
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (window.confirm('Are you sure you want to permanently delete your UniQR organization account and all linked digital identities?')) {
                    if (onLogout) onLogout();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs transition-all"
              >
                <span>Delete Account Permanently</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─── 6. INTERACTIVE PLAN COMPARISON MODAL ─── */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-[#F9D2BA] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-4">
              <div>
                <h3 className="text-2xl font-extrabold text-[#1D4533]">Plan Comparison</h3>
                <p className="text-xs text-[#5E3122] font-medium mt-0.5">
                  Understand all features and capacity across UniQR plans
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

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1D4533] text-[#1D4533]">
                    <th className="py-3 px-3 font-extrabold text-xs">Resource / Feature</th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#F7EAE0]/50 rounded-t-xl">
                      Starter<br /><span className="text-[11px] font-bold text-[#5E3122]">₹0</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#1D4533] text-[#F7EAE0] rounded-t-xl">
                      Pro Growth<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹399 / mo</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#5E3122] text-[#F7EAE0] rounded-t-xl">
                      Business Scale<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹999 / mo</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#1D4533] text-[#F7EAE0] rounded-t-xl">
                      Factory Scale<br /><span className="text-[11px] font-bold text-[#F9D2BA]">₹2,999 / mo</span>
                    </th>
                    <th className="py-3 px-3 font-extrabold text-center bg-[#5E3122] text-[#F7EAE0] rounded-t-xl">
                      Enterprise<br /><span className="text-[11px] font-bold text-[#F9D2BA]">Custom</span>
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
                </tbody>
              </table>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F9D2BA]">
              <span className="text-xs text-[#5E3122] font-semibold">
                Need high-volume QR stamping for over 100,000 units?
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#F9D2BA] text-xs font-bold text-[#5E3122] hover:bg-[#F7EAE0]"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isProcessingUpgrade}
                  onClick={handleUpgradeToEnterprise}
                  className="px-5 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
                  <span>{isProcessingUpgrade ? 'Connecting Gateway...' : 'Upgrade to Enterprise'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
