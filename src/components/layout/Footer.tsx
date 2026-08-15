import React from 'react';
import { QrCode, Sparkles, Mail, Phone, MessageSquare, ShieldCheck, ArrowRight, Globe, Lock } from 'lucide-react';
import { sound } from '../../services/audio';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenContactSales: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContactSales }) => {
  return (
    <footer className="bg-[#1D4533] text-[#F7EAE0] border-t-2 border-[#F9D2BA] selection:bg-[#F9D2BA] selection:text-[#1D4533]">
      
      {/* MAIN FOOTER BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
        
        {/* COL 1: BRAND STORY & CONTACT CTA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="UniQR Logo" className="w-10 h-10 rounded-xl border border-[#F9D2BA] object-cover shadow-md" />
            <div>
              <span className="text-xl font-black text-white tracking-tight">UniQR</span>
              <span className="block text-[10px] text-[#F9D2BA] font-extrabold uppercase tracking-widest">
                Living Product Identity Platform
              </span>
            </div>
          </div>

          <p className="text-xs text-[#F7EAE0]/90 font-medium leading-relaxed max-w-sm">
            UniQR transforms static QR codes into living digital identities connecting products, components, owners, warranties, service histories, and AI context engines across 15 verticals.
          </p>

          <div className="pt-2 space-y-2 font-semibold">
            <div className="flex items-center gap-2 text-white">
              <Phone className="w-4 h-4 text-[#F9D2BA]" />
              <span>Phone / WhatsApp: <strong className="text-[#F9D2BA] font-bold">+91 9049874780</strong></span>
            </div>

            <div className="flex items-center gap-2 text-white">
              <Mail className="w-4 h-4 text-[#F9D2BA]" />
              <span>Email: <strong className="text-[#F9D2BA] font-bold">agbtechnologies247@gmail.com</strong></span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onOpenContactSales();
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#F9D2BA] hover:bg-[#F7EAE0] text-[#1D4533] font-extrabold text-xs inline-flex items-center gap-2 shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Enterprise Sales</span>
          </button>
        </div>

        {/* COL 2: PLATFORM SOLUTIONS */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-[#F9D2BA] uppercase tracking-wider">Solutions</h4>
          <ul className="space-y-2 text-[#F7EAE0]/80 font-semibold">
            <li><button onClick={() => { sound.playClick(); onNavigate('use-cases'); }} className="hover:text-[#F9D2BA] transition-colors">15 Industry Passports</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('use-cases'); }} className="hover:text-[#F9D2BA] transition-colors">Manufacturing BOM</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('use-cases'); }} className="hover:text-[#F9D2BA] transition-colors">Healthcare FDA UDI</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('use-cases'); }} className="hover:text-[#F9D2BA] transition-colors">Automotive VIN Passports</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('use-cases'); }} className="hover:text-[#F9D2BA] transition-colors">Pharmaceutical Cold-Chain</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('use-cases'); }} className="hover:text-[#F9D2BA] transition-colors">Real Estate Property OC</button></li>
          </ul>
        </div>

        {/* COL 3: DEVELOPER & ARCHITECTURE */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-[#F9D2BA] uppercase tracking-wider">Developers</h4>
          <ul className="space-y-2 text-[#F7EAE0]/80 font-semibold">
            <li><button onClick={() => { sound.playClick(); onNavigate('api-docs'); }} className="hover:text-[#F9D2BA] transition-colors">REST API Platform</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('api-docs'); }} className="hover:text-[#F9D2BA] transition-colors">OpenAPI 3.0 Specification</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('api-docs'); }} className="hover:text-[#F9D2BA] transition-colors">JSON Schema Definition</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('api-docs'); }} className="hover:text-[#F9D2BA] transition-colors">cURL &amp; Node SDK Snippets</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('landing'); }} className="hover:text-[#F9D2BA] transition-colors">5-Layer Database Stack</button></li>
          </ul>
        </div>

        {/* COL 4: COMPANY & LEGAL */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-[#F9D2BA] uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-[#F7EAE0]/80 font-semibold">
            <li><button onClick={() => { sound.playClick(); onNavigate('landing'); }} className="hover:text-[#F9D2BA] transition-colors">Overview</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('pricing'); }} className="hover:text-[#F9D2BA] transition-colors">Pricing Plans</button></li>
            <li><button onClick={() => { sound.playClick(); onOpenContactSales(); }} className="hover:text-[#F9D2BA] transition-colors">About UniQR Story</button></li>
            <li><button onClick={() => { sound.playClick(); onOpenContactSales(); }} className="hover:text-[#F9D2BA] transition-colors">Contact Support</button></li>
            <li><button onClick={() => { sound.playClick(); onNavigate('app'); }} className="hover:text-[#F9D2BA] font-bold text-[#F9D2BA]">Launch Studio App &rarr;</button></li>
          </ul>
        </div>

      </div>

      {/* BOTTOM COPYRIGHT & COMPLIANCE BAR */}
      <div className="bg-[#5E3122] py-5 px-4 sm:px-6 border-t border-[#F9D2BA]/30 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-[#F7EAE0]/80">
            &copy; {new Date().getFullYear()} AGB Technologies Ltd. All rights reserved. UniQR Living Digital Identity Platform.
          </div>

          <div className="flex items-center gap-4 text-[#F9D2BA]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SHA-256 Tamper-Evident Ledger</span>
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>ISO 27001 Certified</span>
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};
