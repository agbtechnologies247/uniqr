import React, { useState, useEffect } from 'react';
import { Search, QrCode, Package, Camera, Network, BarChart3, CreditCard, Code2, Shield, X, ArrowRight, Building2, Palette } from 'lucide-react';
import { sound } from '../../services/audio';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentTab: (tab: string) => void;
  onOpenNewProduct: () => void;
  onOpenUpgrade: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setCurrentTab,
  onOpenNewProduct,
  onOpenUpgrade,
}) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        sound.playClick();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'builder', title: 'Open Passport Studio', category: 'Studio', icon: Palette, action: () => setCurrentTab('builder') },
    { id: 'qr-studio', title: 'Generate Custom QR Code', category: 'Studio', icon: QrCode, action: () => setCurrentTab('qr-studio') },
    { id: 'add-product', title: 'Register New Physical Product', category: 'Products', icon: Package, action: () => onOpenNewProduct() },
    { id: 'scanner', title: 'Launch Scanner', category: 'Tools', icon: Camera, action: () => setCurrentTab('scanner') },
    { id: 'graph', title: 'Open Connected Intelligence', category: 'Ecosystem', icon: Network, action: () => setCurrentTab('graph') },
    { id: 'products', title: 'View Inventory', category: 'Products', icon: Package, action: () => setCurrentTab('products') },
    { id: 'analytics', title: 'View Scan Telemetry Analytics', category: 'Analytics', icon: BarChart3, action: () => setCurrentTab('analytics') },
    { id: 'billing', title: 'Upgrade Subscription Tier', category: 'Account', icon: CreditCard, action: () => onOpenUpgrade() },
    { id: 'api', title: 'API Credentials & Webhooks', category: 'Developer', icon: Code2, action: () => setCurrentTab('api') },
    { id: 'admin', title: 'Admin Operations Portal', category: 'System', icon: Shield, action: () => setCurrentTab('admin') },
  ];

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#5E3122]/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#F9D2BA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#5E3122]">
        
        {/* Command Search Bar */}
        <div className="p-4 border-b border-[#F9D2BA] flex items-center gap-3 bg-[#F7EAE0]">
          <Search className="w-5 h-5 text-[#1D4533] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search action (e.g. Generate, Network, API)..."
            className="w-full bg-transparent text-[#1D4533] font-bold text-sm focus:outline-none placeholder-[#5E3122]/70"
          />
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1D4533] text-[#F7EAE0]">
            ESC
          </span>
        </div>

        {/* Action Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F7EAE0] transition-all text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-[#1D4533]">
                        {item.title}
                      </div>
                      <span className="text-[10px] text-[#5E3122] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#5E3122] group-hover:text-[#1D4533] font-bold">
                    <span className="text-[10px] font-mono">Execute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#5E3122] font-bold">
              No command matching "{query}".
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[#F7EAE0] border-t border-[#F9D2BA] flex items-center justify-between text-[11px] text-[#5E3122] font-semibold">
          <span>UniQR Command Palette</span>
          <span className="font-mono font-bold">Use ↑ ↓ to navigate, ↵ to select</span>
        </div>

      </div>
    </div>
  );
};
