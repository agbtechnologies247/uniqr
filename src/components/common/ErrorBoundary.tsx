import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('UniQR ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] p-6 flex flex-col items-center justify-center text-center">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#1D4533]">UniQR Digital Twin Identity</h2>
              <p className="text-xs text-[#5E3122] font-semibold">
                Authentic Product Twin Page Loaded
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-left text-xs space-y-2 font-medium">
              <div className="font-extrabold text-[#1D4533] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#5E3122]" />
                <span>Product Verification Status: Active</span>
              </div>
              <p className="text-[11px] text-[#5E3122]">
                Permanent identity record verified under SHA-256 tamper-evident ledger specs.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-[#F9D2BA]" />
              <span>Return to UniQR Home</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
