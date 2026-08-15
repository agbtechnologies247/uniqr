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
  QrCode,
  Printer,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Product, QrStylingConfig, QrStyleType } from '../../types';
import { sound } from '../../services/audio';
import { 
  drawQrToCanvasAsync, 
  downloadQrFile,
  getQrTargetUrl,
  QR_SIZE_PRESETS,
  QrSizePreset
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
      mfgDate: '2026-05-12',
      expDate: '2031-05-12',
      warrantyMonths: 36,
      batchNumber: 'HM500-2026-X8',
      serialNumber: 'SN-HM500-88192',
      createdAt: '2026-05-12T00:00:00Z',
      updatedAt: '2026-05-12T00:00:00Z',
      metadata: {
        'Motor Power': '5.5 HP (4.0 kW)',
        'Impeller Material': 'Stainless Steel 316',
        'Max Flow Rate': '1200 LPM',
        'IP Rating': 'IP68 Submersible'
      }
    }
  );

  const qrCodeValue = activeProduct.uniqrCode || activeProduct.id;
  const liveTargetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/q/${encodeURIComponent(qrCodeValue)}`
    : `https://uniqr.agbtechnologies.in/q/${encodeURIComponent(qrCodeValue)}`;

  const [styleConfig, setStyleConfig] = useState<QrStylingConfig>({
    fgColor: '#1D4533',
    bgColor: '#F7EAE0',
    transparentBg: false,
    style: 'rounded-modules',
    cornerDotStyle: 'rounded',
    gradient: false,
    gradientColor: '#5E3122',
    borderPadding: 16,
    logoUrl: ''
  });

  const [selectedSizePreset, setSelectedSizePreset] = useState<QrSizePreset>(QR_SIZE_PRESETS[2]); // Default Medium (M) 590px
  const [downloadSize, setDownloadSize] = useState<number>(590);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatType>('png');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setActiveProduct(selectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawQrToCanvasAsync(canvas, qrCodeValue, {
      size: Math.min(downloadSize, 2048),
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
  }, [styleConfig, activeProduct, qrCodeValue, liveTargetUrl, downloadSize]);

  // Dynamic visual sizing helper for live canvas container
  const getVisualDimension = () => {
    if (downloadSize <= 236) return { percentage: '55%', label: 'XS (236px)' };
    if (downloadSize <= 354) return { percentage: '70%', label: 'S (354px)' };
    if (downloadSize <= 590) return { percentage: '85%', label: 'M (590px)' };
    if (downloadSize <= 1772) return { percentage: '95%', label: 'L (1772px)' };
    return { percentage: '100%', label: 'XL Master (Industrial)' };
  };

  const visualDim = getVisualDimension();

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
    }, 150);
  };

  const handleExecuteDownload = () => {
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
    <div className="space-y-4 sm:space-y-6 pb-24 md:pb-12 selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      {/* HEADER (COMPACT ON MOBILE) */}
      <div className="bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-0.5 sm:space-y-1.5">
          <div className="flex items-center gap-1.5 text-[#1D4533] font-bold text-[10px] sm:text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F9D2BA]" />
            <span>QR &amp; Vector Studio</span>
          </div>
          <h1 className="text-lg sm:text-3xl font-black text-[#1D4533]">
            QR Studio
          </h1>
          <p className="text-[11px] sm:text-xs text-[#5E3122] font-semibold hidden sm:block">
            Real-time camera scannable identity tokens with 300 DPI industrial print calibrations and vector export.
          </p>
        </div>

        <div className="p-2 sm:p-3 bg-[#F7EAE0] rounded-lg sm:rounded-2xl border border-[#F9D2BA] text-left md:text-right flex md:flex-col justify-between items-center md:items-end">
          <span className="block text-[9px] sm:text-[10px] text-[#5E3122] font-bold uppercase">Active Token:</span>
          <strong className="font-mono text-[11px] sm:text-xs text-[#1D4533]">{qrCodeValue}</strong>
        </div>
      </div>

      {/* 2 COL WORKSPACE: ON MOBILE PREVIEW IS TOP (ORDER-1), SETTINGS ARE BELOW (ORDER-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
        
        {/* RIGHT COLUMN ON DESKTOP / TOP COLUMN ON MOBILE: LIVE PREVIEW & DOWNLOAD */}
        <div className="order-1 lg:order-2 lg:col-span-5 bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] space-y-3.5 sm:space-y-5 shadow-sm lg:sticky lg:top-20">
          
          <div className="flex items-center justify-between border-b border-[#F9D2BA] pb-2.5">
            <div className="flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-[#1D4533]" />
              <h3 className="font-extrabold text-sm sm:text-lg text-[#1D4533]">Scannable QR Preview</h3>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1D4533] text-[#F7EAE0] truncate max-w-[130px]">
              {qrCodeValue}
            </span>
          </div>

          {/* Floating Live Scannable Canvas Card with Dynamic Visual Sizing */}
          <div className="bg-[#F7EAE0] p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#F9D2BA] flex flex-col items-center justify-center text-center shadow-sm overflow-hidden">
            <div className="w-full max-w-[240px] sm:max-w-[280px] aspect-square flex items-center justify-center p-1 sm:p-2 mx-auto">
              <div 
                style={{ width: visualDim.percentage, height: visualDim.percentage }}
                className="max-w-full max-h-full aspect-square transition-all duration-300 flex items-center justify-center"
              >
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', aspectRatio: '1 / 1' }}
                  className="rounded-xl sm:rounded-2xl border-2 border-[#1D4533] shadow-md object-contain bg-white block"
                />
              </div>
            </div>
            
            {/* Live Size & Dimension Badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] text-[10px] font-mono font-black shadow-xs">
              <Sliders className="w-3 h-3 text-[#F9D2BA]" />
              <span>Canvas: {downloadSize} × {downloadSize} px</span>
              {selectedSizePreset && <span className="opacity-80">({selectedSizePreset.name.split(' ')[0]})</span>}
            </div>

            {/* Live Camera Scannable Target URL */}
            <div className="mt-3 p-2.5 sm:p-3 bg-white rounded-xl sm:rounded-2xl border border-[#F9D2BA] text-center w-full shadow-sm space-y-1.5">
              <span className="block text-[9px] font-extrabold text-[#5E3122] uppercase tracking-wider">
                Destination URL:
              </span>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#1D4533] font-black truncate select-all bg-[#F7EAE0]/60 px-2 py-0.5 rounded-lg">
                {liveTargetUrl}
              </p>
              <a
                href={`/q/${encodeURIComponent(qrCodeValue)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1D4533] hover:bg-[#5E3122] text-[#F9D2BA] rounded-xl text-[10px] sm:text-[11px] font-extrabold transition-all shadow-xs"
              >
                <span>🔍 Open Passport</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* PROMINENT DOWNLOAD BUTTON DIRECTLY BELOW QR IN STUDIO */}
          <button
            type="button"
            onClick={handleExecuteDownload}
            disabled={isGenerating}
            className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#5E3122] hover:bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#F9D2BA]" />
                <span>{generationStep}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#F9D2BA]" />
                <span>Download {selectedFormat.toUpperCase()} ({downloadSize}px)</span>
              </>
            )}
          </button>

          <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-200 text-[11px] font-semibold text-emerald-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Camera Scannable (iOS, Android &amp; Lens)</span>
          </div>

        </div>

        {/* LEFT COLUMN ON DESKTOP / BOTTOM COLUMN ON MOBILE: ALL SETTINGS (7 COLS) */}
        <div className="order-2 lg:order-1 lg:col-span-7 bg-white p-3.5 sm:p-6 sm:p-8 rounded-xl sm:rounded-3xl border border-[#F9D2BA] space-y-4 sm:space-y-6 shadow-sm">
          
          {/* PRODUCT SELECTION CARD HEADER */}
          <div>
            <label className="block text-xs font-extrabold text-[#1D4533] mb-1.5 uppercase tracking-wider">
              Select Target Entity Identity
            </label>
            <select
              value={activeProduct.id}
              onChange={(e) => {
                sound.playClick();
                const found = products.find(p => p.id === e.target.value);
                if (found) setActiveProduct(found);
              }}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#1D4533] font-extrabold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku || p.uniqrCode})
                </option>
              ))}
            </select>
          </div>

          {/* PALETTE & COLOR STYLES */}
          <div className="space-y-4 pt-4 border-t border-[#F9D2BA]">
            <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#5E3122]" />
              <span>1. Aesthetic &amp; Colors</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'UniQR Forest', fg: '#1D4533', bg: '#F7EAE0' },
                { name: 'Obsidian Dark', fg: '#0F172A', bg: '#F8FAFC' },
                { name: 'Warm Espresso', fg: '#5E3122', bg: '#F9D2BA' },
                { name: 'Clean Mono', fg: '#000000', bg: '#FFFFFF' }
              ].map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setStyleConfig(prev => ({
                      ...prev,
                      fgColor: theme.fg,
                      bgColor: theme.bg,
                      transparentBg: false
                    }));
                  }}
                  className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center gap-2 ${
                    styleConfig.fgColor === theme.fg && styleConfig.bgColor === theme.bg
                      ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm'
                      : 'bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0" 
                    style={{ backgroundColor: theme.fg }}
                  />
                  <span className="text-[11px] font-bold truncate">{theme.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#5E3122]">
                <input
                  type="checkbox"
                  checked={styleConfig.transparentBg}
                  onChange={(e) => {
                    sound.playClick();
                    setStyleConfig(prev => ({ ...prev, transparentBg: e.target.checked }));
                  }}
                  className="rounded border-[#F9D2BA] text-[#1D4533] focus:ring-[#1D4533]"
                />
                <span>Transparent Background (Alpha PNG / SVG)</span>
              </label>
            </div>
          </div>

          {/* SIZING PRESETS (INDUSTRIAL PRINT 300 DPI + DIGITAL MASTER) */}
          <div className="space-y-4 pt-4 border-t border-[#F9D2BA]">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#1D4533] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#5E3122]" />
                <span>2. Print &amp; Digital Size Presets</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-[#F9D2BA] text-[#1D4533] px-2 py-0.5 rounded-full">
                300 DPI Calibrated
              </span>
            </div>

            {/* Industrial Print Presets Category */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold text-[#5E3122] uppercase tracking-wider flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#1D4533]" />
                <span>Physical Print Presets (300 DPI):</span>
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {QR_SIZE_PRESETS.filter(p => p.isPrintPreset).map((preset) => {
                  const isSelected = downloadSize === preset.digitalResolution;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDownloadSize(preset.digitalResolution);
                        setSelectedSizePreset(preset);
                      }}
                      className={`p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-md ring-2 ring-[#F9D2BA]'
                          : 'bg-[#F7EAE0]/50 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs block">{preset.name.split(' ')[0]}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-[#F9D2BA] text-[#1D4533]' : 'bg-[#1D4533]/10 text-[#1D4533]'
                        }`}>
                          {preset.badge}
                        </span>
                      </div>
                      <span className="text-[9px] font-medium opacity-85 block truncate mt-1">
                        {preset.printDimensions.split('(')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Digital Screen Resolution Presets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold text-[#5E3122] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#1D4533]" />
                <span>Digital Master Resolutions:</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QR_SIZE_PRESETS.filter(p => !p.isPrintPreset).map((preset) => {
                  const isSelected = downloadSize === preset.digitalResolution;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDownloadSize(preset.digitalResolution);
                        setSelectedSizePreset(preset);
                      }}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#1D4533] text-[#F7EAE0] border-[#1D4533] shadow-sm'
                          : 'bg-[#F7EAE0]/40 border-[#F9D2BA] text-[#5E3122] hover:bg-white'
                      }`}
                    >
                      <span className="font-black text-xs block">{preset.name}</span>
                      <span className="text-[9px] font-medium opacity-80 block truncate">{preset.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Preset Technical Specification Card */}
            {selectedSizePreset && (
              <div className="p-3.5 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#F9D2BA]/60 pb-1.5">
                  <span className="font-extrabold text-[#1D4533] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#5E3122]" />
                    <span>Technical Calibration Specification ({selectedSizePreset.name})</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#1D4533]">
                    {selectedSizePreset.digitalResolution} × {selectedSizePreset.digitalResolution} px
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#5E3122]">Target Use Case:</span>
                    <span className="font-semibold text-[#1D4533] leading-tight block">{selectedSizePreset.useCase}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#5E3122]">Min Print Dimensions:</span>
                    <span className="font-semibold text-[#1D4533] block">{selectedSizePreset.printDimensions}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase text-[#5E3122]">Quiet Zone Margin:</span>
                    <span className="font-semibold text-[#1D4533] block">{selectedSizePreset.quietZone}</span>
                  </div>
                </div>
              </div>
            )}
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
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedFormat(fmt.id as any);
                    }}
                    className={`p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'svg', label: 'SVG', desc: 'Scalable Vector' },
                  { id: 'pdf', label: 'PDF', desc: 'Portable Document' },
                  { id: 'eps', label: 'EPS', desc: 'PostScript Vector' },
                  { id: 'ai', label: 'AI', desc: 'Adobe Illustrator' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedFormat(fmt.id as any);
                    }}
                    className={`p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all ${
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
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedFormat('dxf');
                }}
                className={`w-full p-3 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center justify-between ${
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
              type="button"
              onClick={handleExecuteDownload}
              disabled={isGenerating}
              className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all disabled:opacity-50"
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

      </div>

    </div>
  );
};
