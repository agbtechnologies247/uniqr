import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Send, CheckCircle2, Building2, Shield, Sparkles } from 'lucide-react';
import { sound } from '../../services/audio';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    volume: '5,000 - 50,000 QRs / month',
    requirements: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessChime();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#5E3122]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-[#F9D2BA] shadow-2xl relative my-8 text-[#5E3122]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F9D2BA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center font-bold shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-[#1D4533]">Contact Enterprise Sales</h2>
              <p className="text-xs text-[#5E3122] font-semibold">Talk to our team about custom SLAs, dedicated VPS &amp; high volume QRs</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-[#5E3122] hover:bg-[#F7EAE0] rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DIRECT CONTACT CARDS */}
        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          
          {/* WHATSAPP / PHONE CARD */}
          <a
            href="https://wa.me/919049874780?text=Hi%20AGB%20Technologies,%20I'm%20interested%20in%20UniQR%20Enterprise%20Plan"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="p-4 rounded-2xl bg-[#F7EAE0] hover:bg-[#F9D2BA] border border-[#F9D2BA] transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] font-extrabold uppercase text-[#5E3122]">WhatsApp / Phone</span>
              <span className="font-extrabold text-xs text-[#1D4533] mt-0.5 block">+91 9049874780</span>
            </div>
          </a>

          {/* EMAIL CARD */}
          <a
            href="mailto:agbtechnologies247@gmail.com?subject=UniQR%20Enterprise%20Inquiry"
            onClick={() => sound.playClick()}
            className="p-4 rounded-2xl bg-[#F7EAE0] hover:bg-[#F9D2BA] border border-[#F9D2BA] transition-all flex items-center gap-3 group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[10px] font-extrabold uppercase text-[#5E3122]">Official Email</span>
              <span className="font-extrabold text-xs text-[#1D4533] mt-0.5 block truncate">agbtechnologies247@gmail.com</span>
            </div>
          </a>

        </div>

        {/* INQUIRY FORM */}
        {submitted ? (
          <div className="mt-6 p-8 bg-[#F7EAE0] rounded-2xl border border-[#F9D2BA] text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1D4533] text-[#F9D2BA] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-lg text-[#1D4533]">Inquiry Submitted Successfully!</h3>
            <p className="text-xs text-[#5E3122] font-semibold max-w-md mx-auto">
              Thank you {formData.name || 'Enterprise Partner'}. Our team will review your requirements and reach out via WhatsApp/email shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-2 px-6 py-2.5 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-[#1D4533] border-b border-[#F9D2BA] pb-2">
              Submit Enterprise Requirement Form
            </h3>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5E3122] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Verma"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5E3122] mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5E3122] mb-1">Phone Number / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9049874780"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5E3122] mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="AGB Industries Ltd"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Estimated Monthly QR Volume</label>
              <select
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              >
                <option value="5,000 - 50,000 QRs / month">5,000 - 50,000 QRs / month</option>
                <option value="50,000 - 500,000 QRs / month">50,000 - 500,000 QRs / month</option>
                <option value="500,000+ Unlimited Enterprise QRs">500,000+ Unlimited Enterprise QRs</option>
                <option value="Custom Private Cloud / On-Premise Deployment">Custom Private Cloud / On-Premise Deployment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5E3122] mb-1">Requirement Details &amp; Custom Features</label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Describe your ERP integration requirements, custom laser vector specs, SLA targets..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EAE0] border border-[#F9D2BA] text-[#5E3122] font-bold focus:border-[#1D4533] focus:ring-2 focus:ring-[#1D4533] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1D4533] hover:bg-[#5E3122] text-[#F7EAE0] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#F9D2BA]" />
              <span>Submit Enterprise Requirement Inquiry</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
