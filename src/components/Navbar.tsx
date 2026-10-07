import React, { useState } from 'react';
import { GTecLogo } from './GTecLogo';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  Heart, 
  FileText,
  Truck,
  ShieldCheck,
  Send,
  Lock,
  KeyRound,
  ChevronRight
} from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  onOpenQuote?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  cart,
  onOpenCart,
  searchQuery,
  onSearchChange,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenQuote,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'computers', label: 'COMPUTER' },
    { id: 'printers', label: 'PRINTER' },
    { id: 'scanners', label: 'SCANNER' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'services', label: 'SERVICES' },
    { id: 'support', label: 'SUPPORT' },
    { id: 'contact', label: 'CONTACT' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top announcement bar */}
      <div className="bg-[#072b4f] text-slate-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span className="font-bold text-cyan-300">G-Tec Technology</span>
            <span className="text-slate-500">·</span>
            <div className="flex items-center gap-2 text-slate-200 text-[11px] sm:text-xs">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Sales &amp; Tech Line 1:{' '}
                <a href="tel:+251910624518" className="font-mono text-cyan-300 font-semibold hover:underline">
                  +251 91 062 4518
                </a>{' '}
                /{' '}
                <a href="tel:0725594518" className="font-mono text-cyan-300 font-semibold hover:underline">
                  0725594518
                </a>
              </span>
              <span className="text-slate-500">|</span>
              <span>Customer Care Line 2: <a href="tel:+251967418315" className="font-mono text-cyan-300 font-semibold hover:underline">+251 96 741 8315</a></span>
            </div>
          </div>
          <div className="flex items-center gap-3.5 text-[11px] text-slate-300 shrink-0">
            <a
              href="https://t.me/G_Tec_Technolog"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-cyan-300 hover:text-white font-semibold transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded"
            >
              <Send className="w-3 h-3 text-cyan-300 shrink-0" />
              <span>Telegram: @G_Tec_Technolog</span>
            </a>
            <span className="text-slate-500 hidden md:inline">·</span>
            <span className="flex items-center gap-1 text-slate-300 hidden md:flex">
              <Truck className="w-3 h-3 text-cyan-400 shrink-0" />
              Free Addis Delivery over ETB 15,000
            </span>
            {onOpenAdmin && (
              <>
                <span className="text-slate-500 hidden sm:inline">·</span>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-cyan-300 hover:text-white font-semibold transition-colors bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer"
                  title="Company Admin: Product Uploading & Editing Page"
                >
                  <Lock className="w-3 h-3 text-cyan-300" />
                  <span>Admin Upload Page</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Brand element with guaranteed fixed layout */}
        <button
          onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-95 shrink-0 whitespace-nowrap"
          aria-label="G-Tec Technology Home"
        >
          <GTecLogo size="md" variant="full" className="shrink-0" />
        </button>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-bold tracking-wider text-slate-700 shrink-0">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  if (link.id === 'services' || link.id === 'contact' || link.id === 'support') {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (['computers', 'printers', 'scanners', 'accessories'].includes(link.id)) {
                    const el = document.getElementById('products-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`relative py-2 uppercase transition-colors hover:text-[#0072BC] cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-[#0072BC] font-extrabold' : 'text-slate-700'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0072BC] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Customer Actions & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <div className="relative">
            {showSearchInput ? (
              <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-300 focus-within:border-cyan-600 focus-within:ring-1 focus-within:ring-cyan-500 w-44 sm:w-60 transition-all">
                <Search className="w-4 h-4 text-slate-500 shrink-0 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent border-none text-xs w-full text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearchInput(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs ml-1 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Search Products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Telegram Quick Badge (sm and up) */}
          <a
            href="https://t.me/G_Tec_Technolog"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-[#0072BC] border border-cyan-200 text-xs font-semibold rounded-lg transition-colors"
            title="Open Telegram Channel"
          >
            <Send className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden lg:inline">Telegram</span>
          </a>

          {/* Wishlist Button */}
          {onOpenWishlist && (
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Saved Items"
              aria-label={`Wishlist, ${wishlistCount} items`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            aria-label={`Shopping Cart, ${cartTotalCount} items`}
          >
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            <span className="font-semibold text-xs tabular-nums hidden sm:inline text-slate-700">
              Cart
            </span>
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Admin Product Upload & Edit CTA */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-slate-400"
              title="Company Admin: Product Uploading & Editing Page"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0072BC]" />
              <span>Admin Upload</span>
            </button>
          )}

          {/* Primary Customer CTA: Request B2B Quote */}
          <button
            onClick={() => {
              if (onOpenQuote) {
                onOpenQuote();
              } else {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Get Quote</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                  if (link.id === 'services' || link.id === 'contact' || link.id === 'support') {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else if (['computers', 'printers', 'scanners', 'accessories'].includes(link.id)) {
                    const el = document.getElementById('products-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`text-left px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                  activeTab === link.id
                    ? 'bg-blue-50 text-[#0072BC]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Admin: Product Upload &amp; Edit Page</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}

            <a
              href="https://t.me/G_Tec_Technolog"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-600/10 text-[#0072BC] hover:bg-cyan-600/20 text-xs font-bold rounded-lg border border-cyan-200 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Join Telegram Channel: @G_Tec_Technolog</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0072BC] text-white text-xs font-bold rounded-lg shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Request Corporate Quote
            </button>

            <div className="text-center text-xs text-slate-700 py-1 space-y-1">
              <p className="font-semibold text-slate-900">Direct Support Lines:</p>
              <p>
                1. Sales &amp; Technical Support:{' '}
                <a href="tel:+251910624518" className="font-mono font-bold text-[#0072BC]">
                  +251 91 062 4518
                </a>{' '}
                /{' '}
                <a href="tel:0725594518" className="font-mono font-bold text-[#0072BC]">
                  0725594518
                </a>
              </p>
              <p>2. Customer Inquiries: <a href="tel:+251967418315" className="font-mono font-bold text-[#0072BC]">+251 96 741 8315</a></p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
