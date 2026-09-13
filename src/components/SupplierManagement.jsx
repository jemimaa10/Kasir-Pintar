import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Phone, 
  MapPin, 
  User, 
  PackagePlus, 
  CheckCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export default function SupplierManagement() {
  const { suppliers, addSupplier, products, recordPurchase } = useApp();

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  // Supplier Form
  const [supForm, setSupForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    address: ''
  });

  // Restock Form
  const [restockForm, setRestockForm] = useState({
    supplierId: suppliers[0]?.id || '',
    productId: products[0]?.id || '',
    qty: 10,
    buyPrice: '',
    invoiceNo: ''
  });

  const handleCreateSupplier = (e) => {
    e.preventDefault();
    addSupplier({
      name: supForm.name,
      contactPerson: supForm.contactPerson,
      phone: supForm.phone,
      address: supForm.address
    });
    setSupForm({ name: '', contactPerson: '', phone: '', address: '' });
    setIsSupplierModalOpen(false);
  };

  const handleRestock = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === restockForm.productId);
    recordPurchase(restockForm.supplierId, [
      {
        productId: restockForm.productId,
        qty: Number(restockForm.qty),
        buyPrice: restockForm.buyPrice ? Number(restockForm.buyPrice) : (product?.buyPrice || 0)
      }
    ], restockForm.invoiceNo);

    alert(`Berhasil menambah ${restockForm.qty} stok untuk "${product?.name}"!`);
    setIsRestockModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Suplier & Kulakan</h2>
          <p className="text-xs sm:text-sm text-slate-500">Pencatatan data suplier grosir, distributor, dan faktur barang masuk.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRestockModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Catat Stok Masuk (Kulakan)</span>
          </button>
          <button
            onClick={() => setIsSupplierModalOpen(true)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm rounded-xl transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Suplier</span>
          </button>
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Distributor
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-base">{s.name}</h4>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>PIC: {s.contactPerson}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{s.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{s.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Pencatatan Barang Masuk (Restock)</h3>
              <button onClick={() => setIsRestockModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Suplier</label>
                <select
                  value={restockForm.supplierId}
                  onChange={(e) => setRestockForm({ ...restockForm, supplierId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Produk yang Masuk</label>
                <select
                  value={restockForm.productId}
                  onChange={(e) => setRestockForm({ ...restockForm, productId: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok saat ini: {p.stock} {p.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Masuk</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={restockForm.qty}
                    onChange={(e) => setRestockForm({ ...restockForm, qty: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. Faktur (Opsional)</label>
                  <input
                    type="text"
                    placeholder="INV-..."
                    value={restockForm.invoiceNo}
                    onChange={(e) => setRestockForm({ ...restockForm, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20"
                >
                  Tambah Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Tambah Data Suplier</h3>
              <button onClick={() => setIsSupplierModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Suplier / Perusahaan</label>
                <input
                  type="text"
                  required
                  value={supForm.name}
                  onChange={(e) => setSupForm({ ...supForm, name: e.target.value })}
                  placeholder="Contoh: PT Distribusi Sembako"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Sales / PIC</label>
                <input
                  type="text"
                  required
                  value={supForm.contactPerson}
                  onChange={(e) => setSupForm({ ...supForm, contactPerson: e.target.value })}
                  placeholder="Contoh: Bpk. Budi"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={supForm.phone}
                  onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })}
                  placeholder="0812-..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Gudang / Kantor</label>
                <input
                  type="text"
                  value={supForm.address}
                  onChange={(e) => setSupForm({ ...supForm, address: e.target.value })}
                  placeholder="Jl. ..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Simpan Suplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
