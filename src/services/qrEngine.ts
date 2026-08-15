import QRCode from 'qrcode';
import { QrStylingConfig } from '../types';

export interface QrRenderOptions {
  text: string;
  size: number;
  config: QrStylingConfig;
}

export class QrEngine {
  /**
   * Generates a 2D matrix array representing the QR code module grid
   */
  static async getQrMatrix(text: string): Promise<boolean[][]> {
    const qrData = QRCode.create(text, { errorCorrectionLevel: 'H' });
    const moduleCount = qrData.modules.size;
    const data = qrData.modules.data;
    const matrix: boolean[][] = [];

    for (let r = 0; r < moduleCount; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < moduleCount; c++) {
        row.push(Boolean(data[r * moduleCount + c]));
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Render custom styled QR Code onto an HTML5 Canvas element
   */
  static async renderToCanvas(canvas: HTMLCanvasElement, options: QrRenderOptions): Promise<void> {
    const { text, size, config } = options;
    const matrix = await this.getQrMatrix(text);
    const n = matrix.length;
    const padding = config.borderPadding || 16;
    const cellSize = (size - padding * 2) / n;

    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, size, size);
    if (!config.transparentBg) {
      ctx.fillStyle = config.bgColor || '#ffffff';
      ctx.fillRect(0, 0, size, size);
    }

    // Set up foreground fill (Solid or Gradient)
    if (config.gradient && config.gradientColor) {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, config.fgColor);
      grad.addColorStop(1, config.gradientColor);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = config.fgColor;
    }

    // Helper to check if a cell is inside the 3 corner finder patterns (7x7 top-left, top-right, bottom-left)
    const isFinderPattern = (r: number, c: number) => {
      if (r < 7 && c < 7) return true; // top-left
      if (r < 7 && c >= n - 7) return true; // top-right
      if (r >= n - 7 && c < 7) return true; // bottom-left
      return false;
    };

    // Draw standard data modules
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!matrix[r][c]) continue;
        if (isFinderPattern(r, c)) continue; // We draw finder eyes separately for crisp custom styling

        const x = padding + c * cellSize;
        const y = padding + r * cellSize;

        switch (config.style) {
          case 'circular-dots':
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 * 0.85, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'rounded-modules':
          case 'soft-rounded':
            const radius = cellSize * 0.4;
            ctx.beginPath();
            ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, radius);
            ctx.fill();
            break;

          case 'minimal':
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 3, 0, Math.PI * 2);
            ctx.fill();
            break;

          case 'square':
          case 'high-contrast':
          default:
            ctx.fillRect(x, y, cellSize + 0.2, cellSize + 0.2);
            break;
        }
      }
    }

    // Draw Corner Finder Patterns (Eyes)
    const drawEye = (startR: number, startC: number) => {
      const eyeX = padding + startC * cellSize;
      const eyeY = padding + startR * cellSize;
      const eyeSize = 7 * cellSize;

      ctx.save();
      // Outer 7x7 frame
      ctx.beginPath();
      if (config.cornerDotStyle === 'rounded' || config.style === 'rounded-square' || config.style === 'soft-rounded') {
        ctx.roundRect(eyeX, eyeY, eyeSize, eyeSize, cellSize * 1.5);
      } else if (config.cornerDotStyle === 'dots' || config.style === 'circular-dots') {
        ctx.roundRect(eyeX, eyeY, eyeSize, eyeSize, eyeSize / 2);
      } else {
        ctx.rect(eyeX, eyeY, eyeSize, eyeSize);
      }
      ctx.fill();

      // Cut out inner 5x5 area
      ctx.fillStyle = config.transparentBg ? '#0a0d14' : config.bgColor;
      ctx.beginPath();
      const innerX = eyeX + cellSize;
      const innerY = eyeY + cellSize;
      const innerSize = 5 * cellSize;
      if (config.cornerDotStyle === 'rounded' || config.style === 'rounded-square' || config.style === 'soft-rounded') {
        ctx.roundRect(innerX, innerY, innerSize, innerSize, cellSize);
      } else if (config.cornerDotStyle === 'dots' || config.style === 'circular-dots') {
        ctx.roundRect(innerX, innerY, innerSize, innerSize, innerSize / 2);
      } else {
        ctx.rect(innerX, innerY, innerSize, innerSize);
      }
      ctx.fill();

      // Inner 3x3 core dot
      if (config.gradient && config.gradientColor) {
        const grad = ctx.createLinearGradient(eyeX, eyeY, eyeX + eyeSize, eyeY + eyeSize);
        grad.addColorStop(0, config.fgColor);
        grad.addColorStop(1, config.gradientColor);
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = config.fgColor;
      }
      ctx.beginPath();
      const coreX = eyeX + 2 * cellSize;
      const coreY = eyeY + 2 * cellSize;
      const coreSize = 3 * cellSize;
      if (config.cornerDotStyle === 'rounded' || config.cornerDotStyle === 'dots' || config.style === 'circular-dots') {
        ctx.roundRect(coreX, coreY, coreSize, coreSize, cellSize * 0.8);
      } else {
        ctx.rect(coreX, coreY, coreSize, coreSize);
      }
      ctx.fill();
      ctx.restore();
    };

    drawEye(0, 0); // Top-left
    drawEye(0, n - 7); // Top-right
    drawEye(n - 7, 0); // Bottom-left

    // Center Logo overlay if provided
    if (config.logoUrl) {
      await this.drawCenterLogo(ctx, config.logoUrl, size, config.bgColor);
    }
  }

  private static drawCenterLogo(ctx: CanvasRenderingContext2D, logoUrl: string, size: number, bgColor: string): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoSize = size * 0.22;
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;

        // Background badge behind logo
        ctx.save();
        ctx.fillStyle = bgColor || '#ffffff';
        ctx.beginPath();
        ctx.roundRect(x - 6, y - 6, logoSize + 12, logoSize + 12, 12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.drawImage(img, x, y, logoSize, logoSize);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoUrl;
    });
  }

  /**
   * Generates pure SVG string for crisp vector downloading
   */
  static async generateSVG(text: string, config: QrStylingConfig, size: number = 512): Promise<string> {
    const matrix = await this.getQrMatrix(text);
    const n = matrix.length;
    const padding = config.borderPadding || 16;
    const cellSize = (size - padding * 2) / n;

    let pathData = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          const x = padding + c * cellSize;
          const y = padding + r * cellSize;
          pathData += `M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z `;
        }
      }
    }

    const bgRect = config.transparentBg 
      ? '' 
      : `<rect width="${size}" height="${size}" fill="${config.bgColor}" rx="16" />`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${bgRect}
  <path d="${pathData}" fill="${config.fgColor}" />
</svg>`;
  }
}
