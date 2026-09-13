import React, { useState, useEffect } from 'react';
import { 
  X, 
  Banknote, 
  QrCode, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah } from '../utils/formatters';

export default function PaymentModal() {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    cartTotal, 
    completeTransaction,
    storeInfo
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'qris', 'transfer'
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
  const [cashAmount, setCashAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('BCA');

  // Reset inputs when modal opens
  useEffect(() => {
    if (isPaymentModalOpen) {
      setCashAmount('');
      setPaymentMethod('cash');
      setCustomerName('Pelanggan Umum');
    }
  }, [isPaymentModalOpen, cartTotal]);

  if (!isPaymentModalOpen) return null;

  const numericCash = Number(cashAmount) || 0;
  const change = numericCash - cartTotal;
  const isCashSufficient = numericCash >= cartTotal;

  // Quick cash buttons
  const quickCashOptions = [
    { label: 'Uang Pas', value: cartTotal },
    { label: 'Rp 20.000', value: 20000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 150.000', value: 150000 },
    { label: 'Rp 200.000', value: 200000 },
  ].filter(opt => opt.value >= cartTotal || opt.label === 'Uang Pas');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (paymentMethod === 'cash') {
      if (!isCashSufficient) {
        alert('Nominal uang bayar masih kurang!');
        return;
      }
      completeTransaction({
        paymentMethod: 'cash',
        paidAmount: numericCash,
        customerName
      });
    } else {
      completeTransaction({
        paymentMethod,
        paidAmount: cartTotal,
        customerName
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Pembayaran Kasir</h3>
            <p className="text-xs text-slate-500">Pilih metode & selesaikan transaksi</p>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Bill Card */}
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
          <span className="text-xs uppercase font-semibold tracking-wider text-slate-400">Total Tagihan</span>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">
            {formatRupiah(cartTotal)}
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
          
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nama Pelanggan (Opsional)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Pelanggan Umum, Ibu Rina, dll."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'cash', label: 'Tunai', icon: Banknote },
                { id: 'qris', label: 'QRIS', icon: QrCode },
                { id: 'transfer', label: 'Transfer', icon: Building2 },
              ].map(m => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                      isSel 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSel ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* METHOD: CASH */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Uang Diterima (Rp)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">Rp</span>
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="0"
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 text-base font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-2">
                {quickCashOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashAmount(String(opt.value))}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Change / Kembalian preview */}
              {numericCash > 0 && (
                <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isCashSufficient 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <div className="flex items-center space-x-2">
                    {isCashSufficient ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-xs font-medium">
                      {isCashSufficient ? 'Kembalian:' : 'Uang Kurang:'}
                    </span>
                  </div>
                  <span className="font-extrabold text-base">
                    {formatRupiah(Math.abs(change))}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* METHOD: QRIS */}
          {paymentMethod === 'qris' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border border-slate-300 shadow-xs flex flex-col items-center justify-center">
                {/* Simulated QR Code SVG */}
                <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M10 10h30v30H10zM50 10h10v10H50zM70 10h20v20H70zM50 30h10v10H50zM15 15v20h20V15H15zM20 20h10v10H20zM75 15v10h10V15H75zM10 50h10v20H10zM30 50h20v10H30zM70 50h20v10H70zM10 80h30v10H10zM60 70h10v20H60zM80 80h10v10H80zM30 70h10v10H30zM50 80h10v10H50z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Scan QRIS Nasional</p>
                <p className="text-xs text-slate-500">BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">Total: {formatRupiah(cartTotal)}</p>
              </div>
            </div>
          )}

          {/* METHOD: TRANSFER */}
          {paymentMethod === 'transfer' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {['BCA', 'Mandiri', 'BRI'].map(bank => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedBank === bank 
                        ? 'border-blue-600 bg-blue-50 text-blue-800' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Tujuan:</span>
                  <span className="font-bold text-slate-800">Bank {selectedBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Rekening:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedBank === 'BCA' ? '8830-1234-56' : selectedBank === 'Mandiri' ? '1310-0099-8822' : '0021-9988-7766-50'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Atas Nama:</span>
                  <span className="font-semibold text-slate-800">{storeInfo.name}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Confirm */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={paymentMethod === 'cash' && !isCashSufficient}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center space-x-2 shadow-md transition-all ${
              paymentMethod === 'cash' && !isCashSufficient
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20 active:scale-[0.98]'
            }`}
          >
            <span>Selesaikan & Cetak Struk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
