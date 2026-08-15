import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedProducts: Product[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const [csvText, setCsvText] = useState<string>(
`name,sku,brand,category,hsn,gst,warrantyMonths
AERO-Pro Bench Press,AGB-FT-BP01,UniQR Industrial,Fitness Equipment,95069190,18,36
Smart Solar Inverter 5kW,AGB-EL-INV5,AGB Industrial,Electronics,85044090,18,60
Tactical Resistance Band Set,AGB-FT-RB03,UniQR Wear,Apparel & Accessories,95069190,12,12`
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleParseCsv = () => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg('CSV must contain header row and at least 1 product data line.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const newProducts: Product[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length < 2) continue;

        const rowData: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowData[h] = cols[idx] || '';
        });

        const code = `UQ-${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
        newProducts.push({
          id: 'prod-csv-' + Date.now() + '-' + i,
          uniqrCode: code,
          name: rowData['name'] || `CSV Item ${i}`,
          sku: rowData['sku'] || `SKU-CSV-${i}`,
          brand: rowData['brand'] || 'AGB Imported',
          manufacturer: 'AGB Tech Bulk Import',
          description: 'Imported via CSV Bulk Pipeline',
          category: rowData['category'] || 'General',
          hsn: rowData['hsn'] || '9506',
          gst: Number(rowData['gst']) || 18,
          batchNumber: `CSV-BATCH-${new Date().toISOString().split('T')[0]}`,
          serialNumber: `SN-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
          mfgDate: new Date().toISOString().split('T')[0],
          expDate: '2036-12-31',
          warrantyMonths: Number(rowData['warrantymonths']) || 24,
          customFields: { 'Source': 'CSV Pipeline' },
          tags: ['Bulk', 'CSV'],
          location: 'Main Warehouse',
          supplier: 'AGB Import Pipeline',
          status: 'Active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          connectedApps: ['Enterprise ERP', 'Asset Tracking']
        });
      }

      if (newProducts.length === 0) {
        setErrorMsg('No valid rows found to import.');
        return;
      }

      // Sync batch to backend REST API
      fetch('/api/v1/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts })
      }).catch(() => {});

      onImportSuccess(newProducts);
      onClose();
    } catch (err: any) {
      setErrorMsg('Failed to parse CSV format: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5E3122]/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-xl p-6 rounded-3xl border border-[#F9D2BA] shadow-2xl relative text-[#5E3122]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#F9D2BA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#1D4533]">Bulk CSV Import</h2>
              <p className="text-xs text-[#5E3122] font-semibold">Generate product identity records instantly</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-[#5E3122] hover:bg-[#F7EAE0] rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[#1D4533] font-extrabold uppercase mb-1">Paste CSV Data</label>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value);
                setErrorMsg('');
              }}
              className="w-full p-3.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-mono text-xs focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none font-bold shadow-inner"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] space-y-1 text-[11px] font-semibold">
            <div className="font-extrabold text-[#1D4533]">Required CSV Columns:</div>
            <code className="text-[#1D4533] font-mono font-bold">name, sku, brand, category, hsn, gst, warrantyMonths</code>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F9D2BA]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F7EAE0] text-[#5E3122] font-bold border border-[#F9D2BA] hover:bg-[#F9D2BA]"
            >
              Cancel
            </button>
            <button
              onClick={handleParseCsv}
              className="px-6 py-2 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Process Bulk Import</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
