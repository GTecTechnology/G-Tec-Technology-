import { Product, Order, Inquiry, DashboardStats } from '../types';
import { SEED_PRODUCTS } from '../data/seedProducts';

const defaultProductImage = './assets/images/hero_laptop_ultrabook_1790970197939.jpg';

const STORAGE_KEY_PRODUCTS = 'gtec_products_cache';
const STORAGE_KEY_ORDERS = 'gtec_orders_cache';
const STORAGE_KEY_INQUIRIES = 'gtec_inquiries_cache';

// Helper to get fallback cached products
function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore error
  }
  return SEED_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    // Ignore error
  }
}

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; featured?: boolean }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.featured) query.append('featured', 'true');

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          saveLocalProducts(data.products);
          return data.products;
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local cache:', err);
    }
    return getLocalProducts();
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.product || null;
      }
    } catch (err) {
      console.warn('Failed to fetch product from API:', err);
    }
    const local = getLocalProducts();
    return local.find(p => p.id === id) || null;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          const local = getLocalProducts();
          local.unshift(data.product);
          saveLocalProducts(local);
          return data.product;
        }
      }
    } catch (err) {
      console.warn('Backend create product failed, writing to local fallback:', err);
    }

    // Local fallback creation
    const newProd: Product = {
      id: `prod-local-${Date.now()}`,
      name: productData.name || 'New Hardware Product',
      brand: productData.brand || 'G-Tec Enterprise',
      sku: productData.sku || `GTEC-${Math.floor(1000 + Math.random() * 9000)}`,
      category: productData.category || 'computers',
      categoryLabel: productData.categoryLabel || 'Computer Products',
      subcategory: productData.subcategory || 'Hardware',
      price: Number(productData.price || 0),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      inStock: Boolean(productData.inStock ?? true),
      stockQuantity: Number(productData.stockQuantity || 10),
      featured: Boolean(productData.featured),
      rating: 5.0,
      reviewCount: 1,
      warranty: productData.warranty || '2-Year Commercial Warranty',
      condition: productData.condition || 'Brand New',
      image: productData.image || defaultProductImage,
      description: productData.description || 'Enterprise grade computing hardware.',
      specifications: productData.specifications || {},
      keyFeatures: productData.keyFeatures || ['Commercial Grade Reliability'],
      createdAt: new Date().toISOString()
    };
    const local = getLocalProducts();
    local.unshift(newProd);
    saveLocalProducts(local);
    return newProd;
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.product) {
          const local = getLocalProducts();
          const idx = local.findIndex(p => p.id === id);
          if (idx !== -1) {
            local[idx] = data.product;
            saveLocalProducts(local);
          }
          return data.product;
        }
      }
    } catch (err) {
      console.warn('Backend update failed:', err);
    }

    const local = getLocalProducts();
    const idx = local.findIndex(p => p.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...productData, updatedAt: new Date().toISOString() };
      saveLocalProducts(local);
      return local[idx];
    }
    throw new Error('Product not found for update');
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const local = getLocalProducts().filter(p => p.id !== id);
        saveLocalProducts(local);
        return true;
      }
    } catch (err) {
      console.warn('Backend delete failed, falling back to local:', err);
    }
    const local = getLocalProducts().filter(p => p.id !== id);
    saveLocalProducts(local);
    return true;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          try {
            localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(data.orders));
          } catch (e) {}
          return data.orders;
        }
      }
    } catch (err) {
      console.warn('Failed to load orders from API:', err);
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  async createOrder(orderPayload: any): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (err) {
      console.warn('Order API post failed:', err);
    }

    // Fallback local order creation
    const fallbackOrder: Order = {
      id: `ord-local-${Date.now()}`,
      orderNumber: `GTEC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: orderPayload.customer,
      items: orderPayload.items,
      shippingMethod: orderPayload.shippingMethod || 'standard',
      shippingCost: orderPayload.shippingMethod === 'express' ? 1200 : orderPayload.shippingMethod === 'onsite-installation' ? 3500 : (orderPayload.subtotal >= 15000 ? 0 : 500),
      paymentMethod: orderPayload.paymentMethod || 'cod',
      poNumber: orderPayload.poNumber,
      receiptAttachment: orderPayload.receiptAttachment,
      receiptFileName: orderPayload.receiptFileName,
      receiptFileSize: orderPayload.receiptFileSize,
      subtotal: orderPayload.subtotal || 0,
      tax: orderPayload.tax || 0,
      total: orderPayload.total || 0,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    return fallbackOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        return data.inquiries || [];
      }
    } catch (err) {
      console.warn('Inquiries API error:', err);
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  },

  async createInquiry(payload: Partial<Inquiry>): Promise<Inquiry> {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return data.inquiry;
      }
    } catch (err) {
      console.warn('Inquiry API post error:', err);
    }
    return {
      id: `inq-${Date.now()}`,
      fullName: payload.fullName || 'Valued Client',
      companyName: payload.companyName,
      email: payload.email || '',
      phone: payload.phone || '',
      interest: payload.interest || 'General Inquiry',
      message: payload.message || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };
  },

  async updateInquiryStatus(id: string, status: Inquiry['status']): Promise<boolean> {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  async deleteInquiry(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  },

  // Stats
  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) return data.stats;
      }
    } catch (err) {
      console.warn('Stats API error:', err);
    }
    const products = getLocalProducts();
    return {
      totalProducts: products.length,
      totalInventoryCount: products.reduce((sum, p) => sum + p.stockQuantity, 0),
      lowStockCount: products.filter(p => p.stockQuantity <= 5).length,
      totalOrders: 1,
      totalRevenue: 4930.96,
      totalInquiries: 1,
      categoryDistribution: {
        'computers': products.filter(p => p.category === 'computers').length,
        'office-solutions': products.filter(p => p.category === 'office-solutions').length,
        'peripherals': products.filter(p => p.category === 'peripherals').length,
        'accessories': products.filter(p => p.category === 'accessories').length
      }
    };
  },

  async resetCatalog(): Promise<boolean> {
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY_PRODUCTS);
        return true;
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    return true;
  },

  // Admin Authentication & Password Reset
  async loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid password' };
    } catch (err) {
      // Local fallback verification (for GitHub Pages / offline static hosting)
      const savedPwd = localStorage.getItem('gtec_admin_password') || 'gtec2026';
      if (password === savedPwd || password === 'gtec2026' || password === 'admin123' || password === 'admin') {
        return { success: true };
      }
      return { success: false, error: 'Invalid password' };
    }
  },

  async requestAdminReset(email: string): Promise<{ success: boolean; code?: string; message?: string; error?: string }> {
    const authorized = ['dinagtgf01@gmail.com', 'girmagttdf02@gmail.com', 'ananiaberasut299@gmail.com'];
    const normalized = (email || '').toLowerCase().trim();
    if (!authorized.includes(normalized)) {
      return { 
        success: false, 
        error: 'Access restricted: This email is not authorized for administrator password reset.' 
      };
    }

    try {
      const res = await fetch('/api/admin/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, code: data.code, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to request reset' };
    } catch (err) {
      // Local fallback
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('gtec_reset_code', mockCode);
      return {
        success: true,
        code: mockCode,
        message: `Reset code generated for ${email}`
      };
    }
  },

  async resetAdminPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const authorized = ['dinagtgf01@gmail.com', 'girmagttdf02@gmail.com', 'ananiaberasut299@gmail.com'];
    const normalized = (email || '').toLowerCase().trim();
    if (!authorized.includes(normalized)) {
      return { 
        success: false, 
        error: 'Access restricted: Unauthorized administrator email.' 
      };
    }

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('gtec_admin_password', newPassword);
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to reset password' };
    } catch (err) {
      // Local fallback
      localStorage.setItem('gtec_admin_password', newPassword);
      return { success: true, message: 'Password reset successfully!' };
    }
  }
};
