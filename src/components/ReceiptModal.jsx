import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatDate } from '../utils/formatters';
import { PAYMENT_METHOD_LABEL, formatKm, getCarName } from '../utils/carUtils';

// Baris "label : nilai" di dalam kertas struk (tetap putih–hitam untuk printer thermal)
function ReceiptRow({ label, value, strong = false, accent = false }) {
  return (
    <div className="flex justify-between gap-3">
      <span className={accent ? 'text-slate-700' : 'text-slate-500'}>{label}</span>
      <span className={`text-right ${strong ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}

export default function ReceiptModal() {
  const {
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    currentReceipt,
    storeInfo,
    setActiveTab
  } = useApp();

  if (!isReceiptModalOpen || !currentReceipt) return null;

  const isCarSale = currentReceipt.saleType === 'car';
  const car = currentReceipt.car || null;
  const credit = currentReceipt.credit || null;
  const tradeIn = currentReceipt.tradeIn || null;
  const items = currentReceipt.items || [];
  const paymentLabel = PAYMENT_METHOD_LABEL[currentReceipt.paymentMethod] || currentReceipt.paymentMethod || '-';
  const carName = items[0]?.name || getCarName(car, { withYear: true }) || 'Unit Mobil';
  const amountDue = Number.isFinite(currentReceipt.amountDue) ? currentReceipt.amountDue : (currentReceipt.total || 0);
  const isVoided = currentReceipt.status === 'void';
  const shopName = (storeInfo.name || 'AUTO18').trim();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const sep = '--------------------------------';
    const head = `=== ${isVoided ? '[DIBATALKAN] ' : ''}${shopName.toUpperCase()} ===${storeInfo.tagline ? `\n${storeInfo.tagline}` : ''}
${storeInfo.address}
Telp: ${storeInfo.phone}
${sep}`;

    const meta = `No. Nota : ${currentReceipt.code}
Waktu    : ${formatDate(currentReceipt.date)}
Kasir    : ${currentReceipt.cashier}
Pelanggan: ${currentReceipt.customerName}${currentReceipt.customerPhone ? `\nNo. HP   : ${currentReceipt.customerPhone}` : ''}`;

    let body;
    if (isCarSale) {
      const carLines = [
        `Kode Stok  : ${car?.code || '-'}`,
        `Tahun      : ${car?.year || '-'}`,
        `Plat       : ${car?.plate || '-'}`,
        `Kilometer  : ${formatKm(car?.mileage)}`,
        `Transmisi  : ${car?.transmission || '-'}`,
        `Bahan Bakar: ${car?.fuel || '-'}`,
        `Warna      : ${car?.color || '-'}`,
      ].join('\n');

      const payLines = [];
      if (currentReceipt.paymentMethod === 'credit' && credit) {
        payLines.push(`Leasing    : ${credit.leasing}`);
        payLines.push(`DP Dibayar : ${credit.dpPercent}% = ${formatRupiah(credit.dpAmount)}`);
        payLines.push(`Tenor      : ${credit.tenorMonths} bulan`);
        payLines.push(`Cicilan    : ${formatRupiah(credit.monthly)} /bulan`);
        payLines.push(`Bunga      : ${credit.annualRate}% flat/thn`);
      } else if (currentReceipt.paymentMethod === 'cash') {
        payLines.push(`Bayar      : ${formatRupiah(currentReceipt.paidAmount)}`);
        payLines.push(`Kembalian  : ${formatRupiah(currentReceipt.changeAmount)}`);
      }

      body = `NOTA PENJUALAN KENDARAAN
${sep}
${carName}
${carLines}
${sep}
Harga      : ${formatRupiah(currentReceipt.subtotal)}
${currentReceipt.discount > 0 ? `Diskon     : -${formatRupiah(currentReceipt.discount)}\n` : ''}TOTAL      : ${formatRupiah(currentReceipt.total)}
${tradeIn ? `Tukar Tambah (${tradeIn.carName}): -${formatRupiah(tradeIn.value)}\n` : ''}${amountDue !== currentReceipt.total ? `Sisa Bayar : ${formatRupiah(amountDue)}\n` : ''}
Pembayaran : ${paymentLabel}${payLines.length ? `\n${payLines.join('\n')}` : ''}${currentReceipt.notes ? `\nCatatan    : ${currentReceipt.notes}` : ''}`;
    } else {
      body = `${items.map(i => `${i.name}\n  ${i.qty} x ${formatRupiah(i.price)} = ${formatRupiah(i.subtotal)}`).join('\n')}
${sep}
Subtotal: ${formatRupiah(currentReceipt.subtotal)}
Diskon  : ${formatRupiah(currentReceipt.discount)}
${currentReceipt.tax > 0 ? `PPN     : ${formatRupiah(currentReceipt.tax)}\n` : ''}TOTAL   : ${formatRupiah(currentReceipt.total)}
Bayar   : ${formatRupiah(currentReceipt.paidAmount)} (${paymentLabel})
Kembali : ${formatRupiah(currentReceipt.changeAmount)}`;
    }

    const text = `${head}
${meta}
${sep}
${body}
================================
${storeInfo.receiptFooter}
`;
    navigator.clipboard.writeText(text);
    alert('Struk teks berhasil disalin ke clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isCarSale ? 'Nota penjualan kendaraan' : 'Struk transaksi'}
        className="bg-ink-800 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[92vh]"
      >

        {/* Banner sukses */}
        <div className="a18-stripes-soft p-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" aria-hidden="true" />
            <span className="font-display font-black uppercase tracking-wide text-white text-sm truncate">
              {isCarSale ? 'Penjualan Mobil Tercatat!' : 'Transaksi Berhasil Disimpan!'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsReceiptModalOpen(false)}
            aria-label="Tutup nota"
            className="p-1.5 shrink-0 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Kertas struk (tetap putih untuk printer thermal) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-ink-900">
          <div
            id="printable-receipt"
            className="bg-white p-5 rounded-xl border border-dashed border-slate-300 font-mono text-xs text-slate-800 space-y-2.5 mx-auto max-w-[320px]"
          >
            {/* Kop struk */}
            <div className="text-center space-y-0.5">
              <h4 className="font-display text-lg font-black uppercase tracking-tight text-slate-900 leading-none">{shopName}</h4>
              {storeInfo.tagline && (
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500">{storeInfo.tagline}</p>
              )}
              <p className="text-[10px] text-slate-500 leading-tight pt-1">{storeInfo.address}</p>
              <p className="text-[10px] text-slate-500">Telp: {storeInfo.phone}</p>
            </div>

            <div className="border-b border-dashed border-slate-300 my-2" />

            {isVoided && (
              <p className="rounded-lg border-2 border-red-600 bg-red-50 px-3 py-1 text-center text-[11px] font-black uppercase tracking-[0.2em] text-red-700">
                Dibatalkan
              </p>
            )}

            {isCarSale && (
              <p className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-900">
                Nota Penjualan Kendaraan
              </p>
            )}

            {/* Data transaksi */}
            <div className="space-y-0.5 text-[11px]">
              <ReceiptRow label="No. Nota:" value={currentReceipt.code} strong />
              <ReceiptRow label="Tanggal:" value={formatDate(currentReceipt.date)} />
              <ReceiptRow label="Kasir:" value={currentReceipt.cashier} />
              <ReceiptRow label="Pelanggan:" value={currentReceipt.customerName} />
              {isCarSale && currentReceipt.customerPhone && (
                <ReceiptRow label="No. HP:" value={currentReceipt.customerPhone} />
              )}
            </div>

            <div className="border-b border-dashed border-slate-300 my-2" />

            {isCarSale ? (
              <>
                {/* Data kendaraan */}
                <div className="space-y-1 text-[11px]">
                  <p className="font-bold text-slate-900 leading-snug">{carName}</p>
                  <ReceiptRow label="Kode Stok:" value={car?.code || '-'} />
                  <ReceiptRow label="Tahun:" value={car?.year || '-'} />
                  <ReceiptRow label="Plat:" value={car?.plate || '-'} />
                  <ReceiptRow label="Kilometer:" value={formatKm(car?.mileage)} />
                  <ReceiptRow label="Transmisi:" value={car?.transmission || '-'} />
                  <ReceiptRow label="Bahan Bakar:" value={car?.fuel || '-'} />
                  <ReceiptRow label="Warna:" value={car?.color || '-'} />
                </div>

                <div className="border-b border-dashed border-slate-300 my-2" />

                {/* Rincian harga */}
                <div className="space-y-1 text-[11px]">
                  <ReceiptRow label="Harga" value={formatRupiah(currentReceipt.subtotal)} />
                  {currentReceipt.discount > 0 && (
                    <ReceiptRow label="Diskon" value={`-${formatRupiah(currentReceipt.discount)}`} />
                  )}
                  <div className="flex justify-between gap-3 font-bold text-sm text-slate-900 pt-1 border-t border-dashed border-slate-200">
                    <span>TOTAL</span>
                    <span>{formatRupiah(currentReceipt.total)}</span>
                  </div>
                  {tradeIn && (
                    <ReceiptRow
                      label={`Tukar Tambah${tradeIn.carName ? ` (${tradeIn.carName})` : ''}`}
                      value={`-${formatRupiah(tradeIn.value)}`}
                    />
                  )}
                  {/* Sisa bayar hanya relevan bila berbeda dari total (mis. ada tukar tambah) */}
                  {amountDue !== currentReceipt.total && (
                    <ReceiptRow label="Sisa Bayar" value={formatRupiah(amountDue)} strong accent />
                  )}
                </div>

                <div className="border-b border-dashed border-slate-300 my-2" />

                {/* Pembayaran */}
                <div className="space-y-1 text-[11px]">
                  <ReceiptRow label="Pembayaran" value={paymentLabel} strong />

                  {currentReceipt.paymentMethod === 'credit' && credit && (
                    <>
                      <ReceiptRow label="Leasing" value={credit.leasing || '-'} />
                      <ReceiptRow
                        label={`DP Dibayar (${credit.dpPercent}%)`}
                        value={formatRupiah(credit.dpAmount)}
                      />
                      <ReceiptRow label="Tenor" value={`${credit.tenorMonths} bulan`} />
                      <ReceiptRow label="Cicilan/bulan" value={formatRupiah(credit.monthly)} strong />
                      <ReceiptRow label="Bunga" value={`${credit.annualRate}% flat/thn`} />
                    </>
                  )}

                  {currentReceipt.paymentMethod === 'cash' && (
                    <>
                      <ReceiptRow label="Bayar" value={formatRupiah(currentReceipt.paidAmount)} />
                      <ReceiptRow label="Kembalian" value={formatRupiah(currentReceipt.changeAmount)} strong />
                    </>
                  )}
                </div>

                {currentReceipt.notes && (
                  <>
                    <div className="border-b border-dashed border-slate-300 my-2" />
                    <p className="text-[10px] text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-700">Catatan: </span>
                      {currentReceipt.notes}
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Daftar barang & jasa */}
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="font-semibold text-slate-800">{item.name}</div>
                      <div className="flex justify-between gap-3 text-[11px] text-slate-500">
                        <span>{item.qty} x {formatRupiah(item.price)}</span>
                        <span className="font-medium text-slate-800">{formatRupiah(item.subtotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-b border-dashed border-slate-300 my-2" />

                {/* Total */}
                <div className="space-y-1 text-[11px]">
                  <ReceiptRow label="Subtotal" value={formatRupiah(currentReceipt.subtotal)} />
                  {currentReceipt.discount > 0 && (
                    <ReceiptRow label="Diskon" value={`-${formatRupiah(currentReceipt.discount)}`} />
                  )}
                  {currentReceipt.tax > 0 && (
                    <ReceiptRow label="Pajak PPN" value={formatRupiah(currentReceipt.tax)} />
                  )}
                  <div className="flex justify-between gap-3 font-bold text-sm text-slate-900 pt-1 border-t border-dashed border-slate-200">
                    <span>TOTAL</span>
                    <span>{formatRupiah(currentReceipt.total)}</span>
                  </div>
                  <ReceiptRow label={`Bayar (${paymentLabel})`} value={formatRupiah(currentReceipt.paidAmount)} />
                  <ReceiptRow label="Kembalian" value={formatRupiah(currentReceipt.changeAmount)} strong />
                </div>
              </>
            )}

            <div className="border-b border-dashed border-slate-300 my-2" />

            {/* Kaki struk */}
            <div className="text-center text-[10px] text-slate-500 pt-1 space-y-1">
              <p className="whitespace-pre-line leading-relaxed">{storeInfo.receiptFooter}</p>
              <div className="pt-2 flex justify-center">
                {/* Simulasi barcode */}
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

        {/* Tombol aksi */}
        <div className="p-4 border-t border-white/10 bg-ink-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyText}
              className="a18-btn-ghost px-3 py-2.5 text-xs"
              title="Salin teks struk"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Salin</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="a18-btn-outline px-3.5 py-2 text-xs"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              <span>Cetak Struk</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsReceiptModalOpen(false);
              if (!isCarSale) setActiveTab('pos');
            }}
            className="a18-btn-primary px-4 py-2.5 text-xs"
          >
            {isCarSale ? 'Selesai' : 'Transaksi Baru'}
          </button>
        </div>

      </div>
    </div>
  );
}
