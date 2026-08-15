import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  Palette, 
  Sliders, 
  Image as ImageIcon, 
  RefreshCw, 
  Layers, 
  Check, 
  Zap,
  Cpu,
  FileCode,
  FileType,
  FileSpreadsheet,
  ShieldCheck,
  Lock,
  FileDown,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { Product, QrStylingConfig, QrStyleType } from '../../types';
import { sound } from '../../services/audio';
import { 
  drawQrToCanvasAsync, 
  downloadQrFile,
  getQrTargetUrl 
} from '../../services/qrExportEngine';

interface QrStudioProps {
  products: Product[];
  selectedProduct: Product | null;
  quotaUsed: number;
  quotaLimit: number;
  onGenerateSuccess: () => void;
  onOpenUpgrade: () => void;
}

export type ExportFormatType = 'png' | 'jpg' | 'bmp' | 'svg' | 'pdf' | 'eps' | 'ai' | 'dxf';

export const QrStudio: React.FC<QrStudioProps> = ({
  products,
  selectedProduct,
  quotaUsed,
  quotaLimit,
  onGenerateSuccess,
  onOpenUpgrade,
}) => {
  const [activeProduct, setActiveProduct] = useState<Product>(
    selectedProduct || products[0] || {
      id: 'prod-default',
      uniqrCode: 'UQR-PROD-000001',
      name: 'AGB HydroMax 500 Industrial Water Pump',
      sku: 'HM500-IND',
      brand: 'AGB Industrial Equipment Pvt. Ltd.',
      manufacturer: 'AGB Industrial Equipment Pvt. Ltd.',
      description: 'Flagship industrial water pump with tamper-evident digital identity passport.',
      category: 'Industrial Machinery',
      hsn: '84137010',
      gst: 18,
      batchNumber: 'BATCH-2026-HM500',
      serialNumber: 'HM500-2026-000847',
      mfgDate: '2026-07-12',
      expDate: '2036-07-12',
      warrantyMonths: 24,
      customFields: {},
      tags: [],
      location: 'Pune Plant Bay 4',
      supplier: 'AGB Industrial',
      status: 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      connectedApps: []
    }
  );

  // Exact resolution target code & live destination URL
  const qrCodeValue = activeProduct.uniqrCode || activeProduct.sku || activeProduct.id;
  const liveTargetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/q/${encodeURIComponent(qrCodeValue)}`
    : `https://uniqr.agbtechnologies.in/q/${encodeURIComponent(qrCodeValue)}`;

  const [styleConfig, setStyleConfig] = useState<QrStylingConfig>({
    fgColor: '#1D4533',
    bgColor: '#F7EAE0',
    transparentBg: false,
    style: 'rounded-modules',
    cornerDotStyle: 'rounded',
    errorCorrectionLevel: 'H',
    gradient: false,
    gradientColor: '#5E3122',
    borderPadding: 16,
    logoUrl: ''
  });

  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>('png');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setActiveProduct(selectedProduct);
    }
  }, [selectedProduct]);

  // Render 100% real-time camera scannable preview canvas at 300px with exact target product URL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawQrToCanvasAsync(canvas, qrCodeValue, {
      size: 300,
      fgColor: styleConfig.fgColor,
      bgColor: styleConfig.bgColor,
      transparentBg: styleConfig.transparentBg,
      style: styleConfig.style,
      cornerDotStyle: styleConfig.cornerDotStyle,
      gradient: styleConfig.gradient,
      gradientColor: styleConfig.gradientColor,
      logoUrl: styleConfig.logoUrl,
      customTargetUrl: liveTargetUrl
    });
  }, [styleConfig, activeProduct, qrCodeValue, liveTargetUrl]);

  const handleSimulatedGeneration = async (callback: () => Promise<void> | void) => {
    sound.playClick();
    setIsGenerating(true);

    const steps = [
      '1/4 Resolving Permanent Identity Record...',
      '2/4 Encoding Target Cryptographic Route...',
      '3/4 Formatting Multi-Layer Geometry...',
      '4/4 Locking QR Payload...'
    ];

    let currentStep = 0;
    const interval = setInterval(async () => {
      if (currentStep < steps.length) {
        setGenerationStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        onGenerateSuccess();
        await callback();
      }
    }, 180);
  };

  const handleExecuteDownload = () => {
    const isLockedSize = downloadSize === 256 || downloadSize === 8192;
    if (isLockedSize) {
      onOpenUpgrade();
      return;
    }

    handleSimulatedGeneration(async () => {
      await downloadQrFile(qrCodeValue, selectedFormat, {
        size: downloadSize,
        fgColor: styleConfig.fgColor,
        bgColor: styleConfig.bgColor,
        transparentBg: styleConfig.transparentBg,
        style: styleConfig.style,
        cornerDotStyle: styleConfig.cornerDotStyle,
        gradient: styleConfig.gradient,
        gradientColor: styleConfig.gradientColor,
        logoUrl: styleConfig.logoUrl,
        customTargetUrl: liveTargetUrl
      });
    });
  };

  return (
    <div className="space-y-8 pb-12 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#1D4533] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
            <span>Universal QR &amp; Vector Studio</span>
          </div>
          <h1 className="text-3xl font-black text-[#1D4533]">
            Dynamic QR &amp; Vector Studio
          </h1>
          <p className="text-xs text-[#5E3122] font-semibold">
            All export settings under Target Product card. Real-time camera scannable identity tokens with direct passport resolution.
          </p>
        </div>

        <div className="p-3 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] text-right">
          <span className="block text-[10px] text-[#5E3122] font-bold uppercase">Active Entity Code</span>
          <strong className="font-mono text-xs text-[#1D4533]">{qrCodeValue}</strong>
        </div>
      </div>

      {/* 2 COL WORKSPACE: LEFT ALL SETTINGS (7 COLS), RIGHT PREVIEW & DOWNLOAD (5 COLS) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ALL SETTINGS UNDER PRODUCT SELECTION CARD (7 COLS) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] space-y-6 shadow-sm">
          
          {/* PRODUCT SELECTION CARD HEADER */}
          <div>
            <label className="block text-xs font-extrabold text-[#1D4533] mb-2 uppercase tracking-wider">
              Select Target Product / Entity Identity
            </label>
            <select
              value={activeProduct.id}
              onChange={(e) => {
                sound.playClick();
                const found = products.find(p => p.id === e.target.value);
                if (found) setActiveProduct(found);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku || p.uniqrCode})
                </option>
              ))}
            </select>
          </div>

          {/* COLOR & MODULE GEOMETRY */}
          <div className="space-y-4 pt-2 border-t border-[#F9D2BA]">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#5E3122]" />
              <span>1. Aesthetic Colors &amp; Module Geometry</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#5E3122] mb-1">Foreground</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleConfig.fgColor}
                    onChange={(e) => setStyleConfig(prev => ({ ...prev, fgColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-[#F9D2BA] bg-transparent"
                  />
                  <span className="font-mono text-xs text-[#1D4533] font-bold">{styleConfig.fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5E3122] mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={styleConfig.transparentBg}
                    value={styleConfig.bgColor}
                    onChange={(e) => setStyleConfig(prev => ({ ...prev, bgColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-[#F9D2BA] bg-transparent disabled:opacity-30"
                  />
                  <span className="font-mono text-xs text-[#1D4533] font-bold">{styleConfig.bgColor}</span>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-between p-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA]">
                <span className="text-xs font-bold text-[#1D4533]">Transparent BG</span>
                <input
                  type="checkbox"
                  checked={styleConfig.transparentBg}
                  onChange={(e) => setStyleConfig(prev => ({ ...prev, transparentBg: e.target.checked }))}
                  className="w-4 h-4 rounded text-[#1D4533]"
                />
              </div>
            </div>

            {/* MODULE SHAPE SELECTOR */}
            <div>
              <label className="block text-[11px] font-bold text-[#5E3122] mb-2">Module Geometry</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[
                  { id: 'rounded-modules', label: 'Rounded Modules' },
                  { id: 'square', label: 'Standard Square' },
                  { id: 'circular-dots', label: 'Circular Dots' },
                  { id: 'soft-rounded', label: 'Soft Rounded' },
                  { id: 'high-contrast', label: 'High Contrast' },
                  { id: 'minimal', label: 'Minimalist' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      sound.playClick();
                      setStyleConfig(prev => ({ ...prev, style: st.id as any }));
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-bold ${
                      styleConfig.style === st.id
                        ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-xs'
                        : 'bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CORNER EYE STYLES */}
            <div>
              <label className="block text-[11px] font-bold text-[#5E3122] mb-2">Corner Finder Eyes</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rounded', label: 'Rounded Eyes' },
                  { id: 'square', label: 'Square Eyes' },
                  { id: 'dots', label: 'Dot Cluster Eyes' }
                ].map((eye) => (
                  <button
                    key={eye.id}
                    onClick={() => {
                      sound.playClick();
                      setStyleConfig(prev => ({ ...prev, cornerDotStyle: eye.id as any }));
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-bold ${
                      styleConfig.cornerDotStyle === eye.id
                        ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-xs'
                        : 'bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                    }`}
                  >
                    {eye.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RESOLUTION & SIZE SELECTOR */}
          <div className="space-y-3 pt-4 border-t border-[#F9D2BA]">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#5E3122]" />
              <span>2. Output Resolution</span>
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { size: 512, label: '512 px', tag: 'Web & App' },
                { size: 1024, label: '1024 px', tag: 'Standard' },
                { size: 2048, label: '2048 px', tag: 'High-Res Print' },
                { size: 4096, label: '4096 px', tag: 'Ultra Pack' },
                { size: 8192, label: '8192 px', tag: 'Laser Engrave' }
              ].map((res) => (
                <button
                  key={res.size}
                  onClick={() => {
                    sound.playClick();
                    setDownloadSize(res.size);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    downloadSize === res.size
                      ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm'
                      : 'bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                  }`}
                >
                  <span className="font-black text-xs block">{res.label}</span>
                  <span className="text-[9px] font-medium opacity-80 block truncate">{res.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* EXPORT FORMATS MATRIX */}
          <div className="space-y-4 pt-4 border-t border-[#F9D2BA]">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <FileDown className="w-4 h-4 text-[#5E3122]" />
              <span>3. Export File Format</span>
            </h3>

            {/* CATEGORY 1: RASTER */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#1D4533] uppercase tracking-wider block">
                1. Raster Bitmap Formats
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'png', label: 'PNG', desc: 'Lossless Raster with Alpha' },
                  { id: 'jpg', label: 'JPG', desc: 'Compressed High-Contrast' },
                  { id: 'bmp', label: 'BMP', desc: 'Uncompressed Industrial' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedFormat(fmt.id as any);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      selectedFormat === fmt.id
                        ? 'bg-[#1D4533] border-[#1D4533] text-[#F7EAE0] shadow-md'
                        : 'bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]'
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{fmt.label}</span>
                    <span className="text-[8px] font-medium opacity-80 block truncate">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY 2: VECTOR */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#1D4533] uppercase tracking-wider block">
                2. Vector &amp; Print Formats
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'svg', label: 'SVG', desc: 'Scalable Vector' },
                  { id: 'pdf', label: 'PDF', desc: 'Portable Document' },
                  { id: 'eps', label: 'EPS', desc: 'PostScript Vector' },
                  { id: 'ai', label: 'AI', desc: 'Adobe Illustrator' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedFormat(fmt.id as any);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      selectedFormat === fmt.id
                        ? 'bg-[#1D4533] border-[#1D4533] text-[#F7EAE0] shadow-md'
                        : 'bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]'
                    }`}
                  >
                    <span className="font-extrabold text-xs block">{fmt.label}</span>
                    <span className="text-[8px] font-medium opacity-80 block truncate">{fmt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CATEGORY 3: CAD & INDUSTRIAL */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#1D4533] uppercase tracking-wider block">
                3. CAD &amp; Industrial Manufacturing
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedFormat('dxf');
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedFormat === 'dxf'
                    ? 'bg-[#1D4533] border-[#1D4533] text-[#F7EAE0] shadow-md'
                    : 'bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122] hover:bg-[#F9D2BA]'
                }`}
              >
                <div>
                  <span className="font-extrabold text-xs block">DXF Vector (AutoCAD / Laser Cutting / CNC)</span>
                  <span className="text-[10px] font-medium opacity-80 block">Drawing Exchange Format for Laser &amp; CNC Engraving</span>
                </div>
                <Cpu className="w-5 h-5 shrink-0" />
              </button>
            </div>

          </div>

          {/* UNIFIED GENERATE & DOWNLOAD BUTTON (INSIDE LEFT CARD) */}
          <div className="pt-4 border-t border-[#F9D2BA]">
            <button
              onClick={handleExecuteDownload}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-[#F9D2BA]" />
                  <span>{generationStep}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-5 h-5 text-[#F9D2BA]" />
                  <span>Generate &amp; Download {selectedFormat.toUpperCase()} ({downloadSize}px)</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: HIGH-RES LIVE PREVIEW & DOWNLOAD BUTTON BELOW QR (5 COLS) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] space-y-6 shadow-sm sticky top-24">
          
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-3">
            <h3 className="font-extrabold text-lg text-[#1D4533]">UniQR Live Scannable Preview</h3>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] truncate max-w-[160px]">
              {qrCodeValue}
            </span>
          </div>

          {/* Floating Live Scannable Canvas Card */}
          <div className="bg-[#F7EAE0] p-6 rounded-2xl border border-[#F9D2BA] flex flex-col items-center justify-center text-center shadow-sm">
            <canvas
              ref={canvasRef}
              className="w-64 h-64 max-w-full rounded-2xl border border-[#F9D2BA] shadow-md transition-transform duration-300 hover:scale-105"
            />
            
            {/* Live Camera Scannable Target URL */}
            <div className="mt-4 p-3.5 bg-white rounded-2xl border border-[#F9D2BA] text-center w-full shadow-sm space-y-2">
              <span className="block text-[9px] font-extrabold text-[#5E3122] uppercase tracking-wider">
                Real-Time Scannable Target Destination:
              </span>
              <p className="text-[11px] font-mono text-[#1D4533] font-black truncate select-all bg-[#F7EAE0]/60 px-2 py-1 rounded-lg">
                {liveTargetUrl}
              </p>
              <a
                href={`/q/${encodeURIComponent(qrCodeValue)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4533] hover:bg-[#5E3122] text-[#F9D2BA] rounded-xl text-[11px] font-extrabold transition-all shadow-xs"
              >
                <span>🔍 Open Live Scanned Passport</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* PROMINENT DOWNLOAD BUTTON DIRECTLY BELOW QR IN STUDIO */}
          <button
            onClick={handleExecuteDownload}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-[#F9D2BA]" />
                <span>{generationStep}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5 text-[#F9D2BA]" />
                <span>Download {selectedFormat.toUpperCase()} QR Code ({downloadSize}px)</span>
              </>
            )}
          </button>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>100% Camera Scannable (iOS, Android &amp; Google Lens)</span>
          </div>

        </div>

      </div>

    </div>
  );
};
