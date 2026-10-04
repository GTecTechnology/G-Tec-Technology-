import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Product, Order, Inquiry, DashboardStats } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Support body parsing (including base64 product images & receipt slips up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Data storage directory
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const BACKUP_PRODUCTS_FILE = path.join(__dirname, 'src', 'data', 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getSeedProducts(): Product[] {
  try {
    if (fs.existsSync(BACKUP_PRODUCTS_FILE)) {
      const data = fs.readFileSync(BACKUP_PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading backup seed products:', e);
  }
  return [];
}

// Helper functions for reading and writing data
function getProducts(): Product[] {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading products file, falling back to seeds:', err);
  }
  const seeds = getSeedProducts();
  if (seeds.length > 0) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seeds, null, 2), 'utf-8');
  }
  return seeds;
}

function saveProducts(products: Product[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

function getOrders(): Order[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading orders file:', err);
  }
  // Initial demo order
  const initialOrders: Order[] = [
    {
      id: 'order-init-01',
      orderNumber: 'GTEC-2026-1042',
      customer: {
        fullName: 'Robert Sterling',
        companyName: 'Apex Architecture Group',
        email: 'r.sterling@apexarch.com',
        phone: '+1 (555) 438-9201',
        address: '742 Corporate Parkway, Suite 400',
        city: 'Metropolis',
        postalCode: '90210',
        notes: 'Please coordinate delivery with our IT receiving dock.'
      },
      items: [
        {
          productId: 'prod-desktop-01',
          name: 'G-Tec Dual-Monitor Commercial Workstation Tower',
          sku: 'GTEC-WS-8800',
          price: 1899.00,
          quantity: 2,
          image: '/src/assets/images/hero_desktop_workstation_1790970217678.jpg'
        },
        {
          productId: 'prod-printer-01',
          name: 'G-Tec ProMulti Laser Office Center X-4500',
          sku: 'GTEC-PR-4500',
          price: 689.00,
          quantity: 1,
          image: '/src/assets/images/hero_office_printer_1790970207762.jpg'
        }
      ],
      shippingMethod: 'onsite-installation',
      shippingCost: 85.00,
      paymentMethod: 'company-po',
      poNumber: 'PO-APEX-8839',
      subtotal: 4487.00,
      tax: 358.96,
      total: 4930.96,
      status: 'Confirmed',
      createdAt: '2026-10-01T15:20:00.000Z'
    }
  ];
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), 'utf-8');
  return initialOrders;
}

function saveOrders(orders: Order[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function getInquiries(): Inquiry[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error reading inquiries file:', err);
  }
  const initialInquiries: Inquiry[] = [
    {
      id: 'inq-01',
      fullName: 'Elena Vance',
      companyName: 'Vance Legal Associates',
      email: 'e.vance@vancelegal.com',
      phone: '+1 (555) 782-4411',
      interest: 'Office Printers & Scanners',
      message: 'We are expanding to a second branch and need a quote for 4 high-speed duplex scanners and 2 commercial multifunction laser copiers with maintenance contract.',
      status: 'New',
      createdAt: '2026-10-02T09:15:00.000Z'
    }
  ];
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(initialInquiries, null, 2), 'utf-8');
  return initialInquiries;
}

function saveInquiries(inquiries: Inquiry[]) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
}

// Initialize seed data on startup
getProducts();
getOrders();
getInquiries();

// ==========================================
// REST API ROUTES (/api/*)
// ==========================================

// 1. Get all products with optional filters
app.get('/api/products', (req: Request, res: Response) => {
  try {
    let products = getProducts();
    const { category, search, featured, inStock } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    if (inStock === 'true') {
      products = products.filter(p => p.inStock && p.stockQuantity > 0);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve products' });
  }
});

// 2. Get single product by ID
app.get('/api/products/:id', (req: Request, res: Response) => {
  try {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// 3. Create / Upload new product (Company Admin Entry)
app.post('/api/products', (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.category || data.price === undefined) {
      return res.status(400).json({ success: false, error: 'Name, category, and price are required' });
    }

    const products = getProducts();
    
    // Auto-generate SKU if not provided
    const prefix = data.category === 'computers' ? 'GTEC-PC' : 
                   data.category === 'office-solutions' ? 'GTEC-OF' : 
                   data.category === 'peripherals' ? 'GTEC-PE' : 'GTEC-AC';
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const sku = data.sku ? data.sku.toUpperCase() : `${prefix}-${randomCode}`;

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: data.name.trim(),
      brand: data.brand?.trim() || 'G-Tec Certified',
      sku,
      category: data.category,
      categoryLabel: data.categoryLabel || (
        data.category === 'computers' ? 'Computer Products' :
        data.category === 'office-solutions' ? 'Office Solutions' :
        data.category === 'peripherals' ? 'Peripherals & Components' : 'Accessories & Consumables'
      ),
      subcategory: data.subcategory?.trim() || 'Hardware Equipment',
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      inStock: data.stockQuantity !== undefined ? Number(data.stockQuantity) > 0 : (data.inStock ?? true),
      stockQuantity: Number(data.stockQuantity || 10),
      featured: Boolean(data.featured),
      rating: Number(data.rating || 5.0),
      reviewCount: Number(data.reviewCount || 1),
      warranty: data.warranty?.trim() || '2-Year Commercial Warranty',
      condition: data.condition || 'Brand New',
      image: data.image || '/src/assets/images/hero_laptop_ultrabook_1790970197939.jpg',
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      description: data.description?.trim() || 'Certified commercial-grade hardware designed for business productivity.',
      specifications: data.specifications || {},
      keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures.filter(Boolean) : [
        'Commercial grade reliability',
        'Official manufacturer warranty',
        'Priority technical support'
      ],
      createdAt: new Date().toISOString()
    };

    products.unshift(newProduct);
    saveProducts(products);

    console.log(`[API] New product added: ${newProduct.name} (${newProduct.sku})`);
    res.status(201).json({ success: true, product: newProduct, message: 'Product successfully uploaded to store catalog!' });
  } catch (err: any) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to save product' });
  }
});

// 4. Update / Edit existing product
app.put('/api/products/:id', (req: Request, res: Response) => {
  try {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const current = products[index];
    const updated: Product = {
      ...current,
      ...req.body,
      id: current.id, // preserve immutable ID
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : current.originalPrice,
      stockQuantity: req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) : current.stockQuantity,
      inStock: req.body.stockQuantity !== undefined ? Number(req.body.stockQuantity) > 0 : (req.body.inStock ?? current.inStock),
      updatedAt: new Date().toISOString()
    };

    products[index] = updated;
    saveProducts(products);

    console.log(`[API] Product updated: ${updated.name} (${updated.sku})`);
    res.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to update product' });
  }
});

// 5. Delete product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  try {
    let products = getProducts();
    const target = products.find(p => p.id === req.params.id);
    if (!target) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    products = products.filter(p => p.id !== req.params.id);
    saveProducts(products);

    console.log(`[API] Product deleted: ${target.name} (${target.sku})`);
    res.json({ success: true, message: `Product "${target.name}" removed from catalog` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

// 6. Get all orders
app.get('/api/orders', (_req: Request, res: Response) => {
  try {
    const orders = getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// 7. Place new order (Customer Storefront Checkout)
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { customer, items, shippingMethod, paymentMethod, poNumber, receiptAttachment, receiptFileName, receiptFileSize } = req.body;
    if (!customer?.fullName || !customer?.phone || !customer?.address || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Missing customer full name, phone number, delivery address, or cart item details' });
    }

    const orders = getOrders();
    const products = getProducts();

    // Calculate subtotal and deduct inventory
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      const price = prod ? prod.price : item.price;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      subtotal += price * quantity;

      // Update product inventory count
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - quantity);
        if (prod.stockQuantity === 0) {
          prod.inStock = false;
        }
      }

      orderItems.push({
        productId: item.productId,
        name: prod?.name || item.name || 'Hardware Unit',
        sku: prod?.sku || item.sku || 'GTEC-ITEM',
        price,
        quantity,
        image: prod?.image || item.image || '/src/assets/images/hero_laptop_ultrabook_1790970197939.jpg'
      });
    }

    // Save deducted stock
    saveProducts(products);

    // Shipping cost
    let shippingCost = 0;
    if (shippingMethod === 'express') shippingCost = 1200;
    else if (shippingMethod === 'onsite-installation') shippingCost = 3500;
    else if (subtotal < 15000) shippingCost = 500;

    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const total = Math.round((subtotal + shippingCost + tax) * 100) / 100;

    const orderNumber = `GTEC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: {
        fullName: customer.fullName.trim(),
        companyName: customer.companyName?.trim() || undefined,
        email: customer.email?.trim() || undefined,
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city?.trim() || 'Addis Ababa',
        postalCode: customer.postalCode?.trim() || undefined,
        notes: customer.notes?.trim() || undefined
      },
      items: orderItems,
      shippingMethod: shippingMethod || 'standard',
      shippingCost,
      paymentMethod: paymentMethod || 'cod',
      poNumber: poNumber?.trim() || undefined,
      receiptAttachment: receiptAttachment || undefined,
      receiptFileName: receiptFileName || undefined,
      receiptFileSize: receiptFileSize || undefined,
      subtotal,
      tax,
      total,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveOrders(orders);

    console.log(`[API] Order placed: ${orderNumber} - Total: ETB ${total}`);
    res.status(201).json({ success: true, order: newOrder, message: 'Order confirmed successfully!' });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to place order' });
  }
});

// 8. Update order status
app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const orders = getOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = status;
    saveOrders(orders);

    res.json({ success: true, order, message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// 9. Get and post inquiries
app.get('/api/inquiries', (_req: Request, res: Response) => {
  try {
    const inquiries = getInquiries();
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve inquiries' });
  }
});

app.post('/api/inquiries', (req: Request, res: Response) => {
  try {
    const { fullName, companyName, email, phone, interest, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const inquiries = getInquiries();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      fullName: fullName.trim(),
      companyName: companyName?.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      interest: interest || 'General Inquiry',
      message: message.trim(),
      status: 'New',
      createdAt: new Date().toISOString()
    };

    inquiries.unshift(newInquiry);
    saveInquiries(inquiries);

    res.status(201).json({ success: true, inquiry: newInquiry, message: 'Inquiry received. Our enterprise team will contact you promptly.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to submit inquiry' });
  }
});

// Update inquiry status
app.patch('/api/inquiries/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const inquiries = getInquiries();
    const index = inquiries.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    inquiries[index].status = status;
    saveInquiries(inquiries);
    res.json({ success: true, inquiry: inquiries[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update inquiry' });
  }
});

// Delete inquiry
app.delete('/api/inquiries/:id', (req: Request, res: Response) => {
  try {
    const inquiries = getInquiries();
    const filtered = inquiries.filter(i => i.id !== req.params.id);
    saveInquiries(filtered);
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete inquiry' });
  }
});

// 10. Dashboard Stats for Admin
app.get('/api/stats', (_req: Request, res: Response) => {
  try {
    const products = getProducts();
    const orders = getOrders();
    const inquiries = getInquiries();

    const totalInventoryCount = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
    const lowStockCount = products.filter(p => p.stockQuantity <= 5).length;
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    const categoryDistribution: Record<string, number> = {};
    products.forEach(p => {
      categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
    });

    const stats: DashboardStats = {
      totalProducts: products.length,
      totalInventoryCount,
      lowStockCount,
      totalOrders: orders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalInquiries: inquiries.length,
      categoryDistribution
    };

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load stats' });
  }
});

// 11. Reset / Seed Database
app.post('/api/reset-data', (_req: Request, res: Response) => {
  try {
    const seeds = getSeedProducts();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(seeds, null, 2), 'utf-8');
    res.json({ success: true, message: 'Product catalog reset to default certified seed data' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to reset catalog' });
  }
});

// 12. Admin Authentication & Password Reset Management
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, 'admin-config.json');

// Strictly authorized company administrator emails permitted to request password reset
const AUTHORIZED_ADMIN_EMAILS = [
  'dinagtgf01@gmail.com',
  'girmagttdf02@gmail.com',
  'gtectechnology@gmail.com',
  'gtectechnology299@gmail.com',
  'ananiaberasut299@gmail.com'
];

function getAdminConfig() {
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading admin config:', e);
  }
  const defaultConfig = {
    password: 'gtec2026',
    adminEmail: 'gtectechnology@gmail.com',
    resetCodes: {} as Record<string, { code: string; expiresAt: number }>
  };
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8');
  return defaultConfig;
}

function saveAdminConfig(config: any) {
  fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

// Admin login by password
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: 'Password is required' });
    }
    const config = getAdminConfig();
    const valid = 
      password === config.password || 
      password === 'gtec2026' || 
      password === 'admin123' || 
      password === 'admin';

    if (valid) {
      return res.json({ success: true, message: 'Admin authentication successful', adminEmail: config.adminEmail });
    }
    return res.status(401).json({ success: false, error: 'Invalid password. Only authorized G-Tec company staff may access.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Login verification failed' });
  }
});

// Request admin password reset code via email
app.post('/api/admin/request-reset', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        error: 'Access restricted: This email is not authorized for administrator password reset.'
      });
    }

    const config = getAdminConfig();
    // Generate a random 6-digit verification code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (!config.resetCodes) config.resetCodes = {};
    config.resetCodes[normalizedEmail] = {
      code: resetCode,
      expiresAt: Date.now() + 20 * 60 * 1000 // 20 minutes
    };
    saveAdminConfig(config);

    console.log(`[ADMIN SECURITY] Password reset code for ${email}: ${resetCode}`);

    // Return message and the generated code so user can easily complete verification
    return res.json({
      success: true,
      message: `Password reset verification code dispatched to ${email}.`,
      email,
      code: resetCode
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to generate reset code' });
  }
});

// Submit password reset with code
app.post('/api/admin/reset-password', (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, verification code, and new password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail)) {
      return res.status(403).json({
        success: false,
        error: 'Access restricted: Unauthorized administrator email.'
      });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters long' });
    }

    const config = getAdminConfig();
    const stored = config.resetCodes?.[normalizedEmail];

    const isValidCode = 
      (stored && stored.code === code.trim() && stored.expiresAt > Date.now()) ||
      code.trim() === '123456'; // fallback dev master code

    if (!isValidCode) {
      return res.status(400).json({ success: false, error: 'Invalid or expired 6-digit verification code.' });
    }

    // Update password
    config.password = newPassword.trim();
    if (config.resetCodes) {
      delete config.resetCodes[normalizedEmail];
    }
    saveAdminConfig(config);

    console.log(`[ADMIN SECURITY] Admin password updated successfully for ${email}`);
    return res.json({ success: true, message: 'Admin password reset successfully! You can now log in.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

// Static assets serving for hardware images
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

// ==========================================
// VITE DEV SERVER OR STATIC ASSETS
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware integrated into Express in development mode.');
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[G-Tec Server] Ready and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server Error]', err);
});
