import React, { useState } from 'react';
import { Product } from '../types';
import { 
  ShoppingBag, 
  Eye, 
  Check, 
  Sparkles, 
  Laptop, 
  Printer, 
  ScanLine,
  Cpu, 
  Layers,
  Search,
  Heart,
  SlidersHorizontal,
  Star,
  X
} from 'lucide-react';
import { formatETB } from '../utils/formatCurrency';

interface FeaturedProductsProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (productId: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  searchQuery,
  onSearchChange,
  wishlistIds = [],
  onToggleWishlist
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // 4 Target Categories + All Equipment
  const categories = [
    { id: 'all', label: 'All Equipment', icon: Layers },
    { id: 'computers', label: 'Computer', icon: Laptop },
    { id: 'printers', label: 'Printer', icon: Printer },
    { id: 'scanners', label: 'Scanner', icon: ScanLine },
    { id: 'accessories', label: 'Accessories', icon: Cpu }
  ];

  // Dynamic Header Title depending on selection
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case 'computers':
        return 'Computer Products (Laptops & Workstations)';
      case 'printers':
        return 'Office Printer Products';
      case 'scanners':
        return 'Document Scanner Products';
      case 'accessories':
        return 'Accessories & Power Hardware';
      default:
        return 'Commercial Hardware Catalog';
    }
  };

  // Filtering
  let filtered = products.filter(item => {
    const matchesCategory = 
      activeCategory === 'all' || 
      item.category === activeCategory ||
      (activeCategory === 'computers' && (item.category === 'computers' || item.subcategory.toLowerCase().includes('laptop') || item.subcategory.toLowerCase().includes('workstation') || item.subcategory.toLowerCase().includes('conference'))) ||
      (activeCategory === 'printers' && (item.category === 'printers' || item.subcategory.toLowerCase().includes('printer') || item.subcategory.toLowerCase().includes('copier'))) ||
      (activeCategory === 'scanners' && (item.category === 'scanners' || item.subcategory.toLowerCase().includes('scanner') || item.subcategory.toLowerCase().includes('digitizer'))) ||
      (activeCategory === 'accessories' && (item.category === 'accessories' || item.category === 'peripherals' || item.subcategory.toLowerCase().includes('power') || item.subcategory.toLowerCase().includes('toner') || item.subcategory.toLowerCase().includes('dock') || item.subcategory.toLowerCase().includes('input')));

    const matchesSearch = searchQuery === '' || (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subcategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStock = !onlyInStock || item.inStock;
    return matchesCategory && matchesSearch && matchesStock;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="products-catalog" className="py-14 sm:py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0072BC] mb-1">
              <span>Equipment Catalog</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-700 font-bold uppercase">
                {activeCategory === 'all' ? 'All Hardware' : activeCategory}
              </span>
              <span aria-hidden="true">·</span>
              <span>Prices in ETB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {getCategoryTitle()}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              {activeCategory === 'computers'
                ? 'High-performance business laptops, CAD dual-monitor workstations, and executive computer systems.'
                : activeCategory === 'printers'
                ? 'High-volume office laser printers, multifunction copiers, and duplex network printing stations.'
                : activeCategory === 'scanners'
                ? 'High-speed ADF sheet-fed document scanners with optical character recognition (OCR) digitization.'
                : activeCategory === 'accessories'
                ? 'Enterprise pure sine-wave UPS units, Thunderbolt docks, toner cartridges, and ergonomic peripherals.'
                : 'Commercial hardware catalog for computers, office printers, sheet-fed scanners, and certified enterprise peripherals.'}
            </p>
          </div>

          {/* Quick stats indicator */}
          <div className="flex items-center gap-3 shrink-0 text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Showing <strong className="text-slate-900">{filtered.length}</strong> items</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">Immediate Dispatch</span>
          </div>
        </div>

        {/* Dedicated Product Search Bar Above All Equipment */}
        <div className="mb-6 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Input Container */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#0072BC]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search all equipment by model, brand, specification (e.g. Core i7, LaserJet, Scanner, 64GB)..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm font-medium rounded-xl border border-slate-200 focus:border-[#0072BC] focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Matching items counter & reset */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-500">
                <strong className="text-slate-900 font-bold">{filtered.length}</strong> equipment found
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="text-xs font-bold text-[#0072BC] hover:underline cursor-pointer"
                >
                  Reset Search
                </button>
              )}
            </div>
          </div>

          {/* Quick Search Tag Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              Popular Searches:
            </span>
            {['UltraBook', 'LaserJet', 'Duplex Scanner', 'Workstation', 'Toner Cartridge', 'UPS Power', 'i9'].map((keyword) => {
              const isActive = searchQuery.toLowerCase() === keyword.toLowerCase();
              return (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => onSearchChange(isActive ? '' : keyword)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0072BC] text-white shadow-2xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {keyword}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pills & Interactive Filters Bar */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 mb-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Category selection tabs: Computer, Printer, Scanner, Accessories, All */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map(cat => {
                const isSelected = activeCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? 'bg-[#0072BC] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* In-Stock & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
              {/* In-Stock Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-slate-300 text-[#0072BC] focus:ring-cyan-500 h-4 w-4"
                />
                <span>In-Stock Only</span>
              </label>

              <span className="text-slate-300 hidden sm:inline">|</span>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#0072BC] text-xs font-medium cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High (ETB)</option>
                  <option value="price-desc">Price: High to Low (ETB)</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching equipment found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try adjusting your search or category filter to discover more hardware equipment in our catalog.
            </p>
            <button
              onClick={() => { onSelectCategory('all'); onSearchChange(''); setOnlyInStock(false); }}
              className="px-4 py-2 bg-[#0072BC] text-white text-xs font-semibold rounded-lg hover:bg-[#005B99] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map(product => {
              const isAdded = addedIds[product.id];
              const isWish = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Product Image Frame */}
                  <div className="relative aspect-4/3 bg-slate-100/70 overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          parent.classList.add('bg-gradient-to-br', 'from-slate-100', 'to-slate-200');
                        }
                      }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {product.featured && (
                        <span className="bg-[#0072BC] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs tracking-wide">
                          Featured
                        </span>
                      )}
                      <span className="bg-white/95 backdrop-blur-xs text-slate-700 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                        {product.condition}
                      </span>
                    </div>

                    {/* Wishlist Heart Button */}
                    {onToggleWishlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs transition-colors cursor-pointer"
                        aria-label="Save to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isWish ? 'text-rose-500 fill-rose-500' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Product Details Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Subcategory & SKU */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span className="text-slate-600 font-semibold">{product.subcategory}</span>
                        <span className="font-mono text-slate-400">{product.sku}</span>
                      </div>

                      {/* Product Name */}
                      <h3 
                        className="font-bold text-slate-900 text-sm mt-1.5 leading-snug line-clamp-2 hover:text-[#0072BC] transition-colors cursor-pointer"
                        onClick={() => onSelectProduct(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="font-semibold text-slate-800 text-[11px]">{product.rating}</span>
                        <span className="text-slate-400 text-[11px]">({product.reviewCount} reviews)</span>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Key Tech Specs Snippet */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-600">
                        {Object.entries(product.specifications).slice(0, 2).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-1">
                            <span className="text-slate-400">{key}:</span>
                            <span className="font-medium text-slate-700 truncate max-w-[120px]">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action Buttons in ETB */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
                            {formatETB(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through tabular-nums">
                              {formatETB(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {product.inStock ? (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            In Stock ({product.stockQuantity})
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            Sold Out
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Specs</span>
                        </button>

                        <button
                          onClick={() => handleAdd(product)}
                          disabled={!product.inStock}
                          className={`flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : product.inStock
                              ? 'bg-[#0072BC] hover:bg-[#005B99] text-white shadow-xs active:scale-[0.98]'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>{product.inStock ? 'Add to Cart' : 'Sold Out'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
