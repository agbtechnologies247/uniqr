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

interface HeroPreset {
  id: string;
  name: string;
  category: string;
  icon: string;
  productName: string;
  sku: string;
  brand: string;
  price: string;
  status: string;
}

const HERO_PRESETS: HeroPreset[] = [
  {
    id: 'goods',
    name: 'Manufactured Goods',
    category: 'Retail Product',
    icon: '🏋️',
    productName: 'AERO-X Pro Fitness Dumbbell (20kg)',
    sku: 'AX-20KG-BLK',
    brand: 'AERO Fitness Technologies',
    price: '12,000',
    status: 'Verified Authentic'
  },
  {
    id: 'machine',
    name: 'Industrial Machine',
    category: 'Heavy Asset',
    icon: '⚙️',
    productName: 'AGB HydroMax 500 Submersible Pump',
    sku: 'HM500-IND-2026',
    brand: 'AGB Industrial Equipment Ltd.',
    price: '45,000',
    status: '36-Mo Active Warranty'
  },
  {
    id: 'compliance',
    name: 'Compliance Certificate',
    category: 'Official Document',
    icon: '📜',
    productName: 'ISO 9001:2015 Quality Certificate',
    sku: 'ISO-9001-QMS-2026',
    brand: 'TÜV Rheinland India Pvt. Ltd.',
    price: 'Compliant',
    status: 'Cryptographically Stamped'
  },
  {
    id: 'pharma',
    name: 'Pharma / Cold Chain',
    category: 'Batch Traceability',
    icon: '💊',
    productName: 'BioShield Clinical Vaccine Lot 42',
    sku: 'LOT-BS-2026-X42',
    brand: 'BioShield Therapeutics',
    price: 'Regulated',
    status: 'Cold-Chain Intact (2-8°C)'
  },
  {
    id: 'executive',
    name: 'Digital Twin Passport',
    category: 'Personnel Identity',
    icon: '🧑‍💼',
    productName: 'Dr. A. B. Joshi (Chief Operations Officer)',
    sku: 'EXEC-AGB-0084',
    brand: 'AGB Technologies Group',
    price: 'Level 4 Clearance',
    status: 'Active Pass Credential'
  }
];

const QR_PALETTES = [
  { id: 'emerald', name: 'Forest Emerald', dark: '#1D4533', light: '#F7EAE0' },
  { id: 'obsidian', name: 'Obsidian Glow', dark: '#0F172A', light: '#F8FAFC' },
  { id: 'espresso', name: 'Warm Espresso', dark: '#5E3122', light: '#F9D2BA' },
  { id: 'sapphire', name: 'Deep Sapphire', dark: '#1E3A8A', light: '#EFF6FF' }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, onOpenUpgrade, setCurrentTab, onOpenContactSales }) => {
  // Hero Interactive Demo State
  const [activePresetId, setActivePresetId] = useState<string>('goods');
  const [heroProductName, setHeroProductName] = useState<string>('AERO-X Pro Fitness Dumbbell (20kg)');
  const [heroSku, setHeroSku] = useState<string>('AX-20KG-BLK');
  const [heroBrand, setHeroBrand] = useState<string>('AERO Fitness Technologies');
  const [heroPrice, setHeroPrice] = useState<string>('12,000');
  const [heroStatus, setHeroStatus] = useState<string>('Verified Authentic');
  const [heroCode, setHeroCode] = useState<string>('UQ-8AF92B7A2');
  const [selectedPalette, setSelectedPalette] = useState(QR_PALETTES[0]);
  const [heroQrUrl, setHeroQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Target URL encodes dynamic parameters so mobile scan reflects live customized inputs
  const targetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/q/${heroCode}?name=${encodeURIComponent(heroProductName)}&price=${encodeURIComponent(heroPrice)}&sku=${encodeURIComponent(heroSku)}&brand=${encodeURIComponent(heroBrand)}`
    : `https://uniqr.agbtechnologies.in/q/${heroCode}?name=${encodeURIComponent(heroProductName)}&price=${encodeURIComponent(heroPrice)}&sku=${encodeURIComponent(heroSku)}&brand=${encodeURIComponent(heroBrand)}`;

  const handleReRollToken = () => {
    sound.playClick();
    const chars = '0123456789ABCDEF';
    let rand = '';
    for (let i = 0; i < 8; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
    setHeroCode(`UQ-${rand}`);
  };

  const handleSelectPreset = (preset: HeroPreset) => {
    sound.playSuccessChime();
    setActivePresetId(preset.id);
    setHeroProductName(preset.productName);
    setHeroSku(preset.sku);
    setHeroBrand(preset.brand);
    setHeroPrice(preset.price);
    setHeroStatus(preset.status);
    handleReRollToken();
  };

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 280,
      color: { dark: selectedPalette.dark, light: selectedPalette.light }
    })
      .then(url => setHeroQrUrl(url))
      .catch(err => console.error(err));
  }, [targetUrl, heroProductName, heroPrice, heroSku, heroBrand, selectedPalette]);

  const handleDownloadQr = async (format: 'png' | 'svg') => {
    sound.playClick();
    if (format === 'svg') {
      try {
        const svgString = await QRCode.toString(targetUrl, {
          type: 'svg',
          margin: 1,
          color: { dark: selectedPalette.dark, light: selectedPalette.light }
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `UniQR-${heroSku || heroCode}.svg`;
        link.href = blobUrl;
        link.click();
        URL.revokeObjectURL(blobUrl);
        return;
      } catch (err) {
        console.error('Failed to export SVG', err);
      }
    }
    const link = document.createElement('a');
    link.download = `UniQR-${heroSku || heroCode}.png`;
    link.href = heroQrUrl;
    link.click();
  };

  const handleShareQr = () => {
    sound.playClick();
    if (navigator.share) {
      navigator.share({
        title: heroProductName,
        text: `Scan UniQR product identity for ${heroProductName} (${heroSku})`,
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
              <span>Launch Studio</span>
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
              <span>Register Identity</span>
            </button>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              TRANSFORMED INTERACTIVE LIVING IDENTITY & QR STUDIO WIDGET
          ══════════════════════════════════════════════════════════════════ */}
          <div className="mt-12 sm:mt-14 max-w-5xl mx-auto bg-white/95 backdrop-blur-xl p-5 sm:p-8 rounded-3xl border-2 border-[#F9D2BA] shadow-2xl text-left space-y-6 relative overflow-hidden">
            
            {/* Top Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1D4533] via-[#F9D2BA] to-[#5E3122]" />

            {/* Widget Header & Schema Preset Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F9D2BA] pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md shrink-0 ring-4 ring-[#F7EAE0]">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-2xl text-[#1D4533] tracking-tight">Instant Universal QR Studio</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[10px] font-mono font-black uppercase tracking-wider">
                      Live Sandbox
                    </span>
                  </div>
                  <p className="text-xs text-[#5E3122] font-semibold mt-0.5">
                    Test live schema mapping, customize attributes, and scan on your phone right now.
                  </p>
                </div>
              </div>

              {/* Token & Reset */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="px-3 py-1.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#1D4533]" />
                  <span className="font-mono text-xs font-black text-[#1D4533]">{heroCode}</span>
                </div>
                <button
                  type="button"
                  onClick={handleReRollToken}
                  className="p-2 rounded-xl bg-[#F7EAE0] hover:bg-[#F9D2BA] text-[#1D4533] transition-all border border-[#F9D2BA]"
                  title="Generate Fresh Unique SHA Token"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 1-Click Interactive Industry Schema Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#5E3122]">
                  1. Choose an Industry Schema Preset:
                </span>
                <span className="text-[10px] font-bold text-[#1D4533]">1-Click Auto-Mapping</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {HERO_PRESETS.map((preset) => {
                  const isSelected = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md ring-2 ring-[#F9D2BA]'
                          : 'bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                      }`}
                    >
                      <span className="text-lg shrink-0">{preset.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-black block truncate leading-tight">{preset.name}</span>
                        <span className={`text-[9px] font-medium block truncate ${isSelected ? 'text-[#F9D2BA]' : 'text-[#5E3122]/80'}`}>
                          {preset.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Form & Scannable QR Matrix */}
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start pt-2">
              
              {/* Left Side: Live Editable Attributes & Palette Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-4 text-xs">
                
                {/* Core Field Inputs */}
                <div className="p-4 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-3.5">
                  <div className="flex items-center justify-between border-b border-[#F9D2BA]/60 pb-2">
                    <span className="font-extrabold text-xs text-[#1D4533] uppercase tracking-wider">
                      2. Live Editable Identity Attributes
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Live Scannable
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">
                        Entity / Product Name:
                      </label>
                      <input
                        type="text"
                        value={heroProductName}
                        onChange={(e) => setHeroProductName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] font-bold focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                        placeholder="Enter entity name..."
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">
                        Primary Identifier (SKU / Serial / Batch):
                      </label>
                      <input
                        type="text"
                        value={heroSku}
                        onChange={(e) => setHeroSku(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                        placeholder="e.g. SKU-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">
                        Authority / Brand / Issuer:
                      </label>
                      <input
                        type="text"
                        value={heroBrand}
                        onChange={(e) => setHeroBrand(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] font-bold focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                        placeholder="e.g. AGB Industrial"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">
                        Valuation / Price (₹) / Status:
                      </label>
                      <input
                        type="text"
                        value={heroPrice}
                        onChange={(e) => setHeroPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] font-bold focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                        placeholder="e.g. 12,000"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold text-[#5E3122] uppercase mb-1">
                        Security / Ledger Tag:
                      </label>
                      <input
                        type="text"
                        value={heroStatus}
                        onChange={(e) => setHeroStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#F9D2BA] text-[#1D4533] font-bold focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                        placeholder="e.g. SHA-256 Stamped"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Palette Selector */}
                <div className="p-3.5 rounded-2xl bg-[#F7EAE0]/40 border border-[#F9D2BA] space-y-2">
                  <span className="block text-[11px] font-extrabold text-[#5E3122] uppercase">
                    3. QR Aesthetic Theme Palette:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {QR_PALETTES.map((pal) => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedPalette(pal);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                          selectedPalette.id === pal.id
                            ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-xs'
                            : 'bg-white border-[#F9D2BA] text-[#5E3122] hover:bg-[#F7EAE0]'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: pal.dark }}
                        />
                        <span className="text-[11px] font-bold truncate">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Direct Gateway to Full Workspace */}
                <div className="p-4 rounded-2xl bg-[#1D4533] text-[#F7EAE0] space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#F9D2BA]">
                      Need 28+ Custom Section Fields?
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#F9D2BA] text-[#1D4533] px-2 py-0.5 rounded-full">
                      BOM • Ledgers • GPS
                    </span>
                  </div>
                  <p className="text-xs text-[#F7EAE0]/85 leading-relaxed">
                    Instantly load this entity into the full Universal Studio to configure BOM architecture, multi-color palettes, and laser vector downloads.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onLaunchApp();
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#F9D2BA] hover:bg-white text-[#1D4533] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>🚀 Launch in Full Universal Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Right Side: High-Resolution Scannable Live QR Matrix (5 cols) */}
              <div className="lg:col-span-5 bg-[#F7EAE0] p-5 sm:p-6 rounded-3xl border border-[#F9D2BA] text-center space-y-4 shadow-sm">
                
                {/* Badge Header */}
                <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span className="text-xs font-extrabold text-[#1D4533] uppercase tracking-wider">
                      Live Scannable QR
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[10px] font-mono font-extrabold">
                    {heroSku || heroCode}
                  </span>
                </div>
                
                {/* Live Matrix Canvas Preview with Holographic Container */}
                {heroQrUrl && (
                  <div className="relative group inline-block">
                    <div className="bg-white p-3.5 rounded-2xl inline-block border-2 border-[#F9D2BA] shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <img src={heroQrUrl} alt="UniQR Code Matrix" className="w-48 h-48 sm:w-52 sm:h-52 mx-auto rounded-xl" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-[#F9D2BA]/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Scannable Target Link Preview with 1-Click Open */}
                <div className="p-3 bg-white rounded-2xl border border-[#F9D2BA] text-center space-y-1.5 shadow-2xs">
                  <span className="block text-[9px] font-black uppercase text-[#5E3122] tracking-wider">
                    Scannable Target Identity URL:
                  </span>
                  <div className="text-[11px] font-mono text-[#1D4533] font-black truncate bg-[#F7EAE0] px-2 py-1 rounded-lg select-all">
                    {targetUrl}
                  </div>
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#1D4533] hover:text-[#5E3122] underline pt-0.5"
                  >
                    <span>🔍 Test Live Passport In New Tab</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

                {/* Direct High-Precision Export & Share Controls */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleDownloadQr('png')}
                    className="py-2.5 bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] rounded-xl font-black text-[#1D4533] flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    title="Download 1024px PNG image"
                  >
                    <Download className="w-3.5 h-3.5 text-[#5E3122]" />
                    <span>PNG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadQr('svg')}
                    className="py-2.5 bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] rounded-xl font-black text-[#1D4533] flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    title="Download Vector SVG"
                  >
                    <Download className="w-3.5 h-3.5 text-[#5E3122]" />
                    <span>SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareQr}
                    className="py-2.5 bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] rounded-xl font-black text-[#1D4533] flex items-center justify-center gap-1.5 shadow-xs transition-all"
                    title="Share direct link"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#5E3122]" />
                    <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                  </button>
                </div>

                {/* Primary CTA: Register In Inventory */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccessChime();
                    setCurrentTab('create-product');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all group"
                >
                  <Zap className="w-4 h-4 text-[#F9D2BA] group-hover:rotate-12 transition-transform" />
                  <span>Register &amp; Save Living Entity</span>
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
