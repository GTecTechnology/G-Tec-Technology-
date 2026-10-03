import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { formatETB } from '../utils/formatCurrency';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onViewProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onViewProduct
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-slate-900 text-base">Saved Equipment &amp; Wishlist</h3>
            <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {wishlistProducts.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Your wishlist is currently empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tap the heart icon on any computer, printer, scanner, or component to save it for quick review.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#0072BC] text-white text-xs font-semibold rounded-lg hover:bg-[#005B99] transition-colors cursor-pointer"
              >
                Browse Equipment
              </button>
            </div>
          ) : (
            wishlistProducts.map(product => (
              <div 
                key={product.id}
                className="flex items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div 
                  className="flex items-center gap-3 min-w-0 cursor-pointer"
                  onClick={() => {
                    onViewProduct(product);
                    onClose();
                  }}
                >
                  <div className="w-16 h-16 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply" 
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
                    <h5 className="font-bold text-slate-900 text-xs truncate hover:text-[#0072BC]">
                      {product.name}
                    </h5>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-bold text-xs text-slate-900 tabular-nums">
                        {formatETB(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-slate-400 line-through tabular-nums">
                          {formatETB(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onRemoveFromWishlist(product.id);
                    }}
                    disabled={!product.inStock}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Remove from wishlist"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              All prices shown in Ethiopian Birr (ETB)
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
