export type ProductCategory = 
  | 'computers' 
  | 'printers'
  | 'scanners'
  | 'office-solutions' 
  | 'peripherals' 
  | 'accessories'
  | 'corporate-quotes';

export interface Product {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: ProductCategory;
  categoryLabel: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
  warranty: string;
  condition: 'Brand New' | 'Certified Refurbished';
  image: string;
  gallery?: string[];
  description: string;
  specifications: Record<string, string>;
  keyFeatures: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  companyName?: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  shippingMethod: 'standard' | 'express' | 'onsite-installation';
  shippingCost: number;
  paymentMethod: 'telebirr' | 'cbe-birr' | 'cod' | 'bank-transfer' | 'credit-card' | 'company-po';
  poNumber?: string;
  receiptAttachment?: string;
  receiptFileName?: string;
  receiptFileSize?: string;
  subtotal: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered';
  createdAt: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  interest: 'Computer Systems' | 'Office Printers & Scanners' | 'Enterprise IT Fleet' | 'Maintenance & Service' | 'General Inquiry';
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalInventoryCount: number;
  lowStockCount: number;
  totalOrders: number;
  totalRevenue: number;
  totalInquiries: number;
  categoryDistribution: Record<string, number>;
}
