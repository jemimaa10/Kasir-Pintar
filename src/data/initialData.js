export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Sembako & Beras', icon: 'Wheat', color: 'emerald' },
  { id: 'cat-2', name: 'Minyak & Bumbu', icon: 'Flame', color: 'amber' },
  { id: 'cat-3', name: 'Minuman Dingin & Kering', icon: 'Coffee', color: 'blue' },
  { id: 'cat-4', name: 'Makanan Ringan & Snack', icon: 'Cookie', color: 'orange' },
  { id: 'cat-5', name: 'Kebersihan & Perawatan', icon: 'Sparkles', color: 'teal' },
  { id: 'cat-6', name: 'Kebutuhan Harian Lain', icon: 'Package', color: 'purple' },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p-1',
    sku: 'SBK-1001',
    name: 'Beras Rojolele Super 5kg',
    categoryId: 'cat-1',
    categoryName: 'Sembako & Beras',
    unit: 'karung',
    buyPrice: 65000,
    sellPrice: 74000,
    stock: 24,
    minStock: 5,
    barcode: '899123456001',
    color: '#10b981'
  },
  {
    id: 'p-2',
    sku: 'SBK-1002',
    name: 'Gula Pasir Gulaku 1kg',
    categoryId: 'cat-1',
    categoryName: 'Sembako & Beras',
    unit: 'pcs',
    buyPrice: 15500,
    sellPrice: 18000,
    stock: 35,
    minStock: 10,
    barcode: '899123456002',
    color: '#10b981'
  },
  {
    id: 'p-3',
    sku: 'MNY-2001',
    name: 'Minyak Goreng Bimoli 2 Liter',
    categoryId: 'cat-2',
    categoryName: 'Minyak & Bumbu',
    unit: 'pouch',
    buyPrice: 32000,
    sellPrice: 37500,
    stock: 18,
    minStock: 6,
    barcode: '899123456003',
    color: '#f59e0b'
  },
  {
    id: 'p-4',
    sku: 'MNY-2002',
    name: 'Kecap Manis Bango 520ml',
    categoryId: 'cat-2',
    categoryName: 'Minyak & Bumbu',
    unit: 'pouch',
    buyPrice: 19000,
    sellPrice: 23000,
    stock: 15,
    minStock: 5,
    barcode: '899123456004',
    color: '#f59e0b'
  },
  {
    id: 'p-5',
    sku: 'MNM-3001',
    name: 'Indomie Goreng Original 85g',
    categoryId: 'cat-4',
    categoryName: 'Makanan Ringan & Snack',
    unit: 'pcs',
    buyPrice: 2800,
    sellPrice: 3500,
    stock: 120,
    minStock: 25,
    barcode: '899123456005',
    color: '#f97316'
  },
  {
    id: 'p-6',
    sku: 'MNM-3002',
    name: 'Indomie Kuah Ayam Bawang 75g',
    categoryId: 'cat-4',
    categoryName: 'Makanan Ringan & Snack',
    unit: 'pcs',
    buyPrice: 2700,
    sellPrice: 3500,
    stock: 95,
    minStock: 20,
    barcode: '899123456006',
    color: '#f97316'
  },
  {
    id: 'p-7',
    sku: 'DRK-4001',
    name: 'Teh Pucuk Harum 350ml Dingin',
    categoryId: 'cat-3',
    categoryName: 'Minuman Dingin & Kering',
    unit: 'botol',
    buyPrice: 3200,
    sellPrice: 4500,
    stock: 42,
    minStock: 12,
    barcode: '899123456007',
    color: '#3b82f6'
  },
  {
    id: 'p-8',
    sku: 'DRK-4002',
    name: 'Aqua Botol Sedang 600ml',
    categoryId: 'cat-3',
    categoryName: 'Minuman Dingin & Kering',
    unit: 'botol',
    buyPrice: 2500,
    sellPrice: 3500,
    stock: 58,
    minStock: 15,
    barcode: '899123456008',
    color: '#3b82f6'
  },
  {
    id: 'p-9',
    sku: 'DRK-4003',
    name: 'Kopi Kapal Api Spesial Mix 1 Renteng (10 sachet)',
    categoryId: 'cat-3',
    categoryName: 'Minuman Dingin & Kering',
    unit: 'renteng',
    buyPrice: 13500,
    sellPrice: 16500,
    stock: 16,
    minStock: 5,
    barcode: '899123456009',
    color: '#3b82f6'
  },
  {
    id: 'p-10',
    sku: 'SNK-5001',
    name: 'Chitato Sapi Panggang 68g',
    categoryId: 'cat-4',
    categoryName: 'Makanan Ringan & Snack',
    unit: 'pcs',
    buyPrice: 9200,
    sellPrice: 11500,
    stock: 22,
    minStock: 6,
    barcode: '899123456010',
    color: '#f97316'
  },
  {
    id: 'p-11',
    sku: 'SNK-5002',
    name: 'Biskuit Roma Kelapa 300g',
    categoryId: 'cat-4',
    categoryName: 'Makanan Ringan & Snack',
    unit: 'pack',
    buyPrice: 8500,
    sellPrice: 10500,
    stock: 3,
    minStock: 8, // Low stock on purpose!
    barcode: '899123456011',
    color: '#f97316'
  },
  {
    id: 'p-12',
    sku: 'KBS-6001',
    name: 'Sabun Mandi Lifebuoy Red 85g',
    categoryId: 'cat-5',
    categoryName: 'Kebersihan & Perawatan',
    unit: 'pcs',
    buyPrice: 3800,
    sellPrice: 5000,
    stock: 28,
    minStock: 10,
    barcode: '899123456012',
    color: '#14b8a6'
  },
  {
    id: 'p-13',
    sku: 'KBS-6002',
    name: 'Deterjen Rinso Molto Anti Noda 770g',
    categoryId: 'cat-5',
    categoryName: 'Kebersihan & Perawatan',
    unit: 'pack',
    buyPrice: 18500,
    sellPrice: 22500,
    stock: 2,
    minStock: 6, // Low stock on purpose!
    barcode: '899123456013',
    color: '#14b8a6'
  },
  {
    id: 'p-14',
    sku: 'SBK-1003',
    name: 'Telur Ayam Negeri Fresh (1 kg)',
    categoryId: 'cat-1',
    categoryName: 'Sembako & Beras',
    unit: 'kg',
    buyPrice: 26000,
    sellPrice: 29500,
    stock: 15,
    minStock: 5,
    barcode: '899123456014',
    color: '#10b981'
  },
  {
    id: 'p-15',
    sku: 'MNM-3003',
    name: 'Susu Kental Manis Frisian Flag Gold 370g',
    categoryId: 'cat-3',
    categoryName: 'Minuman Dingin & Kering',
    unit: 'kaleng',
    buyPrice: 13000,
    sellPrice: 15500,
    stock: 19,
    minStock: 6,
    barcode: '899123456015',
    color: '#3b82f6'
  }
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'PT Indofood CBP Sukses Makmur',
    contactPerson: 'Bpk. Hendra Saputra',
    phone: '0812-9988-7711',
    address: 'Kawasan Industri Cikarang Blok B-12',
    categories: ['Makanan Ringan & Snack', 'Minuman Dingin & Kering'],
    balance: 0
  },
  {
    id: 'sup-2',
    name: 'Agen Grosir Sembako Berkah Jaya',
    contactPerson: 'Hj. Siti Rohmah',
    phone: '0857-1122-3344',
    address: 'Pasar Induk Kramat Jati Kios A-44',
    categories: ['Sembako & Beras', 'Minyak & Bumbu'],
    balance: 0
  },
  {
    id: 'sup-3',
    name: 'CV Tirta Abadi Distribusi',
    contactPerson: 'Sdr. Kevin Wijaya',
    phone: '0821-4455-6677',
    address: 'Jl. Soekarno Hatta No. 120 Bandung',
    categories: ['Minuman Dingin & Kering', 'Kebersihan & Perawatan'],
    balance: 0
  }
];

export const INITIAL_STORE_INFO = {
  name: 'Toko Berkah Bersama UMKM',
  tagline: 'Sedia Sembako & Kebutuhan Harian Murah Lengkap',
  address: 'Jl. Merdeka No. 45 RT 03/05, Kec. Coblong, Kota Bandung',
  phone: '0812-3456-7890',
  cashierName: 'Kasir 01 (Jeremy)',
  receiptFooter: 'Terima kasih atas kunjungan Anda!\nBarang yang sudah dibeli dapat ditukar 1x24 jam dengan membawa struk.',
  taxEnabled: false,
  taxRate: 11
};

// Seed sample transactions so charts & dashboard have lively metrics right away
const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

export const INITIAL_TRANSACTIONS = [
  {
    id: 'trx-101',
    code: 'TRX-2609-1001',
    date: new Date(y, m, d, 9, 15).toISOString(),
    customerName: 'Pelanggan Umum',
    items: [
      { id: 'p-1', name: 'Beras Rojolele Super 5kg', price: 74000, buyPrice: 65000, qty: 1, subtotal: 74000 },
      { id: 'p-3', name: 'Minyak Goreng Bimoli 2 Liter', price: 37500, buyPrice: 32000, qty: 1, subtotal: 37500 },
      { id: 'p-7', name: 'Teh Pucuk Harum 350ml Dingin', price: 4500, buyPrice: 3200, qty: 2, subtotal: 9000 }
    ],
    subtotal: 120500,
    discount: 0,
    tax: 0,
    total: 120500,
    paymentMethod: 'cash',
    paidAmount: 150000,
    changeAmount: 29500,
    totalProfit: 17100
  },
  {
    id: 'trx-102',
    code: 'TRX-2609-1002',
    date: new Date(y, m, d, 10, 42).toISOString(),
    customerName: 'Ibu Rahayu',
    items: [
      { id: 'p-5', name: 'Indomie Goreng Original 85g', price: 3500, buyPrice: 2800, qty: 5, subtotal: 17500 },
      { id: 'p-14', name: 'Telur Ayam Negeri Fresh (1 kg)', price: 29500, buyPrice: 26000, qty: 1, subtotal: 29500 }
    ],
    subtotal: 47000,
    discount: 2000,
    tax: 0,
    total: 45000,
    paymentMethod: 'qris',
    paidAmount: 45000,
    changeAmount: 0,
    totalProfit: 7000 - 2000
  },
  {
    id: 'trx-103',
    code: 'TRX-2609-1003',
    date: new Date(y, m, d, 11, 20).toISOString(),
    customerName: 'Bpk. Ahmad',
    items: [
      { id: 'p-2', name: 'Gula Pasir Gulaku 1kg', price: 18000, buyPrice: 15500, qty: 2, subtotal: 36000 },
      { id: 'p-9', name: 'Kopi Kapal Api Spesial Mix 1 Renteng (10 sachet)', price: 16500, buyPrice: 13500, qty: 1, subtotal: 16500 }
    ],
    subtotal: 52500,
    discount: 0,
    tax: 0,
    total: 52500,
    paymentMethod: 'transfer',
    paidAmount: 52500,
    changeAmount: 0,
    totalProfit: 8000
  }
];
