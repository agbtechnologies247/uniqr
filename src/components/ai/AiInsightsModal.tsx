import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, Cpu, Zap, Activity, CheckCircle2, RefreshCw, X, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [selectedRole, setSelectedRole] = useState<'technician' | 'customer' | 'anonymous'>('technician');
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && product) {
      setLoading(true);
      fetch(`/api/v1/q/${product.uniqrCode}?role=${selectedRole}`)
        .then(res => res.json())
        .then(data => {
          setAiData(data);
          setLoading(false);
        })
        .catch(() => {
          // Fallback mock AI response
          setAiData({
            token: product.uniqrCode,
            name: product.name,
            aiResponse: {
              persona: selectedRole === 'technician' ? 'Technician View' : selectedRole === 'customer' ? 'Customer View' : 'Public View',
              headline: selectedRole === 'technician' ? '⚠ High Failure Probability (88%) Detected' : `Welcome to your ${product.name}`,
              alertLevel: selectedRole === 'technician' ? 'CRITICAL' : 'NORMAL',
              predictiveRiskScore: selectedRole === 'technician' ? 88 : 5,
              recommendedAction: selectedRole === 'technician' ? 'Schedule immediate component replacement within 4 days' : 'Register product warranty & view user manual',
              recommendedParts: ['Bearing Assembly (92% match)', 'Drive Motor (81% match)', 'Thermal Fuse (76% match)'],
              assignedTechnician: 'Mahesh Kulkarni (Senior Bio-Engineer)',
              sections: [
                {
                  title: 'Diagnostic & Telemetry Log',
                  fields: {
                    'Operating Hours': '2,400 hrs',
                    'Failure Probability': '88% Risk',
                    'Estimated Failure Window': 'Within 4 Days',
                    'Last Calibration': '2026-05-15 (Autoclave Passed)'
                  }
                }
              ]
            }
          });
          setLoading(false);
        });
    }
  }, [isOpen, product, selectedRole]);

  if (!isOpen) return null;

  const resp = aiData?.aiResponse;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#5E3122]/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-3xl p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-2xl relative my-8 text-[#5E3122]">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F9D2BA]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl text-[#1D4533]">AI Scan Decision Engine</h2>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#F9D2BA] text-[#1D4533]">
                  ML Predictor Active
                </span>
              </div>
              <p className="text-xs text-[#5E3122] font-semibold mt-0.5">
                Target Entity: {product.name} ({product.uniqrCode})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-[#5E3122] hover:bg-[#F7EAE0]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ROLE PERSONA SWITCHER */}
        <div className="my-6">
          <label className="block text-[11px] font-bold text-[#5E3122] uppercase tracking-wider mb-2">
            Simulate Scanner Role Persona:
          </label>
          <div className="flex items-center gap-2 bg-[#5E3122] p-1.5 rounded-2xl border border-[#F9D2BA]/30">
            {[
              { id: 'technician', label: '🔧 Field Engineer / Technician' },
              { id: 'customer', label: '👤 End Customer' },
              { id: 'anonymous', label: '🌐 Anonymous Public QR Scan' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                  selectedRole === tab.id
                    ? 'bg-[#F9D2BA] text-[#1D4533] shadow-sm'
                    : 'text-[#F7EAE0] hover:bg-[#1D4533]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#5E3122] font-bold">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-[#1D4533]" />
            <p className="text-xs">Computing AI Decision Context & Risk Metrics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* HERO PREDICTIVE BANNER */}
            <div className={`p-5 rounded-2xl border ${
              resp?.alertLevel === 'CRITICAL'
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-[#F7EAE0] border-[#F9D2BA] text-[#5E3122]'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1 text-[#1D4533]">
                    <Cpu className="w-4 h-4 text-[#1D4533]" />
                    <span>{resp?.persona} Result</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1D4533]">{resp?.headline}</h3>
                  <p className="text-xs mt-1 font-semibold">{resp?.recommendedAction}</p>
                </div>

                {resp?.predictiveRiskScore > 0 && (
                  <div className="text-center bg-white p-3 rounded-xl border border-[#F9D2BA] shrink-0 shadow-sm">
                    <div className="text-2xl font-extrabold text-[#1D4533]">{resp.predictiveRiskScore}%</div>
                    <div className="text-[9px] font-extrabold uppercase text-[#5E3122]">Failure Risk</div>
                  </div>
                )}
              </div>
            </div>

            {/* RECOMMENDED PARTS (Technician Persona) */}
            {resp?.recommendedParts && resp.recommendedParts.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-[#F9D2BA] shadow-sm">
                <h4 className="font-extrabold text-sm text-[#1D4533] mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#1D4533]" />
                  <span>ML Recommended Replacement Parts</span>
                </h4>
                <div className="grid sm:grid-cols-3 gap-2.5">
                  {resp.recommendedParts.map((part: string, idx: number) => (
                    <div key={idx} className="p-3 bg-[#F7EAE0] rounded-xl border border-[#F9D2BA] text-xs font-bold text-[#1D4533]">
                      {part}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTIONS */}
            {resp?.sections?.map((sec: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#F9D2BA] shadow-sm space-y-3">
                <h4 className="font-extrabold text-sm text-[#1D4533]">{sec.title}</h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(sec.fields || {}).map(([k, v]) => (
                    <div key={k} className="p-2.5 bg-[#F7EAE0] rounded-xl font-mono border border-[#F9D2BA]">
                      <span className="text-[#5E3122]/70 block text-[9px] font-bold uppercase">{k}:</span>
                      <span className="text-[#1D4533] font-bold">{v as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};
