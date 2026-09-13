import React, { useState } from 'react';
import { X, Store, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SettingsModal() {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen, 
    storeInfo, 
    setStoreInfo, 
    resetToDefault 
  } = useApp();

  const [form, setForm] = useState({ ...storeInfo });

  if (!isSettingsModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setStoreInfo(form);
    setIsSettingsModalOpen(false);
    alert('Pengaturan toko berhasil diperbarui!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Pengaturan Profil Toko & Struk</h3>
          </div>
          <button onClick={() => setIsSettingsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Toko UMKM</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Slogan / Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap Toko</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon Toko</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Kasir Default</label>
              <input
                type="text"
                value={form.cashierName}
                onChange={(e) => setForm({ ...form, cashierName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pesan Kaki Struk (Receipt Footer)</label>
            <textarea
              rows={2}
              value={form.receiptFooter}
              onChange={(e) => setForm({ ...form, receiptFooter: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
          </div>

          {/* Tax Setting */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">Pajak PPN Kasir</span>
              <span className="text-[11px] text-slate-500">Terapkan tarif PPN pada transaksi</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.taxEnabled}
                onChange={(e) => setForm({ ...form, taxEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="font-bold text-slate-700">{form.taxRate}%</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={resetToDefault}
              className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
