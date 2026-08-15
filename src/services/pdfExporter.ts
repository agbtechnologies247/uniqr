import { Product, QrStylingConfig } from '../types';
import { QrEngine } from './qrEngine';

export class PdfExporter {
  /**
   * Generates a printable A4 SVG grid layout containing sticker label cards for the given product QR
   */
  static async generatePrintableStickerSheetSVG(
    product: Product,
    config: QrStylingConfig,
    rows: number = 5,
    cols: number = 3
  ): Promise<string> {
    const qrSvg = await QrEngine.generateSVG(product.uniqrCode, config, 140);
    const totalLabels = rows * cols;
    const pageWidth = 794; // ~A4 width @ 96DPI
    const pageHeight = 1123; // ~A4 height @ 96DPI

    const marginX = 40;
    const marginY = 50;
    const labelWidth = (pageWidth - marginX * 2 - (cols - 1) * 15) / cols;
    const labelHeight = (pageHeight - marginY * 2 - (rows - 1) * 15) / rows;

    let labelsMarkup = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        const lx = marginX + c * (labelWidth + 15);
        const ly = marginY + r * (labelHeight + 15);

        labelsMarkup += `
          <g transform="translate(${lx}, ${ly})">
            <!-- Sticker Label Border -->
            <rect width="${labelWidth}" height="${labelHeight}" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
            <rect width="${labelWidth - 8}" height="${labelHeight - 8}" x="4" y="4" rx="8" fill="none" stroke="#e2e8f0" stroke-dasharray="4,4" />

            <!-- Brand Header -->
            <text x="16" y="24" font-family="Inter, sans-serif" font-weight="700" font-size="11" fill="#006ec7">${product.brand.toUpperCase()}</text>
            <text x="16" y="38" font-family="Inter, sans-serif" font-weight="600" font-size="12" fill="#0f172a">${product.name.slice(0, 22)}${product.name.length > 22 ? '...' : ''}</text>
            
            <!-- SKU & Details -->
            <text x="16" y="54" font-family="JetBrains Mono, monospace" font-size="10" fill="#64748b">SKU: ${product.sku}</text>
            <text x="16" y="68" font-family="JetBrains Mono, monospace" font-size="10" fill="#64748b">ID: ${product.uniqrCode}</text>

            <!-- QR Embedded SVG -->
            <g transform="translate(${labelWidth - 110}, 16)">
              ${qrSvg.replace(/<\?xml.*?\?>/, '').replace(/width=".*?"/, 'width="95"').replace(/height=".*?"/, 'height="95"')}
            </g>

            <!-- Bottom Digital Passport Callout -->
            <rect x="16" y="${labelHeight - 28}" width="${labelWidth - 32}" height="18" rx="4" fill="#f0f4ff" />
            <text x="${labelWidth / 2}" y="${labelHeight - 15}" font-family="Inter, sans-serif" font-weight="600" font-size="9" fill="#0258a3" text-anchor="middle">Scan for Warranty &amp; Universal Passport</text>
          </g>
        `;
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pageWidth} ${pageHeight}" width="${pageWidth}" height="${pageHeight}">
  <rect width="${pageWidth}" height="${pageHeight}" fill="#f8fafc" />
  <text x="${pageWidth / 2}" y="30" font-family="Inter, sans-serif" font-weight="700" font-size="14" fill="#475569" text-anchor="middle">UNIQR Print-Ready Sticker Sheet (A4 - ${totalLabels} Labels)</text>
  ${labelsMarkup}
</svg>`;
  }

  /**
   * Triggers browser print dialog for the generated sticker sheet
   */
  static printStickerSheet(svgContent: string) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>UNIQR Printable Sheet</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; background: white; display: flex; justify-content: center; }
            svg { width: 100vw; height: 100vh; }
          </style>
        </head>
        <body>
          ${svgContent}
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}
