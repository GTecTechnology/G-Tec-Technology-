import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Truck, 
  Building2, 
  CheckCircle2, 
  Printer, 
  ArrowRight,
  PackageCheck,
  Smartphone,
  CreditCard,
  Banknote,
  AlertCircle,
  Paperclip,
  UploadCloud,
  Trash2,
  FileCheck
} from 'lucide-react';
import { CartItem, Order, CustomerDetails } from '../types';
import { api } from '../services/api';
import { GTecLogo } from './GTecLogo';
import { formatETB } from '../utils/formatCurrency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderSuccess
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Hawassa',
    postalCode: '',
    notes: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'onsite-installation'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'telebirr' | 'cbe-birr' | 'bank-transfer' | 'cod' | 'company-po'>('telebirr');
  const [poNumber, setPoNumber] = useState('');
  
  // Payment Receipt Attachment State
  const [receiptFile, setReceiptFile] = useState<{
    name: string;
    size: string;
    dataUrl: string;
    type: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Shipping cost in ETB
  const shippingCost = 
    shippingMethod === 'express' 
      ? 1200 
      : shippingMethod === 'onsite-installation' 
      ? 3500 
      : (subtotal >= 15000 ? 0 : 500);

  // 15% Ethiopian VAT or commercial tax
  const tax = Math.round(subtotal * 0.15);
  const grandTotal = subtotal + shippingCost + tax;

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Receipt file exceeds 15MB limit. Please select a smaller image or document.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setReceiptFile({
        name: file.name,
        size: sizeStr,
        dataUrl,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Receipt file exceeds 15MB limit. Please select a smaller file.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setReceiptFile({
        name: file.name,
        size: sizeStr,
        dataUrl,
        type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Full name, Phone, and Address are required; Corporate Email Address is OPTIONAL as requested
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setErrorMessage('Please provide your Full Name, Phone Number, and Delivery Address.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          ...customer,
          email: customer.email?.trim() || undefined
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        shippingMethod,
        paymentMethod,
        poNumber: paymentMethod === 'company-po' ? poNumber : undefined,
        receiptAttachment: receiptFile?.dataUrl,
        receiptFileName: receiptFile?.name,
        receiptFileSize: receiptFile?.size,
        shippingCost,
        subtotal,
        tax,
        total: grandTotal
      };

      const placedOrder = await api.createOrder(orderPayload);
      setConfirmedOrder(placedOrder);
      onOrderSuccess(placedOrder);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      setErrorMessage('Unable to process order right now. Please verify your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Commercial Branding */}
        <div className="bg-[#072b4f] px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <GTecLogo variant="white" size="sm" />
            <div className="h-6 w-px bg-slate-700 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-300 block">
                Official Commercial Checkout
              </span>
              <span className="text-[11px] text-slate-300">
                Verified B2B &amp; Retail Procurement · Prices in ETB
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Confirmation Screen with Tax Invoice Summary in ETB */
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Order Confirmed &amp; Dispatched for Staging
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Thank You for Your Order!
              </h2>
              <p className="text-xs text-slate-600 mt-2">
                Order reference <strong className="font-mono text-slate-900">{confirmedOrder.orderNumber}</strong> has been logged into our enterprise dispatch system. Our commercial coordinator will contact you via phone to verify delivery.
              </p>
            </div>

            {/* Invoice Summary Box in ETB */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Client / Organization</span>
                  <p className="text-xs font-bold text-slate-900">
                    {confirmedOrder.customer.fullName} {confirmedOrder.customer.companyName && `(${confirmedOrder.customer.companyName})`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {confirmedOrder.customer.address}, {confirmedOrder.customer.city} · {confirmedOrder.customer.phone}
                    {confirmedOrder.customer.email && ` · ${confirmedOrder.customer.email}`}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Payment Method</span>
                  <p className="text-xs font-semibold text-slate-900 uppercase">
                    {confirmedOrder.paymentMethod}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 mt-1">
                    Status: {confirmedOrder.status}
                  </span>
                </div>
              </div>

              {/* Attached Payment Receipt Confirmation */}
              {confirmedOrder.receiptFileName && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold min-w-0">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Payment Receipt Attached: {confirmedOrder.receiptFileName}</span>
                  </div>
                  {confirmedOrder.receiptAttachment && (
                    <a
                      href={confirmedOrder.receiptAttachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={confirmedOrder.receiptFileName}
                      className="px-2.5 py-1 bg-white text-[#0072BC] border border-cyan-300 rounded font-bold text-[11px] hover:bg-cyan-50 shrink-0"
                    >
                      View Receipt
                    </a>
                  )}
                </div>
              )}

              {/* Order Items List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Ordered Equipment:</span>
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-200/60 last:border-none">
                    <span className="text-slate-800">
                      <strong>{item.quantity}x</strong> {item.name} <span className="font-mono text-slate-400">({item.sku})</span>
                    </span>
                    <span className="font-bold tabular-nums text-slate-900">
                      {formatETB(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals in ETB */}
              <div className="border-t border-slate-200 pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-semibold">{formatETB(confirmedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({confirmedOrder.shippingMethod})</span>
                  <span className="tabular-nums font-semibold">
                    {confirmedOrder.shippingCost === 0 ? 'FREE' : formatETB(confirmedOrder.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT (15%)</span>
                  <span className="tabular-nums font-semibold">{formatETB(confirmedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount (ETB)</span>
                  <span className="tabular-nums text-[#0072BC]">{formatETB(confirmedOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0072BC] hover:bg-[#005B99] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Return to Store</span>
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[82vh] overflow-y-auto">
            {/* Left 7 Cols: Customer & Payment Details */}
            <div className="lg:col-span-7 space-y-6">
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Customer Details */}
              <div>
                <h3 className="text-xs font-bold text-[#0072BC] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>1. Client &amp; Organization Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abebe Bikila"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Company / Organization</label>
                    <input
                      type="text"
                      placeholder="e.g. Ethiopian Tech PLC (Optional)"
                      value={customer.companyName || ''}
                      onChange={(e) => setCustomer({ ...customer, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-semibold">Corporate Email Address</label>
                      <span className="text-[10px] text-slate-400 font-medium">(Optional)</span>
                    </div>
                    <input
                      type="email"
                      placeholder="name@company.com (optional)"
                      value={customer.email || ''}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 91 062 4518"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Delivery Address (Street, Building, Floor) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hawassa, Commercial Center, 2nd Floor"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">City / Region *</label>
                    <select
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
                    >
                      <option value="Hawassa">Hawassa</option>
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Bishoftu / Debre Zeit">Bishoftu / Debre Zeit</option>
                      <option value="Adama / Nazret">Adama / Nazret</option>
                      <option value="Other Regional City">Other Regional City</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Special Delivery Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Gate 2 receiving dock"
                      value={customer.notes || ''}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Speed */}
              <div>
                <h3 className="text-xs font-bold text-[#0072BC] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>2. Delivery &amp; Deployment Option</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <label 
                    onClick={() => setShippingMethod('standard')}
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      shippingMethod === 'standard' 
                        ? 'border-[#0072BC] bg-blue-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Standard Delivery</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">1-2 business days across Ethiopia</div>
                    </div>
                    <span className="font-bold text-[#0072BC] mt-2">
                      {subtotal >= 15000 ? 'FREE' : formatETB(500)}
                    </span>
                  </label>

                  <label 
                    onClick={() => setShippingMethod('express')}
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      shippingMethod === 'express' 
                        ? 'border-[#0072BC] bg-blue-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Same-Day Express</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Priority courier in 4 hours</div>
                    </div>
                    <span className="font-bold text-[#0072BC] mt-2">{formatETB(1200)}</span>
                  </label>

                  <label 
                    onClick={() => setShippingMethod('onsite-installation')}
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      shippingMethod === 'onsite-installation' 
                        ? 'border-[#0072BC] bg-blue-50/50 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900">Engineer Setup</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">On-site unboxing &amp; network setup</div>
                    </div>
                    <span className="font-bold text-[#0072BC] mt-2">{formatETB(3500)}</span>
                  </label>
                </div>
              </div>

              {/* Step 3: Ethiopian Payment Methods & Receipt Attachment */}
              <div>
                <h3 className="text-xs font-bold text-[#0072BC] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>3. Payment Method &amp; Receipt Attachment</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div
                    onClick={() => setPaymentMethod('telebirr')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      paymentMethod === 'telebirr' ? 'border-[#0072BC] bg-blue-50/50 ring-1 ring-[#0072BC]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Telebirr</div>
                      <div className="text-[11px] text-slate-500">Fast payment via Telebirr merchant code</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cbe-birr')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      paymentMethod === 'cbe-birr' ? 'border-[#0072BC] bg-blue-50/50 ring-1 ring-[#0072BC]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">CBE Birr</div>
                      <div className="text-[11px] text-slate-500">Commercial Bank of Ethiopia transfer</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('bank-transfer')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      paymentMethod === 'bank-transfer' ? 'border-[#0072BC] bg-blue-50/50 ring-1 ring-[#0072BC]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Bank Wire / Deposit</div>
                      <div className="text-[11px] text-slate-500">Awash, Dashen, CBE or BOA account</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      paymentMethod === 'cod' ? 'border-[#0072BC] bg-blue-50/50 ring-1 ring-[#0072BC]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Cash on Delivery</div>
                      <div className="text-[11px] text-slate-500">Pay courier directly upon receipt</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('company-po')}
                    className={`sm:col-span-2 p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                      paymentMethod === 'company-po' ? 'border-[#0072BC] bg-blue-50/50 ring-1 ring-[#0072BC]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Corporate Purchase Order (Net-30)</div>
                      <div className="text-[11px] text-slate-500">Official PO invoicing for registered businesses &amp; organizations</div>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'company-po' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <label className="block text-slate-700 font-semibold">Enter Official Purchase Order (PO) Number</label>
                    <input
                      type="text"
                      placeholder="e.g. PO-2026-ETH-8942"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md font-mono"
                    />
                  </div>
                )}

                {/* Receipt Attachment Section */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#0072BC]" />
                      <span>Payment Receipt / Slip Attachment</span>
                      <span className="text-[10px] font-semibold text-cyan-800 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded">
                        Fast Verification
                      </span>
                    </label>
                    {receiptFile && (
                      <button
                        type="button"
                        onClick={() => setReceiptFile(null)}
                        className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
                    Attach your payment receipt screenshot (Telebirr SMS confirmation, CBE Birr transfer slip, Bank deposit voucher, or Corporate PO scan) to fast-track order verification and immediate dispatch.
                  </p>

                  {uploadError && (
                    <div className="mb-2 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {!receiptFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer ${
                        isDragging 
                          ? 'border-[#0072BC] bg-cyan-50/60 scale-[1.01]' 
                          : 'border-slate-300 hover:border-[#0072BC] bg-slate-50/80 hover:bg-slate-100/60'
                      }`}
                    >
                      <input
                        type="file"
                        id="receipt-file-input"
                        accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                        onChange={handleReceiptUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload payment receipt"
                      />
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-[#0072BC] flex items-center justify-center mb-0.5">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Click to attach receipt or drag &amp; drop file here
                        </span>
                        <p className="text-[10px] text-slate-400">
                          Supports PNG, JPG, JPEG, WEBP or PDF (Max 15MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {receiptFile.type.startsWith('image/') ? (
                          <div className="w-12 h-12 rounded-lg border border-emerald-300 overflow-hidden shrink-0 bg-white shadow-xs">
                            <img 
                              src={receiptFile.dataUrl} 
                              alt="Receipt preview" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-emerald-300 flex items-center justify-center shrink-0 bg-white text-emerald-700 shadow-xs">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="text-xs font-bold text-emerald-950 truncate block">
                              {receiptFile.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                            {receiptFile.size} · Receipt Successfully Attached
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label
                          htmlFor="receipt-change-input"
                          className="px-2.5 py-1 text-xs text-[#0072BC] hover:text-[#005B99] bg-white border border-slate-200 hover:border-slate-300 rounded-lg font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Change Slip
                        </label>
                        <input
                          type="file"
                          id="receipt-change-input"
                          accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                          onChange={handleReceiptUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Order Summary & Placement */}
            <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                  Order Summary ({cart.length} items)
                </h3>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 text-xs">
                      <div className="w-12 h-12 bg-white rounded border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">Qty: {item.quantity} × {formatETB(item.product.price)}</p>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums shrink-0">
                        {formatETB(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown in ETB */}
                <div className="border-t border-slate-200 mt-4 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-semibold">{formatETB(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="tabular-nums font-semibold">
                      {shippingCost === 0 ? 'FREE' : formatETB(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable VAT (15%)</span>
                    <span className="tabular-nums font-semibold">{formatETB(tax)}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-base pt-3 border-t border-slate-200">
                    <span>Grand Total (ETB)</span>
                    <span className="tabular-nums text-[#0072BC]">{formatETB(grandTotal)}</span>
                  </div>
                </div>

                {receiptFile && (
                  <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate text-[11px]">Slip attached: <strong>{receiptFile.name}</strong></span>
                  </div>
                )}
              </div>

              {/* Place Order CTA */}
              <div className="pt-6 space-y-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-[#0072BC] hover:bg-[#005B99] disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Commercial warranty &amp; official tax receipt included
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
