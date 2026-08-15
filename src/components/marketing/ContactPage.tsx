import React, { useState } from 'react';
import { 
  Phone, Mail, MessageSquare, ShieldCheck, Sparkles, Send, CheckCircle2, QrCode, MapPin
} from 'lucide-react';
import { Footer } from '../layout/Footer';
import { sound } from '../../services/audio';

interface ContactPageProps {
  onNavigate: (tab: string) => void;
  onOpenContactSales?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onOpenContactSales }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: 'Manufacturing',
    requirement: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7EAE0] text-[#5E3122] flex flex-col justify-between selection:bg-[#1D4533] selection:text-[#F7EAE0]">
      
      <div className="py-16 px-4 sm:px-6 lg:px-8 space-y-16 max-w-7xl mx-auto w-full flex-1">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1D4533] text-[#F9D2BA] font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F9D2BA]" />
            <span>Enterprise Support &amp; Consultation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[#1D4533] tracking-tight">
            Contact UniQR Team
          </h1>

          <p className="text-sm sm:text-base text-[#5E3122] font-semibold leading-relaxed">
            Have questions about custom ERP integrations, high-volume QR generation, or on-premise deployments? Get in touch with our team.
          </p>
        </div>

        {/* 2-COL CONTACT GRID */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* COL 1: CONTACT INFO & ABOUT UNIQR */}
          <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-[#F9D2BA] shadow-sm">
            
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-[#1D4533]">About UniQR</h3>
              <p className="text-xs text-[#5E3122] font-medium leading-relaxed">
                UniQR by AGB Technologies is the next-generation Universal Product Digital Twin platform. We replace static QR images with dynamic, scannable intelligence tokens that evolve alongside physical assets across supply chain lifecycles.
              </p>
            </div>

            <div className="space-y-4 border-t border-[#F9D2BA] pt-6 font-semibold text-xs">
              
              <a 
                href="https://wa.me/919049874780" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3.5 p-3.5 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] text-[#1D4533] hover:bg-[#F9D2BA] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-extrabold text-[#5E3122]">Phone / WhatsApp:</span>
                  <span className="font-extrabold text-sm text-[#1D4533] group-hover:text-[#5E3122]">+91 9049874780</span>
                </div>
              </a>

              <a 
                href="mailto:agbtechnologies247@gmail.com" 
                className="flex items-center gap-3.5 p-3.5 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] text-[#1D4533] hover:bg-[#F9D2BA] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-extrabold text-[#5E3122]">Email Support:</span>
                  <span className="font-extrabold text-sm text-[#1D4533] group-hover:text-[#5E3122]">agbtechnologies247@gmail.com</span>
                </div>
              </a>

            </div>

          </div>

          {/* COL 2: REQUIREMENT FORM */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#F9D2BA] shadow-xl space-y-6">
            
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h3 className="text-2xl font-extrabold text-[#1D4533]">Requirement Received!</h3>
                <p className="text-xs text-[#5E3122] font-semibold leading-relaxed max-w-md mx-auto">
                  Thank you for submitting your enterprise requirements. Our technical team will reach out via WhatsApp (+91 9049874780) and Email within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#1D4533] text-[#F7EAE0] font-extrabold text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-[#1D4533]">Enterprise Requirement Form</h3>
                  <p className="text-xs text-[#5E3122] font-medium">Tell us about your industry and dynamic QR volume needs.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1D4533] mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full p-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1D4533] mb-1">Email Address:</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="w-full p-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#1D4533] mb-1">Phone / WhatsApp:</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9049874780"
                      className="w-full p-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#1D4533] mb-1">Industry Vertical:</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full p-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                    >
                      {['Manufacturing', 'Electronics', 'Automotive', 'Healthcare', 'Pharmacy', 'Retail', 'Logistics', 'Real Estate', 'Other'].map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#1D4533] mb-1">Requirement Details:</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    placeholder="Describe your estimated monthly QR volume, custom dynamic parameters, or ERP integration specifications..."
                    className="w-full p-3 rounded-2xl bg-[#F7EAE0] border border-[#F9D2BA] text-xs font-bold text-[#1D4533] focus:outline-none focus:ring-2 focus:ring-[#1D4533]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Send className="w-4 h-4 text-[#F9D2BA]" />
                  <span>Submit Enterprise Inquiry</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

      <Footer onNavigate={onNavigate} onOpenContactSales={onOpenContactSales || (() => {})} />

    </div>
  );
};
