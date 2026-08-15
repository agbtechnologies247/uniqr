import React, { useState, useRef } from 'react';
import { Camera, Upload, QrCode, CheckCircle2, AlertCircle, Sparkles, Search } from 'lucide-react';
import { storage } from '../../services/storage';
import { Product } from '../../types';

interface CameraScannerProps {
  onScanSuccess: (uniqrCode: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    setIsScanning(true);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Camera access unavailable. Use manual lookup below.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
    }
    setIsScanning(false);
  };

  const handleLookup = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const prod = storage.getProductById(trimmed) || storage.getProducts().find(p => p.uniqrCode === trimmed);
    
    if (prod) {
      setScannedProduct(prod);
      storage.recordScan(prod.uniqrCode, {
        referral: 'Camera Scanner App',
        appSource: 'UNIQR PWA Native'
      });
    } else {
      alert(`No product identity found for code: "${trimmed}". Please verify the UQ code.`);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-[#F9D2BA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[#1D4533] font-bold text-xs uppercase mb-1">
            <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
            <span>Live Camera Feed</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#1D4533]">Universal QR Scanner</h1>
          <p className="text-xs text-[#5E3122] mt-0.5 font-medium">
            Instant product lookup &amp; identity verification from mobile camera or UQ code entry.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* CAMERA SCANNER VIEWPORT (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] flex flex-col items-center justify-center space-y-6 text-center shadow-sm">
          
          <div className="w-full max-w-md h-72 rounded-2xl bg-[#F7EAE0] border-2 border-dashed border-[#F9D2BA] flex flex-col items-center justify-center relative overflow-hidden group">
            
            {isScanning ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-[#1D4533] text-[#F7EAE0] flex items-center justify-center mx-auto shadow-sm font-bold">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="font-extrabold text-[#1D4533] text-sm">Native Scanner</div>
                <p className="text-xs text-[#5E3122] font-medium">Position QR code within frame</p>
              </div>
            )}

            {/* Target Reticle Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-[#F9D2BA] rounded-2xl animate-pulse" />
              </div>
            )}
          </div>

          {cameraError && (
            <div className="text-xs text-red-700 font-bold bg-red-50 p-3 rounded-xl border border-red-200">
              {cameraError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {isScanning ? (
              <button
                onClick={stopCamera}
                className="px-6 py-2.5 rounded-xl bg-red-700 text-white font-extrabold text-xs shadow-sm"
              >
                Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                className="px-6 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-sm"
              >
                Start Scanner
              </button>
            )}
          </div>
        </div>

        {/* MANUAL CODE ENTRY (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] space-y-6 shadow-sm">
          <h3 className="font-extrabold text-base text-[#1D4533] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#1D4533]" />
            <span>Manual Identity Lookup</span>
          </h3>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#5E3122]">Enter UQ Code or Serial:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="e.g. UQ-8AF92B7A2"
                className="flex-1 px-3.5 py-2.5 rounded-input bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold text-xs focus:border-[#1D4533] focus:outline-none"
              />
              <button
                onClick={() => handleLookup(manualInput)}
                className="px-4 py-2.5 rounded-button bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-sm"
              >
                Verify
              </button>
            </div>
          </div>

          {scannedProduct && (
            <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1D4533]">
                <CheckCircle2 className="w-4 h-4 text-[#1D4533]" />
                <span>Verified Identity Found!</span>
              </div>
              <h4 className="font-extrabold text-sm text-[#1D4533]">{scannedProduct.name}</h4>
              <p className="text-xs text-[#5E3122] font-medium">{scannedProduct.description}</p>
              <button
                onClick={() => onScanSuccess(scannedProduct.uniqrCode)}
                className="w-full mt-2 py-2 rounded-xl bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs shadow-sm"
              >
                View Full Product Passport
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
