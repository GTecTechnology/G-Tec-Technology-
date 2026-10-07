import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldAlert,
  Headphones
} from 'lucide-react';
import { api } from '../services/api';

interface SupportContactSectionProps {
  initialServiceInterest?: string;
}

export const SupportContactSection: React.FC<SupportContactSectionProps> = ({
  initialServiceInterest = 'General Inquiry'
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    interest: initialServiceInterest as any,
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.createInquiry(formData);
      setSubmitted(true);
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        interest: 'General Inquiry',
        message: ''
      });
    } catch (err: any) {
      setErrorMsg('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-slate-100/70 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact & Location Info from Screenshot */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0072BC] mb-1">
                <span>Direct Contact &amp; Support</span>
                <span aria-hidden="true">·</span>
                <span>Commercial Headquarters</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Get In Touch With G-Tec
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Connect directly with our enterprise hardware advisers, commercial sales engineers, and authorized repair technicians for customized office IT deployments.
              </p>
            </div>

            {/* Quick Contact Cards matching screenshot details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0072BC] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Commercial Headquarters</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Hawassa, Ethiopia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0072BC] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Direct Telephone Contacts</span>
                  <div className="text-xs text-slate-600 mt-1 space-y-1">
                    <p>
                      <strong className="text-slate-800">Sales &amp; Tech Line 1:</strong>{' '}
                      <a href="tel:+251910624518" className="font-mono text-[#0072BC] font-bold hover:underline">
                        +251 91 062 4518
                      </a>{' '}
                      <span className="text-slate-400">/</span>{' '}
                      <a href="tel:0725594518" className="font-mono text-[#0072BC] font-bold hover:underline">
                        0725594518
                      </a>
                    </p>
                    <p>
                      <strong className="text-slate-800">Customer Support Line 2:</strong>{' '}
                      <a href="tel:+251967418315" className="font-mono text-[#0072BC] font-bold hover:underline">
                        +251 96 741 8315
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 text-[#0072BC] flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Official Telegram Channel</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <a
                      href="https://t.me/G_Tec_Technolog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-cyan-700 hover:text-cyan-900 hover:underline"
                    >
                      https://t.me/G_Tec_Technolog
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0072BC] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Official Electronic Inquiries</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Sales: <span className="font-semibold text-slate-800">sales@gtectechnology.com</span><br />
                    Support: <span className="font-semibold text-slate-800">support@gtectechnology.com</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0072BC] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">Operating Hours</span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mon – Fri: 08:30 – 17:30 (EAT)<br />
                    Saturday: 08:30 – 13:00 (Emergency IT On-call)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hardware Quote / Service Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="w-5 h-5 text-[#0072BC]" />
              <h3 className="text-lg font-bold text-slate-900">
                Request Corporate Quote or Technical Support
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Our hardware specialists respond within 2 business hours with itemized equipment pricing and installation options.
            </p>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Quote Request Submitted</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Thank you. Your inquiry has been routed to our corporate sales department and logged into the G-Tec company portal.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-emerald-800 underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Organization Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Acme Corporation (Optional)"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Area of Hardware Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e: any) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800 cursor-pointer"
                  >
                    <option value="Computer Systems">Computer Systems &amp; Workstations</option>
                    <option value="Office Printers & Scanners">Office Printers, Copiers &amp; Scanners</option>
                    <option value="Enterprise IT Fleet">Enterprise IT Fleet &amp; Smart Office</option>
                    <option value="Maintenance & Service">Preventive Maintenance &amp; Repair Contract</option>
                    <option value="General Inquiry">General Hardware Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Equipment Requirements or Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the number of units, technical specifications, or office setup details needed..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Request...' : 'Submit Hardware Quote Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
