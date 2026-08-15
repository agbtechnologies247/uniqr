import React, { useState, useEffect } from 'react';
import { 
  QrCode, Sparkles, ShieldCheck, Zap, Layers, RefreshCw, Cpu, CheckCircle2, 
  ArrowRight, Download, Eye, Terminal, Building2, Check, Globe, Smartphone, Lock, Share2, PlusCircle, CreditCard, Star, HelpCircle, ShoppingBag
} from 'lucide-react';
import QRCode from 'qrcode';
import { sound } from '../../services/audio';
import { IntelligenceArchitectureShowcase } from './IntelligenceArchitectureShowcase';
import { Footer } from '../layout/Footer';

interface LandingPageProps {
  onLaunchApp: () => void;
  onOpenUpgrade: () => void;
  setCurrentTab: (tab: string) => void;
  onOpenContactSales?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenUpgrade, setCurrentTab, onOpenContactSales }) => {
  // Hero Interactive Demo State
  const [heroProductName, setHeroProductName] = useState<string>('AERO-X Pro Fitness Dumbbell (20kg)');
  const [heroPrice, setHeroPrice] = useState<string>('12,000');
  const [heroCode, setHeroCode] = useState<string>('UQ-8AF92B7A2');
  const [heroQrUrl, setHeroQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Target URL encodes Product Name & Price query parameters so mobile scan IMMEDIATELY reflects live site inputs
  const targetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/q/${heroCode}?name=${encodeURIComponent(heroProductName)}&price=${encodeURIComponent(heroPrice)}`
    : `https://uniqr.agbtechnologies.in/q/${heroCode}?name=${encodeURIComponent(heroProductName)}&price=${encodeURIComponent(heroPrice)}`;

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 260,
      color: { dark: '#1D4533', light: '#F7EAE0' }
    })
      .then(url => setHeroQrUrl(url))
      .catch(err => console.error(err));
  }, [targetUrl, heroProductName, heroPrice]);

  const handleDownloadQr = async (format: 'png' | 'svg') => {
    sound.playClick();
    if (format === 'svg') {
      try {
        const svgString = await QRCode.toString(targetUrl, {
          type: 'svg',
          margin: 1,
          color: { dark: '#1D4533', light: '#F7EAE0' }
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `UniQR-${heroCode}.svg`;
        link.href = blobUrl;
        link.click();
        URL.revokeObjectURL(blobUrl);
        return;
      } catch (err) {
        console.error('Failed to export SVG', err);
      }
    }
    const link = document.createElement('a');
    link.download = `UniQR-${heroCode}.png`;
    link.href = heroQrUrl;
    link.click();
  };

  const handleShareQr = () => {
    sound.playClick();
    if (navigator.share) {
      navigator.share({
        title: heroProductName,
        text: `Scan UniQR product identity for ${heroProductName} (₹${heroPrice})`,
        url: targetUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(targetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] selection:bg-[#1D4533] selection:text-[#F7EAE0] overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-[#F9D2BA]/40 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1D4533] text-[#F7EAE0] font-extrabold text-[11px] sm:text-xs mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F9D2BA]" />
            <span>Identity As a Service</span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight sm:leading-none text-[#1D4533]">
            The QR stays. The intelligence evolves.
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-xl text-[#5E3122] max-w-3xl mx-auto leading-relaxed font-medium">
            UniQR transforms QR codes into living digital identities that connect products, people, assets, locations, transactions, and processes.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => {
                sound.playClick();
                onLaunchApp();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-base shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Launch Product Studio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentTab('create-product');
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5 text-[#F9D2BA]" />
              <span>Register Product Identity</span>
            </button>
          </div>

          {/* GET YOUR QR DEMO WIDGET IN HERO SECTION */}
          <div className="mt-12 sm:mt-14 max-w-5xl mx-auto bg-white p-5 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-2xl text-left space-y-6">
            
            {/* Widget Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-[#1D4533]">Get Your QR</h3>
                  <p className="text-xs text-[#5E3122] font-semibold mt-0.5">
                    Customize fields live below to generate your instant scannable UniQR.
                  </p>
                </div>
              </div>
            </div>

            {/* Split Builder & UniQR Panel */}
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              
              {/* Left Side: Live Editable Attributes (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">Product Name:</label>
                    <input
                      type="text"
                      value={heroProductName}
                      onChange={(e) => setHeroProductName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-bold focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">Price (₹):</label>
                    <input
                      type="text"
                      value={heroPrice}
                      onChange={(e) => setHeroPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-bold focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                    />
                  </div>
                </div>

                {/* GET MORE FIELDS BUTTON */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 font-extrabold text-[#1D4533] text-xs">
                    <span>Need More Dynamic Fields &amp; Custom Sections?</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] text-[10px] font-bold">28+ Field Types</span>
                  </div>
                  <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                    Add warranty tracking, batch numbers, certificates, GPS locations, formulas, and tamper-evident event trails in the full workspace.
                  </p>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onLaunchApp();
                    }}
                    className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4 text-[#F9D2BA]" />
                    <span>Get More Fields</span>
                  </button>
                </div>

              </div>

              {/* Right Side: UniQR Panel (5 cols) */}
              <div className="lg:col-span-5 bg-[#F7EAE0] p-5 sm:p-6 rounded-2xl border border-[#F9D2BA] text-center space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-2">
                  <div className="text-xs font-extrabold text-[#1D4533] uppercase tracking-wider">UniQR</div>
                  <span className="px-2 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] text-[10px] font-mono font-bold">
                    {heroCode}
                  </span>
                </div>
                
                {heroQrUrl && (
                  <div className="bg-white p-3 rounded-xl inline-block border border-[#F9D2BA] shadow-sm">
                    <img src={heroQrUrl} alt="UniQR Code Matrix" className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg" />
                  </div>
                )}

                <div className="text-[10px] font-mono text-[#5E3122] font-bold truncate">
                  Scan on mobile to view "{heroProductName}" (₹{heroPrice})
                </div>

                {/* DOWNLOAD & SHARE OPTIONS */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleDownloadQr('png')}
                    className="py-2 bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] rounded-xl font-extrabold text-[#1D4533] flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => handleDownloadQr('svg')}
                    className="py-2 bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] rounded-xl font-extrabold text-[#1D4533] flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SVG</span>
                  </button>
                  <button
                    onClick={handleShareQr}
                    className="py-2 bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] rounded-xl font-extrabold text-[#1D4533] flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>

                {/* GENERATE QR ACTION */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentTab('create-product');
                  }}
                  className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 text-[#F9D2BA]" />
                  <span>Generate QR</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FLAGSHIP INTELLIGENCE ARCHITECTURE SHOWCASE */}
      <IntelligenceArchitectureShowcase />

      {/* DEDICATED FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-white border-y border-[#F9D2BA]">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F9D2BA]" />
              <span>Core Platform Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D4533]">Built for Complete Product Life-Cycle</h2>
            <p className="text-[#5E3122] text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
              UniQR powers physical products with digital twin intelligence, compliance ledgers, and dynamic customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#1D4533]">28+ Dynamic Field Types</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                Build custom Notion + Airtable style product schemas. Support currency, formulas, signatures, GPS location, barcodes, and AI generated fields.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#1D4533]">Tamper-Evident Business Trail</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                Log manufacturing, quality inspection, warehouse entry, and delivery events with cryptographic SHA-256 digital signatures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#1D4533]">AI Scan Decision Engine</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                Predict component failure risk and automatically serve customized pages for Field Technicians vs End Customers based on context.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#1D4533]">Laser / Vector Engraving Export</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                Export 8192px ultra high-resolution PNGs, vector SVGs, PDFs, and laser cut parameters for physical metal &amp; steel engraving.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#1D4533]">Enterprise ERP Integration</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                Connect seamlessly with enterprise inventory, sales orders, warranty activation, and supply chain systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-[#1D4533]">Connected Intelligence</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                Visualize relationship networks connecting components, suppliers, field engineers, and customer support cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-[#F7EAE0]">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs mb-3">
              <CreditCard className="w-3.5 h-3.5 text-[#F9D2BA]" />
              <span>Simple Transparent Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D4533]">Choose the Plan Right for Your Business</h2>
            <p className="text-[#5E3122] text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
              Start free to generate your first product identities. Scale as your inventory and physical assets grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 text-left">
            
            {/* Plan 1: Starter Free */}
            <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                  Starter Free
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#1D4533]">₹0</div>
                  <div className="text-xs text-[#5E3122] font-semibold mt-1">Lifetime Free</div>
                </div>
                <ul className="space-y-2 text-xs text-[#5E3122] font-medium border-t border-[#F9D2BA] pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Up to 10 Active Product QRs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Standard PNG &amp; SVG Exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Basic Product Identity Passport</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onLaunchApp();
                }}
                className="w-full py-3 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] font-extrabold text-xs transition-all border border-[#F9D2BA]"
              >
                Get Started Free
              </button>
            </div>

            {/* Plan 2: Pro Growth */}
            <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                  Pro Growth
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#1D4533]">₹399</div>
                  <div className="text-xs text-[#5E3122] font-semibold mt-1">per month</div>
                </div>
                <ul className="space-y-2 text-xs text-[#5E3122] font-medium border-t border-[#F9D2BA] pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Up to 50 Product QRs / Mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>8192px Ultra High Res Exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Tamper-Evident Trail Ledgers</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenUpgrade();
                }}
                className="w-full py-3 rounded-xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs transition-all"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Plan 3: Business Scale (Popular) */}
            <div className="bg-[#1D4533] p-6 rounded-3xl border border-[#F9D2BA] shadow-xl flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F9D2BA] text-[#1D4533] text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0]/20 text-[#F9D2BA] font-extrabold text-[10px] uppercase">
                  Business Scale
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#F7EAE0]">₹999</div>
                  <div className="text-xs text-[#F9D2BA] font-semibold mt-1">per month</div>
                </div>
                <ul className="space-y-2 text-xs text-[#F7EAE0] font-medium border-t border-white/20 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F9D2BA] shrink-0" />
                    <span>Up to 500 Product QRs / Mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F9D2BA] shrink-0" />
                    <span>Laser / Vector Engraving SVG</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#F9D2BA] shrink-0" />
                    <span>AI Decision Engine &amp; ML</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenUpgrade();
                }}
                className="w-full py-3 rounded-xl bg-[#F9D2BA] hover:bg-white text-[#1D4533] font-extrabold text-xs shadow-md transition-all"
              >
                Choose Business Scale
              </button>
            </div>

            {/* Plan 4: Factory Scale */}
            <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                  Factory Scale
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-[#1D4533]">₹2,999</div>
                  <div className="text-xs text-[#5E3122] font-semibold mt-1">per month</div>
                </div>
                <ul className="space-y-2 text-xs text-[#5E3122] font-medium border-t border-[#F9D2BA] pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Up to 5,000 Product QRs / Mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Laser / Vector Engraving SVG</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>AI Decision Engine &amp; ML</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenUpgrade();
                }}
                className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all"
              >
                Choose Factory Scale
              </button>
            </div>

            {/* Plan 5: Enterprise Custom */}
            <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#F7EAE0] text-[#1D4533] font-extrabold text-[10px] uppercase">
                  Enterprise Custom
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-[#1D4533]">Custom</div>
                  <div className="text-xs text-[#5E3122] font-semibold mt-1">Contact Sales</div>
                </div>
                <ul className="space-y-2 text-xs text-[#5E3122] font-medium border-t border-[#F9D2BA] pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Unlimited Product Identifiers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Dedicated Enterprise ERP Sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#1D4533] shrink-0" />
                    <span>Custom Domain &amp; SLA Guarantee</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  if (onOpenContactSales) {
                    onOpenContactSales();
                  } else {
                    onOpenUpgrade();
                  }
                }}
                className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all"
              >
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* PUBLIC WEBSITE FOOTER */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} onOpenContactSales={() => onOpenContactSales && onOpenContactSales()} />

    </div>
  );
};
