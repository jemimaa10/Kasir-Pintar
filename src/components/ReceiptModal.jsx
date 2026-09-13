import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Copy, 
  ShoppingBag,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';

export default function ReceiptModal() {
  const { 
    isReceiptModalOpen, 
    setIsReceiptModalOpen, 
    currentReceipt,
    storeInfo,
    setActiveTab
  } = useApp();

  if (!isReceiptModalOpen || !currentReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `=== ${storeInfo.name} ===
${storeInfo.address}
Telp: ${storeInfo.phone}
--------------------------------
No. Trx : ${currentReceipt.code}
Waktu   : ${formatDate(currentReceipt.date)}
Kasir   : ${currentReceipt.cashier}
Pelanggan: ${currentReceipt.customerName}
--------------------------------
${currentReceipt.items.map(i => `${i.name}\n  ${i.qty} x ${formatRupiah(i.price)} = ${formatRupiah(i.subtotal)}`).join('\n')}
--------------------------------
Subtotal: ${formatRupiah(currentReceipt.subtotal)}
Diskon  : ${formatRupiah(currentReceipt.discount)}
TOTAL   : ${formatRupiah(currentReceipt.total)}
Bayar   : ${formatRupiah(currentReceipt.paidAmount)} (${currentReceipt.paymentMethod.toUpperCase()})
Kembali : ${formatRupiah(currentReceipt.changeAmount)}
================================
${storeInfo.receiptFooter}
`;
    navigator.clipboard.writeText(text);
    alert('Struk teks berhasil disalin ke clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Success Banner */}
        <div className="p-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="font-bold text-sm">Transaksi Berhasil Disimpan!</span>
          </div>
          <button
            onClick={() => setIsReceiptModalOpen(false)}
            className="p-1 rounded-lg hover:bg-emerald-700 text-white/80 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/50">
          <div 
            id="printable-receipt"
            className="bg-white p-5 rounded-xl border border-dashed border-slate-300 font-mono text-xs text-slate-800 shadow-xs space-y-2.5 mx-auto max-w-[320px]"
          >
            {/* Header */}
            <div className="text-center space-y-0.5">
              <h4 className="font-extrabold text-sm tracking-tight uppercase text-slate-900">{storeInfo.name}</h4>
              <p className="text-[10px] text-slate-500 leading-tight">{storeInfo.address}</p>
              <p className="text-[10px] text-slate-500">Telp: {storeInfo.phone}</p>
            </div>

            <div className="border-b border-dashed border-slate-300 my-2" />

            {/* Meta */}
            <div className="space-y-0.5 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold text-slate-800">{currentReceipt.code}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatDate(currentReceipt.date)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{currentReceipt.cashier}</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{currentReceipt.customerName}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-300 my-2" />

            {/* Item list */}
            <div className="space-y-2">
              {currentReceipt.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-semibold text-slate-800">{item.name}</div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{item.qty} x {formatRupiah(item.price)}</span>
                    <span className="font-medium text-slate-800">{formatRupiah(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b border-dashed border-slate-300 my-2" />

            {/* Totals */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(currentReceipt.subtotal)}</span>
              </div>
              {currentReceipt.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Diskon</span>
                  <span>-{formatRupiah(currentReceipt.discount)}</span>
                </div>
              )}
              {currentReceipt.tax > 0 && (
                <div className="flex justify-between">
                  <span>Pajak PPN</span>
                  <span>{formatRupiah(currentReceipt.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-dashed border-slate-200">
                <span>TOTAL</span>
                <span>{formatRupiah(currentReceipt.total)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Bayar ({currentReceipt.paymentMethod.toUpperCase()})</span>
                <span>{formatRupiah(currentReceipt.paidAmount)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Kembalian</span>
                <span>{formatRupiah(currentReceipt.changeAmount)}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-300 my-2" />

            {/* Footer */}
            <div className="text-center text-[10px] text-slate-500 pt-1 space-y-1">
              <p className="whitespace-pre-line leading-relaxed">{storeInfo.receiptFooter}</p>
              <div className="pt-2 flex justify-center">
                {/* Simulated barcode */}
                <div className="h-7 w-40 flex items-center justify-between opacity-80">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="h-full bg-slate-900" 
                      style={{ width: (i % 3 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '1px') }} 
                    />
                  ))}
                </div>
              </div>
              <p className="font-mono text-[9px] text-slate-400">{currentReceipt.code}</p>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopyText}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1 transition-colors"
              title="Salin teks struk"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Salin</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk</span>
            </button>
          </div>

          <button
            onClick={() => {
              setIsReceiptModalOpen(false);
              setActiveTab('pos');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            Transaksi Baru
          </button>
        </div>

      </div>
    </div>
  );
}
