import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Lock,
  Send
} from 'lucide-react';
import { GTecLogo } from './GTecLogo';

interface FooterProps {
  onOpenStaffLogin: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenStaffLogin, onNavigate }) => {
  return (
    <footer className="bg-[#041a2e] text-slate-300 border-t border-slate-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Logo & Mission with Fixed Layout */}
          <div className="space-y-4">
            <div className="shrink-0 whitespace-nowrap">
              <GTecLogo variant="white" size="lg" className="shrink-0" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Your comprehensive technology partner providing high-performance commercial computers, high-volume laser printers, sheet-fed scanners, and certified enterprise IT services in Ethiopia.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="text-cyan-300 font-semibold">Storefront Currency: ETB (Ethiopian Birr)</p>
              <p>Delivery across Addis Ababa &amp; Major Ethiopian Hubs</p>
            </div>
          </div>

          {/* Column 2: Direct Contact with Girma & Dina */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Ethiopia Headquarters &amp; Contacts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Hawassa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-300 font-medium">1. Girma Hirpa: </span>
                  <a href="tel:+251910624518" className="font-mono text-cyan-300 font-semibold hover:underline">
                    +251 91 062 4518
                  </a>{' '}
                  <span className="text-slate-500">/</span>{' '}
                  <a href="tel:0725594518" className="font-mono text-cyan-300 font-semibold hover:underline">
                    0725594518
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-300 font-medium">2. Dina Tesema: </span>
                  <a href="tel:+251967418315" className="font-mono text-cyan-300 font-semibold hover:underline">
                    +251 96 741 8315
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="https://t.me/G_Tec_Technolog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 font-semibold hover:underline"
                >
                  t.me/G_Tec_Technolog
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300">www.gtectechnology.com</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us Emails */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Official Desks
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Enterprise &amp; B2B Fleet Sales</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-mono">info@gtectechnology.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-mono">sales@gtectechnology.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-mono">support@gtectechnology.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Navigation & Social Media */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Equipment Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 mb-6">
              <li>
                <button
                  onClick={() => onNavigate('computers')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Computer (Laptops &amp; PCs)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('printers')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Printer (Laser &amp; Copiers)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scanners')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Scanner (Document Digitizers)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('accessories')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Accessories &amp; Components
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  Enterprise Service &amp; Maintenance
                </button>
              </li>
            </ul>

            {/* Social channels with working Telegram link */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                Official Telegram Channel
              </span>
              <a
                href="https://t.me/G_Tec_Technolog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0072BC]/20 hover:bg-[#0072BC]/40 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold transition-all"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Join @G_Tec_Technolog</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright and discreet staff authentication link */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Copyright © {new Date().getFullYear()} G-Tec Technology. All Rights Reserved. Computer &amp; Office Solutions.
          </div>
          
          {/* Discrete Staff Link only for internal company administration */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenStaffLogin}
              className="flex items-center gap-1.5 text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer text-[11px]"
              title="Restricted G-Tec Company Internal Access"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Sign-in</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
