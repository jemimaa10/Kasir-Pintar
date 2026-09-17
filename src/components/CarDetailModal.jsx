import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  X, Heart, Calendar, Gauge, Settings2, Fuel, Cog, Users, Palette, MapPin, FileText, Wrench,
  BadgeCheck, MessageCircle, Phone, CalendarCheck, CheckCircle2, ShieldCheck, Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CarImage from './CarImage';
import CreditSimulator from './CreditSimulator';
import { AUTO18_BENEFITS, INSPECTION_CATEGORIES } from '../data/initialData';
import { CAR_IMAGE_CREDITS } from '../data/carImages';
import { CAR_STATUS, calcInstallment, formatKm, formatRupiahShort, getCarName, isValidPhone } from '../utils/carUtils';
import { formatDate, formatRupiah } from '../utils/formatters';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

// 'YYYY-MM-DD' hari ini menurut waktu lokal
const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// 'YYYY-MM' → 'Mar 2027'
const formatMonth = (value) => {
  if (!value) return '-';
  const [year, month] = String(value).split('-');
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' }).format(date);
};

const scoreColor = (score) => (score >= 90 ? 'bg-white' : score >= 80 ? 'bg-amber-400' : 'bg-brand-600');

const emptyBooking = {
  customerName: '',
  phone: '',
  date: '',
  time: '10:00',
  location: 'showroom',
  address: '',
  notes: '',
};

export default function CarDetailModal() {
  const {
    selectedCar, closeCarDetail, openCarCheckout, checkoutCar, favoriteCarIds, toggleFavoriteCar,
    addTestDrive, storeInfo, transactions, setCurrentReceipt, setIsReceiptModalOpen,
  } = useApp();

  const [showBooking, setShowBooking] = useState(false);
  const [booking, setBooking] = useState(emptyBooking);
  const [errors, setErrors] = useState({});
  const [successCode, setSuccessCode] = useState('');

  const carId = selectedCar?.id;

  // Reset isi form saat mobil yang dibuka berganti / modal ditutup
  useEffect(() => {
    setShowBooking(false);
    setBooking({ ...emptyBooking, date: todayLocal() });
    setErrors({});
    setSuccessCode('');
  }, [carId]);

  // Tutup dengan Escape (kecuali modal "Proses Penjualan" sedang terbuka di atasnya —
  // Escape hanya boleh menutup modal paling atas) + kunci scroll halaman di belakang
  // modal. Kuncinya dibagi lewat scrollLock supaya modal lain yang bertumpuk tidak
  // saling menimpa nilai overflow tersimpannya satu sama lain.
  const closeRef = useRef(closeCarDetail);
  closeRef.current = closeCarDetail;
  const checkoutOpenRef = useRef(false);
  checkoutOpenRef.current = !!checkoutCar;

  useEffect(() => {
    if (!carId) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !checkoutOpenRef.current) closeRef.current();
    };
    window.addEventListener('keydown', onKeyDown);
    lockScroll();
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      unlockScroll();
    };
  }, [carId]);

  const installment = useMemo(() => calcInstallment({
    price: selectedCar?.price || 0,
    dpPercent: storeInfo.minDpPercent,
    tenorMonths: 60,
    annualRate: storeInfo.creditRate,
  }), [selectedCar?.price, storeInfo.minDpPercent, storeInfo.creditRate]);

  if (!selectedCar) return null;

  const car = selectedCar;
  const isSold = car.status === 'sold';
  const isFavorite = favoriteCarIds.includes(car.id);
  const status = CAR_STATUS[car.status];
  const soldTransaction = isSold ? transactions.find(t => t.id === car.soldTransactionId) : null;
  // Foto bawaan berasal dari Wikimedia Commons dan wajib dicantumkan sumbernya
  const photoCredit = !car.imageUrl && car.imageKey
    ? CAR_IMAGE_CREDITS.find(credit => credit.key === car.imageKey)
    : null;

  const specs = [
    { icon: Calendar, label: 'Tahun', value: car.year },
    { icon: Gauge, label: 'Kilometer', value: formatKm(car.mileage) },
    { icon: Settings2, label: 'Transmisi', value: car.transmission },
    { icon: Fuel, label: 'Bahan Bakar', value: car.fuel },
    { icon: Cog, label: 'Mesin', value: car.engineCc ? `${car.engineCc} cc` : '-' },
    { icon: Users, label: 'Kapasitas', value: `${car.seats} kursi` },
    { icon: Palette, label: 'Warna', value: car.color || '-' },
    { icon: MapPin, label: 'Lokasi', value: car.location || '-' },
    { icon: FileText, label: 'Plat', value: car.plate ? `Plat ${String(car.plate).trim().split(' ')[0]}` : '-' },
    { icon: Users, label: 'Kepemilikan', value: `Tangan ke-${car.ownerCount || 1}` },
    { icon: Calendar, label: 'Pajak s/d', value: formatMonth(car.taxValidUntil) },
    { icon: Wrench, label: 'Riwayat Servis', value: car.serviceRecord ? 'Ada' : 'Tidak ada' },
  ];

  const waDigits = String(storeInfo.whatsapp || '').replace(/\D/g, '');
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Halo Auto18, saya tertarik dengan ${getCarName(car, { withYear: true })} (${car.code})`)}`
    : '';

  const submitBooking = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!booking.customerName.trim()) nextErrors.customerName = 'Nama wajib diisi';
    if (!isValidPhone(booking.phone)) nextErrors.phone = 'Nomor HP tidak valid';
    if (!booking.date) nextErrors.date = 'Tanggal wajib dipilih';
    else if (booking.date < todayLocal()) nextErrors.date = 'Tanggal sudah lewat';
    if (booking.location === 'rumah' && !booking.address.trim()) nextErrors.address = 'Alamat wajib diisi';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const created = addTestDrive({
      carId: car.id,
      customerName: booking.customerName.trim(),
      phone: booking.phone.trim(),
      date: booking.date,
      time: booking.time,
      location: booking.location,
      address: booking.address.trim(),
      notes: booking.notes.trim(),
    });
    setSuccessCode(created.code);
    setShowBooking(false);
    setBooking({ ...emptyBooking, date: todayLocal() });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) closeCarDetail(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={getCarName(car, { withYear: true })}
        className="my-4 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-ink-800/95 px-5 py-3.5 backdrop-blur">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-500">{car.code}</p>
            <h2 className="truncate font-display text-lg font-black uppercase tracking-wide text-white">
              {getCarName(car, { withYear: true })}
            </h2>
          </div>
          <button type="button" onClick={closeCarDetail} aria-label="Tutup detail mobil" className="a18-btn-ghost px-2">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1.5fr_1fr]">
          {/* Kiri: media & spesifikasi */}
          <div className="space-y-6">
            <div className="relative">
              <CarImage car={car} className="aspect-[16/10] w-full rounded-2xl" />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                {car.isFeatured && !isSold && (
                  <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                    Pilihan Auto18
                  </span>
                )}
                {status && car.status !== 'available' && (
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status.className}`}>
                    {status.label}
                  </span>
                )}
              </div>
            </div>

            {/* Kredit foto (lisensi Wikimedia Commons) */}
            {photoCredit && (
              <p className="-mt-4 text-[10px] text-neutral-600">
                Foto ilustrasi (diubah ukurannya): {photoCredit.author} /{' '}
                <a href={photoCredit.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-400">
                  Wikimedia Commons
                </a>{' '}
                (
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-neutral-400"
                >
                  {photoCredit.license}
                </a>
                )
              </p>
            )}

            {/* Spesifikasi */}
            <div>
              <h3 className="font-display text-sm font-black uppercase tracking-wide text-white">Spesifikasi</h3>
              <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-ink-900 p-3">
                    <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-500">
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="mt-1 truncate text-sm font-semibold text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Fitur */}
            {car.features?.length > 0 && (
              <div>
                <h3 className="font-display text-sm font-black uppercase tracking-wide text-white">Fitur Unggulan</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {car.features.map(feature => (
                    <span key={feature} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink-900 px-3 py-1.5 text-xs text-neutral-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {car.description && (
              <div>
                <h3 className="font-display text-sm font-black uppercase tracking-wide text-white">Catatan Showroom</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{car.description}</p>
              </div>
            )}

            {/* Laporan inspeksi */}
            <div className="a18-card p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-brand-600 bg-ink-900">
                  <span className="font-display text-xl font-black leading-none text-white">{car.inspectionScore}</span>
                  <span className="text-[9px] uppercase text-neutral-500">dari 100</span>
                </div>
                <div>
                  <h3 className="flex items-center gap-1.5 font-display text-sm font-black uppercase tracking-wide text-white">
                    <BadgeCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
                    Laporan Inspeksi Auto18
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400">
                    Mesin, transmisi, kaki-kaki, kelistrikan, interior, eksterior, dan dokumen diperiksa sebelum dijual.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {INSPECTION_CATEGORIES.map(category => {
                  const score = car.inspection?.[category.key] ?? 0;
                  return (
                    <div key={category.key}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-300">{category.label}</span>
                        <span className="font-bold text-white">{score}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className={`h-full rounded-full ${scoreColor(score)}`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefit */}
            <div className="rounded-2xl border border-brand-600/40 bg-brand-950/30 p-5">
              <h3 className="flex items-center gap-1.5 font-display text-sm font-black uppercase tracking-wide text-white">
                <ShieldCheck className="h-4 w-4 text-brand-500" aria-hidden="true" />
                Gratis Layanan Darurat 24 Jam
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-neutral-300 sm:grid-cols-2">
                {AUTO18_BENEFITS.slice(0, 4).map(benefit => (
                  <li key={benefit.no} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
                    {benefit.title}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-neutral-500">dan {AUTO18_BENEFITS.length - 4} layanan lainnya.</p>
            </div>
          </div>

          {/* Kanan: harga & aksi */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <div className="a18-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Harga Cash</p>
              <p className="font-display text-3xl font-black text-white">{formatRupiah(car.price)}</p>
              {!isSold && (
                <p className="mt-1 text-sm text-brand-400">
                  Cicilan mulai {formatRupiahShort(installment.monthly)}/bln
                  <span className="text-neutral-500"> · DP {storeInfo.minDpPercent}% · 60 bln</span>
                </p>
              )}

              {isSold ? (
                <div className="mt-4 rounded-xl border border-white/10 bg-ink-900 p-4 text-sm">
                  <p className="font-bold text-white">Mobil ini sudah terjual</p>
                  <p className="mt-1 text-neutral-400">
                    {car.soldAt ? formatDate(car.soldAt, false) : '-'}
                    {car.soldPrice ? ` · ${formatRupiah(car.soldPrice)}` : ''}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {successCode ? (
                    <div className="rounded-xl border border-white/15 bg-ink-900 p-4">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                        <CheckCircle2 className="h-4 w-4 text-brand-500" aria-hidden="true" />
                        Booking test drive terkirim
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Kode booking <span className="font-mono font-bold text-white">{successCode}</span>.
                        Tim Auto18 akan menghubungi Anda untuk konfirmasi.
                      </p>
                      <button type="button" onClick={() => setSuccessCode('')} className="a18-btn-ghost mt-2 px-0 text-xs">
                        Booking lagi
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setShowBooking(v => !v)} className="a18-btn-primary w-full py-3">
                      <CalendarCheck className="h-4 w-4" />
                      {showBooking ? 'Tutup Form' : 'Booking Test Drive'}
                    </button>
                  )}

                  {waHref ? (
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="a18-btn-outline w-full">
                      <MessageCircle className="h-4 w-4" />
                      Chat WhatsApp
                    </a>
                  ) : (
                    <a href={`tel:${String(storeInfo.callCenter || '').replace(/[^\d+]/g, '')}`} className="a18-btn-outline w-full">
                      <Phone className="h-4 w-4" />
                      Telepon {storeInfo.callCenter}
                    </a>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleFavoriteCar(car.id)}
                aria-pressed={isFavorite}
                className="a18-btn-ghost mt-2 w-full justify-center"
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-brand-500 text-brand-500' : ''}`} />
                {isFavorite ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
              </button>
            </div>

            {/* Form booking test drive */}
            {showBooking && !isSold && (
              <form onSubmit={submitBooking} className="a18-card space-y-3 p-5" noValidate>
                <h3 className="font-display text-sm font-black uppercase tracking-wide text-white">Jadwal Test Drive</h3>

                <div>
                  <label htmlFor="td-name" className="a18-label">Nama Lengkap</label>
                  <input
                    id="td-name"
                    value={booking.customerName}
                    onChange={(e) => setBooking(b => ({ ...b, customerName: e.target.value }))}
                    className="a18-input"
                    placeholder="Nama Anda"
                  />
                  {errors.customerName && <p className="mt-1 text-xs text-brand-400">{errors.customerName}</p>}
                </div>

                <div>
                  <label htmlFor="td-phone" className="a18-label">Nomor HP</label>
                  <input
                    id="td-phone"
                    type="tel"
                    value={booking.phone}
                    onChange={(e) => setBooking(b => ({ ...b, phone: e.target.value }))}
                    className="a18-input"
                    placeholder="0812-3456-7890"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-brand-400">{errors.phone}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="td-date" className="a18-label">Tanggal</label>
                    <input
                      id="td-date"
                      type="date"
                      min={todayLocal()}
                      value={booking.date}
                      onChange={(e) => setBooking(b => ({ ...b, date: e.target.value }))}
                      className="a18-input"
                    />
                    {errors.date && <p className="mt-1 text-xs text-brand-400">{errors.date}</p>}
                  </div>
                  <div>
                    <label htmlFor="td-time" className="a18-label">Jam</label>
                    <select
                      id="td-time"
                      value={booking.time}
                      onChange={(e) => setBooking(b => ({ ...b, time: e.target.value }))}
                      className="a18-input"
                    >
                      {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                  </div>
                </div>

                <fieldset>
                  <legend className="a18-label">Lokasi</legend>
                  <div className="flex gap-2">
                    {[{ id: 'showroom', label: 'Di Showroom' }, { id: 'rumah', label: 'Di Rumah Saya' }].map(option => (
                      <label
                        key={option.id}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                          booking.location === option.id
                            ? 'border-brand-500 bg-brand-600 text-white'
                            : 'border-white/15 text-neutral-300 hover:border-white/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="td-location"
                          className="sr-only"
                          checked={booking.location === option.id}
                          onChange={() => setBooking(b => ({ ...b, location: option.id }))}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {booking.location === 'rumah' && (
                  <div>
                    <label htmlFor="td-address" className="a18-label">Alamat</label>
                    <input
                      id="td-address"
                      value={booking.address}
                      onChange={(e) => setBooking(b => ({ ...b, address: e.target.value }))}
                      className="a18-input"
                      placeholder="Kecamatan, kota"
                    />
                    {errors.address && <p className="mt-1 text-xs text-brand-400">{errors.address}</p>}
                  </div>
                )}

                <div>
                  <label htmlFor="td-notes" className="a18-label">Catatan (opsional)</label>
                  <textarea
                    id="td-notes"
                    rows={2}
                    value={booking.notes}
                    onChange={(e) => setBooking(b => ({ ...b, notes: e.target.value }))}
                    className="a18-input"
                    placeholder="Misal: ingin tanya simulasi kredit"
                  />
                </div>

                <button type="submit" className="a18-btn-primary w-full">Kirim Booking</button>
              </form>
            )}

            <CreditSimulator price={car.price} compact />

            {/* Panel showroom */}
            <div className="a18-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Panel Showroom</p>
              {isSold ? (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-neutral-400">
                    Terjual {car.soldAt ? formatDate(car.soldAt) : '-'} · {formatRupiah(car.soldPrice || 0)}
                  </p>
                  {soldTransaction && (
                    <button
                      type="button"
                      onClick={() => { setCurrentReceipt(soldTransaction); setIsReceiptModalOpen(true); }}
                      className="a18-btn-outline w-full"
                    >
                      <Receipt className="h-4 w-4" />
                      Lihat Nota
                    </button>
                  )}
                </div>
              ) : (
                <button type="button" onClick={() => openCarCheckout(car.id)} className="a18-btn-outline mt-2 w-full">
                  <Receipt className="h-4 w-4" />
                  Proses Penjualan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
