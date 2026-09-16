import React from 'react';
import {
  Phone,
  Heart,
  Settings,
  RotateCcw,
  LayoutDashboard,
  CarFront,
  ShoppingBag,
  Package,
  Truck,
  FileBarChart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PUBLIC_TABS, ADMIN_TABS } from '../data/navigation';
import Logo from './Logo';

// Ikon untuk setiap tab panel showroom
const ADMIN_TAB_ICONS = {
  dashboard: LayoutDashboard,
  cars: CarFront,
  pos: ShoppingBag,
  products: Package,
  suppliers: Truck,
  reports: FileBarChart,
};

// Nomor telepon untuk link tel: (hanya angka dan +)
const toTelHref = (number) => `tel:${String(number || '').replace(/[^\d+]/g, '')}`;

// Sembunyikan scrollbar horizontal pada baris yang bisa digeser
const HIDE_SCROLLBAR = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

export default function Navbar() {
  const {
    activeTab,
    setActiveTab,
    cartItemsCount,
    products,
    cars,
    sellRequests,
    testDrives,
    favoriteCarIds,
    storeInfo,
    setIsSettingsModalOpen,
    resetToDefault
  } = useApp();

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const newSellRequestCount = sellRequests.filter(r => r.status === 'new').length;
  const pendingTestDriveCount = testDrives.filter(t => t.status === 'pending').length;
  const carInboxCount = newSellRequestCount + pendingTestDriveCount;
  // Hanya hitung favorit yang mobilnya masih ada
  const favoriteCount = favoriteCarIds.filter(id => cars.some(c => c.id === id)).length;

  // Badge per tab admin: nilai + warna
  const adminBadges = {
    pos: cartItemsCount > 0
      ? { value: cartItemsCount, title: `${cartItemsCount} item di keranjang`, className: 'bg-brand-600 text-white' }
      : null,
    products: lowStockCount > 0
      ? { value: lowStockCount, title: `${lowStockCount} produk stok menipis`, className: 'bg-amber-400 text-black' }
      : null,
    cars: carInboxCount > 0
      ? {
          value: carInboxCount,
          title: `${newSellRequestCount} permintaan jual baru, ${pendingTestDriveCount} test drive menunggu`,
          className: 'bg-brand-600 text-white'
        }
      : null,
  };

  const iconButtonClass =
    'relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:h-9 sm:w-9';
  const iconButtonTone = 'text-neutral-300 hover:bg-white/10 hover:text-white';

  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/85">
      {/* Garis aksen merah */}
      <div className="h-0.5 bg-gradient-to-r from-brand-900 via-brand-600 to-brand-900" aria-hidden="true" />

      {/* Baris 1: logo, menu publik, aksi */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('buy-car')}
                title="Beranda Auto18"
                aria-label="Beranda Auto18"
                className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {/* Layar sangat sempit: tanpa tagline agar baris tidak meluap */}
                <Logo size="sm" showTagline={false} className="min-[400px]:hidden" />
                <Logo size="sm" className="hidden min-[400px]:inline-flex sm:hidden" />
                <Logo size="md" className="hidden sm:inline-flex" />
              </button>

              <nav className="flex items-stretch self-stretch" aria-label="Menu utama">
                {PUBLIC_TABS.map(tab => {
                  const isActive = activeTab === tab.id;
                  const [firstWord, ...restWords] = tab.label.split(' ');
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative flex items-center whitespace-nowrap px-2.5 font-display text-xs font-black uppercase tracking-wide transition-colors focus:outline-none focus-visible:bg-white/5 focus-visible:text-white sm:px-4 sm:text-sm ${
                        isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{firstWord}</span>
                      {restWords.length > 0 && (
                        <span className="hidden sm:inline">&nbsp;{restWords.join(' ')}</span>
                      )}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-1.5 bottom-0 h-1 rounded-t-sm bg-brand-600 transition-transform duration-200 origin-center sm:inset-x-3 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {storeInfo.callCenter && (
                <a
                  href={toTelHref(storeInfo.callCenter)}
                  className="mr-1 hidden items-center gap-2.5 rounded-full border border-white/20 py-1 pl-1 pr-4 transition-colors hover:border-brand-500 hover:bg-white/5 lg:inline-flex"
                  title="Hubungi Call Center 24 Jam"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Call Center 24 Jam</span>
                    <span className="block font-display text-sm font-black text-white">{storeInfo.callCenter}</span>
                  </span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('buy-car')}
                title="Mobil Favorit"
                aria-label={`Mobil favorit (${favoriteCount})`}
                className={`${iconButtonClass} ${iconButtonTone}`}
              >
                <Heart className={`h-5 w-5 ${favoriteCount > 0 ? 'fill-brand-600 text-brand-500' : ''}`} />
                {favoriteCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-black">
                    {favoriteCount > 99 ? '99+' : favoriteCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                title="Pengaturan Showroom"
                aria-label="Pengaturan Showroom"
                className={`${iconButtonClass} ${iconButtonTone}`}
              >
                <Settings className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={resetToDefault}
                title="Reset ke Data Demo Awal"
                aria-label="Reset ke Data Demo Awal"
                className={`${iconButtonClass} text-neutral-500 hover:bg-brand-600/15 hover:text-brand-400`}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Baris 2: panel showroom (admin) */}
      <div className="border-b border-white/10 bg-ink-800">
        <div className="max-w-7xl mx-auto">
          <nav
            aria-label="Panel Showroom"
            className={`flex items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 ${HIDE_SCROLLBAR}`}
          >
            <span className="flex shrink-0 items-center gap-2 pr-1 font-display text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 sm:pr-2">
              <span className="h-3 w-1.5 -skew-x-12 bg-brand-600" aria-hidden="true" />
              Panel Showroom
            </span>

            {ADMIN_TABS.map(tab => {
              const Icon = ADMIN_TAB_ICONS[tab.id] || LayoutDashboard;
              const isActive = activeTab === tab.id;
              const badge = adminBadges[tab.id];
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    isActive
                      ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'border-white/10 text-neutral-300 hover:border-white/30 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                  {badge && (
                    <span
                      title={badge.title}
                      className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-black leading-none ${
                        isActive ? 'bg-white text-brand-700' : badge.className
                      }`}
                    >
                      {badge.value > 99 ? '99+' : badge.value}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Spacer agar padding kanan tetap terlihat saat digeser */}
            <span className="w-1 shrink-0 sm:hidden" aria-hidden="true" />
          </nav>
        </div>
      </div>
    </header>
  );
}
