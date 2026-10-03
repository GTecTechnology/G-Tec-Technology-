import React, { useState } from 'react';
import { Product } from '../types';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  FileText, 
  Plus, 
  Minus, 
  Check,
  Star
} from 'lucide-react';
import { formatETB } from '../utils/formatCurrency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onRequestQuote: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onRequestQuote
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features'>('specs');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Product Imagery & Key Badges */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-[#0072BC] uppercase tracking-wider">{product.categoryLabel}</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">{product.sku}</span>
          </div>

          {/* Main Photo Showcase */}
          <div className="aspect-4/3 w-full bg-white rounded-xl border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden my-auto shadow-xs">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Value props beneath photo */}
          <div className="mt-4 pt-4 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0072BC] shrink-0" />
              <span>{product.warranty}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Addis Ababa Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Purchase Block, Specifications */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Backordered'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-slate-800 text-xs">{product.rating}</span>
              <span className="text-slate-400 text-xs">({product.reviewCount} verified enterprise reviews)</span>
            </div>

            {/* Price in ETB */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {formatETB(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  {formatETB(product.originalPrice)}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">Excl. applicable VAT</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector & Buy CTAs */}
          <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-xs font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-xs font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs font-semibold text-slate-700 ml-auto">
                Total: <strong className="text-slate-900">{formatETB(product.price * quantity)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : product.inStock
                    ? 'bg-[#0072BC] hover:bg-[#005B99] text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onRequestQuote(product);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Request B2B Quote</span>
              </button>
            </div>
          </div>

          {/* Specifications & Key Features Tabs */}
          <div className="flex-1">
            <div className="flex border-b border-slate-200 mb-3">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer mr-6 ${
                  activeTab === 'specs'
                    ? 'text-[#0072BC] border-b-2 border-[#0072BC]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'features'
                    ? 'text-[#0072BC] border-b-2 border-[#0072BC]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Key Features
              </button>
            </div>

            {activeTab === 'specs' ? (
              <div className="space-y-1.5 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 py-1 border-b border-slate-100 last:border-none">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="col-span-2 text-slate-900 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2 text-xs text-slate-600">
                {product.keyFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#0072BC] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
