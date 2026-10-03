import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck,
  Tag,
  Check
} from 'lucide-react';
import { CartItem } from '../types';
import { formatETB } from '../utils/formatCurrency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Free shipping threshold in Addis Ababa: ETB 15,000
  const freeShippingThreshold = 15000;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.trim().toUpperCase() === 'GTEC10') {
      setDiscountPercent(10);
      setCouponApplied(true);
    } else if (couponCode.trim().toUpperCase() === 'ETHIOPIA' || couponCode.trim().toUpperCase() === 'B2B') {
      setDiscountPercent(5);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid promotion code. Try GTEC10 for 10% off.');
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalSubtotal = subtotal - discountAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0072BC]" />
            <h2 className="font-bold text-slate-900 text-base">Commercial Cart</h2>
            <span className="bg-blue-100 text-[#0072BC] text-xs font-semibold px-2 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress in ETB */}
        <div className="bg-cyan-50/70 border-b border-cyan-100 px-4 py-2.5">
          <div className="flex items-center justify-between text-xs text-cyan-900 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#0072BC]" />
              {subtotal >= freeShippingThreshold ? (
                <span className="text-emerald-700 font-bold">Free Addis Ababa Delivery Unlocked!</span>
              ) : (
                <span>Add {formatETB(freeShippingThreshold - subtotal)} more for Free Delivery</span>
              )}
            </span>
            <span className="text-[11px] text-cyan-700 font-bold">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full bg-cyan-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-[#0072BC] h-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore our commercial computers, laser printers, scanners, and IT peripherals to begin adding items.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2.5 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.product.id}
                className="flex gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{item.product.sku}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-900 tabular-nums">
                      {formatETB(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. GTEC10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0072BC] uppercase font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={couponApplied || !couponCode.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {couponApplied ? 'Applied' : 'Apply'}
              </button>
            </form>

            {couponError && (
              <p className="text-[11px] text-rose-600">{couponError}</p>
            )}
            {couponApplied && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                {discountPercent}% promotional B2B discount applied!
              </p>
            )}

            {/* Calculations Breakdown in ETB */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">{formatETB(subtotal)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="tabular-nums">-{formatETB(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Addis Ababa Delivery</span>
                <span className="font-semibold text-emerald-600">
                  {subtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Estimated Total (ETB)</span>
                <span className="tabular-nums text-[#0072BC]">{formatETB(finalSubtotal)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Telebirr, CBE Birr &amp; Bank Transfer
              </span>
              <button
                onClick={onClearCart}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
