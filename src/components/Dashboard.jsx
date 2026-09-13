import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Wallet, 
  AlertTriangle, 
  ArrowUpRight, 
  CreditCard,
  QrCode,
  Banknote,
  Package,
  PlusCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { 
    transactions, 
    products, 
    setActiveTab, 
    setCurrentReceipt, 
    setIsReceiptModalOpen 
  } = useApp();

  // Metrics for Today
  const today = new Date().toISOString().slice(0, 10);
  const todayTrx = transactions.filter(t => t.date.slice(0, 10) === today);
  const todayRevenue = todayTrx.reduce((acc, t) => acc + t.total, 0);
  const todayProfit = todayTrx.reduce((acc, t) => acc + (t.totalProfit || 0), 0);
  const todayCount = todayTrx.length;

  // Low stock products
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Top products calculation
  const productSalesMap = {};
  transactions.forEach(trx => {
    trx.items.forEach(item => {
      if (!productSalesMap[item.id]) {
        productSalesMap[item.id] = { name: item.name, qty: 0, revenue: 0 };
      }
      productSalesMap[item.id].qty += item.qty;
      productSalesMap[item.id].revenue += item.subtotal;
    });
  });
  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // 7-day sales breakdown
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayTrx = transactions.filter(t => t.date.slice(0, 10) === key);
    const total = dayTrx.reduce((acc, t) => acc + t.total, 0);
    const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric' }).format(d);
    return { date: key, dayName, total };
  });
  const maxDayTotal = Math.max(...last7Days.map(d => d.total), 100000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
            Ringkasan Bisnis Hari Ini
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Dashboard Penjualan UMKM
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Pantau arus kas kasir, performa omset harian, dan ketersediaan stok barang secara real-time.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('pos')}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buka Kasir POS</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Omset Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Omset Hari Ini</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(todayRevenue)}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
              <span>{todayCount} transaksi berhasil</span>
            </p>
          </div>
        </div>

        {/* Card 2: Laba Kotor Hari Ini */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimasi Laba Kotor</span>
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{formatRupiah(todayProfit)}</h3>
            <p className="text-xs text-slate-500 mt-1">
              Margin: {todayRevenue > 0 ? Math.round((todayProfit / todayRevenue) * 100) : 0}% dari omset
            </p>
          </div>
        </div>

        {/* Card 3: Total Produk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Katalog Produk</span>
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-slate-900">{products.length}</h3>
            <p className="text-xs text-blue-600 font-medium mt-1 cursor-pointer hover:underline" onClick={() => setActiveTab('products')}>
              Lihat manajemen inventaris &rarr;
            </p>
          </div>
        </div>

        {/* Card 4: Stok Menipis */}
        <div className={`bg-white p-5 rounded-2xl border transition-shadow ${
          lowStockProducts.length > 0 
            ? 'border-amber-300 bg-amber-50/20' 
            : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok Menipis / Habis</span>
            <div className={`p-2.5 rounded-xl ${
              lowStockProducts.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-extrabold ${
              lowStockProducts.length > 0 ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {lowStockProducts.length} Produk
            </h3>
            <p className="text-xs text-amber-700 font-medium mt-1 cursor-pointer hover:underline" onClick={() => setActiveTab('products')}>
              {lowStockProducts.length > 0 ? 'Perlu kulakan / restock segera' : 'Semua stok dalam batas aman'}
            </p>
          </div>
        </div>

      </div>

      {/* Middle Section: 7-Day Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 7-Day Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Tren Omset 7 Hari Terakhir</h3>
              <p className="text-xs text-slate-500">Performa transaksi harian kasir</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Live Chart
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {last7Days.map((d, idx) => {
                const heightPct = Math.round((d.total / maxDayTotal) * 100);
                const isToday = idx === 6;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatRupiah(d.total)}
                    </div>
                    <div className="w-full max-w-[48px] bg-slate-100 rounded-xl h-36 flex items-end p-1">
                      <div 
                        style={{ height: `${Math.max(8, heightPct)}%` }}
                        className={`w-full rounded-lg transition-all duration-300 ${
                          isToday 
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20' 
                            : 'bg-slate-300 group-hover:bg-emerald-400'
                        }`}
                      />
                    </div>
                    <span className={`text-[11px] whitespace-nowrap ${
                      isToday ? 'font-bold text-emerald-700' : 'text-slate-500 font-medium'
                    }`}>
                      {d.dayName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Selling Products (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Produk Terlaris</h3>
            <span className="text-xs text-slate-400">Total Terjual</span>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Belum ada data transaksi</p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-slate-800 truncate" title={p.name}>{p.name}</h5>
                      <span className="text-[10px] text-slate-400">{formatRupiah(p.revenue)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {p.qty} terjual
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: Low stock alerts & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Low stock alert table (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base">Peringatan Stok Menipis</h3>
            </div>
            <button 
              onClick={() => setActiveTab('suppliers')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Kulakan &rarr;
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Semua produk memiliki stok yang memadai 👍
            </div>
          ) : (
            <div className="space-y-2.5">
              {lowStockProducts.slice(0, 5).map(prod => (
                <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-amber-50/50 border border-amber-200/60">
                  <div>
                    <h5 className="font-semibold text-xs text-slate-800">{prod.name}</h5>
                    <p className="text-[10px] text-slate-500">Min. Stok: {prod.minStock} {prod.unit}</p>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-1 rounded-lg bg-red-100 text-red-700">
                    Sisa {prod.stock} {prod.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions List (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Aktivitas Transaksi Terakhir</h3>
            <button 
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Lihat Semua ({transactions.length}) &rarr;
            </button>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100">
            {transactions.slice(0, 5).map(trx => (
              <div 
                key={trx.id}
                onClick={() => {
                  setCurrentReceipt(trx);
                  setIsReceiptModalOpen(true);
                }}
                className="pt-2.5 first:pt-0 flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {trx.paymentMethod === 'cash' ? <Banknote className="w-4 h-4 text-emerald-600" /> : trx.paymentMethod === 'qris' ? <QrCode className="w-4 h-4 text-blue-600" /> : <CreditCard className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-slate-800">{trx.code}</h5>
                    <p className="text-[10px] text-slate-400">{formatDate(trx.date)} • {trx.customerName}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-xs text-slate-900">{formatRupiah(trx.total)}</div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{trx.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
