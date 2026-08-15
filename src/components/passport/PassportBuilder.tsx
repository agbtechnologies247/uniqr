import React, { useState, useCallback, useRef } from 'react';
import {
  Palette,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  Check,
  Sparkles,
  Type,
  Layout,
  Image as ImageIcon,
  Paintbrush,
  Settings2,
  Monitor,
  CheckCircle2,
  Pipette,
  Layers,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid,
  List,
  Search,
  ExternalLink,
  QrCode,
  ArrowLeft,
  SlidersHorizontal,
  Package,
  Wrench,
  FileCheck,
  Building2,
  Boxes
} from 'lucide-react';
import { PassportConfig, PassportSectionConfig, PASSPORT_FONTS, DEFAULT_PASSPORT_CONFIG, DEFAULT_SECTIONS } from '../../types/passport';
import { Product } from '../../types';
import { DynamicPassport } from './DynamicPassport';
import { storage } from '../../services/storage';
import { sound } from '../../services/audio';

interface PassportBuilderProps {
  products?: Product[];
  onSave?: () => void;
}

// 6 Curated 3-Color Harmonized Palettes
interface ThreeColorPalette {
  name: string;
  primary: string;    // Brand, buttons, highlights
  card: string;       // Card background & surfaces
  background: string; // Page Canvas Background
  textColor: string;  // Primary text
  borderColor: string;// Card border tint
}

const THREE_COLOR_PALETTES: ThreeColorPalette[] = [
  {
    name: 'UniQR Forest & Sand',
    primary: '#1D4533',
    card: '#FFFFFF',
    background: '#F7EAE0',
    textColor: '#1D4533',
    borderColor: '#F9D2BA',
  },
  {
    name: 'Corporate Obsidian',
    primary: '#10B981',
    card: '#1E293B',
    background: '#0F172A',
    textColor: '#F8FAFC',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  {
    name: 'Minimal Paper White',
    primary: '#0F172A',
    card: '#F8FAFC',
    background: '#FFFFFF',
    textColor: '#0F172A',
    borderColor: '#E2E8F0',
  },
  {
    name: 'Vibrant Emerald Mint',
    primary: '#059669',
    card: '#FFFFFF',
    background: '#ECFDF5',
    textColor: '#064E3B',
    borderColor: '#A7F3D0',
  },
  {
    name: 'Terracotta & Roast',
    primary: '#5E3122',
    card: '#FFFFFF',
    background: '#FDF6F0',
    textColor: '#5E3122',
    borderColor: '#F9D2BA',
  },
  {
    name: 'Midnight Gold Luxury',
    primary: '#F59E0B',
    card: '#18181B',
    background: '#09090B',
    textColor: '#FAFAFA',
    borderColor: 'rgba(245,158,11,0.25)',
  },
];

// Sample fallback product for live preview
const SAMPLE_PRODUCT: Product = {
  id: 'preview-sample',
  uniqrCode: 'UQ-PREVIEW-001',
  name: 'Premium Industrial Sensor XR-7000',
  sku: 'XR-7000-PRO',
  brand: 'AGB Industrial Equipment',
  manufacturer: 'AGB Industrial Equipment Pvt. Ltd.',
  description: 'High-precision industrial IoT sensor designed for real-time monitoring of manufacturing processes. Features advanced telemetry, edge computing capabilities, and predictive maintenance analytics.',
  category: 'Industrial IoT',
  hsn: '9031.80',
  gst: 18,
  batchNumber: 'BATCH-2026-Q3-001',
  serialNumber: 'SN-XR7000-00127',
  mfgDate: '2026-06-15',
  expDate: '2031-06-15',
  warrantyMonths: 36,
  customFields: {
    'Price (₹)': '₹1,85,000',
    'Operating Range': '-40°C to 125°C',
    'IP Rating': 'IP68 / IP69K',
    'Communication': 'LoRaWAN, NB-IoT, BLE 5.3',
    'Accuracy': '±0.01% Full Scale',
    'Certifications': 'CE, UL, ATEX Zone 1',
    'Data Sheet': 'https://agbtechnologies.com/datasheets/xr-7000',
  },
  builderSections: [
    {
      id: 'sec-calibration',
      title: 'Calibration Data',
      category: 'Details',
      fields: [
        { id: 'f1', name: 'Last Calibrated', type: 'Date', value: '2026-07-20' },
        { id: 'f2', name: 'Calibration Certificate', type: 'Text', value: 'CAL-2026-0720-XR' },
        { id: 'f3', name: 'Calibration Valid', type: 'Boolean', value: true, validation: { isPublic: true } },
      ],
    },
  ],
  trailEvents: [],
  status: 'Active',
  createdAt: '2026-06-15T10:00:00Z',
  updatedAt: '2026-08-01T14:30:00Z',
  tags: ['Industrial', 'IoT', 'Sensor'],
  connectedApps: ['Enterprise ERP', 'Asset Management', 'Predictive Maintenance', 'SCADA'],
  location: 'Pune, India',
  supplier: 'AGB Industrial Equipment Pvt. Ltd.',
};

// ─── Collapsible Section Component (Brand Styled) ────────────────────
const ConfigSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border border-[#F9D2BA] overflow-hidden shadow-sm transition-all">
      <button
        onClick={() => {
          sound.playClick();
          setOpen(!open);
        }}
        className="w-full px-4 py-3.5 flex items-center gap-2.5 bg-white hover:bg-[#F7EAE0]/50 text-[#1D4533] font-extrabold text-xs transition-colors border-b border-transparent data-[open=true]:border-[#F9D2BA]"
        data-open={open}
      >
        <span className="text-[#1D4533]">{icon}</span>
        <span className="flex-1 text-left">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-[#5E3122]" /> : <ChevronRight className="w-4 h-4 text-[#5E3122]" />}
      </button>
      {open && (
        <div className="p-4 bg-[#FDFBF7] flex flex-col gap-3.5 border-t border-[#F9D2BA]/40">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Field Components (Brand Styled) ─────────────────────────────────
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[10px] font-extrabold text-[#5E3122] uppercase tracking-wider block">
    {children}
  </label>
);

const ColorPicker: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-8 h-8 rounded-lg border border-[#F9D2BA] cursor-pointer p-0 bg-transparent shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 rounded-lg border border-[#F9D2BA] bg-white text-[#1D4533] text-xs font-mono font-bold focus:outline-none focus:border-[#1D4533]"
      />
    </div>
  </div>
);

const TextInput: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <Label>{label}</Label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] text-xs font-medium focus:outline-none focus:border-[#1D4533]"
    />
  </div>
);

const NumberSlider: React.FC<{ label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void }> = ({ label, value, min, max, step = 1, unit = 'px', onChange }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center">
      <Label>{label}</Label>
      <span className="text-[10px] font-mono font-bold text-[#1D4533] bg-[#F7EAE0] px-1.5 py-0.5 rounded border border-[#F9D2BA]">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full accent-[#1D4533] cursor-pointer"
    />
  </div>
);

const FontSelect: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <Label>{label}</Label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl border border-[#F9D2BA] bg-white text-[#1D4533] text-xs font-semibold focus:outline-none focus:border-[#1D4533]"
      style={{ fontFamily: value }}
    >
      {PASSPORT_FONTS.map(f => (
        <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
      ))}
    </select>
  </div>
);

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-xs font-bold text-[#1D4533]">{label}</span>
    <button
      type="button"
      onClick={() => {
        sound.playClick();
        onChange(!value);
      }}
      className={`w-10 h-5.5 rounded-full p-0.5 transition-colors relative ${
        value ? 'bg-[#1D4533]' : 'bg-[#5E3122]/30'
      }`}
    >
      <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform shadow-sm ${
        value ? 'translate-x-4.5' : 'translate-x-0'
      }`} />
    </button>
  </div>
);

const AlignmentPicker: React.FC<{ label: string; value: string; onChange: (v: 'left' | 'center' | 'right') => void }> = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <Label>{label}</Label>
    <div className="flex gap-1.5 bg-[#F7EAE0] p-1 rounded-xl border border-[#F9D2BA]">
      {(['left', 'center', 'right'] as const).map(a => (
        <button
          key={a}
          type="button"
          onClick={() => {
            sound.playClick();
            onChange(a);
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold capitalize transition-all flex items-center justify-center gap-1 ${
            value === a 
              ? 'bg-[#1D4533] text-[#F7EAE0] shadow-sm' 
              : 'text-[#5E3122] hover:bg-[#F9D2BA]/50'
          }`}
        >
          {a === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
          {a === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
          {a === 'right' && <AlignRight className="w-3.5 h-3.5" />}
          <span>{a}</span>
        </button>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// PASSPORT STUDIO — Main Component with Available Passports Repository
// ═══════════════════════════════════════════════════════════════════════

export const PassportBuilder: React.FC<PassportBuilderProps> = ({ products = [], onSave }) => {
  const allProducts = products.length > 0 ? products : [SAMPLE_PRODUCT];
  const [activeView, setActiveView] = useState<'gallery' | 'customizer'>('gallery');
  const [galleryLayout, setGalleryLayout] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  const [config, setConfig] = useState<PassportConfig>(() => storage.getPassportConfig());
  const [saved, setSaved] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(allProducts[0] || SAMPLE_PRODUCT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3-Color state (Primary, Card Surface, Background)
  const [primaryColor, setPrimaryColor] = useState<string>(() => config.header.brandNameColor || '#1D4533');
  const [cardColor, setCardColor] = useState<string>(() => config.body.cardBackgroundColor || '#FFFFFF');
  const [bgColor, setBgColor] = useState<string>(() => config.pageBackgroundColor || '#F7EAE0');

  // Filter products for gallery view
  const categories = ['All', ...Array.from(new Set(allProducts.map(p => p.entityType || p.category || 'Product')))];
  
  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uniqrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      categoryFilter === 'All' || 
      (p.entityType || p.category || 'Product') === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Deep updater helper
  const updateConfig = useCallback((path: string[], value: any) => {
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as PassportConfig;
      let target: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]];
      }
      target[path[path.length - 1]] = value;
      return next;
    });
    setSaved(false);
  }, []);

  // Shortcut helpers
  const setH = (key: string, value: any) => updateConfig(['header', key], value);
  const setB = (key: string, value: any) => updateConfig(['body', key], value);
  const setF = (key: string, value: any) => updateConfig(['footer', key], value);

  // Apply 3-Color Palette Customizer
  const applyThreeColors = (primary: string, card: string, background: string, text?: string, border?: string) => {
    sound.playClick();
    setPrimaryColor(primary);
    setCardColor(card);
    setBgColor(background);

    setConfig(prev => ({
      ...prev,
      pageBackgroundColor: background,
      header: {
        ...prev.header,
        brandNameColor: primary,
        backgroundColor: card,
      },
      body: {
        ...prev.body,
        backgroundColor: background,
        cardBackgroundColor: card,
        cardBorderColor: border || `${primary}33`,
        primaryTextColor: text || primary,
        accentColor: primary,
      },
      footer: {
        ...prev.footer,
        backgroundColor: primary,
        textColor: background,
      },
      updatedAt: new Date().toISOString(),
    }));
    setSaved(false);
  };

  // Open Customizer for a specific passport
  const handleOpenCustomizer = (product: Product) => {
    sound.playClick();
    setSelectedProduct(product);
    setActiveView('customizer');
  };

  // Save handler
  const handleSave = () => {
    sound.playSuccessChime();
    storage.savePassportConfig(config);
    setSaved(true);
    onSave?.();
    setTimeout(() => setSaved(false), 3000);
  };

  // Reset to default
  const handleReset = () => {
    sound.playClick();
    if (confirm('Reset passport configuration to default? This cannot be undone.')) {
      setConfig({ ...DEFAULT_PASSPORT_CONFIG, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      setPrimaryColor('#1D4533');
      setCardColor('#FFFFFF');
      setBgColor('#F7EAE0');
      setSaved(false);
    }
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert('Logo file must be under 500 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setH('logoUrl', reader.result as string);
      setH('showLogo', true);
      sound.playClick();
    };
    reader.readAsDataURL(file);
  };

  // Section visibility and reordering
  const toggleSectionVisibility = (sectionId: string) => {
    sound.playClick();
    const updated = config.body.sections.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    setB('sections', updated);
  };

  const moveSectionUp = (sectionId: string) => {
    sound.playClick();
    const sorted = [...config.body.sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === sectionId);
    if (idx <= 0) return;
    const newOrder = sorted[idx - 1].order;
    sorted[idx - 1].order = sorted[idx].order;
    sorted[idx].order = newOrder;
    setB('sections', sorted);
  };

  const moveSectionDown = (sectionId: string) => {
    sound.playClick();
    const sorted = [...config.body.sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(s => s.id === sectionId);
    if (idx < 0 || idx >= sorted.length - 1) return;
    const newOrder = sorted[idx + 1].order;
    sorted[idx + 1].order = sorted[idx].order;
    sorted[idx].order = newOrder;
    setB('sections', sorted);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* ─── HEADER BAR (User-Requested Text & Icon Reset) ─── */}
      <div className="bg-[#1D4533] p-6 rounded-3xl border border-[#F9D2BA]/30 text-[#F7EAE0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 text-[#F9D2BA] font-extrabold text-xs uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>Digital Passport Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F7EAE0] tracking-tight">
            Passport Layout &amp; Theme Customizer
          </h1>
          <p className="text-xs sm:text-sm text-[#F9D2BA]/90 mt-0.5 font-medium">
            Customize color palettes, brand fonts, section order, alignment, and footer branding for your public passport page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Switcher Button */}
          <div className="bg-[#5E3122] p-1 rounded-2xl border border-[#F9D2BA]/30 flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveView('gallery');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'gallery'
                  ? 'bg-[#F9D2BA] text-[#1D4533] shadow-xs'
                  : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Passports ({allProducts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveView('customizer');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'customizer'
                  ? 'bg-[#F9D2BA] text-[#1D4533] shadow-xs'
                  : 'text-[#F7EAE0] hover:bg-[#1D4533]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customizer</span>
            </button>
          </div>

          {/* Reset Default Icon Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-[#5E3122] hover:bg-[#F9D2BA] hover:text-[#1D4533] text-[#F7EAE0] transition-all flex items-center justify-center shadow-sm"
            title="Reset Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Save Passport Button */}
          <button
            type="button"
            onClick={handleSave}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md ${
              saved 
                ? 'bg-emerald-500 text-white' 
                : 'bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533]'
            }`}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Saved!' : 'Save Passport'}</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VIEW A: AVAILABLE PASSPORTS REPOSITORY (GRID & LIST GALLERY)       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeView === 'gallery' && (
        <div className="space-y-6">
          
          {/* SEARCH & CONTROLS TOOLBAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#F9D2BA] shadow-sm">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5E3122]/60" />
              <input
                type="text"
                placeholder="Search available passports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F7EAE0]/50 border border-[#F9D2BA] rounded-xl text-xs font-medium text-[#1D4533] placeholder-[#5E3122]/50 focus:outline-none focus:border-[#1D4533]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playClick();
                    setCategoryFilter(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-[#1D4533] text-[#F7EAE0] shadow-xs'
                      : 'bg-white border border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid / List Layout Switcher */}
            <div className="flex items-center gap-1 bg-[#F7EAE0] p-1 rounded-xl border border-[#F9D2BA] shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setGalleryLayout('grid');
                }}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  galleryLayout === 'grid' ? 'bg-[#1D4533] text-[#F7EAE0]' : 'text-[#5E3122] hover:bg-[#F9D2BA]'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setGalleryLayout('list');
                }}
                className={`p-1.5 rounded-lg text-xs transition-all ${
                  galleryLayout === 'list' ? 'bg-[#1D4533] text-[#F7EAE0]' : 'text-[#5E3122] hover:bg-[#F9D2BA]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* PASSPORT CARDS: GRID VIEW */}
          {galleryLayout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-[#F9D2BA] p-5 space-y-4 hover:border-[#1D4533] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[10px] font-black uppercase tracking-wider">
                        {prod.entityType || prod.category || 'Digital Twin'}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#1D4533] bg-[#F7EAE0] px-2 py-0.5 rounded border border-[#F9D2BA]">
                        {prod.uniqrCode}
                      </span>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-start gap-3">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-14 h-14 rounded-2xl object-cover border border-[#F9D2BA] shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#1D4533] border border-[#F9D2BA] flex items-center justify-center text-[#F9D2BA] font-extrabold text-sm shrink-0">
                          UQ
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-extrabold text-[#1D4533] truncate group-hover:text-[#5E3122] transition-colors">
                          {prod.name}
                        </h3>
                        <p className="text-xs text-[#5E3122] font-medium truncate mt-0.5">
                          {prod.brand || prod.manufacturer || 'Universal Entity'}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          {prod.status || 'Active Passport'}
                        </span>
                      </div>
                    </div>

                    {/* Passport Theme Palette Preview */}
                    <div className="p-2.5 rounded-xl bg-[#F7EAE0]/60 border border-[#F9D2BA]/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-[#5E3122]">Active Palette:</span>
                      <div className="flex items-center -space-x-1">
                        <div className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: primaryColor }} title="Primary" />
                        <div className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: cardColor }} title="Card Surface" />
                        <div className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: bgColor }} title="Background" />
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-[#F9D2BA]/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCustomizer(prod)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Paintbrush className="w-3.5 h-3.5 text-[#F9D2BA]" />
                      <span>Customize</span>
                    </button>

                    <a
                      href={`/q/${prod.uniqrCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-white hover:bg-[#F9D2BA] text-[#1D4533] border border-[#F9D2BA] transition-all flex items-center justify-center shadow-xs"
                      title="Open Public Passport"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* PASSPORT CARDS: LIST VIEW */
            <div className="bg-white rounded-3xl border border-[#F9D2BA] overflow-hidden shadow-sm divide-y divide-[#F9D2BA]/60">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7EAE0]/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="w-12 h-12 rounded-xl object-cover border border-[#F9D2BA] shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#1D4533] border border-[#F9D2BA] flex items-center justify-center text-[#F9D2BA] font-extrabold text-xs shrink-0">
                        UQ
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-[#1D4533] truncate">
                          {prod.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[9px] font-black uppercase">
                          {prod.entityType || prod.category || 'Digital Twin'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#5E3122] font-medium mt-0.5">
                        <span>{prod.brand || prod.manufacturer || 'Universal Entity'}</span>
                        <span className="font-mono font-bold text-[#1D4533] bg-[#F7EAE0] px-1.5 py-0.5 rounded border border-[#F9D2BA]">
                          {prod.uniqrCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenCustomizer(prod)}
                      className="py-2 px-4 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Paintbrush className="w-3.5 h-3.5 text-[#F9D2BA]" />
                      <span>Customize</span>
                    </button>

                    <a
                      href={`/q/${prod.uniqrCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white hover:bg-[#F9D2BA] text-[#1D4533] border border-[#F9D2BA] transition-all flex items-center justify-center shadow-xs"
                      title="Open Public Passport"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* VIEW B: PASSPORT CUSTOMIZER WORKSPACE (SPLIT SCREEN)                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeView === 'customizer' && (
        <div className="space-y-4">
          
          {/* Back to Passports Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setActiveView('gallery');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F9D2BA] border border-[#F9D2BA] text-[#1D4533] font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Passports Gallery</span>
            </button>

            <span className="text-xs font-bold text-[#5E3122]">
              Editing Live Template for: <strong className="text-[#1D4533]">{selectedProduct.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ─── LEFT COLUMN: CONFIG ACCORDIONS (5 COLS) ─── */}
            <div className="lg:col-span-5 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              
              {/* SECTION 1: 3-COLOR PALETTE CUSTOMIZER */}
              <ConfigSection title="3-Color Palette Customizer" icon={<Pipette className="w-4 h-4 text-[#1D4533]" />} defaultOpen={true}>
                <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                  Select 3 core colors that dynamically style the entire passport: Brand / Primary, Card Surfaces, and Page Background.
                </p>

                {/* Curated 3-Color Swatch Presets */}
                <div className="space-y-2 pt-1">
                  <Label>Curated 3-Color Harmonized Palettes</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {THREE_COLOR_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => applyThreeColors(pal.primary, pal.card, pal.background, pal.textColor, pal.borderColor)}
                        className="p-2.5 rounded-xl bg-white border border-[#F9D2BA] hover:border-[#1D4533] hover:shadow-sm text-left transition-all group flex items-center justify-between gap-2"
                      >
                        <div className="truncate">
                          <span className="text-[11px] font-extrabold text-[#1D4533] block truncate">{pal.name}</span>
                        </div>
                        {/* 3-Color Dot Swatch */}
                        <div className="flex items-center -space-x-1 shrink-0">
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: pal.primary }} title="Primary" />
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: pal.card }} title="Card Surface" />
                          <div className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: pal.background }} title="Background" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3 Color Pickers */}
                <div className="pt-3 border-t border-[#F9D2BA]/50 space-y-3">
                  <ColorPicker
                    label="1. Primary / Brand Color (Headers, Buttons, Accents)"
                    value={primaryColor}
                    onChange={(c) => {
                      setPrimaryColor(c);
                      applyThreeColors(c, cardColor, bgColor);
                    }}
                  />
                  <ColorPicker
                    label="2. Card Surface Color (Content Containers)"
                    value={cardColor}
                    onChange={(c) => {
                      setCardColor(c);
                      applyThreeColors(primaryColor, c, bgColor);
                    }}
                  />
                  <ColorPicker
                    label="3. Page Canvas Background Color"
                    value={bgColor}
                    onChange={(c) => {
                      setBgColor(c);
                      applyThreeColors(primaryColor, cardColor, c);
                    }}
                  />
                </div>
              </ConfigSection>

              {/* SECTION 2: HEADER CONFIG */}
              <ConfigSection title="Header — Logo & Brand Name" icon={<Layout className="w-4 h-4 text-[#1D4533]" />} defaultOpen={false}>
                {/* Logo Upload */}
                <div className="flex flex-col gap-1.5">
                  <Label>Organization Logo</Label>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-white border border-dashed border-[#F9D2BA] hover:border-[#1D4533] text-[#1D4533] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />

                    {config.header.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setH('logoUrl', '');
                          setH('showLogo', false);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove logo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <Toggle label="Display Brand Name" value={config.header.showBrandName} onChange={v => setH('showBrandName', v)} />
                {config.header.showBrandName && (
                  <>
                    <TextInput label="Brand Name" value={config.header.brandName} onChange={v => setH('brandName', v)} />
                    <FontSelect label="Brand Font" value={config.header.brandNameFont} onChange={v => setH('brandNameFont', v)} />
                    <NumberSlider label="Brand Size" value={config.header.brandNameSize} min={12} max={36} onChange={v => setH('brandNameSize', v)} />
                    <ColorPicker label="Brand Name Color" value={config.header.brandNameColor} onChange={v => setH('brandNameColor', v)} />
                  </>
                )}

                <Toggle label="Display Tagline" value={config.header.showTagline} onChange={v => setH('showTagline', v)} />
                {config.header.showTagline && (
                  <>
                    <TextInput label="Tagline Text" value={config.header.tagline} onChange={v => setH('tagline', v)} />
                    <ColorPicker label="Tagline Color" value={config.header.taglineColor} onChange={v => setH('taglineColor', v)} />
                  </>
                )}

                <AlignmentPicker label="Header Alignment" value={config.header.alignment} onChange={v => setH('alignment', v)} />
                <Toggle label="Display Verification Seal Badge" value={config.header.showVerificationBadge} onChange={v => setH('showVerificationBadge', v)} />
                <Toggle label="Display Entity Type Badge" value={config.header.showEntityTypeBadge} onChange={v => setH('showEntityTypeBadge', v)} />
              </ConfigSection>

              {/* SECTION 3: BODY & TYPOGRAPHY */}
              <ConfigSection title="Body — Typography & Styling" icon={<Paintbrush className="w-4 h-4 text-[#1D4533]" />} defaultOpen={false}>
                <FontSelect label="Headings Font" value={config.body.headingFont} onChange={v => setB('headingFont', v)} />
                <NumberSlider label="Heading Size" value={config.body.headingSize} min={14} max={32} onChange={v => setB('headingSize', v)} />
                <FontSelect label="Body & Fields Font" value={config.body.bodyFont} onChange={v => setB('bodyFont', v)} />
                <NumberSlider label="Body Size" value={config.body.bodySize} min={11} max={18} onChange={v => setB('bodySize', v)} />
                <NumberSlider label="Card Corner Radius" value={config.body.cardBorderRadius} min={0} max={32} onChange={v => setB('cardBorderRadius', v)} />
                <NumberSlider label="Section Spacing" value={config.body.sectionSpacing} min={8} max={36} onChange={v => setB('sectionSpacing', v)} />
              </ConfigSection>

              {/* SECTION 4: SECTION VISIBILITY & ORDER */}
              <ConfigSection title="Section Visibility & Ordering" icon={<Layers className="w-4 h-4 text-[#1D4533]" />} defaultOpen={false}>
                <div className="space-y-2">
                  {[...config.body.sections].sort((a, b) => a.order - b.order).map((sec, idx, arr) => (
                    <div
                      key={sec.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        sec.visible
                          ? 'bg-white border-[#F9D2BA] shadow-xs'
                          : 'bg-[#F7EAE0]/50 border-gray-300 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <button
                          type="button"
                          onClick={() => toggleSectionVisibility(sec.id)}
                          className="text-[#1D4533] hover:text-[#5E3122]"
                          title={sec.visible ? 'Hide section' : 'Show section'}
                        >
                          {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                        </button>
                        <span className="text-xs font-bold text-[#1D4533] truncate">{sec.label}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSectionUp(sec.id)}
                          className="p-1 rounded hover:bg-[#F7EAE0] disabled:opacity-30 text-[#1D4533]"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === arr.length - 1}
                          onClick={() => moveSectionDown(sec.id)}
                          className="p-1 rounded hover:bg-[#F7EAE0] disabled:opacity-30 text-[#1D4533]"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ConfigSection>

              {/* SECTION 5: FOOTER CONFIG */}
              <ConfigSection title="Footer — Notes & Actions" icon={<Type className="w-4 h-4 text-[#1D4533]" />} defaultOpen={false}>
                <Toggle label="Show Action Buttons (Download, Verify)" value={config.footer.showActionButtons} onChange={v => setF('showActionButtons', v)} />
                <Toggle label="Show Back to Platform Button" value={config.footer.showBackButton} onChange={v => setF('showBackButton', v)} />
                <Toggle label="Show Custom Footer Note" value={config.footer.showCustomFooterText} onChange={v => setF('showCustomFooterText', v)} />
                {config.footer.showCustomFooterText && (
                  <TextInput label="Custom Footer Note" value={config.footer.customFooterText} onChange={v => setF('customFooterText', v)} placeholder="e.g. For official inquiries contact support@company.com" />
                )}
                <div className="p-3 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA] text-[10px] text-[#5E3122] font-semibold space-y-1">
                  <div className="flex items-center gap-1 text-[#1D4533] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mandatory Platform Branding</span>
                  </div>
                  <p>
                    "Powered by UniQR — agbtechnologies.com" is automatically pinned to the footer base on all digital twin passport pages.
                  </p>
                </div>
              </ConfigSection>

              {/* SECTION 6: GLOBAL SETTINGS */}
              <ConfigSection title="Global Page Settings" icon={<Settings2 className="w-4 h-4 text-[#1D4533]" />} defaultOpen={false}>
                <NumberSlider label="Page Maximum Width" value={config.maxWidth} min={640} max={1200} step={20} onChange={v => updateConfig(['maxWidth'], v)} />
                <NumberSlider label="Outer Card Corner Radius" value={config.borderRadius} min={0} max={36} onChange={v => updateConfig(['borderRadius'], v)} />
                <Toggle label="Show Share QR Button" value={config.showShareButton} onChange={v => updateConfig(['showShareButton'], v)} />
                <Toggle label="Show AI Decision Engine Button" value={config.showAiEngineButton} onChange={v => updateConfig(['showAiEngineButton'], v)} />
                <Toggle label="Show Audit Trail History Tab" value={config.showLedgerTrailTab} onChange={v => updateConfig(['showLedgerTrailTab'], v)} />
              </ConfigSection>

            </div>

            {/* ─── RIGHT COLUMN: REAL-TIME LIVE PASSPORT PREVIEW (7 COLS) ─── */}
            <div className="lg:col-span-7 sticky top-20">
              <div className="bg-white rounded-3xl border border-[#F9D2BA] shadow-sm p-4 sm:p-6 space-y-4">
                
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[#1D4533]" />
                    <span className="font-extrabold text-xs text-[#1D4533] uppercase tracking-wider">
                      Real-Time Live Passport Preview
                    </span>
                  </div>

                  {/* Sample Product Switcher */}
                  {allProducts.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#5E3122]">Preview Entity:</span>
                      <select
                        value={selectedProduct.id}
                        onChange={(e) => {
                          const p = allProducts.find(prod => prod.id === e.target.value);
                          if (p) setSelectedProduct(p);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#F9D2BA] bg-white text-xs font-bold text-[#1D4533] focus:outline-none"
                      >
                        {allProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Live Passport Frame */}
                <div className="rounded-2xl border border-[#F9D2BA] overflow-hidden shadow-inner max-h-[720px] overflow-y-auto bg-gray-50">
                  <DynamicPassport
                    product={selectedProduct}
                    config={config}
                    isPreview={true}
                    onBackToApp={() => {}}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
