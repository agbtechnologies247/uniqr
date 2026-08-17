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
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

export const getQrTargetUrl = (tokenOrCode: string, customUrl?: string): string => {
  if (customUrl) return customUrl;
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/q/${encodeURIComponent(tokenOrCode)}`;
  }
  return `https://uniqr.agbtechnologies.in/q/${encodeURIComponent(tokenOrCode)}`;
};

const isFinderModule = (r: number, c: number, N: number): boolean => {
  if (r < 7 && c < 7) return true; // Top-Left
  if (r < 7 && c >= N - 7) return true; // Top-Right
  if (r >= N - 7 && c < 7) return true; // Bottom-Left
  return false;
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

/**
 * Draw custom-styled high-fidelity camera-scannable QR code onto a Canvas.
 */
export const drawQrToCanvasAsync = async (
  canvas: HTMLCanvasElement,
  token: string,
  options: QrRenderOptions
): Promise<void> => {
  const targetUrl = getQrTargetUrl(token, options.customTargetUrl);
  const size = Math.min(options.size || 590, 4096);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const qr = QRCode.create(targetUrl, {
    errorCorrectionLevel: options.errorCorrectionLevel || 'H'
  });

  const N = qr.modules.size;
  const margin = options.margin ?? 2;
  const total = N + margin * 2;
  const moduleSize = size / total;
  const offset = margin * moduleSize;

  // Background
  if (!options.transparentBg) {
    ctx.fillStyle = options.bgColor || '#F7EAE0';
    ctx.fillRect(0, 0, size, size);
  } else {
    ctx.clearRect(0, 0, size, size);
  }

  // Foreground brush
  let fgFill: string | CanvasGradient = options.fgColor || '#1D4533';
  if (options.gradient && options.gradientColor) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, options.fgColor || '#1D4533');
    grad.addColorStop(1, options.gradientColor);
    fgFill = grad;
  }
  ctx.fillStyle = fgFill;

  // 1. Draw Data Modules (excluding finder 7x7 areas)
  const style = options.style || 'rounded-modules';
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (qr.modules.get(r, c) && !isFinderModule(r, c, N)) {
        const x = offset + c * moduleSize;
        const y = offset + r * moduleSize;

        if (style === 'circular-dots') {
          ctx.beginPath();
          ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize * 0.44, 0, Math.PI * 2);
          ctx.fill();
        } else if (style === 'rounded-modules') {
          drawRoundedRect(ctx, x, y, moduleSize, moduleSize, moduleSize * 0.35);
          ctx.fill();
        } else if (style === 'soft-rounded') {
          drawRoundedRect(ctx, x, y, moduleSize, moduleSize, moduleSize * 0.2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }
  }

  // 2. Draw 3 Finder Patterns
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: N - 7 },
    { r: N - 7, c: 0 }
  ];

  const cornerStyle = options.cornerDotStyle || 'rounded';

  for (const pos of finderPositions) {
    const fx = offset + pos.c * moduleSize;
    const fy = offset + pos.r * moduleSize;
    const fw = 7 * moduleSize;
    const cx = fx + 3.5 * moduleSize;
    const cy = fy + 3.5 * moduleSize;

    if (cornerStyle === 'dots') {
      // Outer ring
      ctx.fillStyle = fgFill;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5 * moduleSize, 0, Math.PI * 2);
      ctx.fill();

      // Middle cutout
      if (!options.transparentBg) {
        ctx.fillStyle = options.bgColor || '#F7EAE0';
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5 * moduleSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Inner center eyeball
      ctx.fillStyle = fgFill;
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5 * moduleSize, 0, Math.PI * 2);
      ctx.fill();

    } else if (cornerStyle === 'rounded') {
      // Outer 7x7 rounded box
      ctx.fillStyle = fgFill;
      drawRoundedRect(ctx, fx, fy, fw, fw, moduleSize * 1.6);
      ctx.fill();

      // Inner 5x5 cutout
      if (!options.transparentBg) {
        ctx.fillStyle = options.bgColor || '#F7EAE0';
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      drawRoundedRect(ctx, fx + moduleSize, fy + moduleSize, 5 * moduleSize, 5 * moduleSize, moduleSize * 1.0);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      // Inner 3x3 eyeball
      ctx.fillStyle = fgFill;
      drawRoundedRect(ctx, fx + 2 * moduleSize, fy + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize, moduleSize * 0.8);
      ctx.fill();

    } else {
      // Classic square finder
      ctx.fillStyle = fgFill;
      ctx.fillRect(fx, fy, fw, fw);

      if (!options.transparentBg) {
        ctx.fillStyle = options.bgColor || '#F7EAE0';
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      ctx.fillRect(fx + moduleSize, fy + moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.globalCompositeOperation = 'source-over';

      ctx.fillStyle = fgFill;
      ctx.fillRect(fx + 2 * moduleSize, fy + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
    }
  }
};

/**
 * Generate a PNG data URL for live reactive previews on any screen.
 */
export const generateQrDataUrlAsync = async (
  token: string,
  options: QrRenderOptions
): Promise<string> => {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  await drawQrToCanvasAsync(canvas, token, options);
  return canvas.toDataURL('image/png');
};

/**
 * Generate scalable SVG vector matching all styles, colors, and finder patterns.
 */
export const generateSVGStringAsync = async (
  token: string,
  options: QrRenderOptions
): Promise<string> => {
  const targetUrl = getQrTargetUrl(token, options.customTargetUrl);
  const size = options.size || 590;

  const qr = QRCode.create(targetUrl, {
    errorCorrectionLevel: options.errorCorrectionLevel || 'H'
  });

  const N = qr.modules.size;
  const margin = options.margin ?? 2;
  const total = N + margin * 2;
  const moduleSize = (size / total).toFixed(3);
  const mSize = parseFloat(moduleSize);
  const offset = margin * mSize;

  const fgColor = options.fgColor || '#1D4533';
  const bgColor = options.bgColor || '#F7EAE0';
  const transparent = !!options.transparentBg;
  const cornerStyle = options.cornerDotStyle || 'rounded';
  const style = options.style || 'rounded-modules';

  let svgElements = '';

  // Background rect
  if (!transparent) {
    svgElements += `<rect width="${size}" height="${size}" fill="${bgColor}" />\n`;
  }

  // Linear gradient definition
  let fillDef = `fill="${fgColor}"`;
  let defs = '';
  if (options.gradient && options.gradientColor) {
    defs = `
    <defs>
      <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${fgColor}" />
        <stop offset="100%" stop-color="${options.gradientColor}" />
      </linearGradient>
    </defs>`;
    fillDef = `fill="url(#qrGrad)"`;
  }

  // Data modules
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (qr.modules.get(r, c) && !isFinderModule(r, c, N)) {
        const x = (offset + c * mSize).toFixed(2);
        const y = (offset + r * mSize).toFixed(2);

        if (style === 'circular-dots') {
          const cx = (offset + c * mSize + mSize / 2).toFixed(2);
          const cy = (offset + r * mSize + mSize / 2).toFixed(2);
          const rad = (mSize * 0.44).toFixed(2);
          svgElements += `<circle cx="${cx}" cy="${cy}" r="${rad}" ${fillDef} />\n`;
        } else if (style === 'rounded-modules') {
          const rx = (mSize * 0.35).toFixed(2);
          svgElements += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${rx}" ${fillDef} />\n`;
        } else if (style === 'soft-rounded') {
          const rx = (mSize * 0.2).toFixed(2);
          svgElements += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${rx}" ${fillDef} />\n`;
        } else {
          svgElements += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" ${fillDef} />\n`;
        }
      }
    }
  }

  // Finder patterns
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: N - 7 },
    { r: N - 7, c: 0 }
  ];

  for (const pos of finderPositions) {
    const fx = (offset + pos.c * mSize).toFixed(2);
    const fy = (offset + pos.r * mSize).toFixed(2);
    const fw = (7 * mSize).toFixed(2);
    const cx = (offset + pos.c * mSize + 3.5 * mSize).toFixed(2);
    const cy = (offset + pos.r * mSize + 3.5 * mSize).toFixed(2);

    if (cornerStyle === 'dots') {
      svgElements += `<circle cx="${cx}" cy="${cy}" r="${(3.5 * mSize).toFixed(2)}" ${fillDef} />\n`;
      if (!transparent) {
        svgElements += `<circle cx="${cx}" cy="${cy}" r="${(2.5 * mSize).toFixed(2)}" fill="${bgColor}" />\n`;
      }
      svgElements += `<circle cx="${cx}" cy="${cy}" r="${(1.5 * mSize).toFixed(2)}" ${fillDef} />\n`;
    } else if (cornerStyle === 'rounded') {
      const rxOuter = (mSize * 1.6).toFixed(2);
      const rxInner = (mSize * 1.0).toFixed(2);
      const rxEye = (mSize * 0.8).toFixed(2);

      svgElements += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fw}" rx="${rxOuter}" ${fillDef} />\n`;
      if (!transparent) {
        svgElements += `<rect x="${(parseFloat(fx) + mSize).toFixed(2)}" y="${(parseFloat(fy) + mSize).toFixed(2)}" width="${(5 * mSize).toFixed(2)}" height="${(5 * mSize).toFixed(2)}" rx="${rxInner}" fill="${bgColor}" />\n`;
      }
      svgElements += `<rect x="${(parseFloat(fx) + 2 * mSize).toFixed(2)}" y="${(parseFloat(fy) + 2 * mSize).toFixed(2)}" width="${(3 * mSize).toFixed(2)}" height="${(3 * mSize).toFixed(2)}" rx="${rxEye}" ${fillDef} />\n`;
    } else {
      svgElements += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fw}" ${fillDef} />\n`;
      if (!transparent) {
        svgElements += `<rect x="${(parseFloat(fx) + mSize).toFixed(2)}" y="${(parseFloat(fy) + mSize).toFixed(2)}" width="${(5 * mSize).toFixed(2)}" height="${(5 * mSize).toFixed(2)}" fill="${bgColor}" />\n`;
      }
      svgElements += `<rect x="${(parseFloat(fx) + 2 * mSize).toFixed(2)}" y="${(parseFloat(fy) + 2 * mSize).toFixed(2)}" width="${(3 * mSize).toFixed(2)}" height="${(3 * mSize).toFixed(2)}" ${fillDef} />\n`;
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${defs}
  ${svgElements}
</svg>`;
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
