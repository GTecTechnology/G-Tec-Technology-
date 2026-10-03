import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FeaturedProducts } from './components/FeaturedProducts';
import { OurServices } from './components/OurServices';
import { SupportContactSection } from './components/SupportContactSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistModal } from './components/WishlistModal';
import { StaffLoginModal } from './components/StaffLoginModal';
import { FloatingChatButton } from './components/FloatingChatButton';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/admin/AdminPortal';
import { Check, ShoppingBag, Heart } from 'lucide-react';
import { formatETB } from './utils/formatCurrency';

const CART_STORAGE_KEY = 'gtec_ecommerce_cart';
const WISHLIST_STORAGE_KEY = 'gtec_ecommerce_wishlist';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<'store' | 'admin'>('store');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products & Loading state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [quoteInterestService, setQuoteInterestService] = useState<string>('General Inquiry');

  // Floating Toast State
  const [toastMessage, setToastMessage] = useState<{ text: string; icon?: 'cart' | 'wishlist' | 'success' } | null>(null);

  const showToast = (text: string, icon: 'cart' | 'wishlist' | 'success' = 'success') => {
    setToastMessage({ text, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return [];
  });

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore
    }
    return [];
  });

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      // Ignore
    }
  }, [cart]);

  // Save wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      // Ignore
    }
  }, [wishlistIds]);

  // Load products from API
  const fetchProductList = async () => {
    try {
      const list = await api.getProducts();
      setProducts(list);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity > 1 ? `${quantity}x ` : ''}"${product.name}" to cart`, 'cart');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    const isSaved = wishlistIds.includes(productId);
    const prod = products.find(p => p.id === productId);
    const name = prod ? prod.name : 'Product';

    if (isSaved) {
      setWishlistIds(prev => prev.filter(id => id !== productId));
      showToast(`Removed "${name}" from saved list`, 'wishlist');
    } else {
      setWishlistIds(prev => [...prev, productId]);
      showToast(`Saved "${name}" to wishlist`, 'wishlist');
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  // Navigation handlers
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'computers' || tab === 'printers' || tab === 'scanners' || tab === 'accessories') {
      setActiveCategory(tab);
      document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'office-solutions') {
      setActiveCategory('printers');
      document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'home') {
      setActiveCategory('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  // If Admin View is active, display the company management portal (accessible strictly after authentication)
  if (currentView === 'admin') {
    return (
      <AdminPortal
        onBackToStore={() => {
          setCurrentView('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onProductUpdated={() => {
          fetchProductList();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#072b4f] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          {toastMessage.icon === 'cart' ? (
            <ShoppingBag className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : toastMessage.icon === 'wishlist' ? (
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Customer Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenQuote={() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsStaffLoginOpen(true)}
      />

      {/* Hero Technological Banner */}
      <HeroBanner
        onSelectCategory={handleCategorySelect}
        onExploreProducts={() => {
          document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Commercial Products Catalog Section */}
      <FeaturedProducts
        products={products}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onSelectProduct={setSelectedProduct}
        onAddToCart={handleAddToCart}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Our Services Section */}
      <OurServices
        onOpenInquiry={(serviceTitle) => {
          setQuoteInterestService(serviceTitle);
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Support & Corporate Contact / Quote Section */}
      <SupportContactSection
        initialServiceInterest={quoteInterestService}
      />

      {/* Dark Ocean Blue Footer */}
      <Footer
        onOpenStaffLogin={() => setIsStaffLoginOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onRequestQuote={(prod) => {
          setQuoteInterestService(prod.categoryLabel);
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onViewProduct={(product) => setSelectedProduct(product)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={(_order: Order) => {
          handleClearCart();
          fetchProductList();
        }}
      />

      {/* Floating Chat with Support Button (Telegram Channel) */}
      <FloatingChatButton />

      {/* Protected Staff Authentication Modal for authorized company access only */}
      <StaffLoginModal
        isOpen={isStaffLoginOpen}
        onClose={() => setIsStaffLoginOpen(false)}
        onAuthenticated={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
