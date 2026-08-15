import React, { useState } from 'react';
import { X, Printer, Grid, LayoutGrid, Download, Check } from 'lucide-react';
import { Product, QrStylingConfig } from '../../types';
import { PdfExporter } from '../../services/pdfExporter';

interface PrintStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  styleConfig: QrStylingConfig;
}

export const PrintStudioModal: React.FC<PrintStudioModalProps> = ({
  isOpen,
  onClose,
  product,
  styleConfig
}) => {
  const [rows, setRows] = useState<number>(5);
  const [cols, setCols] = useState<number>(3);
  const [svgPreview, setSvgPreview] = useState<string>('');

  if (!isOpen) return null;

  const handleUpdateLayout = async () => {
    const svg = await PdfExporter.generatePrintableStickerSheetSVG(product, styleConfig, rows, cols);
    setSvgPreview(svg);
  };

  React.useEffect(() => {
    handleUpdateLayout();
  }, [rows, cols, product, styleConfig]);

  const handlePrint = () => {
    PdfExporter.printStickerSheet(svgPreview);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl p-6 rounded-3xl border border-slate-700 shadow-2xl relative my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-white">Printable Sticker &amp; Label Studio</h2>
              <p className="text-xs text-slate-400">A4 Printable Batch Grid for Product Packaging</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          
          {/* Controls */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Sheet Grid Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setRows(5); setCols(3); }}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    rows === 5 && cols === 3 
                      ? 'bg-amber-600 border-amber-500 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Grid className="w-4 h-4 mx-auto mb-1" />
                  <span>A4 3x5 Grid (15 Labels)</span>
                </button>
                <button
                  onClick={() => { setRows(4); setCols(2); }}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    rows === 4 && cols === 2 
                      ? 'bg-amber-600 border-amber-500 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 mx-auto mb-1" />
                  <span>A4 2x4 Large (8 Labels)</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 space-y-1">
              <div className="font-bold text-slate-200">Label Card Details:</div>
              <div>Brand: {product.brand}</div>
              <div>SKU: {product.sku}</div>
              <div>Identity Code: {product.uniqrCode}</div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Sticker Sheet</span>
            </button>
          </div>

          {/* SVG Sheet Preview */}
          <div className="md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-center max-h-[500px] overflow-auto">
            {svgPreview ? (
              <div
                className="w-full bg-white rounded-lg shadow-2xl p-2 max-w-[400px]"
                dangerouslySetInnerHTML={{ __html: svgPreview }}
              />
            ) : (
              <div className="text-slate-500 text-xs">Generating print layout...</div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
