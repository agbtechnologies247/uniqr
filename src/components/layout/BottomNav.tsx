import React from 'react';
import { Home, Package, PlusCircle, Camera, Network } from 'lucide-react';
import { sound } from '../../services/audio';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'qr-studio', label: 'Generate', icon: PlusCircle, isMain: true },
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'graph', label: 'Network', icon: Network },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center pointer-events-none">
      {/* Floating Dock */}
      <div className="bg-[#1D4533]/95 backdrop-blur-md border border-[#F9D2BA]/40 rounded-full px-3 py-2 flex items-center justify-around w-full max-w-md shadow-2xl pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setCurrentTab(tab.id);
                }}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#F9D2BA] text-[#1D4533] flex items-center justify-center shadow-xl ring-4 ring-[#1D4533] group-active:scale-90 transition-transform font-bold">
                  <Icon className="w-6 h-6 text-[#1D4533]" />
                </div>
                <span className="text-[9px] font-extrabold text-[#F9D2BA] mt-1 uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setCurrentTab(tab.id);
              }}
              className={`flex flex-col items-center py-1.5 px-3 rounded-full transition-all ${
                isActive 
                  ? 'text-[#F9D2BA] font-extrabold scale-105 bg-[#5E3122]' 
                  : 'text-[#F7EAE0]/80 hover:text-[#F9D2BA]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
