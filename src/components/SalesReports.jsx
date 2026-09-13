import React, { useState } from 'react';
import { 
  FileBarChart, 
  Download, 
  Filter, 
  Printer, 
  Search, 
  Banknote, 
  QrCode, 
  CreditCard,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function SalesReports() {
  const { transactions, setCurrentReceipt, setIsReceiptModalOpen } = useApp();

  const [dateFilter, setDateFilter] = useState('all'); // 'today', 'week', 'month', 'all'
  const [methodFilter, setMethodFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Filter transactions
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const filtered = transactions.filter(t => {
    // Search by code or customer
    const matchSearch = t.code.toLowerCase().includes(search.toLowerCase()) || 
                        t.customerName.toLowerCase().includes(search.toLowerCase());
    
    // Payment method
    const matchMethod = methodFilter === 'all' || t.paymentMethod === methodFilter;

    // Date range
    let matchDate = true;
    const tDate = new Date(t.date);
    if (dateFilter === 'today') {
      matchDate = t.date.slice(0, 10) === todayStr;
    } else if (dateFilter === 'week') {
      const diffDays = (now - tDate) / (1000 * 60 * 60 * 24);
      matchDate = diffDays <= 7;
    } else if (dateFilter === 'month') {
      matchDate = tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }

    return matchSearch && matchMethod && matchDate;
  });

  // Calculate summaries
  const totalRevenue = filtered.reduce((acc, t) => acc + t.total, 0);
  const totalProfit = filtered.reduce((acc, t) => acc + (t.totalProfit || 0), 0);
  const avgBasket = filtered.length > 0 ? Math.round(totalRevenue / filtered.length) : 0;

  // Export to CSV
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor!');
      return;
    }

    const headers = ['No. Transaksi', 'Tanggal', 'Waktu', 'Kasir', 'Pelanggan', 'Metode Bayar', 'Subtotal', 'Diskon', 'Total', 'Estimasi Laba'];
    const rows = filtered.map(t => [
      t.code,
      t.date.slice(0, 10),
      t.date.slice(11, 16),
      `"${t.cashier || 'Kasir'}"`,
      `"${t.customerName}"`,
      t.paymentMethod.toUpperCase(),
      t.subtotal,
      t.discount,
      t.total,
      t.totalProfit || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_Kasir_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Laporan Penjualan & Transaksi</h2>
          <p className="text-xs sm:text-sm text-slate-500">Pantau riwayat omset, keuntungan bersih, dan cetak ulang struk kasir.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-sm flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export ke CSV (Excel)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Omset Filtered</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{formatRupiah(totalRevenue)}</h3>
          <p className="text-xs text-slate-400 mt-1">{filtered.length} transaksi tercatat</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keuntungan / Laba Bersih</span>
          <h3 className="text-2xl font-extrabold text-emerald-600 mt-2">{formatRupiah(totalProfit)}</h3>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}% Margin rata-rata
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rata-Rata per Transaksi</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{formatRupiah(avgBasket)}</h3>
          <p className="text-xs text-slate-400 mt-1">Nilai belanja rata-rata</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode nota atau pelanggan..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="today">Hari Ini</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">Bulan Ini</option>
            <option value="all">Semua Waktu</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="all">Semua Metode</option>
            <option value="cash">Tunai (Cash)</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Transfer Bank</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">Tanggal & Waktu</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4 text-center">Item</th>
                <th className="py-3.5 px-4 text-right">Total Transaksi</th>
                <th className="py-3.5 px-4 text-right">Laba Bersih</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada transaksi pada filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {t.code}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {t.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase ${
                        t.paymentMethod === 'cash' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : t.paymentMethod === 'qris' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {t.paymentMethod === 'cash' ? <Banknote className="w-3 h-3" /> : t.paymentMethod === 'qris' ? <QrCode className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        <span>{t.paymentMethod}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-slate-700">{t.items.length} item</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                      {formatRupiah(t.total)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      +{formatRupiah(t.totalProfit || 0)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setCurrentReceipt(t);
                          setIsReceiptModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 mx-auto transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
