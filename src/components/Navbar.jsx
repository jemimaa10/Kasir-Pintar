import React from 'react';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Package, 
  Truck, 
  FileBarChart, 
  Settings, 
  RotateCcw,
  Store,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    cartItemsCount, 
    products, 
    storeInfo, 
    setIsSettingsModalOpen,
    resetToDefault 
  } = useApp();

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const navItems = [
    { id: 'pos', label: 'Kasir POS', icon: ShoppingBag, badge: cartItemsCount > 0 ? cartItemsCount : null, badgeColor: 'bg-emerald-500' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produk & Stok', icon: Package, badge: lowStockCount > 0 ? lowStockCount : null, badgeColor: 'bg-amber-500' },
    { id: 'suppliers', label: 'Suplier & Kulakan', icon: Truck },
    { id: 'reports', label: 'Laporan Penjualan', icon: FileBarChart },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pos')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-800">{storeInfo.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">POS UMKM</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">{storeInfo.tagline}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              title="Pengaturan Toko & Kasir"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={resetToDefault}
              title="Reset ke Data Demo Awal"
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 space-x-1 overflow-x-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 py-0.2 text-[9px] font-bold rounded-full bg-emerald-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
