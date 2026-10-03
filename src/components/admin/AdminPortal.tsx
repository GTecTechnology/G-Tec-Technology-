import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  Trash2, 
  Edit3, 
  Save, 
  ArrowLeft, 
  CheckCircle, 
  Layers, 
  ShoppingBag, 
  FileText, 
  BarChart3, 
  RefreshCw, 
  Search, 
  Eye, 
  Laptop, 
  Printer, 
  ScanLine, 
  Cpu, 
  Sparkles, 
  Check, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Package,
  Sliders,
  DollarSign,
  Paperclip,
  Headphones,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { Product, ProductCategory, Order, Inquiry, DashboardStats } from '../../types';
import { api } from '../../services/api';
import { GTecLogo } from '../GTecLogo';
import { formatETB } from '../../utils/formatCurrency';

const laptopImg = './assets/images/hero_laptop_ultrabook_1790970197939.jpg';
const printerImg = './assets/images/hero_office_printer_1790970207762.jpg';
const workstationImg = './assets/images/hero_desktop_workstation_1790970217678.jpg';
const scannerImg = './assets/images/hero_scanner_hardware_1790970242091.jpg';
const conferenceImg = './assets/images/hero_conference_office_1790970228482.jpg';

interface AdminPortalProps {
  onBackToStore: () => void;
  onProductUpdated: () => void;
}

// Preset photo assets ready for 1-click selection
const PRESET_IMAGES = [
  {
    label: 'Modern Business Laptop',
    category: 'computers',
    url: laptopImg
  },
  {
    label: 'Multifunction Laser Printer',
    category: 'office-solutions',
    url: printerImg
  },
  {
    label: 'Dual-Monitor Workstation Tower',
    category: 'computers',
    url: workstationImg
  },
  {
    label: 'High-Speed Document Scanner',
    category: 'office-solutions',
    url: scannerImg
  },
  {
    label: 'Executive Conference Room',
    category: 'office-solutions',
    url: conferenceImg
  }
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToStore,
  onProductUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'inventory' | 'orders' | 'inquiries'>('upload');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Category view within the Upload section (includes standard hardware categories & 'corporate-quotes' submissions)
  const [uploadCategoryView, setUploadCategoryView] = useState<'computers' | 'office-solutions' | 'peripherals' | 'accessories' | 'corporate-quotes'>('computers');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'New' | 'Contacted' | 'Closed'>('all');
  const [inquirySearch, setInquirySearch] = useState('');

  // Form State for Product Data Entry / Upload
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'G-Tec Enterprise',
    sku: '',
    category: 'computers' as ProductCategory,
    subcategory: 'Laptops',
    price: 999.00,
    originalPrice: 1199.00,
    stockQuantity: 15,
    inStock: true,
    featured: true,
    condition: 'Brand New' as 'Brand New' | 'Certified Refurbished',
    warranty: '2-Year Commercial On-Site Warranty',
    image: laptopImg,
    description: '',
    specifications: [
      { key: 'Processor', value: 'Intel® Core™ i7-1365U vPro (10 Cores)' },
      { key: 'System Memory', value: '32 GB DDR5 5200MHz' },
      { key: 'Solid State Storage', value: '1 TB PCIe Gen4 NVMe SSD' },
      { key: 'Display Screen', value: '15.6" IPS FHD Anti-Glare 400 nits' }
    ],
    keyFeatures: [
      'Commercial grade military durability chassis',
      'Dual high-speed USB-C Thunderbolt 4 interfaces',
      'TPM 2.0 cryptographic enterprise hardware security'
    ]
  });

  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Inquiry management
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await api.updateInquiryStatus(id, status);
      await loadData();
      showToast(`Inquiry marked as ${status}`);
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this corporate quote submission?')) return;
    try {
      await api.deleteInquiry(id);
      await loadData();
      showToast('Submission deleted');
    } catch (e) {
      showToast('Failed to delete submission', 'error');
    }
  };

  const handleConvertInquiryToProduct = (inquiry: Inquiry) => {
    setEditingProductId(null);
    setUploadCategoryView('corporate-quotes');
    setFormData({
      name: `Custom Quote: ${inquiry.companyName || inquiry.fullName} - ${inquiry.interest}`,
      brand: inquiry.companyName || 'G-Tec Enterprise',
      sku: `GTEC-QS-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'corporate-quotes',
      subcategory: inquiry.interest,
      price: 25000,
      originalPrice: 28500,
      stockQuantity: 10,
      inStock: true,
      featured: true,
      condition: 'Brand New',
      warranty: '1-Year Enterprise Commercial SLA & Technical Support',
      image: conferenceImg,
      description: `Custom hardware quotation and deployment proposal prepared for ${inquiry.fullName} (${inquiry.companyName ? inquiry.companyName + ', ' : ''}${inquiry.email}, ${inquiry.phone}).\n\nClient inquiry requirements:\n"${inquiry.message}"`,
      specifications: [
        { key: 'Client Organization', value: inquiry.companyName || inquiry.fullName },
        { key: 'Direct Contact', value: `${inquiry.phone} | ${inquiry.email}` },
        { key: 'Requested Service', value: inquiry.interest },
        { key: 'Deployment Type', value: 'Custom Corporate Deployment' },
        { key: 'SLA Support', value: '24/7 Dedicated Hardware Assistance' }
      ],
      keyFeatures: [
        'Itemized hardware and peripheral allocation per client technical specifications',
        'Official commercial invoice and warranty certificate issued by G-Tec Technology',
        'Complete delivery, deployment, and on-site integration by certified technicians'
      ]
    });
    // Switch to upload view to review
    setUploadCategoryView('computers'); // show the form
    showToast('Inquiry converted into Product Quote! Adjust price and click Publish.');
  };

  // Load all initial admin data
  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords, inqs, st] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getInquiries(),
        api.getStats()
      ]);
      setProducts(prods);
      setOrders(ords);
      setInquiries(inqs);
      setStats(st);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Spec Template autofills based on hardware type
  const handleApplySpecTemplate = (type: 'laptop' | 'printer' | 'workstation' | 'scanner' | 'accessory') => {
    if (type === 'laptop') {
      setFormData(prev => ({
        ...prev,
        category: 'computers',
        subcategory: 'Laptops',
        image: laptopImg,
        specifications: [
          { key: 'Processor', value: 'Intel® Core™ i7-1365U (10-Core, up to 5.2 GHz)' },
          { key: 'System RAM', value: '32 GB DDR5 5200MHz' },
          { key: 'Primary Storage', value: '1 TB NVMe PCIe Gen4 M.2' },
          { key: 'Display Screen', value: '15.6" IPS FHD (1920x1080) 400 nits' },
          { key: 'Graphics Engine', value: 'Intel® Iris® Xe Graphics' },
          { key: 'Operating System', value: 'Windows 11 Pro 64-bit' }
        ],
        keyFeatures: [
          'Ultra-thin magnesium-aluminum alloy chassis',
          'Fast charge battery: 0 to 80% in 45 minutes',
          'Biometric fingerprint reader & IR camera for Windows Hello'
        ]
      }));
      showToast('Autofilled Business Laptop specification template');
    } else if (type === 'printer') {
      setFormData(prev => ({
        ...prev,
        category: 'office-solutions',
        subcategory: 'Laser Printers & Copiers',
        image: printerImg,
        specifications: [
          { key: 'Print Speed', value: 'Up to 48 pages per minute' },
          { key: 'Print Resolution', value: '1200 x 1200 dpi Optical' },
          { key: 'Duplex Printing', value: 'Automatic Two-Sided Printing & Scanning' },
          { key: 'ADF Feeder', value: '50-Sheet Auto Document Feeder' },
          { key: 'Monthly Duty Cycle', value: '80,000 pages per month' },
          { key: 'Network Interfaces', value: 'Gigabit Ethernet, Dual-Band Wi-Fi, USB 3.0' }
        ],
        keyFeatures: [
          'Ultra-low running cost per page with high-yield toner cartridges',
          'Pin-protected confidential print release',
          'Direct scan-to-email and network shared folder integration'
        ]
      }));
      showToast('Autofilled Commercial Laser Printer template');
    } else if (type === 'workstation') {
      setFormData(prev => ({
        ...prev,
        category: 'computers',
        subcategory: 'Desktop Workstations',
        image: workstationImg,
        specifications: [
          { key: 'Processor', value: 'Intel® Core™ i9-14900 (24 Cores / 32 Threads)' },
          { key: 'System RAM', value: '64 GB DDR5 5600MHz (Max 128GB)' },
          { key: 'Primary Storage', value: '2 TB NVMe PCIe Gen4 SSD' },
          { key: 'Graphics Card', value: 'NVIDIA® GeForce RTX™ 4070 12GB' },
          { key: 'Dual Monitors', value: '2x 27-inch QHD IPS 2560x1440 99% sRGB' },
          { key: 'Power Supply', value: '750W 80 PLUS Gold Certified' }
        ],
        keyFeatures: [
          'Turnkey dual-display commercial bundle ready to plug and work',
          'Acoustically dampened tower enclosure for quiet office acoustics',
          'Optimized for multi-threaded analytics, CAD, and spreadsheet processing'
        ]
      }));
      showToast('Autofilled Dual-Monitor Workstation template');
    } else if (type === 'scanner') {
      setFormData(prev => ({
        ...prev,
        category: 'office-solutions',
        subcategory: 'Scanners & Digitizers',
        image: scannerImg,
        specifications: [
          { key: 'Scan Speed', value: '60 ppm / 120 ipm duplex' },
          { key: 'Feeder Capacity', value: '80-Sheet Auto Document Feeder (ADF)' },
          { key: 'Optical Resolution', value: '600 dpi Optical (1200 interpolated)' },
          { key: 'Paper Handling', value: 'Business cards, IDs, receipts, legal size' },
          { key: 'Connectivity', value: 'USB 3.0 & Gigabit Ethernet LAN' }
        ],
        keyFeatures: [
          'Ultrasonic double-feed detection prevents skipped pages',
          'Built-in OCR converts directly to searchable PDF or Excel',
          'Compact folding desktop footprint'
        ]
      }));
      showToast('Autofilled Document Scanner template');
    } else if (type === 'accessory') {
      setFormData(prev => ({
        ...prev,
        category: 'accessories',
        subcategory: 'Toner & Supplies',
        image: printerImg,
        specifications: [
          { key: 'Page Yield', value: '14,000 Pages (Black) / 10,000 (Color)' },
          { key: 'Formulation', value: 'High-Density Micro-Polymer Toner' },
          { key: 'Compatibility', value: 'G-Tec X-4500 and standard office laser series' },
          { key: 'Certification', value: 'ISO 9001 & ISO 14001' }
        ],
        keyFeatures: [
          'Sharp smudge-proof text and vibrant graph printing',
          'Smart microchip displays accurate remaining percentage',
          'Free eco-recycle prepaid return bag included'
        ]
      }));
      showToast('Autofilled Office Supplies / Toner template');
    }
  };

  // Spec row modifications
  const handleAddSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleUpdateSpecRow = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => {
      const copy = [...prev.specifications];
      copy[index][field] = value;
      return { ...prev, specifications: copy };
    });
  };

  const handleRemoveSpecRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Feature bullet modifications
  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, '']
    }));
  };

  const handleUpdateFeature = (index: number, value: string) => {
    setFormData(prev => {
      const copy = [...prev.keyFeatures];
      copy[index] = value;
      return { ...prev, keyFeatures: copy };
    });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  // File upload simulation (FileReader)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData(prev => ({ ...prev, image: event.target!.result as string }));
          showToast('Custom product photo attached successfully');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-generate SKU
  const handleGenerateSku = () => {
    const prefix = formData.category === 'computers' ? 'GTEC-PC' :
                   formData.category === 'office-solutions' ? 'GTEC-PR' :
                   formData.category === 'peripherals' ? 'GTEC-PE' :
                   formData.category === 'corporate-quotes' ? 'GTEC-QS' :
                   'GTEC-AC';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, sku: `${prefix}-${rand}` }));
    showToast('Generated official SKU code');
  };

  // Submit / Publish Product to Website
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please provide a Product Name', 'error');
      return;
    }

    setLoading(true);

    try {
      // Build clean specs record
      const specsRecord: Record<string, string> = {};
      formData.specifications.forEach(row => {
        if (row.key.trim() && row.value.trim()) {
          specsRecord[row.key.trim()] = row.value.trim();
        }
      });

      const payload: Partial<Product> = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || 'G-Tec Certified',
        sku: formData.sku.trim() || `GTEC-${Math.floor(1000 + Math.random() * 9000)}`,
        category: formData.category,
        categoryLabel: formData.category === 'computers' ? 'Computer Products' :
                       formData.category === 'office-solutions' ? 'Office Solutions' :
                       formData.category === 'peripherals' ? 'Peripherals & Components' :
                       formData.category === 'corporate-quotes' ? 'Request Corporate Quote or Technical Support' :
                       'Accessories & Consumables',
        subcategory: formData.subcategory.trim() || 'Hardware Equipment',
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        inStock: Number(formData.stockQuantity) > 0 && formData.inStock,
        featured: formData.featured,
        warranty: formData.warranty.trim() || '2-Year Commercial Warranty',
        condition: formData.condition,
        image: formData.image,
        description: formData.description.trim() || `${formData.name} certified for commercial use.`,
        specifications: specsRecord,
        keyFeatures: formData.keyFeatures.filter(f => f.trim() !== '')
      };

      if (editingProductId) {
        // Edit mode
        await api.updateProduct(editingProductId, payload);
        showToast(`Product "${payload.name}" updated successfully! Changes are live on the site.`);
        setEditingProductId(null);
      } else {
        // Create mode
        const created = await api.createProduct(payload);
        showToast(`Product "${created.name}" published to storefront! It is now live.`);
      }

      // Reset form
      setFormData({
        name: '',
        brand: 'G-Tec Enterprise',
        sku: '',
        category: 'computers',
        subcategory: 'Laptops',
        price: 999.00,
        originalPrice: 1199.00,
        stockQuantity: 15,
        inStock: true,
        featured: true,
        condition: 'Brand New',
        warranty: '2-Year Commercial On-Site Warranty',
        image: laptopImg,
        description: '',
        specifications: [
          { key: 'Processor', value: 'Intel® Core™ i7-1365U vPro (10 Cores)' },
          { key: 'System Memory', value: '32 GB DDR5 5200MHz' },
          { key: 'Storage', value: '1 TB PCIe Gen4 NVMe SSD' },
          { key: 'Display', value: '15.6" IPS FHD Anti-Glare 400 nits' }
        ],
        keyFeatures: [
          'Commercial grade military durability chassis',
          'Fast charging enterprise battery'
        ]
      });

      // Refresh data
      await loadData();
      onProductUpdated();
    } catch (err: any) {
      console.error('Failed to submit product:', err);
      showToast('Error uploading product: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Edit existing product
  const handleEditClick = (product: Product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      sku: product.sku,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
      featured: product.featured,
      condition: product.condition,
      warranty: product.warranty,
      image: product.image,
      description: product.description,
      specifications: Object.entries(product.specifications || {}).map(([key, value]) => ({ key, value })),
      keyFeatures: product.keyFeatures || []
    });
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${product.name}" for editing`);
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the public store catalog?`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      showToast(`Removed "${name}" from catalog`);
      await loadData();
      onProductUpdated();
    } catch (err: any) {
      showToast('Could not delete product', 'error');
    }
  };

  // Quick Stock adjustment
  const handleQuickStock = async (product: Product, delta: number) => {
    const newQty = Math.max(0, product.stockQuantity + delta);
    try {
      await api.updateProduct(product.id, {
        stockQuantity: newQty,
        inStock: newQty > 0
      });
      await loadData();
      onProductUpdated();
      showToast(`Stock updated to ${newQty} units`);
    } catch (e) {}
  };

  // Toggle Featured status
  const handleToggleFeatured = async (product: Product) => {
    try {
      await api.updateProduct(product.id, { featured: !product.featured });
      await loadData();
      onProductUpdated();
      showToast(`Updated homepage featured status for ${product.name}`);
    } catch (e) {}
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadData();
      showToast(`Order marked as ${status}`);
    } catch (e) {}
  };

  // Filter products for inventory table
  const filteredProducts = products.filter(p => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = searchTerm === '' || (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top duration-300 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950 border-emerald-500/50 text-emerald-200' 
            : 'bg-rose-950 border-rose-500/50 text-rose-200'
        }`}>
          {toastMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Administration Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront</span>
            </button>
            <div className="h-6 w-px bg-slate-800" />
            <GTecLogo size="sm" variant="white" />
            <span className="hidden md:inline-block text-[11px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded font-mono font-bold tracking-wide">
              COMPANY MANAGEMENT CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0072BC] hover:bg-[#005FA0] text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-slate-800/60 py-1.5">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Product Upload &amp; Data Entry</span>
            {editingProductId && (
              <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-bold">
                EDITING
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Store Catalog &amp; Inventory</span>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Client Orders</span>
            <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span>Request Corporate Quote or Technical Support</span>
            <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
              {inquiries.length}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Quick KPI Stat Bar */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Active Products</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white font-mono">{stats.totalProducts}</span>
                <span className="text-xs text-slate-400">items in catalog</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Total Stock Units</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-300 font-mono">{stats.totalInventoryCount}</span>
                <span className="text-xs text-slate-400">units in warehouse</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Processed Orders</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">{stats.totalOrders}</span>
                <span className="text-xs text-slate-400">sales logged</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Gross Sales</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatETB(stats.totalRevenue)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCT UPLOAD & DATA ENTRY WEB FORM (The core user requirement) */}
        {/* ========================================================================= */}
        {activeTab === 'upload' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* Category Selector for the Upload Section */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Category Section:
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  (Select a category to upload products or manage quote &amp; support submissions)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setUploadCategoryView('computers');
                    setFormData(prev => ({ ...prev, category: 'computers', subcategory: 'Laptops' }));
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadCategoryView === 'computers'
                      ? 'bg-[#0072BC] text-white shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Computers</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUploadCategoryView('office-solutions');
                    setFormData(prev => ({ ...prev, category: 'office-solutions', subcategory: 'Printers & Copiers' }));
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadCategoryView === 'office-solutions'
                      ? 'bg-[#0072BC] text-white shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Office Solutions</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUploadCategoryView('peripherals');
                    setFormData(prev => ({ ...prev, category: 'peripherals', subcategory: 'Displays & Docks' }));
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadCategoryView === 'peripherals'
                      ? 'bg-[#0072BC] text-white shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <ScanLine className="w-3.5 h-3.5" />
                  <span>Peripherals</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUploadCategoryView('accessories');
                    setFormData(prev => ({ ...prev, category: 'accessories', subcategory: 'Accessories & Supplies' }));
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    uploadCategoryView === 'accessories'
                      ? 'bg-[#0072BC] text-white shadow-xs'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Accessories</span>
                </button>

                {/* THE REQUESTED CATEGORY: Request Corporate Quote or Technical Support */}
                <button
                  type="button"
                  onClick={() => setUploadCategoryView('corporate-quotes')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    uploadCategoryView === 'corporate-quotes'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                      : 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:bg-amber-900/60 hover:text-white'
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request Corporate Quote or Technical Support</span>
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {inquiries.length}
                  </span>
                </button>
              </div>
            </div>

            {/* IF CATEGORY IS: corporate-quotes -> SHOW SUBMISSIONS SECTION */}
            {uploadCategoryView === 'corporate-quotes' ? (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                      <Headphones className="w-4 h-4" />
                      <span>Client Inquiries &amp; Quote Submissions</span>
                      <span aria-hidden="true">·</span>
                      <span>Real-time Lead Intake</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Request Corporate Quote or Technical Support Submissions
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                      Live submissions received from the website's "Request Corporate Quote or Technical Support" consultation form. You can reply directly to the customer, update lead status, or convert the inquiry directly into a published custom quote product.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUploadCategoryView('computers');
                      setFormData(prev => ({
                        ...prev,
                        category: 'corporate-quotes',
                        subcategory: 'Corporate Solutions & Support',
                        name: 'Corporate IT Infrastructure & Support Contract',
                        price: 35000,
                        originalPrice: 42000
                      }));
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Custom Quote Product</span>
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search client, company, email, or message..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {(['all', 'New', 'Contacted', 'Closed'] as const).map(status => {
                      const count = status === 'all' 
                        ? inquiries.length 
                        : inquiries.filter(i => i.status === status).length;
                      const isSelected = inquiryStatusFilter === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setInquiryStatusFilter(status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <span className="capitalize">{status}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-300'}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submissions List */}
                {(() => {
                  const filteredInquiries = inquiries.filter(inq => {
                    const matchesStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
                    const q = inquirySearch.toLowerCase().trim();
                    const matchesSearch = !q || (
                      inq.fullName.toLowerCase().includes(q) ||
                      (inq.companyName && inq.companyName.toLowerCase().includes(q)) ||
                      inq.email.toLowerCase().includes(q) ||
                      inq.phone.toLowerCase().includes(q) ||
                      inq.message.toLowerCase().includes(q) ||
                      inq.interest.toLowerCase().includes(q)
                    );
                    return matchesStatus && matchesSearch;
                  });

                  if (filteredInquiries.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-500 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl space-y-2">
                        <Headphones className="w-10 h-10 mx-auto text-slate-600" />
                        <h4 className="text-sm font-bold text-slate-300">No Submissions Found</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          {inquiries.length === 0 
                            ? 'Client submissions from the "Request Corporate Quote or Technical Support" form on the public website will appear here in real-time.' 
                            : 'No inquiries match your current search and filter criteria.'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{inq.fullName}</span>
                                {inq.companyName && (
                                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded">
                                    {inq.companyName}
                                  </span>
                                )}
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  inq.status === 'New'
                                    ? 'bg-amber-950/80 text-amber-300 border-amber-600/60'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-950/80 text-blue-300 border-blue-600/60'
                                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60'
                                }`}>
                                  {inq.status}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                                <a href={`mailto:${inq.email}`} className="hover:text-cyan-300 flex items-center gap-1 font-mono">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{inq.email}</span>
                                </a>
                                {inq.phone && (
                                  <a href={`tel:${inq.phone}`} className="hover:text-cyan-300 flex items-center gap-1 font-mono">
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    <span>{inq.phone}</span>
                                  </a>
                                )}
                                <span className="text-slate-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-600" />
                                  <span>{new Date(inq.createdAt).toLocaleString()}</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
                              <select
                                value={inq.status}
                                onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                              Service / Equipment Area: {inq.interest}
                            </span>
                            <p className="text-xs text-slate-200 leading-relaxed italic">
                              "{inq.message}"
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleConvertInquiryToProduct(inq)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Convert to Custom Product / Quote</span>
                              </button>

                              <a
                                href={`mailto:${inq.email}?subject=G-Tec%20Technology%20Corporate%20Quote%20Follow-up&body=Dear%20${encodeURIComponent(inq.fullName)},%0D%0A%0D%0AThank%20you%20for%20contacting%20G-Tec%20Technology%20regarding%20${encodeURIComponent(inq.interest)}.`}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Reply to Client</span>
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-slate-500 hover:text-rose-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* OTHERWISE SHOW STANDARD PRODUCT UPLOAD FORM */
              <div>
                {/* Banner pointing to corporate quote inquiries */}
                <div className="mb-6 p-3 bg-amber-950/30 border border-amber-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-amber-200">
                    <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Client Inquiries:</strong> {inquiries.length} submissions received from <span className="font-semibold text-white">"Request Corporate Quote or Technical Support"</span>.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadCategoryView('corporate-quotes')}
                    className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>View All Submissions ({inquiries.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                      <span>Web Data Entry Interface</span>
                      <span aria-hidden="true">·</span>
                      <span>Instant Public Sync</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {editingProductId ? `Edit Product: ${formData.name}` : 'Upload New Product to Main Website'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                      Fill in the commercial specifications below. Upon submitting, this product will be recorded in the persistent database and immediately displayed in the customer storefront catalog.
                    </p>
                  </div>

                  {/* Template quick fill buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 block w-full sm:w-auto">Autofill Template:</span>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate('laptop')}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700 transition-colors"
                    >
                      💻 Laptop
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate('printer')}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700 transition-colors"
                    >
                      🖨️ Printer
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate('workstation')}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700 transition-colors"
                    >
                      🖥️ PC Tower
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate('scanner')}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700 transition-colors"
                    >
                      📄 Scanner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate('accessory')}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700 transition-colors"
                    >
                      📦 Toner / Supplies
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmitProduct} className="mt-8 space-y-8">
                  {/* 1. General Identification */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs">1</span>
                      Basic Equipment Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Product Name &amp; Model *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. G-Tec Enterprise UltraBook 15 Core i7"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Brand / Line
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          placeholder="e.g. G-Tec Enterprise / HP / Dell"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-300">SKU / Model Number</label>
                          <button
                            type="button"
                            onClick={handleGenerateSku}
                            className="text-[10px] text-cyan-400 hover:underline"
                          >
                            Auto-generate
                          </button>
                        </div>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="e.g. GTEC-NB-9400"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Store Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                        >
                          <option value="computers">Computer Products (Laptops, PCs, Desktops)</option>
                          <option value="office-solutions">Office Solutions (Printers, Scanners, Copiers)</option>
                          <option value="peripherals">Peripherals &amp; Components (Displays, Docks, Keyboards)</option>
                          <option value="accessories">Accessories &amp; Consumables (Toner, Cables, Power)</option>
                          <option value="corporate-quotes">Request Corporate Quote or Technical Support (Services &amp; Quotes)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Subcategory Tag
                        </label>
                        <input
                          type="text"
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          placeholder="e.g. Business Laptops, Laser Printers..."
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Description Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a comprehensive hardware summary for clients and corporate procurement..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 2. Commercial Pricing & Inventory */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs">2</span>
                  Pricing, Stock &amp; Commercial Terms
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Selling Price (ETB) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[11px]">ETB</span>
                      <input
                        type="number"
                        step="1"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-12 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Original / MSRP Price (ETB)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[11px]">ETB</span>
                      <input
                        type="number"
                        step="1"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-12 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Available Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Equipment Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e: any) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="Brand New">Brand New (Factory Sealed)</option>
                      <option value="Certified Refurbished">Certified Refurbished (Grade A)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Warranty Term
                  </label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="e.g. 2-Year Commercial On-Site Warranty"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* 3. Product Photography & Visuals */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs">3</span>
                  Product Image &amp; Media Asset
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Image Preview Box */}
                  <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-[11px] font-semibold text-slate-400 mb-2">Live Storefront Card Preview</span>
                    <div className="w-full aspect-4/3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden p-2">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Image Selectors */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Image URL / File Path
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://... or /src/assets/images/..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    {/* Quick Pick Presets */}
                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-2">
                        Or select from certified high-res hardware photography:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, image: preset.url }));
                              showToast(`Applied preset: ${preset.label}`);
                            }}
                            className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                              formData.image === preset.url
                                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="w-12 h-10 bg-slate-950 rounded overflow-hidden flex items-center justify-center p-1">
                              <img src={preset.url} alt={preset.label} className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="text-[10px] text-center font-medium line-clamp-1">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Local File upload */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Upload custom hardware photo from your device:
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Technical Specifications Builder */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs">4</span>
                    Technical Specifications Table
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="px-2.5 py-1 text-xs font-semibold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-800/80 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Specification Row</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.specifications.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Specification Parameter (e.g. Processor, RAM, Speed)"
                        value={row.key}
                        onChange={(e) => handleUpdateSpecRow(idx, 'key', e.target.value)}
                        className="w-1/3 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. Intel Core i7, 32GB DDR5, 48 ppm)"
                        value={row.value}
                        onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                        className="w-2/3 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Key Highlights / Bullet Points */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center text-xs">5</span>
                    Key Commercial Selling Points
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-2.5 py-1 text-xs font-semibold bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-800/80 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Feature Point</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-6 text-center">{idx + 1}.</span>
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleUpdateFeature(idx, e.target.value)}
                        placeholder="e.g. Military-grade chassis tested for 24/7 commercial duty"
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Visibility Toggles & Submission */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-950 p-6 rounded-xl border border-slate-800/80">
                <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                    />
                    <span>Highlight on Homepage Featured Grid</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                    />
                    <span>Mark as Available for Immediate Order</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProductId(null);
                        setFormData({
                          name: '',
                          brand: 'G-Tec Enterprise',
                          sku: '',
                          category: 'computers',
                          subcategory: 'Laptops',
                          price: 999.00,
                          originalPrice: 1199.00,
                          stockQuantity: 15,
                          inStock: true,
                          featured: true,
                          condition: 'Brand New',
                          warranty: '2-Year Commercial On-Site Warranty',
                          image: laptopImg,
                          description: '',
                          specifications: [],
                          keyFeatures: []
                        });
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-[#0072BC] hover:from-cyan-400 hover:to-[#005FA0] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {loading
                        ? 'Publishing...'
                        : editingProductId
                        ? 'Save & Update on Main Website'
                        : 'Publish Product to Main Website'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    )}

        {/* ========================================================================= */}
        {/* TAB 2: INVENTORY CATALOG MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Live Store Inventory Catalog</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage live prices, stock levels, featured tags, and product listings in real-time.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setActiveTab('upload');
                  }}
                  className="px-3.5 py-2 bg-[#0072BC] hover:bg-[#005FA0] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New Item</span>
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Reset catalog to factory demo products?')) {
                      await api.resetCatalog();
                      await loadData();
                      onProductUpdated();
                      showToast('Catalog restored to default seed products');
                    }
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Reset to factory sample catalog"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Seeds</span>
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search SKU or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="all">All Departments ({products.length})</option>
                  <option value="computers">Computers &amp; Laptops</option>
                  <option value="office-solutions">Office Solutions</option>
                  <option value="peripherals">Peripherals</option>
                  <option value="accessories">Accessories</option>
                  <option value="corporate-quotes">Request Corporate Quote or Technical Support</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Product &amp; SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit Price</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-12 h-10 bg-slate-900 border border-slate-800 rounded p-1 shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div>
                          <span className="font-bold text-white block line-clamp-1">{product.name}</span>
                          <span className="font-mono text-[11px] text-slate-400">{product.sku}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-300">
                        <span className="font-medium text-cyan-400 block">{product.subcategory}</span>
                        <span className="text-[11px] text-slate-400">{product.categoryLabel}</span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                        {formatETB(product.price)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold tabular-nums ${
                            product.stockQuantity <= 5 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {product.stockQuantity} units
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickStock(product, -1)}
                              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleQuickStock(product, +5)}
                              className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px]"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            product.featured
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {product.featured ? 'Yes' : 'No'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Commercial Hardware Orders</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and fulfill client orders submitted through the public storefront.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-semibold">No orders received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-xs text-slate-300 font-semibold mt-0.5 block">
                          Client: {order.customer.fullName} {order.customer.companyName ? `(${order.customer.companyName})` : ''}
                        </span>
                      </div>

                      {/* Status changer */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e: any) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-xs font-bold text-cyan-300 px-3 py-1 rounded-lg focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 uppercase font-semibold text-[10px] block">Delivery Location</span>
                        <p className="text-slate-300 mt-1">{order.customer.address}, {order.customer.city}</p>
                        <p className="text-slate-400 font-mono mt-0.5">
                          Phone: {order.customer.phone} {order.customer.email ? `· Email: ${order.customer.email}` : ''}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-500 uppercase font-semibold text-[10px] block">Payment Terms &amp; Logistics</span>
                        <p className="text-slate-300 mt-1 uppercase font-semibold">
                          Method: {order.paymentMethod} {order.poNumber ? `(PO: ${order.poNumber})` : ''}
                        </p>
                        <p className="text-slate-400">Shipping: {order.shippingMethod}</p>
                        {order.receiptAttachment && (
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
                            <Paperclip className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="text-cyan-300 font-semibold truncate max-w-[140px]">
                              {order.receiptFileName || 'receipt_slip'}
                            </span>
                            <a
                              href={order.receiptAttachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={order.receiptFileName || 'receipt_slip'}
                              className="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              View / Download Slip
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Line items */}
                    <div className="pt-2 border-t border-slate-800/60 divide-y divide-slate-800/40">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between text-xs">
                          <span className="text-slate-300">
                            <span className="font-mono text-cyan-400 font-bold">{item.quantity}x</span> {item.name} ({item.sku})
                          </span>
                          <span className="font-mono font-bold text-white tabular-nums">
                            {formatETB(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 text-xs font-bold text-white">
                      <span>Order Total:</span>
                      <span className="font-mono text-cyan-400 text-sm tabular-nums">{formatETB(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: B2B QUOTES & CORPORATE INQUIRIES */}
        {/* ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Corporate Quote Inquiries &amp; Service Leads</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Incoming business leads generated from the storefront quote and service consultation forms.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-xs font-semibold">No inquiries logged yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map(inq => (
                  <div key={inq.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-sm">{inq.fullName}</span>
                        {inq.companyName && (
                          <span className="text-xs text-cyan-400 ml-2">({inq.companyName})</span>
                        )}
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {inq.email} · {inq.phone}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-full text-[10px] font-bold">
                        {inq.interest}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      "{inq.message}"
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Submitted: {new Date(inq.createdAt).toLocaleString()}</span>
                      <a
                        href={`mailto:${inq.email}?subject=G-Tec%20Technology%20Hardware%20Quote`}
                        className="text-cyan-400 hover:underline font-semibold"
                      >
                        Reply via Email →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
