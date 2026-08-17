import React, { useState, useEffect, useRef } from "react";
import {
  Download, Sparkles, Palette, Sliders, RefreshCw, Layers, Cpu,
  FileDown, ExternalLink, QrCode, Printer, Info, CheckCircle2,
  Settings2, Shield, Wifi, Binary
} from "lucide-react";
import { Product, QrStylingConfig } from "../../types";
import { sound } from "../../services/audio";
import {
  drawQrToCanvasAsync, downloadQrFile,
  QR_SIZE_PRESETS, QrSizePreset
} from "../../services/qrExportEngine";

interface QrStudioProps {
  products: Product[];
  selectedProduct: Product | null;
  quotaUsed: number;
  quotaLimit: number;
  onGenerateSuccess: () => void;
  onOpenUpgrade: () => void;
}

export type ExportFormatType = "png" | "jpg" | "bmp" | "svg" | "pdf" | "eps" | "ai" | "dxf";
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type EncodingMode = "auto" | "numeric" | "alphanumeric" | "binary";

interface QrTechnicalConfig {
  errorCorrectionLevel: ErrorCorrectionLevel;
  margin: number;
  encodingMode: EncodingMode;
}

const ECL_OPTIONS: { level: ErrorCorrectionLevel; label: string; recovery: string; desc: string; color: string }[] = [
  { level: "L", label: "Low (L)", recovery: "~7%", desc: "Clean environments", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { level: "M", label: "Medium (M)", recovery: "~15%", desc: "General purpose", color: "bg-green-100 text-green-800 border-green-300" },
  { level: "Q", label: "Quartile (Q)", recovery: "~25%", desc: "Light wear & logos", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { level: "H", label: "High (H)", recovery: "~30%", desc: "Industrial / outdoor", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

const MARGIN_OPTIONS: { value: number; label: string; desc: string }[] = [
  { value: 1, label: "Tight", desc: "Compact" },
  { value: 2, label: "Std", desc: "Recommended" },
  { value: 4, label: "Wide", desc: "Industrial" },
];

const ENCODING_OPTIONS: { mode: EncodingMode; label: string; chars: string }[] = [
  { mode: "auto", label: "Auto", chars: "All characters" },
  { mode: "numeric", label: "Numeric", chars: "0-9 only" },
  { mode: "alphanumeric", label: "Alpha", chars: "0-9, A-Z, $%..." },
  { mode: "binary", label: "Binary", chars: "Full ISO-8859-1" },
];

const DEFAULT_PRODUCT: Product = {
  id: "prod-default",
  uniqrCode: "UQR-PROD-000001",
  name: "AGB HydroMax 500 Industrial Water Pump",
  sku: "HM500-IND",
  brand: "AGB Industrial Equipment Pvt. Ltd.",
  manufacturer: "AGB Industrial Equipment Pvt. Ltd.",
  description: "Flagship industrial water pump with tamper-evident digital identity passport.",
  category: "Industrial Machinery",
  hsn: "84137010",
  gst: 18,
  mfgDate: "2026-05-12",
  expDate: "2031-05-12",
  warrantyMonths: 36,
  batchNumber: "HM500-2026-X8",
  serialNumber: "SN-HM500-88192",
  createdAt: "2026-05-12T00:00:00Z",
  updatedAt: "2026-05-12T00:00:00Z",
  metadata: { "Motor Power": "5.5 HP (4.0 kW)", "IP Rating": "IP68 Submersible" }
};

const THEMES = [
  { name: "Forest", fg: "#1D4533", bg: "#F7EAE0" },
  { name: "Obsidian", fg: "#0F172A", bg: "#F8FAFC" },
  { name: "Espresso", fg: "#5E3122", bg: "#F9D2BA" },
  { name: "Mono", fg: "#000000", bg: "#FFFFFF" },
];

export const QrStudio: React.FC<QrStudioProps> = ({
  products,
  selectedProduct,
  onGenerateSuccess,
}) => {
  const [activeProduct, setActiveProduct] = useState<Product>(
    selectedProduct || products[0] || DEFAULT_PRODUCT
  );
  const qrCodeValue = activeProduct.uniqrCode || activeProduct.id;
  const liveTargetUrl = typeof window !== "undefined"
    ? `${window.location.origin}/q/${encodeURIComponent(qrCodeValue)}`
    : `https://uniqr.agbtechnologies.in/q/${encodeURIComponent(qrCodeValue)}`;

  const [styleConfig, setStyleConfig] = useState<QrStylingConfig>({
    fgColor: "#1D4533", bgColor: "#F7EAE0", transparentBg: false,
    style: "rounded-modules", cornerDotStyle: "rounded",
    gradient: false, gradientColor: "#5E3122", borderPadding: 16, logoUrl: ""
  });

  const [technicalConfig, setTechnicalConfig] = useState<QrTechnicalConfig>({
    errorCorrectionLevel: "H",
    margin: 2,
    encodingMode: "auto"
  });

  const [selectedSizePreset, setSelectedSizePreset] = useState<QrSizePreset>(QR_SIZE_PRESETS[2]);
  const [downloadSize, setDownloadSize] = useState<number>(590);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>("png");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedProduct) setActiveProduct(selectedProduct);
  }, [selectedProduct]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawQrToCanvasAsync(canvas, qrCodeValue, {
      size: Math.min(downloadSize, 2048),
      fgColor: styleConfig.fgColor, bgColor: styleConfig.bgColor,
      transparentBg: styleConfig.transparentBg, style: styleConfig.style,
      cornerDotStyle: styleConfig.cornerDotStyle, gradient: styleConfig.gradient,
      gradientColor: styleConfig.gradientColor, logoUrl: styleConfig.logoUrl,
      customTargetUrl: liveTargetUrl,
      errorCorrectionLevel: technicalConfig.errorCorrectionLevel,
      margin: technicalConfig.margin,
    });
  }, [styleConfig, technicalConfig, activeProduct, qrCodeValue, liveTargetUrl, downloadSize]);

  const getVisualDimension = () => {
    if (downloadSize <= 236) return "55%";
    if (downloadSize <= 354) return "70%";
    if (downloadSize <= 590) return "85%";
    if (downloadSize <= 1772) return "95%";
    return "100%";
  };

  const handleSimulatedGeneration = async (callback: () => Promise<void> | void) => {
    sound.playClick();
    setIsGenerating(true);
    const steps = [
      "1/4 Resolving Permanent Identity Record...",
      "2/4 Encoding Target Cryptographic Route...",
      "3/4 Formatting Multi-Layer Geometry...",
      "4/4 Locking QR Payload..."
    ];
    let i = 0;
    const iv = setInterval(async () => {
      if (i < steps.length) { setGenerationStep(steps[i]); i++; }
      else { clearInterval(iv); setIsGenerating(false); onGenerateSuccess(); await callback(); }
    }, 150);
  };

  const handleExecuteDownload = () => {
    handleSimulatedGeneration(async () => {
      await downloadQrFile(qrCodeValue, selectedFormat, {
        size: downloadSize,
        fgColor: styleConfig.fgColor, bgColor: styleConfig.bgColor,
        transparentBg: styleConfig.transparentBg, style: styleConfig.style,
        cornerDotStyle: styleConfig.cornerDotStyle, gradient: styleConfig.gradient,
        gradientColor: styleConfig.gradientColor, logoUrl: styleConfig.logoUrl,
        customTargetUrl: liveTargetUrl,
        errorCorrectionLevel: technicalConfig.errorCorrectionLevel,
        margin: technicalConfig.margin,
      });
    });
  };

  const currentEcl = ECL_OPTIONS.find(e => e.level === technicalConfig.errorCorrectionLevel)!;
  const vd = getVisualDimension();

  const eclDesc = {
    H: "Recommended for industrial, outdoor, and logo-embedded codes.",
    Q: "Good balance with logo embedding. Slightly denser QR.",
    M: "General-purpose. Compact size, standard reliability.",
    L: "Smallest QR. Use only in pristine, controlled environments.",
  }[technicalConfig.errorCorrectionLevel];

  /* ─── SHARED COMPONENT FRAGMENTS ─── */
  const EntitySelector = () => (
    <div className="px-2.5 py-2 lg:px-0 lg:mb-4">
      <select
        value={activeProduct.id}
        onChange={e => { sound.playClick(); const f = products.find(p => p.id === e.target.value); if (f) setActiveProduct(f); }}
        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-extrabold text-xs focus:outline-none focus:ring-2 focus:ring-[#1D4533] lg:rounded-2xl lg:py-3 lg:text-sm"
      >
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name} ({p.sku || p.uniqrCode})</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="selection:bg-[#1D4533] selection:text-[#F7EAE0]">

      {/* ══ MOBILE TOPBAR ══ */}
      <div className="lg:hidden sticky top-0 z-30 bg-[#1D4533] px-3 py-2.5 flex items-center justify-between shadow-lg border-b border-[#F9D2BA]/30">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[#F9D2BA]" />
          <span className="font-black text-[#F7EAE0] text-sm tracking-tight">QR Studio</span>
        </div>
        <a
          href={`/q/${encodeURIComponent(qrCodeValue)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9D2BA] text-[#1D4533] rounded-xl font-extrabold text-[11px] hover:bg-[#F7EAE0] transition-colors shadow-sm active:scale-95"
        >
          <Wifi className="w-3 h-3" />
          <span>Live Passport</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* ══ DESKTOP HEADER ══ */}
      <div className="hidden lg:flex bg-white p-6 rounded-3xl border border-[#F9D2BA] shadow-sm items-center justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#1D4533] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>QR &amp; Vector Studio</span>
          </div>
          <h1 className="text-3xl font-black text-[#1D4533]">QR Studio</h1>
          <p className="text-xs text-[#5E3122] font-semibold">
            Camera-scannable identity tokens · 300 DPI print calibration · Error correction · Multi-format vector export
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/q/${encodeURIComponent(qrCodeValue)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#1D4533] hover:bg-[#5E3122] text-[#F9D2BA] rounded-2xl font-extrabold text-xs transition-all shadow-md"
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Live Passport</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <div className="p-3 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] text-right">
            <span className="block text-[10px] text-[#5E3122] font-bold uppercase">Active Token:</span>
            <strong className="font-mono text-xs text-[#1D4533]">{qrCodeValue}</strong>
          </div>
        </div>
      </div>

      {/* ══ ENTITY SELECTOR ══ */}
      <EntitySelector />

      {/* ══ MOBILE 2×2 QUADRANT GRID ══ */}
      <div className="lg:hidden grid grid-cols-2 gap-2 px-2.5 pb-28">

        {/* Q1 ─ PREVIEW + DOWNLOAD */}
        <div className="bg-white rounded-2xl border border-[#F9D2BA] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#1D4533] px-2.5 py-1.5 flex items-center gap-1.5">
            <QrCode className="w-3 h-3 text-[#F9D2BA]" />
            <span className="text-[10px] font-extrabold text-[#F7EAE0] uppercase tracking-wide">Preview</span>
          </div>
          <div className="flex-1 bg-[#F7EAE0] p-2 flex items-center justify-center">
            <div className="w-full aspect-square max-w-[130px] mx-auto">
              <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}
                className="rounded-xl border-2 border-[#1D4533] shadow-sm block" />
            </div>
          </div>
          <div className="px-2 pt-1 pb-1 flex items-center justify-between">
            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${currentEcl.color}`}>
              ECL {technicalConfig.errorCorrectionLevel} · {currentEcl.recovery}
            </span>
            <span className="text-[9px] font-mono font-bold text-[#5E3122]">{downloadSize}px</span>
          </div>
          <div className="px-2 pb-2.5">
            <button
              type="button" onClick={handleExecuteDownload} disabled={isGenerating}
              className="w-full py-2 rounded-xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {isGenerating
                ? <><RefreshCw className="w-3 h-3 animate-spin" /><span>Generating...</span></>
                : <><Download className="w-3 h-3" /><span>Download {selectedFormat.toUpperCase()}</span></>
              }
            </button>
          </div>
        </div>

        {/* Q2 ─ DESIGN & CUSTOMIZATION */}
        <div className="bg-white rounded-2xl border border-[#F9D2BA] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#5E3122] px-2.5 py-1.5 flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-[#F9D2BA]" />
            <span className="text-[10px] font-extrabold text-[#F7EAE0] uppercase tracking-wide">Design</span>
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 280 }}>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase tracking-wider">Theme</p>
            <div className="grid grid-cols-2 gap-1">
              {THEMES.map(t => (
                <button key={t.name} type="button"
                  onClick={() => { sound.playClick(); setStyleConfig(p => ({ ...p, fgColor: t.fg, bgColor: t.bg, transparentBg: false })); }}
                  className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${styleConfig.fgColor === t.fg && styleConfig.bgColor === t.bg ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/60 border-[#F9D2BA] text-[#5E3122]"}`}
                >
                  <div className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: t.fg }} />
                  <span className="text-[9px] font-bold">{t.name}</span>
                </button>
              ))}
            </div>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase">Custom Color</p>
            <div className="flex gap-2">
              <label className="flex items-center gap-1 text-[9px] font-bold text-[#1D4533] cursor-pointer">
                <input type="color" value={styleConfig.fgColor} onChange={e => setStyleConfig(p => ({ ...p, fgColor: e.target.value }))} className="w-6 h-5 rounded border-0 p-0" />
                <span>QR</span>
              </label>
              <label className="flex items-center gap-1 text-[9px] font-bold text-[#1D4533] cursor-pointer">
                <input type="color" value={styleConfig.bgColor} onChange={e => setStyleConfig(p => ({ ...p, bgColor: e.target.value }))} className="w-6 h-5 rounded border-0 p-0" />
                <span>BG</span>
              </label>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={styleConfig.transparentBg}
                onChange={e => { sound.playClick(); setStyleConfig(p => ({ ...p, transparentBg: e.target.checked })); }}
                className="rounded text-[#1D4533]" />
              <span className="text-[9px] font-bold text-[#5E3122]">Transparent BG</span>
            </label>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase">Finder Pattern</p>
            <div className="flex gap-1">
              {(["square", "rounded", "dots"] as const).map(s => (
                <button key={s} type="button" onClick={() => { sound.playClick(); setStyleConfig(p => ({ ...p, cornerDotStyle: s })); }}
                  className={`flex-1 py-1 text-[9px] font-extrabold rounded-lg border transition-all ${styleConfig.cornerDotStyle === s ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122]"}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Q3 ─ SIZE & RESOLUTION + TECHNICAL */}
        <div className="bg-white rounded-2xl border border-[#F9D2BA] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#1D4533]/90 px-2.5 py-1.5 flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-[#F9D2BA]" />
            <span className="text-[10px] font-extrabold text-[#F7EAE0] uppercase tracking-wide">Size &amp; Tech</span>
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 360 }}>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase flex items-center gap-1">
              <Printer className="w-2.5 h-2.5" /> Print (300 DPI)
            </p>
            <div className="grid grid-cols-3 gap-1">
              {QR_SIZE_PRESETS.filter(p => p.isPrintPreset).map(preset => (
                <button key={preset.id} type="button"
                  onClick={() => { sound.playClick(); setDownloadSize(preset.digitalResolution); setSelectedSizePreset(preset); }}
                  className={`py-1.5 rounded-lg border text-center transition-all ${downloadSize === preset.digitalResolution ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/60 border-[#F9D2BA] text-[#5E3122]"}`}>
                  <span className="font-black text-[9px] block">{preset.name.split(" ")[0]}</span>
                  <span className="text-[8px] opacity-80">{preset.badge}</span>
                </button>
              ))}
            </div>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5" /> Digital
            </p>
            <div className="grid grid-cols-2 gap-1">
              {QR_SIZE_PRESETS.filter(p => !p.isPrintPreset).slice(0, 4).map(preset => (
                <button key={preset.id} type="button"
                  onClick={() => { sound.playClick(); setDownloadSize(preset.digitalResolution); setSelectedSizePreset(preset); }}
                  className={`py-1 px-1.5 rounded-lg border text-left transition-all ${downloadSize === preset.digitalResolution ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/40 border-[#F9D2BA] text-[#5E3122]"}`}>
                  <span className="font-black text-[9px] block truncate">{preset.name.replace("Standard ", "").replace(" Master", "")}</span>
                  <span className="text-[8px] opacity-80">{preset.badge}</span>
                </button>
              ))}
            </div>
            <div className="pt-1 border-t border-[#F9D2BA]">
              <p className="text-[9px] font-extrabold text-[#1D4533] uppercase flex items-center gap-1 mb-1">
                <Shield className="w-2.5 h-2.5" /> Error Correction
              </p>
              <div className="grid grid-cols-2 gap-1">
                {ECL_OPTIONS.map(opt => (
                  <button key={opt.level} type="button"
                    onClick={() => { sound.playClick(); setTechnicalConfig(p => ({ ...p, errorCorrectionLevel: opt.level })); }}
                    className={`py-1 px-1.5 rounded-lg border text-left transition-all ${technicalConfig.errorCorrectionLevel === opt.level ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122]"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[9px]">{opt.level}</span>
                      <span className="text-[8px] font-mono">{opt.recovery}</span>
                    </div>
                    <span className="text-[8px] opacity-80 block truncate">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-[#5E3122] uppercase mb-1">Quiet Zone</p>
              <div className="flex gap-1">
                {MARGIN_OPTIONS.map(m => (
                  <button key={m.value} type="button"
                    onClick={() => { sound.playClick(); setTechnicalConfig(p => ({ ...p, margin: m.value })); }}
                    className={`flex-1 py-1 text-[9px] font-extrabold rounded-lg border transition-all ${technicalConfig.margin === m.value ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122]"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-extrabold text-[#5E3122] uppercase flex items-center gap-1 mb-1">
                <Binary className="w-2.5 h-2.5" /> Encoding
              </p>
              <div className="grid grid-cols-2 gap-1">
                {ENCODING_OPTIONS.map(e => (
                  <button key={e.mode} type="button"
                    onClick={() => { sound.playClick(); setTechnicalConfig(p => ({ ...p, encodingMode: e.mode })); }}
                    className={`py-1 px-1 rounded-lg border text-left transition-all ${technicalConfig.encodingMode === e.mode ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122]"}`}>
                    <span className="font-extrabold text-[9px] block">{e.label}</span>
                    <span className="text-[8px] opacity-80 block truncate">{e.chars}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Q4 ─ EXPORT SETTINGS */}
        <div className="bg-white rounded-2xl border border-[#F9D2BA] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#5E3122]/80 px-2.5 py-1.5 flex items-center gap-1.5">
            <FileDown className="w-3 h-3 text-[#F9D2BA]" />
            <span className="text-[10px] font-extrabold text-[#F7EAE0] uppercase tracking-wide">Export</span>
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto" style={{ maxHeight: 360 }}>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase">Raster</p>
            <div className="flex gap-1">
              {[{ id: "png", label: "PNG" }, { id: "jpg", label: "JPG" }, { id: "bmp", label: "BMP" }].map(fmt => (
                <button key={fmt.id} type="button" onClick={() => { sound.playClick(); setSelectedFormat(fmt.id as ExportFormatType); }}
                  className={`flex-1 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all ${selectedFormat === fmt.id ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122]"}`}>
                  {fmt.label}
                </button>
              ))}
            </div>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase">Vector / Print</p>
            <div className="grid grid-cols-2 gap-1">
              {[{ id: "svg", label: "SVG", desc: "Scalable" }, { id: "pdf", label: "PDF", desc: "Portable Doc" }, { id: "eps", label: "EPS", desc: "PostScript" }, { id: "ai", label: "AI", desc: "Illustrator" }].map(fmt => (
                <button key={fmt.id} type="button" onClick={() => { sound.playClick(); setSelectedFormat(fmt.id as ExportFormatType); }}
                  className={`py-1.5 rounded-lg border text-left px-1.5 transition-all ${selectedFormat === fmt.id ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122]"}`}>
                  <span className="font-extrabold text-[10px] block">{fmt.label}</span>
                  <span className="text-[8px] opacity-80 block">{fmt.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-[9px] font-extrabold text-[#5E3122] uppercase">CAD / Industrial</p>
            <button type="button" onClick={() => { sound.playClick(); setSelectedFormat("dxf"); }}
              className={`w-full py-1.5 rounded-lg border text-left px-1.5 transition-all flex items-center gap-1.5 ${selectedFormat === "dxf" ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122]"}`}>
              <Cpu className="w-3 h-3 shrink-0" />
              <div>
                <span className="font-extrabold text-[9px] block">DXF Vector</span>
                <span className="text-[8px] opacity-80 block">AutoCAD / Laser / CNC</span>
              </div>
            </button>
            <div className="p-1.5 bg-[#F7EAE0] rounded-lg border border-[#F9D2BA]">
              <p className="text-[9px] font-extrabold text-[#1D4533]">Selected: {selectedFormat.toUpperCase()}</p>
              <p className="text-[8px] text-[#5E3122] font-semibold">{downloadSize}px · ECL {technicalConfig.errorCorrectionLevel} · {currentEcl.recovery}</p>
            </div>
          </div>
        </div>

      </div>{/* end mobile quadrant grid */}

      {/* ══ DESKTOP 12-COL LAYOUT ══ */}
      <div className="hidden lg:grid grid-cols-12 gap-8 items-start">

        {/* RIGHT: LIVE PREVIEW */}
        <div className="order-2 col-span-5 bg-white p-8 rounded-3xl border border-[#F9D2BA] space-y-5 shadow-sm sticky top-20">
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-2.5">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#1D4533]" />
              <h3 className="font-extrabold text-lg text-[#1D4533]">Scannable QR Preview</h3>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentEcl.color}`}>
              ECL {technicalConfig.errorCorrectionLevel} · {currentEcl.recovery}
            </span>
          </div>
          <div className="bg-[#F7EAE0] p-5 rounded-2xl border border-[#F9D2BA] flex flex-col items-center">
            <div className="w-full max-w-[280px] aspect-square flex items-center justify-center p-2 mx-auto">
              <div style={{ width: vd, height: vd }} className="aspect-square transition-all duration-300 flex items-center justify-center">
                <canvas ref={canvasRef} style={{ width: "100%", height: "100%", aspectRatio: "1 / 1" }}
                  className="rounded-2xl border-2 border-[#1D4533] shadow-md bg-white block" />
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[10px] font-mono font-black">
              <Sliders className="w-3 h-3" />
              <span>{downloadSize} × {downloadSize} px</span>
              {selectedSizePreset && <span className="opacity-80">({selectedSizePreset.name.split(" ")[0]})</span>}
            </div>
            <div className="mt-3 p-3 bg-white rounded-2xl border border-[#F9D2BA] text-center w-full space-y-1.5">
              <span className="block text-[9px] font-extrabold text-[#5E3122] uppercase tracking-wider">Destination URL:</span>
              <p className="text-[11px] font-mono text-[#1D4533] font-black truncate bg-[#F7EAE0]/60 px-2 py-0.5 rounded-lg">{liveTargetUrl}</p>
              <a href={`/q/${encodeURIComponent(qrCodeValue)}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4533] hover:bg-[#5E3122] text-[#F9D2BA] rounded-xl text-[11px] font-extrabold transition-all">
                <Wifi className="w-3 h-3" /><span>Open Live Passport</span><ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <button type="button" onClick={handleExecuteDownload} disabled={isGenerating}
            className="w-full py-3.5 rounded-2xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
            {isGenerating
              ? <><RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" /><span>{generationStep}</span></>
              : <><Download className="w-4 h-4 text-[#F9D2BA]" /><span>Download {selectedFormat.toUpperCase()} ({downloadSize}px)</span></>}
          </button>
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] font-semibold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Camera Scannable (iOS, Android &amp; Google Lens)</span>
          </div>
        </div>

        {/* LEFT: ALL SETTINGS */}
        <div className="order-1 col-span-7 space-y-6">

          {/* 1. AESTHETIC & COLORS */}
          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#5E3122]" />
              <span>1. Aesthetic &amp; Colors</span>
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {THEMES.map(t => (
                <button key={t.name} type="button"
                  onClick={() => { sound.playClick(); setStyleConfig(p => ({ ...p, fgColor: t.fg, bgColor: t.bg, transparentBg: false })); }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 ${styleConfig.fgColor === t.fg && styleConfig.bgColor === t.bg ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                  <div className="w-4 h-4 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: t.fg }} />
                  <span className="text-[11px] font-bold truncate">{t.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-[#5E3122] cursor-pointer">
                <span>QR Color:</span>
                <input type="color" value={styleConfig.fgColor} onChange={e => setStyleConfig(p => ({ ...p, fgColor: e.target.value }))} className="w-8 h-6 rounded border-0 p-0 cursor-pointer" />
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-[#5E3122] cursor-pointer">
                <span>BG Color:</span>
                <input type="color" value={styleConfig.bgColor} onChange={e => setStyleConfig(p => ({ ...p, bgColor: e.target.value }))} className="w-8 h-6 rounded border-0 p-0 cursor-pointer" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#5E3122]">
                <input type="checkbox" checked={styleConfig.transparentBg}
                  onChange={e => { sound.playClick(); setStyleConfig(p => ({ ...p, transparentBg: e.target.checked })); }}
                  className="rounded border-[#F9D2BA] text-[#1D4533]" />
                <span>Transparent BG (Alpha PNG / SVG)</span>
              </label>
            </div>
          </div>

          {/* 2. TECHNICAL QR CODE PROPERTIES */}
          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] space-y-5 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-[#5E3122]" />
              <span>2. Technical QR Code Properties</span>
            </h3>

            {/* Error Correction Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#1D4533] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#5E3122]" />
                  Error Correction Level (ECL)
                </label>
                <span className="text-[10px] font-mono text-[#5E3122] font-bold">ISO 18004 · Reed-Solomon</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ECL_OPTIONS.map(opt => (
                  <button key={opt.level} type="button"
                    onClick={() => { sound.playClick(); setTechnicalConfig(p => ({ ...p, errorCorrectionLevel: opt.level })); }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${technicalConfig.errorCorrectionLevel === opt.level ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md ring-2 ring-[#F9D2BA]" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm">{opt.level}</span>
                      <span className="text-[10px] font-mono font-bold">{opt.recovery}</span>
                    </div>
                    <span className="text-[10px] font-semibold block mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#5E3122] font-semibold">{currentEcl.recovery} data recovery · {eclDesc}</p>
            </div>

            {/* Finder Patterns */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#1D4533] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#5E3122]" />
                Finder Pattern Style (Corner Squares)
              </label>
              <p className="text-[10px] text-[#5E3122] font-semibold -mt-1">
                Three large corner squares used by digital image sensors to detect orientation, size, and angle.
              </p>
              <div className="flex gap-2">
                {(["square", "rounded", "dots"] as const).map(s => (
                  <button key={s} type="button" onClick={() => { sound.playClick(); setStyleConfig(p => ({ ...p, cornerDotStyle: s })); }}
                    className={`flex-1 p-2.5 rounded-2xl border text-center transition-all ${styleConfig.cornerDotStyle === s ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                    <span className="font-extrabold text-xs capitalize">{s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quiet Zone + Encoding Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#1D4533]">
                  Quiet Zone (Cell Width / Margin Modules)
                </label>
                <p className="text-[10px] text-[#5E3122] font-semibold">
                  Blank border measured in modules (cells). Each module is one QR data dot.
                </p>
                <div className="flex gap-2">
                  {MARGIN_OPTIONS.map(m => (
                    <button key={m.value} type="button"
                      onClick={() => { sound.playClick(); setTechnicalConfig(p => ({ ...p, margin: m.value })); }}
                      className={`flex-1 p-2 rounded-xl border text-center transition-all ${technicalConfig.margin === m.value ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                      <span className="font-extrabold text-[10px] block">{m.label}</span>
                      <span className="text-[9px] opacity-80">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#1D4533] flex items-center gap-1.5">
                  <Binary className="w-3.5 h-3.5 text-[#5E3122]" />
                  Encoding Mode
                </label>
                <p className="text-[10px] text-[#5E3122] font-semibold">
                  Character set per module. Numeric encodes 3× more data than binary.
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {ENCODING_OPTIONS.map(e => (
                    <button key={e.mode} type="button"
                      onClick={() => { sound.playClick(); setTechnicalConfig(p => ({ ...p, encodingMode: e.mode })); }}
                      className={`p-1.5 rounded-xl border text-left transition-all ${technicalConfig.encodingMode === e.mode ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                      <span className="font-extrabold text-[10px] block">{e.label}</span>
                      <span className="text-[9px] opacity-80 block truncate">{e.chars}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. SIZE & RESOLUTION */}
          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#5E3122]" />
                <span>3. Print &amp; Digital Size Presets</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-[#F9D2BA] text-[#1D4533] px-2 py-0.5 rounded-full">300 DPI Calibrated</span>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#5E3122] uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#1D4533]" /> Physical Print Presets (300 DPI):
              </span>
              <div className="grid grid-cols-5 gap-2">
                {QR_SIZE_PRESETS.filter(p => p.isPrintPreset).map(preset => {
                  const isSel = downloadSize === preset.digitalResolution;
                  return (
                    <button key={preset.id} type="button"
                      onClick={() => { sound.playClick(); setDownloadSize(preset.digitalResolution); setSelectedSizePreset(preset); }}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${isSel ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md ring-2 ring-[#F9D2BA]" : "bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs">{preset.name.split(" ")[0]}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 rounded ${isSel ? "bg-[#F9D2BA] text-[#1D4533]" : "bg-[#1D4533]/10 text-[#1D4533]"}`}>{preset.badge}</span>
                      </div>
                      <span className="text-[9px] opacity-85 block truncate mt-1">{preset.printDimensions.split("(")[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold text-[#5E3122] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#1D4533]" /> Digital Master Resolutions:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {QR_SIZE_PRESETS.filter(p => !p.isPrintPreset).map(preset => {
                  const isSel = downloadSize === preset.digitalResolution;
                  return (
                    <button key={preset.id} type="button"
                      onClick={() => { sound.playClick(); setDownloadSize(preset.digitalResolution); setSelectedSizePreset(preset); }}
                      className={`p-2 rounded-xl border text-left transition-all ${isSel ? "bg-[#1D4533] text-[#F7EAE0] border-[#1D4533]" : "bg-[#F7EAE0]/40 border-[#F9D2BA] text-[#5E3122] hover:bg-white"}`}>
                      <span className="font-black text-xs block">{preset.name}</span>
                      <span className="text-[9px] opacity-80 block truncate">{preset.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedSizePreset && (
              <div className="p-3.5 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] space-y-2">
                <div className="flex items-center justify-between border-b border-[#F9D2BA]/60 pb-1.5">
                  <span className="font-extrabold text-xs text-[#1D4533] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#5E3122]" />
                    <span>Technical Calibration ({selectedSizePreset.name})</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#1D4533]">{selectedSizePreset.digitalResolution} × {selectedSizePreset.digitalResolution} px</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#5E3122]">Use Case:</span>
                    <span className="font-semibold text-[#1D4533] leading-tight block">{selectedSizePreset.useCase}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#5E3122]">Min Print Dims:</span>
                    <span className="font-semibold text-[#1D4533] block">{selectedSizePreset.printDimensions}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#5E3122]">Quiet Zone:</span>
                    <span className="font-semibold text-[#1D4533] block">{selectedSizePreset.quietZone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. EXPORT FILE FORMAT */}
          <div className="bg-white p-8 rounded-3xl border border-[#F9D2BA] space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <FileDown className="w-4 h-4 text-[#5E3122]" />
              <span>4. Export File Format</span>
            </h3>
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#1D4533] uppercase tracking-wider block">Raster Bitmap Formats</span>
              <div className="grid grid-cols-3 gap-2">
                {[{ id: "png", label: "PNG", desc: "Lossless Raster with Alpha" }, { id: "jpg", label: "JPG", desc: "Compressed High-Contrast" }, { id: "bmp", label: "BMP", desc: "Uncompressed Industrial" }].map(fmt => (
                  <button key={fmt.id} type="button" onClick={() => { sound.playClick(); setSelectedFormat(fmt.id as ExportFormatType); }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${selectedFormat === fmt.id ? "bg-[#1D4533] border-[#1D4533] text-[#F7EAE0] shadow-md" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]"}`}>
                    <span className="font-extrabold text-xs block">{fmt.label}</span>
                    <span className="text-[8px] opacity-80 block">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#1D4533] uppercase tracking-wider block">Vector &amp; Print Formats</span>
              <div className="grid grid-cols-4 gap-2">
                {[{ id: "svg", label: "SVG", desc: "Scalable Vector" }, { id: "pdf", label: "PDF", desc: "Portable Document" }, { id: "eps", label: "EPS", desc: "PostScript Vector" }, { id: "ai", label: "AI", desc: "Adobe Illustrator" }].map(fmt => (
                  <button key={fmt.id} type="button" onClick={() => { sound.playClick(); setSelectedFormat(fmt.id as ExportFormatType); }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${selectedFormat === fmt.id ? "bg-[#1D4533] border-[#1D4533] text-[#F7EAE0] shadow-md" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]"}`}>
                    <span className="font-extrabold text-xs block">{fmt.label}</span>
                    <span className="text-[8px] opacity-80 block">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#1D4533] uppercase tracking-wider block">CAD &amp; Industrial Manufacturing</span>
              <button type="button" onClick={() => { sound.playClick(); setSelectedFormat("dxf"); }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${selectedFormat === "dxf" ? "bg-[#1D4533] border-[#1D4533] text-[#F7EAE0] shadow-md" : "bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]"}`}>
                <div>
                  <span className="font-extrabold text-xs block">DXF Vector (AutoCAD / Laser Cutting / CNC)</span>
                  <span className="text-[10px] opacity-80 block">Drawing Exchange Format for Laser &amp; CNC Engraving</span>
                </div>
                <Cpu className="w-5 h-5 shrink-0" />
              </button>
            </div>
            <div className="pt-4 border-t border-[#F9D2BA]">
              <button type="button" onClick={handleExecuteDownload} disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50">
                {isGenerating
                  ? <><RefreshCw className="w-5 h-5 animate-spin text-[#F9D2BA]" /><span>{generationStep}</span></>
                  : <><FileDown className="w-5 h-5 text-[#F9D2BA]" /><span>Generate &amp; Download {selectedFormat.toUpperCase()} ({downloadSize}px)</span></>}
              </button>
            </div>
          </div>

        </div>{/* end left col */}
      </div>{/* end desktop grid */}

    </div>
  );
};
