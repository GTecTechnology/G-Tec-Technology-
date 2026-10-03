import { Product } from '../types';

const laptopImg = './assets/images/hero_laptop_ultrabook_1790970197939.jpg';
const printerImg = './assets/images/hero_office_printer_1790970207762.jpg';
const workstationImg = './assets/images/hero_desktop_workstation_1790970217678.jpg';
const scannerImg = './assets/images/hero_scanner_hardware_1790970242091.jpg';
const conferenceImg = './assets/images/hero_conference_office_1790970228482.jpg';

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-laptop-01',
    name: 'G-Tec UltraBook Elite 15',
    brand: 'G-Tec Enterprise',
    sku: 'GTEC-NB-9420',
    category: 'computers',
    categoryLabel: 'Computer',
    subcategory: 'Laptops',
    price: 145000,
    originalPrice: 165000,
    inStock: true,
    stockQuantity: 18,
    featured: true,
    rating: 4.9,
    reviewCount: 42,
    warranty: '2-Year Official Commercial Warranty',
    condition: 'Brand New',
    image: laptopImg,
    description: 'High-performance ultralight business laptop engineered for executive productivity, multitasking, and remote enterprise operations.',
    specifications: {
      'Processor': 'Intel® Core™ i7-1365U vPro (10-Core, up to 5.2 GHz)',
      'Memory': '32 GB DDR5 5200MHz Dual-Channel',
      'Storage': '1 TB PCIe Gen4 NVMe M.2 SSD',
      'Display': '15.6" IPS FHD (1920x1080) Anti-Glare 400 nits',
      'Graphics': 'Intel® Iris® Xe Graphics',
      'Operating System': 'Windows 11 Pro 64-bit',
      'Battery Life': 'Up to 14 Hours with Fast Charge',
      'Connectivity': 'Wi-Fi 6E (802.11ax), Bluetooth 5.3, Thunderbolt 4, HDMI 2.1'
    },
    keyFeatures: [
      'Military-spec durability chassis (MIL-STD-810H)',
      'Enterprise security: TPM 2.0 and biometric fingerprint scanner',
      'Whisper-quiet dual-fan vapor chamber thermal management',
      'Full-size spill-resistant backlit keyboard with numeric keypad'
    ],
    createdAt: '2026-09-15T08:00:00.000Z'
  },
  {
    id: 'prod-printer-01',
    name: 'G-Tec ProMulti Laser Office Center X-4500',
    brand: 'G-Tec PrintMaster',
    sku: 'GTEC-PR-4500',
    category: 'printers',
    categoryLabel: 'Printer',
    subcategory: 'Laser Printers & Copiers',
    price: 89000,
    originalPrice: 99000,
    inStock: true,
    stockQuantity: 12,
    featured: true,
    rating: 4.8,
    reviewCount: 38,
    warranty: '3-Year Office Fleet Maintenance Plan',
    condition: 'Brand New',
    image: printerImg,
    description: 'Enterprise all-in-one monochrome laser printer, high-speed document copier, and network fax designed for demanding corporate departments.',
    specifications: {
      'Print Speed': 'Up to 48 ppm (Letter / A4)',
      'Print Resolution': '1200 x 1200 dpi Optical',
      'Duplex Capabilities': 'Automatic 2-Sided Printing & Dual-Head Single-Pass Scanning',
      'Feeder Capacity': '50-Sheet Auto Document Feeder (ADF)',
      'Paper Tray Capacity': '550-Sheet Standard Cassette + 100-Sheet Multi-Purpose Tray',
      'Connectivity': 'Gigabit Ethernet, Dual-Band Wi-Fi, USB 3.0, NFC Tap-to-Print',
      'Monthly Duty Cycle': 'Up to 80,000 pages per month',
      'Display': '4.3-inch Color Touchscreen with Customizable Workflow Apps'
    },
    keyFeatures: [
      'Ultra low cost per page with high-yield toner options',
      'Secure PIN print release and enterprise LDAP authentication',
      'Direct scanning to network shared folders, email, and cloud',
      'Energy Star 3.0 certified with auto-sleep wake sensors'
    ],
    createdAt: '2026-09-18T10:30:00.000Z'
  },
  {
    id: 'prod-desktop-01',
    name: 'G-Tec Dual-Monitor Commercial Workstation Tower',
    brand: 'G-Tec ProStation',
    sku: 'GTEC-WS-8800',
    category: 'computers',
    categoryLabel: 'Computer',
    subcategory: 'Desktop Workstations',
    price: 235000,
    originalPrice: 260000,
    inStock: true,
    stockQuantity: 8,
    featured: true,
    rating: 5.0,
    reviewCount: 29,
    warranty: '3-Year On-Site Hardware Replacement',
    condition: 'Brand New',
    image: workstationImg,
    description: 'Complete commercial package including dual 27-inch IPS borderless displays, high-expansion mid-tower workstation, wireless keyboard, and mouse.',
    specifications: {
      'Processor': 'Intel® Core™ i9-14900 (24 Cores, 32 Threads, up to 5.8 GHz)',
      'System RAM': '64 GB DDR5 5600MHz (Expandable to 128 GB)',
      'Primary Drive': '2 TB NVMe PCIe Gen4 M.2 SSD',
      'Secondary Drive': '4 TB 7200RPM Enterprise SATA HDD',
      'Graphics Card': 'NVIDIA® GeForce RTX™ 4070 12GB GDDR6X',
      'Display Bundle': '2x 27-inch QHD (2560x1440) IPS 99% sRGB Height-Adjustable',
      'Power Supply': '750W 80 PLUS Gold Certified Modular PSU',
      'Operating System': 'Windows 11 Pro for Workstations'
    },
    keyFeatures: [
      'Dual-monitor productivity workstation ready out-of-the-box',
      'Optimized for CAD, architectural rendering, accounting & large data models',
      'Heavy-duty steel chassis with toolless serviceability',
      'Comprehensive front and rear I/O including 8x USB 3.2, USB-C, 2.5G LAN'
    ],
    createdAt: '2026-09-20T14:15:00.000Z'
  },
  {
    id: 'prod-scanner-01',
    name: 'G-Tec ScanMaster 800 Sheet-Fed Document Scanner',
    brand: 'G-Tec Office Digitizer',
    sku: 'GTEC-SC-800',
    category: 'scanners',
    categoryLabel: 'Scanner',
    subcategory: 'Scanners & Digitizers',
    price: 62000,
    originalPrice: 69000,
    inStock: true,
    stockQuantity: 15,
    featured: true,
    rating: 4.8,
    reviewCount: 24,
    warranty: '2-Year Advanced Exchange Warranty',
    condition: 'Brand New',
    image: scannerImg,
    description: 'High-speed professional desktop sheet-fed scanner with optical character recognition (OCR) and ultrasonic multi-feed detection.',
    specifications: {
      'Scanning Speed': '60 ppm / 120 ipm (Monochrome and Color at 300 dpi)',
      'Optical Resolution': '600 x 600 dpi Optical (1200 dpi interpolated)',
      'ADF Capacity': '80-Sheet Automatic Feeder with Active Separation Rollers',
      'Media Supported': 'Business cards, embossed plastic IDs, legal contracts, receipts',
      'Daily Duty Cycle': 'Up to 7,500 scans per day',
      'Connectivity': 'USB 3.0 Superspeed and 10/100/1000 Gigabit Ethernet',
      'Drivers Included': 'TWAIN, ISIS, WIA for universal DMS software integration'
    },
    keyFeatures: [
      'Ultrasonic double-feed detection prevents paper jams and missed pages',
      'Built-in hardware OCR converts directly to searchable PDF, DOCX, and XLSX',
      'Single-touch scan profiles directly to network folders, FTP, or cloud',
      'Compact footprint folds up when not in use to save office desk space'
    ],
    createdAt: '2026-09-22T09:00:00.000Z'
  },
  {
    id: 'prod-peripheral-01',
    name: 'G-Tec ProMechanical Office Keyboard & Precision Mouse Set',
    brand: 'G-Tec Peripherals',
    sku: 'GTEC-KB-900',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subcategory: 'Input Devices',
    price: 12500,
    originalPrice: 16000,
    inStock: true,
    stockQuantity: 45,
    featured: false,
    rating: 4.7,
    reviewCount: 56,
    warranty: '2-Year Replacement Warranty',
    condition: 'Brand New',
    image: laptopImg,
    description: 'Ergonomic tactile mechanical keyboard with dampened switches and high-precision laser mouse designed for comfortable all-day typing.',
    specifications: {
      'Key Switches': 'G-Tec Silent Tactile Brown Mechanical Switches (50M keystrokes)',
      'Connectivity': 'Tri-Mode: 2.4 GHz USB Dongle, Bluetooth 5.2 (3 Devices), USB-C Wired',
      'Battery': 'Rechargeable 4000mAh (Up to 4 Months per charge)',
      'Mouse Sensor': 'Darkfield Laser Optical 4000 DPI (Tracks on glass)',
      'Compatibility': 'Windows, macOS, Linux, ChromeOS'
    },
    keyFeatures: [
      'Multi-device easy-switch buttons for seamless laptop/desktop switching',
      'Dampened sound dampening layers for open office environments',
      'Precision machined aluminum top plate with magnetic wrist rest'
    ],
    createdAt: '2026-09-25T11:20:00.000Z'
  },
  {
    id: 'prod-accessory-01',
    name: 'G-Tec High-Yield Enterprise Toner Cartridge Set (CMYK 4-Pack)',
    brand: 'G-Tec Consumables',
    sku: 'GTEC-TN-4500-SET',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subcategory: 'Toner & Ink',
    price: 24500,
    originalPrice: 28000,
    inStock: true,
    stockQuantity: 60,
    featured: false,
    rating: 4.9,
    reviewCount: 71,
    warranty: '100% Quality & Print Yield Guarantee',
    condition: 'Brand New',
    image: printerImg,
    description: 'Complete replacement 4-color high-capacity toner pack engineered for crisp text, vibrant presentation graphics, and maximum page yield.',
    specifications: {
      'Cartridge Yield': 'Black: 14,000 Pages | Cyan/Magenta/Yellow: 10,000 Pages Each',
      'Compatibility': 'G-Tec X-4500, X-4800, and standard corporate laser fleets',
      'Formulation': 'Micro-polymerized chemical toner with anti-smear fusion',
      'Certification': 'ISO 9001 and ISO 14001 Certified Factory'
    },
    keyFeatures: [
      'Smart microchip communicates live remaining toner percentage to printer',
      'Zero background graying with razor-sharp micro-text clarity',
      'Recyclable eco-casing with easy snap-fit installation'
    ],
    createdAt: '2026-09-28T16:40:00.000Z'
  },
  {
    id: 'prod-peripheral-02',
    name: 'G-Tec Thunderbolt 4 Enterprise 12-in-1 Docking Station',
    brand: 'G-Tec Peripherals',
    sku: 'GTEC-DK-TB4',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subcategory: 'Docks & Hubs',
    price: 26000,
    originalPrice: 31000,
    inStock: true,
    stockQuantity: 28,
    featured: false,
    rating: 4.9,
    reviewCount: 33,
    warranty: '2-Year On-Site Support Warranty',
    condition: 'Brand New',
    image: workstationImg,
    description: 'Universal enterprise docking hub providing 100W Power Delivery charging, triple 4K 60Hz display outputs, and 2.5 Gbps Ethernet.',
    specifications: {
      'Power Delivery': 'Up to 100W Passthrough Laptop Charging',
      'Display Support': 'Dual 4K @ 60Hz or Single 8K @ 30Hz via HDMI 2.1 & DisplayPort 1.4',
      'Ports': '3x USB-A 10Gbps, 2x USB-C 10Gbps, 2.5G RJ45 LAN, SD/microSD 4.0, Audio Combo',
      'Construction': 'Solid anodized aerospace aluminum enclosure for heat dissipation'
    },
    keyFeatures: [
      'One cable connects power, displays, wired network, and all desk peripherals',
      'Enterprise MAC address passthrough and PXE boot support',
      'Kensington security lock slot for open hot-desk environments'
    ],
    createdAt: '2026-09-29T10:00:00.000Z'
  },
  {
    id: 'prod-accessory-02',
    name: 'G-Tec Heavy-Duty 8-Outlet Surge Protector & Power Strip',
    brand: 'G-Tec Power',
    sku: 'GTEC-SP-4200',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subcategory: 'Power & Cables',
    price: 6500,
    originalPrice: 7800,
    inStock: true,
    stockQuantity: 75,
    featured: false,
    rating: 4.8,
    reviewCount: 88,
    warranty: 'Commercial Connected Equipment Guarantee',
    condition: 'Brand New',
    image: scannerImg,
    description: 'Industrial-grade metal housing power distribution strip with 4320-Joule surge suppression and EMI/RFI noise filtering for workstations and servers.',
    specifications: {
      'Surge Energy Rating': '4,320 Joules with catastrophic fuse cutoff',
      'Outlets': '8 Widely-Spaced AC Outlets (Fits transformer plugs) + 2x USB-C 30W PD',
      'Cord Length': '10-Foot Heavy-Gauge 14 AWG Shielded Power Cord',
      'Chassis': 'Flame-retardant aluminum alloy housing'
    },
    keyFeatures: [
      'Diagnostic LED lights for Protected, Grounded, and Overload status',
      'Resettable 15A circuit breaker prevents electrical overload',
      'Keyhole mounting slots on back for server rack or desk leg mounting'
    ],
    createdAt: '2026-09-30T12:00:00.000Z'
  },
  {
    id: 'prod-display-01',
    name: 'G-Tec 75-inch 4K UHD Commercial Interactive Board',
    brand: 'G-Tec Visuals',
    sku: 'GTEC-IFP-75',
    category: 'computers',
    categoryLabel: 'Computer',
    subcategory: 'Conference Systems',
    price: 340000,
    originalPrice: 380000,
    inStock: true,
    stockQuantity: 6,
    featured: true,
    rating: 5.0,
    reviewCount: 16,
    warranty: '3-Year On-Site Enterprise Warranty',
    condition: 'Brand New',
    image: conferenceImg,
    description: 'Next-generation 75-inch 4K anti-glare interactive touchscreen board with 40-point multi-touch, built-in wireless screen sharing, and digital whiteboard suite.',
    specifications: {
      'Screen Size': '75-inch 4K UHD (3840 x 2160) Anti-Glare 4mm Toughened Glass',
      'Touch System': 'Zero-bonding 40-Point Infrared Touch with Dual Stylus Writing',
      'Built-in Audio': '2x 20W Front-Facing Stereo Soundbar + 8-Array Beamforming Microphones',
      'Camera': 'Integrated 48MP AI Auto-Framing 4K Video Conference Camera',
      'Connectivity': '3x HDMI 2.0 In, HDMI Out, 2x USB-C (65W PD), Gigabit LAN, Wi-Fi 6'
    },
    keyFeatures: [
      'Direct wireless casting from Windows, Mac, iOS, Android, and Chromebook',
      'Instant cloud whiteboard annotations with direct QR-code export',
      'OPS slot support for dual Windows 11 and Android enterprise OS'
    ],
    createdAt: '2026-10-01T09:00:00.000Z'
  },
  {
    id: 'prod-ups-01',
    name: 'G-Tec Enterprise 2000VA Online Pure Sine-Wave UPS',
    brand: 'G-Tec Power',
    sku: 'GTEC-UPS-2000',
    category: 'accessories',
    categoryLabel: 'Accessories',
    subcategory: 'Power Protection',
    price: 48000,
    originalPrice: 55000,
    inStock: true,
    stockQuantity: 22,
    featured: false,
    rating: 4.9,
    reviewCount: 31,
    warranty: '2-Year Battery & Electronics Warranty',
    condition: 'Brand New',
    image: workstationImg,
    description: 'Double-conversion online UPS providing continuous pure sine-wave battery backup, automatic voltage regulation (AVR), and generator compatibility.',
    specifications: {
      'Capacity': '2000VA / 1800W True Double Conversion',
      'Output Voltage': '220V/230V Pure Sine Wave (<2% THD)',
      'Backup Run Time': 'Up to 45 minutes typical workstation load',
      'Input Voltage Window': '110V - 300V Wide AVR Voltage Range',
      'Management': 'USB, RS232, and optional SNMP network management card slot'
    },
    keyFeatures: [
      'Zero transfer time (0ms) protects servers and sensitive office equipment',
      'High-efficiency ECO mode saves power during clean utility supply',
      'Informative LCD display shows real-time load percentage and battery run-time'
    ],
    createdAt: '2026-10-01T15:30:00.000Z'
  }
];
