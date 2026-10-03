import React, { useState } from 'react';
import { 
  Wrench, 
  Printer, 
  ArrowRight, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';

interface OurServicesProps {
  onOpenInquiry: (serviceType: string) => void;
}

export const OurServices: React.FC<OurServicesProps> = ({ onOpenInquiry }) => {
  const [selectedService, setSelectedService] = useState<{
    title: string;
    category?: string;
    description: string;
    details: string[];
    icon: any;
  } | null>(null);

  const services = [
    {
      id: 'computer-service',
      title: 'Computer Service',
      category: 'Enterprise Hardware Maintenance',
      description: 'Professional hardware diagnostics, component upgrades, motherboard repair, operating system provisioning, and scheduled preventive maintenance for business fleets.',
      icon: Wrench,
      details: [
        'Component-level board diagnostics, chip repair & power rail testing',
        'Dual-monitor and workstation desk rollouts with cable management',
        'Enterprise Windows & Linux automated system image deployment',
        'On-site SLA response times: rapid business priority hardware support',
        'Data recovery, secure disk wiping, SSD upgrades & hardware asset recycling'
      ]
    },
    {
      id: 'office-solutions',
      title: 'Office Solutions (Printers & Hardware)',
      category: 'Printer & Office Hardware Maintenance',
      description: 'Comprehensive office printer and hardware maintenance, multi-function copier repairs, document scanner calibration, genuine toner cartridge supply, and fleet servicing contracts.',
      icon: Printer,
      details: [
        'Multi-brand commercial laser printer repair & mechanical diagnostics',
        'Photocopier drum replacement, fuser unit repairs & paper-feed roller servicing',
        'High-speed ADF sheet-fed scanner optical sensor calibration & cleaning',
        'Guaranteed supply of genuine OEM toner cartridges & scheduled consumables replenishment',
        'Office printer network configuration, secure PIN print release & scan-to-folder setup',
        'On-site technician preventative service agreements across Addis Ababa'
      ]
    }
  ];

  return (
    <section id="services" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0072BC] mb-1">
            <span>Enterprise Services</span>
            <span aria-hidden="true">·</span>
            <span>Hardware Maintenance &amp; Office Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Services
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Beyond commercial equipment sales, G-Tec Technology operates certified repair and maintenance centers providing complete lifecycle support for computers, printers, scanners, and computerized office equipment.
          </p>
        </div>

        {/* Clean 2-Card Grid: Service 01 (Computer Service) & Service 02 (Printer & Office Hardware) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Service Card 1: Computer Service */}
          <div className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-[#0072BC] flex items-center justify-center shrink-0 shadow-xs">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">Service 01</span>
                  <h3 className="text-lg font-bold text-slate-900">Computer Service</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dedicated enterprise technicians resolving hardware bottlenecks, repairing motherboard components, installing high-capacity memory, and maintaining high uptime for company workstations and laptops.
              </p>

              <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>On-site technician dispatch &amp; emergency repairs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Hardware warranty claims &amp; certified replacement parts</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>OS deployment, disk cloning &amp; enterprise data security</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedService(services[0])}
                className="w-full py-2.5 px-4 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <span>Learn More About Computer Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Service Card 2: Office Solutions (Printer & Office Hardware) */}
          <div className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:shadow-md">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-[#0072BC] flex items-center justify-center shrink-0 shadow-xs">
                  <Printer className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider block">Service 02</span>
                  <h3 className="text-lg font-bold text-slate-900">Office Solutions (Printers &amp; Hardware)</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Comprehensive maintenance and technical repair for office laser printers, multifunction copiers, sheet-fed scanners, genuine toner supplies, and on-site hardware fleet support.
              </p>

              <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Laser printer &amp; copier component repair and roller replacements</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Document scanner optical sensor calibration &amp; ADF feed maintenance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Original toner supply, waste box disposal &amp; maintenance contracts</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedService(services[1])}
                className="w-full py-2.5 px-4 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <span>Learn More About Office Printer Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0072BC] flex items-center justify-center">
                <selectedService.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedService.title}</h3>
                <span className="text-xs text-slate-500 font-semibold">{selectedService.category}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {selectedService.description}
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Service Scope &amp; Deliverables
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedService.details.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                onOpenInquiry(selectedService.title);
                setSelectedService(null);
              }}
              className="w-full py-2.5 px-4 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Book Service Consultation / Quote</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
