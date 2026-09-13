import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  SlidersHorizontal,
  X,
  Package,
  Layers,
  Barcode,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, generateSku } from '../utils/formatters';

export default function ProductManagement() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    adjustStock,
    categories 
  } = useApp();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockDelta, setStockDelta] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    categoryId: '',
    unit: 'pcs',
    buyPrice: '',
    sellPrice: '',
    stock: '',
    minStock: '5',
    barcode: ''
  });

  const openAddModal = () => {
    setSelectedProduct(null);
    setFormData({
      sku: generateSku('PRD'),
      name: '',
      categoryId: categories[0]?.id || '',
      unit: 'pcs',
      buyPrice: '',
      sellPrice: '',
      stock: '10',
      minStock: '5',
      barcode: ''
    });
    setIsFormOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      categoryId: product.categoryId,
      unit: product.unit,
      buyPrice: String(product.buyPrice),
      sellPrice: String(product.sellPrice),
      stock: String(product.stock),
      minStock: String(product.minStock),
      barcode: product.barcode || ''
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const cat = categories.find(c => c.id === formData.categoryId);
    const payload = {
      sku: formData.sku || generateSku('PRD'),
      name: formData.name,
      categoryId: formData.categoryId,
      categoryName: cat ? cat.name : 'Umum',
      unit: formData.unit,
      buyPrice: Number(formData.buyPrice) || 0,
      sellPrice: Number(formData.sellPrice) || 0,
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 5,
      barcode: formData.barcode
    };

    if (selectedProduct) {
      updateProduct(selectedProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id, name) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleStockAdjustment = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const delta = Number(stockDelta);
    if (!isNaN(delta) && delta !== 0) {
      adjustStock(selectedProduct.id, delta, 'Penyesuaian Manual');
    }
    setIsStockModalOpen(false);
    setStockDelta('');
  };

  // Filtered list
  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.categoryId === catFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchLow = filterLowStockOnly ? p.stock <= p.minStock : true;
    return matchCat && matchSearch && matchLow;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Produk & Stok</h2>
          <p className="text-xs sm:text-sm text-slate-500">Kelola inventaris, SKU, harga beli, harga jual, dan stok barang toko.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk atau SKU..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Kategori ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center space-x-1.5 whitespace-nowrap transition-all ${
              filterLowStockOnly
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Stok Menipis</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">SKU & Barcode</th>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga Modal</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4 text-right">Margin Laba</th>
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada produk yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const profit = p.sellPrice - p.buyPrice;
                  const profitMargin = p.sellPrice > 0 ? Math.round((profit / p.sellPrice) * 100) : 0;
                  const isLow = p.stock <= p.minStock;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-slate-800">{p.sku}</div>
                        {p.barcode && <div className="text-[10px] text-slate-400">{p.barcode}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-[10px] text-slate-400">Satuan: {p.unit}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {p.categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-mono">
                        {formatRupiah(p.buyPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                        {formatRupiah(p.sellPrice)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-emerald-700 font-semibold font-mono">
                          +{formatRupiah(profit)}
                        </span>
                        <div className="text-[10px] text-slate-400">({profitMargin}%)</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsStockModalOpen(true);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs inline-flex items-center space-x-1 transition-all ${
                            p.stock <= 0
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : isLow
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Klik untuk ubah stok manual"
                        >
                          <span>{p.stock}</span>
                          <span className="text-[10px] font-normal">{p.unit}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Edit Produk"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {selectedProduct ? 'Ubah Data Produk' : 'Tambah Produk Baru'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Beras Rojolele 5kg"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">SKU / Kode</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Beli / Modal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm font-bold font-mono text-emerald-700 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Saat Ini</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Min. Stok</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="pack">pack</option>
                    <option value="dus">dus</option>
                    <option value="botol">botol</option>
                    <option value="pouch">pouch</option>
                    <option value="renteng">renteng</option>
                    <option value="kaleng">kaleng</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {isStockModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 max-w-sm w-full space-y-4">
            <h4 className="font-bold text-slate-900">Ubah Stok Manual</h4>
            <p className="text-xs text-slate-500">
              Produk: <span className="font-semibold text-slate-800">{selectedProduct.name}</span> (Stok saat ini: {selectedProduct.stock} {selectedProduct.unit})
            </p>

            <form onSubmit={handleStockAdjustment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tambah / Kurangi Jumlah Stok</label>
                <input
                  type="number"
                  required
                  autoFocus
                  placeholder="Gunakan tanda minus (-) untuk mengurangi, misal -2"
                  value={stockDelta}
                  onChange={(e) => setStockDelta(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
