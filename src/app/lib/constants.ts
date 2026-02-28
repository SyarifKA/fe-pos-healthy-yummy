import type { MenuItem, Ad, Member, OrderStatus } from '../types';

interface StatusStep {
  key: OrderStatus;
  label: string;
  description: string;
  icon: string;
}

// export const MENU_ITEMS: MenuItem[] = [
//   { id: 1,  name: 'Nasi Goreng Spesial',  category: 'food',  price: 35000, emoji: '🍳', desc: 'Nasi goreng telur, ayam & sayuran segar' },
//   { id: 2,  name: 'Mie Ayam Bakso',        category: 'food',  price: 28000, emoji: '🍜', desc: 'Mie dengan topping ayam cincang & bakso' },
//   { id: 3,  name: 'Ayam Bakar Madu',       category: 'food',  price: 45000, emoji: '🍗', desc: 'Ayam bakar dengan saus madu istimewa' },
//   { id: 4,  name: 'Gado-Gado',             category: 'food',  price: 25000, emoji: '🥗', desc: 'Sayuran segar dengan saus kacang pilihan' },
//   { id: 5,  name: 'Soto Ayam',             category: 'food',  price: 30000, emoji: '🍲', desc: 'Soto ayam berkuah bening dengan rempah' },
//   { id: 6,  name: 'Rendang Sapi',          category: 'food',  price: 55000, emoji: '🥩', desc: 'Rendang sapi empuk bumbu khas Minang' },
//   { id: 7,  name: 'Pisang Goreng Keju',    category: 'food',  price: 15000, emoji: '🍌', desc: 'Pisang goreng crispy dengan keju leleh' },
//   { id: 8,  name: 'Salad Buah Segar',      category: 'food',  price: 22000, emoji: '🍓', desc: 'Buah segar dengan yogurt & madu alami' },
//   { id: 9,  name: 'Es Teh Manis',          category: 'drink', price: 8000,  emoji: '🧋', desc: 'Teh manis segar dengan es batu' },
//   { id: 10, name: 'Jus Alpukat',           category: 'drink', price: 18000, emoji: '🥑', desc: 'Jus alpukat segar dengan susu segar' },
//   { id: 11, name: 'Kopi Hitam',            category: 'drink', price: 12000, emoji: '☕', desc: 'Kopi robusta pilihan single origin' },
//   { id: 12, name: 'Es Jeruk Segar',        category: 'drink', price: 10000, emoji: '🍊', desc: 'Jeruk segar peras dengan es batu' },
//   { id: 13, name: 'Milkshake Coklat',      category: 'drink', price: 22000, emoji: '🍫', desc: 'Milkshake coklat creamy premium' },
//   { id: 14, name: 'Lemon Tea',             category: 'drink', price: 14000, emoji: '🍋', desc: 'Teh lemon segar menyegarkan tenggorokan' },
//   { id: 15, name: 'Jus Semangka',          category: 'drink', price: 16000, emoji: '🍉', desc: 'Semangka segar tanpa biji, manis alami' },
//   { id: 16, name: 'Air Mineral',           category: 'drink', price: 5000,  emoji: '💧', desc: 'Air mineral botol 600ml' },
// ];

export const MENU_ITEMS: MenuItem[] = [
  // ── MAKANAN ──────────────────────────────────────────────────────────────
  {
    id: 1, name: 'Nasi Goreng Spesial', category: 'food', price: 35000,
    emoji: '🍳', desc: 'Nasi goreng telur, ayam & sayuran segar dengan bumbu rahasia',
    image: '/menu/foto1.jpg',
    tags: ['bestseller', 'spicy'], calories: 520, isAvailable: true,
    stock: 2
  },
  {
    id: 2, name: 'Mie Ayam Bakso', category: 'food', price: 28000,
    emoji: '🍜', desc: 'Mie kenyal topping ayam cincang & bakso sapi pilihan',
    image: '/menu/foto2.jpg',
    tags: ['bestseller'], calories: 450, isAvailable: true,
    stock: 2
  },
  {
    id: 3, name: 'Ayam Bakar Madu', category: 'food', price: 45000,
    emoji: '🍗', desc: 'Ayam bakar arang dengan glazing madu & kecap spesial',
    image: '/menu/foto3.jpg',
    tags: ['new'], calories: 480, isAvailable: true,
    stock: 2
  },
  {
    id: 4, name: 'Gado-Gado', category: 'food', price: 25000,
    emoji: '🥗', desc: 'Sayuran rebus segar disiram saus kacang khas Betawi',
    image: '/menu/foto4.jpg',
    tags: ['vegetarian', 'healthy'], calories: 320, isAvailable: true,
    stock: 2
  },
  {
    id: 5, name: 'Soto Ayam', category: 'food', price: 30000,
    emoji: '🍲', desc: 'Soto ayam berkuah kuning dengan rempah dan lontong',
    image: '/menu/foto4.jpg',
    tags: [], calories: 390, isAvailable: true,
    stock: 2
  },
  {
    id: 6, name: 'Rendang Sapi', category: 'food', price: 55000,
    emoji: '🥩', desc: 'Rendang sapi empuk dengan 40+ rempah khas Minangkabau',
    image: '/menu/foto5.jpg',
    tags: ['bestseller', 'spicy'], calories: 560, isAvailable: true,
    stock: 2
  },
  {
    id: 7, name: 'Pisang Goreng Keju', category: 'food', price: 15000,
    emoji: '🍌', desc: 'Pisang kepok crispy, leleh keju, susu kental manis',
    image: '/menu/foto6.jpg',
    tags: ['new'], calories: 280, isAvailable: true,
    stock: 2
  },
  {
    id: 8, name: 'Salad Buah Segar', category: 'food', price: 22000,
    emoji: '🍓', desc: 'Buah tropis segar, yogurt greek, madu & granola',
    image: '/menu/foto3.jpg',
    tags: ['vegetarian', 'healthy'], calories: 210, isAvailable: true,
    stock: 2
  },
  // Pre-order item example
  {
    id: 11, name: 'Nasi Box Premium', category: 'food', price: 55000,
    emoji: '🍱', desc: 'Nasi box dengan lauk lengkap untuk acara kantor atau keluarga',
    image: '/menu/foto5.jpg',
    tags: ['new'], calories: 650, isAvailable: true,
    stock: 0,
    isPreOrder: true,
    preOrderInfo: 'Siap dalam 2 hari kerja',
    preOrderDescription: 'Minimal pemesanan 20 box. Includes Nasi Putih, Ayam Goreng, Telur Dadar, Sayur Asem, Kerupuk, Sambal & Air Mineral. Cocok untuk ultah, arisan, maupun gathering kantor.'
  },
  // ── MINUMAN ──────────────────────────────────────────────────────────────
  {
    id: 9, name: 'Es Teh Manis', category: 'drink', price: 8000,
    emoji: '🧋', desc: 'Teh hitam premium, manis pas, es batu serut',
    image: '/menu/foto7.jpg',
    tags: ['bestseller'], calories: 90, isAvailable: true,
    stock: 2
  },
  {
    id: 10, name: 'Jus Alpukat', category: 'drink', price: 18000,
    emoji: '🥑', desc: 'Alpukat hijau segar, susu full cream, sedikit coklat',
    image: '/menu/foto8.jpg',
    tags: ['healthy'], calories: 240, isAvailable: true,
    stock: 2
  },
  {
    id: 11, name: 'Kopi Hitam', category: 'drink', price: 12000,
    emoji: '☕', desc: 'Single origin Gayo Aceh, seduh pour-over atau tubruk',
    image: '/menu/foto9.jpg',
    tags: [], calories: 10, isAvailable: true,
    stock: 2
  },
  {
    id: 12, name: 'Es Jeruk Segar', category: 'drink', price: 10000,
    emoji: '🍊', desc: 'Jeruk pontianak segar diperas, tanpa pengawet',
    image: '/menu/foto10.jpg',
    tags: ['healthy'], calories: 80, isAvailable: true,
    stock: 2
  },
  {
    id: 13, name: 'Milkshake Coklat', category: 'drink', price: 22000,
    emoji: '🍫', desc: 'Coklat Belgia, susu full cream, es krim vanila',
    image: '/menu/foto8.jpg',
    tags: ['new'], calories: 380, isAvailable: true,
    stock: 2
  },
  {
    id: 14, name: 'Lemon Tea', category: 'drink', price: 14000,
    emoji: '🍋', desc: 'Teh hijau, perasan lemon segar, sedikit mint menyegarkan',
    image: '/menu/foto9.jpg',
    tags: ['healthy'], calories: 60, isAvailable: true,
    stock: 2
  },
  {
    id: 15, name: 'Jus Semangka', category: 'drink', price: 16000,
    emoji: '🍉', desc: 'Semangka merah manis tanpa biji, segar tanpa tambahan gula',
    image: '/menu/foto9.jpg',
    tags: ['healthy'], calories: 70, isAvailable: true,
    stock: 2
  },
  {
    id: 16, name: 'Air Mineral', category: 'drink', price: 5000,
    emoji: '💧', desc: 'Air mineral alami pegunungan, botol 600ml',
    image: '/menu/foto8.jpg',
    tags: [], calories: 0, isAvailable: false,
    stock: 2
  },
];

export const ADS: Ad[] = [
  { id: 1, title: '🎉 Promo Spesial!',     text: 'Beli 2 menu utama, gratis 1 minuman segar',    gradient: 'linear-gradient(135deg,#e91e8c,#ff6b9d)' },
  { id: 2, title: '✨ Daftar Member',       text: 'Daftar sekarang & dapatkan diskon 10% setiap order', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
  { id: 3, title: '👨‍👩‍👧 Paket Keluarga',  text: 'Hemat hingga 20% untuk paket makan 4 orang',  gradient: 'linear-gradient(135deg,#0ea47a,#34d399)' },
];

export const DEFAULT_MEMBERS: Member[] = [
  { id: 1, name: 'Budi Santoso',  phone: '081234567890', address: 'Jl. Merdeka No. 10, Jakarta', socmed: '@budisantoso',  joinedAt: '2025-01-15' },
  { id: 2, name: 'Siti Rahayu',   phone: '087654321098', address: 'Jl. Kebon Jeruk 5, Jakarta',  socmed: '@sitirahayu',   joinedAt: '2025-02-01' },
];


export const formatCurrency = (n: number): string =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

export const generateBookingCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HY-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export const orderTypeLabel = (type: string, tableNo: number | null): string => {
  if (type === 'dine-in') return `🪑 Dine In – Meja ${tableNo}`;
  if (type === 'pickup')  return '🛵 Pickup Online';
  return '🥡 Take Away';
};

// QRIS Static Payment - Healthy Yummy
// This is a sample static QRIS, replace with actual merchant QRIS
export const QRIS_STATIC = '00020101021126660016COM.TIGO.MERCHANT.QRIS5215YOURMERCHANTID12345678953035404540503UMI51430015ID.CO.QRIS.WWW0214QRI-1234-5678-HY0010HEALTHY YUMMY07081003080009ID.CO.BCA.QRIS0906HYUMMY5303165';

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: '⏳ Order Masuk',
    waiting_payment: '💳 Menunggu Pembayaran',
    paid: '✅ Lunas',
    processing: '👨‍🍳 Diproses',
    out_for_delivery: '🚚 Dalam Pengantaran',
    ready: '🍽️ Siap Disajikan',
    picked_up: '📦 Sudah Diambil',
    completed: '✅ Selesai',
    cancelled: '🚫 Dibatalkan',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    pending: 'var(--amber)',
    waiting_payment: 'var(--orange)',
    paid: 'var(--green)',
    processing: 'var(--blue)',
    out_for_delivery: '#9C27B0',
    ready: 'var(--accent)',
    picked_up: '#4CAF50',
    completed: '#2E7D32',
    cancelled: 'var(--red)',
  };
  return colors[status] || 'var(--text2)';
};

export const generateWhatsAppMessage = (order: { code: string; customerName: string; total: number; items: { name: string; qty: number; price: number }[] }): string => {
  const itemsList = order.items.map(item => `• ${item.name} x${item.qty} = Rp ${(item.price * item.qty).toLocaleString('id-ID')}`).join('\n');
  const message = `🍽️ *PESANAN HEALTHY YUMMY*\n\n` +
    `Kode Pesanan: *${order.code}*\n` +
    `Pemesan: ${order.customerName}\n\n` +
    `*Ringkasan Pesanan:*\n${itemsList}\n\n` +
    `*Total: Rp ${order.total.toLocaleString('id-ID')}*\n\n` +
    `Terima kasih telah memesan di Healthy Yummy! 😊`;
  return encodeURIComponent(message);
};

// Get status steps based on order type
export const getStatusSteps = (orderType: string): StatusStep[] => {
  if (orderType === 'pickup') {
    // Pickup order flow: paid -> processing -> ready (siap diambil) -> picked_up -> completed
    return [
      { key: 'waiting_payment', label: 'Menunggu Pembayaran', description: 'Silakan lakukan pembayaran di kasir', icon: '💳' },
      { key: 'paid', label: 'Pembayaran Dikonfirmasi', description: 'Pembayaran berhasil', icon: '✅' },
      { key: 'processing', label: 'Pesanan Diproses', description: 'Kitchen sedang menyiapkan', icon: '👨‍🍳' },
      { key: 'ready', label: 'Siap Diambil', description: 'Pesanan siap diambil oleh pelanggan', icon: '📦' },
      { key: 'picked_up', label: 'Sudah Diambil', description: 'Pesanan telah diambil oleh pelanggan', icon: '✓' },
      { key: 'completed', label: 'Selesai', description: 'Pesanan selesai', icon: '🎉' },
    ];
  }
  // Dine-in / Takeaway flow
  return [
    { key: 'waiting_payment', label: 'Menunggu Pembayaran', description: 'Silakan lakukan pembayaran di kasir', icon: '💳' },
    { key: 'paid', label: 'Pembayaran Dikonfirmasi', description: 'Pembayaran berhasil', icon: '✅' },
    { key: 'processing', label: 'Pesanan Diproses', description: 'Kitchen sedang menyiapkan', icon: '👨‍🍳' },
    { key: 'ready', label: 'Siap Disajikan', description: 'Pelayan sedang menuju meja Anda', icon: '🍽️' },
    { key: 'completed', label: 'Selesai', description: 'Pesanan selesai', icon: '🎉' },
  ];
};
