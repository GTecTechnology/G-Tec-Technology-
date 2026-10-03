import React, { useState } from 'react';
import { 
  Laptop, 
  Printer, 
  ScanLine, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (category: string) => void;
  onExploreProducts: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onExploreProducts
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Exactly 4 category buttons as requested by user (Flagship Core removed)
  const heroModules = [
    {
      id: 'computers',
      title: 'Commercial Laptops & Workstations',
      subtitle: 'Executive ultrabooks, dual-screen CAD towers & enterprise servers',
      icon: Laptop,
      categoryKey: 'computers',
      tag: 'Computer'
    },
    {
      id: 'printers',
      title: 'High-Volume Office Laser Printers',
      subtitle: 'Multifunction copiers, high-yield toner & duplex network printing',
      icon: Printer,
      categoryKey: 'printers',
      tag: 'Printer'
    },
    {
      id: 'scanners',
      title: 'High-Speed Document Scanners',
      subtitle: 'Fast ADF sheet digitizers & optical character recognition (OCR)',
      icon: ScanLine,
      categoryKey: 'scanners',
      tag: 'Scanner'
    },
    {
      id: 'accessories',
      title: 'Enterprise Accessories & Power',
      subtitle: 'Pure sine-wave UPS backups, docks, monitors, keyboards & supplies',
      icon: Cpu,
      categoryKey: 'accessories',
      tag: 'Accessories'
    }
  ];

  const handleCategoryClick = (categoryKey: string, idx: number) => {
    setActiveSlide(idx);
    onSelectCategory(categoryKey);
    onExploreProducts();
  };

  const handlePrev = () => {
    const nextIdx = activeSlide === 0 ? heroModules.length - 1 : activeSlide - 1;
    setActiveSlide(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = activeSlide === heroModules.length - 1 ? 0 : activeSlide + 1;
    setActiveSlide(nextIdx);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#061d33] via-[#083c66] to-[#026999] text-white py-12 md:py-16 shadow-inner">
      {/* Subtle tech circuit grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" 
        aria-hidden="true" 
      />
      
      {/* Ambient gradient spotlight */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-400/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Category Buttons Section: Computer, Printer, Scanner, Accessories */}
        <div className="relative flex items-center justify-between my-2">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="z-20 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shrink-0"
            aria-label="Previous category"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-200" />
          </button>

          {/* 4 Interactive Category Buttons with Clean Typography */}
          <div className="grid grid-cols-4 gap-2 sm:gap-6 md:gap-8 w-full max-w-3xl mx-auto px-2 sm:px-4">
            {heroModules.map((item, idx) => {
              const isActive = activeSlide === idx;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleCategoryClick(item.categoryKey, idx)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isActive ? 'scale-105 sm:scale-110' : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  title={`Open ${item.tag} Products`}
                  aria-label={`Open ${item.tag} Products Section`}
                >
                  <div
                    className={`w-14 h-14 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl flex items-center justify-center p-3 transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-white/30 to-white/10 border-2 border-cyan-400 shadow-[0_0_22px_rgba(56,189,248,0.5)] backdrop-blur-md'
                        : 'bg-white/10 border border-white/15 hover:bg-white/20 hover:border-cyan-400/50'
                    }`}
                  >
                    <Icon className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-colors ${
                      isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'
                    }`} />
                  </div>

                  {/* Clean text label visible on ALL devices */}
                  <span 
                    className={`text-xs sm:text-sm font-bold mt-2 text-center tracking-wide transition-colors block ${
                      isActive ? 'text-cyan-300 drop-shadow-sm font-extrabold' : 'text-slate-200 group-hover:text-white'
                    }`}
                    style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                  >
                    {item.tag}
                  </span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shadow-[0_0_8px_#38bdf8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="z-20 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shrink-0"
            aria-label="Next category"
          >
            <ChevronRight className="w-5 h-5 text-cyan-200" />
          </button>
        </div>

        {/* Central Slogan */}
        <div className="text-center mt-8 md:mt-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Official Commercial Hardware &amp; Office Systems · Ethiopia
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase text-white drop-shadow-md text-balance">
            G TEC. TECHNOLOGY - YOUR COMPREHENSIVE TECHNOLOGY PARTNER
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            Providing commercial laptops, dual-monitor workstations, high-yield laser copiers, high-speed document digitizers, and certified enterprise hardware support.
          </p>

          {/* Active Highlight Info Card based on carousel selection */}
          <div className="mt-7 bg-black/25 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:p-5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-xs uppercase tracking-wider text-cyan-300 font-bold">
                Category: {heroModules[activeSlide].tag}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {heroModules[activeSlide].title}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {heroModules[activeSlide].subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => {
                  const cat = heroModules[activeSlide].categoryKey;
                  onSelectCategory(cat);
                  onExploreProducts();
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-[#0072BC] hover:from-cyan-400 hover:to-[#005FA0] text-white text-xs font-bold rounded-lg shadow-md hover:shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                <span>Open {heroModules[activeSlide].tag} Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Full G-Tec Warranty Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Addis Ababa Delivery &amp; Setup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Prices in ETB · Corporate Invoicing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
