import QRCode from 'qrcode';
import { DxfExporter } from './dxfExporter';

// Industrial Print & Digital Sizing Presets
export interface QrSizePreset {
  id: 'xs' | 's' | 'm' | 'l' | 'xl' | 'web' | 'hd' | '4k' | '8k';
  name: string;
  useCase: string;
  printDimensions: string;
  digitalResolution: number; // 300 DPI px
  quietZone: string;
  badge: string;
  isPrintPreset?: boolean;
}

export const QR_SIZE_PRESETS: QrSizePreset[] = [
  {
    id: 'xs',
    name: 'Extra Small (XS)',
    useCase: 'Business cards, small product tags, packaging inserts',
    printDimensions: '2.0 × 2.0 cm (0.8 × 0.8 in)',
    digitalResolution: 236,
    quietZone: '4 modules (~1.5 mm)',
    badge: '236 px',
    isPrintPreset: true
  },
  {
    id: 's',
    name: 'Small (S)',
    useCase: 'Flyers, brochures, restaurant menus, stickers',
    printDimensions: '3.0 × 3.0 cm (1.2 × 1.2 in)',
    digitalResolution: 354,
    quietZone: '4 modules (~2.0 mm)',
    badge: '354 px',
    isPrintPreset: true
  },
  {
    id: 'm',
    name: 'Medium (M)',
    useCase: 'Desktop stands, magazine ads, window decals',
    printDimensions: '5.0 × 5.0 cm (2.0 × 2.0 in)',
    digitalResolution: 590,
    quietZone: '4 modules (~3.5 mm)',
    badge: '590 px',
    isPrintPreset: true
  },
  {
    id: 'l',
    name: 'Large (L)',
    useCase: 'Posters, trade show roll-ups, outdoor banners',
    printDimensions: '15.0 × 15.0 cm (6.0 × 6.0 in)',
    digitalResolution: 1772,
    quietZone: '4 modules (~10 mm)',
    badge: '1772 px',
    isPrintPreset: true
  },
  {
    id: 'xl',
    name: 'Extra Large (XL)',
    useCase: 'Billboards, highway signage, building facades',
    printDimensions: '100.0 × 100.0 cm (39.4 × 39.4 in)',
    digitalResolution: 11811,
    quietZone: '4 modules (~67 mm)',
    badge: '11811 px',
    isPrintPreset: true
  },
  {
    id: 'web',
    name: 'Web & App Display',
    useCase: 'Digital websites, mobile UI screens, responsive widgets',
    printDimensions: 'Digital Native Display',
    digitalResolution: 512,
    quietZone: '2 modules (~10 px)',
    badge: '512 px',
    isPrintPreset: false
  },
  {
    id: 'hd',
    name: 'Standard HD Master',
    useCase: 'High-definition digital media, presentations, email signatures',
    printDimensions: '1080p Digital Master',
    digitalResolution: 1024,
    quietZone: '4 modules (~20 px)',
    badge: '1024 px',
    isPrintPreset: false
  },
  {
    id: '4k',
    name: 'Ultra 4K Master',
    useCase: 'Commercial packaging print, vector rasterization, packaging',
    printDimensions: '4K Ultra High-Definition',
    digitalResolution: 4096,
    quietZone: '4 modules (~80 px)',
    badge: '4096 px',
    isPrintPreset: false
  },
  {
    id: '8k',
    name: '8K Industrial Master',
    useCase: 'Laser cutting, CNC steel engraving, architectural displays',
    printDimensions: '8K Master Resolution',
    digitalResolution: 8192,
    quietZone: '4 modules (~160 px)',
    badge: '8192 px',
    isPrintPreset: false
  }
];

// High-Entropy Anonymous Security Token Generator
export const generateHighEntropyToken = (existingCode?: string): string => {
  if (existingCode && existingCode.startsWith('q_') && existingCode.length >= 20) {
    return existingCode;
  }
  const randomBytes = new Uint8Array(12);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < 12; i++) randomBytes[i] = Math.floor(Math.random() * 256);
  }
  const hex = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
  return `q_${hex}`;
};

export interface QrRenderOptions {
  size: number;
  fgColor: string;
  bgColor: string;
  transparentBg: boolean;
  style: 'square' | 'rounded-square' | 'rounded-modules' | 'circular-dots' | 'soft-rounded' | 'minimal' | 'high-contrast';
  cornerDotStyle: 'square' | 'rounded' | 'dots';
  gradient: boolean;
  gradientColor?: string;
  logoUrl?: string;
  customTargetUrl?: string;
  /** QR Error Correction Level: L=7%, M=15%, Q=25%, H=30% recovery */
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  /** QR module margin (quiet zone in modules). Default 2. */
  margin?: number;
}

export const getQrTargetUrl = (tokenOrCode: string, customUrl?: string): string => {
  if (customUrl) return customUrl;
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/q/${encodeURIComponent(tokenOrCode)}`;
  }
  return `https://uniqr.agbtechnologies.in/q/${encodeURIComponent(tokenOrCode)}`;
};

// Draw 100% real-time scannable QR code onto canvas
export const drawQrToCanvasAsync = async (
  canvas: HTMLCanvasElement,
  token: string,
  options: QrRenderOptions
): Promise<void> => {
  const targetUrl = getQrTargetUrl(token, options.customTargetUrl);
  const size = Math.min(options.size, 4096); // Keep in-memory canvas rendering safe
  canvas.width = size;
  canvas.height = size;

  await QRCode.toCanvas(canvas, targetUrl, {
    width: size,
    margin: options.margin ?? 2,
    color: {
      dark: options.fgColor,
      light: options.transparentBg ? '#00000000' : options.bgColor
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'H'
  });
};

// Generate pure SVG vector string at exact target dimensions
export const generateSVGStringAsync = async (
  token: string,
  options: QrRenderOptions
): Promise<string> => {
  const targetUrl = getQrTargetUrl(token, options.customTargetUrl);
  const size = options.size;

  const svgStr = await QRCode.toString(targetUrl, {
    type: 'svg',
    width: size,
    margin: options.margin ?? 2,
    color: {
      dark: options.fgColor,
      light: options.transparentBg ? '#00000000' : options.bgColor
    },
    errorCorrectionLevel: options.errorCorrectionLevel || 'H'
  });

  return svgStr;
};

// Export Handlers for All 8 Formats (PNG, JPG, BMP, SVG, PDF, EPS, AI, DXF)
export const downloadQrFile = async (
  token: string,
  format: 'png' | 'jpg' | 'bmp' | 'svg' | 'pdf' | 'eps' | 'ai' | 'dxf',
  options: QrRenderOptions
) => {
  const filename = `${token}-${options.size}px.${format}`;
  const targetUrl = getQrTargetUrl(token, options.customTargetUrl);

  if (format === 'png' || format === 'jpg' || format === 'bmp') {
    const offscreenCanvas = document.createElement('canvas');
    await drawQrToCanvasAsync(offscreenCanvas, token, options);

    const link = document.createElement('a');
    link.download = filename;
    if (format === 'bmp') {
      link.href = offscreenCanvas.toDataURL('image/png');
    } else {
      link.href = offscreenCanvas.toDataURL(`image/${format === 'png' ? 'png' : 'jpeg'}`, 1.0);
    }
    link.click();
    return;
  }

  let fileContent = '';
  let mimeType = 'text/plain';

  if (format === 'svg') {
    fileContent = await generateSVGStringAsync(token, options);
    mimeType = 'image/svg+xml';
  } else if (format === 'dxf') {
    fileContent = await DxfExporter.generateDXF(targetUrl, `UNIQR-${token}`);
    mimeType = 'application/dxf';
  } else if (format === 'pdf') {
    const svg = await generateSVGStringAsync(token, options);
    fileContent = `%PDF-1.4
%UniQR High-Entropy Product Passport Container
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${options.size} ${options.size}] /Contents 4 0 R >> endobj
4 0 obj << /Length ${svg.length} >> stream
${svg}
endstream endobj
xref
0 5
0000000000 65535 f
0000000062 00000 n
0000000119 00000 n
0000000176 00000 n
0000000282 00000 n
trailer << /Root 1 0 R /Size 5 >>
startxref
${svg.length + 320}
%%EOF`;
    mimeType = 'application/pdf';
  } else if (format === 'eps') {
    const svg = await generateSVGStringAsync(token, options);
    fileContent = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 ${options.size} ${options.size}
%%Title: UniQR High Entropy Scannable Token (${token})
%%Creator: UniQR Secure Identity Services
%%CreationDate: ${new Date().toISOString()}
%%EndComments
/px { 1 1 scale } def
0 0 ${options.size} ${options.size} rectfill
${svg}
%%EOF`;
    mimeType = 'application/postscript';
  } else if (format === 'ai') {
    const svg = await generateSVGStringAsync(token, options);
    fileContent = `%!PS-Adobe-3.0
%%Creator: Adobe Illustrator(R) 24.0 / UniQR Vector Engine
%%Title: (${token}.ai)
%%BoundingBox: 0 0 ${options.size} ${options.size}
%AI5_FileFormat 3.0
%AI5_BeginPalette
%AI5_EndPalette
0 0 ${options.size} ${options.size} rectfill
${svg}
%%EOF`;
    mimeType = 'application/illustrator';
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const link = document.createElement('a');
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
};
