import React from 'react';
import { Heart, MapPin, Gauge, Calendar, Settings2, Fuel, BadgeCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CarImage from './CarImage';
import { CAR_STATUS, calcInstallment, formatKm, formatRupiahShort, getCarName } from '../utils/carUtils';
import { formatRupiah } from '../utils/formatters';

export default function CarCard({ car }) {
  const { openCarDetail, favoriteCarIds, toggleFavoriteCar, storeInfo } = useApp();

  const isFavorite = favoriteCarIds.includes(car.id);
  const isSold = car.status === 'sold';
  const status = CAR_STATUS[car.status];
  const { monthly } = calcInstallment({
    price: car.price,
    dpPercent: storeInfo.minDpPercent,
    tenorMonths: 60,
    annualRate: storeInfo.creditRate,
  });

  const open = () => openCarDetail(car.id);

  const specs = [
    { icon: Calendar, label: car.year },
    { icon: Gauge, label: formatKm(car.mileage) },
    { icon: Settings2, label: car.transmission },
    { icon: Fuel, label: car.fuel },
  ];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        // Abaikan kalau event ini menggelembung dari elemen lain di dalam kartu (mis.
        // tombol favorit) — kalau tidak, Enter/Space di tombol itu ikut membuka detail.
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      aria-label={`Lihat detail ${getCarName(car, { withYear: true })}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 transition-all hover:border-brand-600 hover:shadow-lg hover:shadow-brand-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {/* Foto */}
      <div className="relative">
        <CarImage
          car={car}
          className="aspect-[16/10] w-full"
          imgClassName={`transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale' : ''}`}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-1.5">
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

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteCar(car.id);
          }}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          title={isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition-colors hover:border-brand-500 hover:bg-brand-600"
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-brand-500 text-brand-500' : ''}`} />
        </button>

        {car.inspectionScore > 0 && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            <BadgeCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
            Inspeksi {car.inspectionScore}/100
          </span>
        )}
      </div>

      {/* Info */}
      <div className={`flex flex-1 flex-col p-4 ${isSold ? 'opacity-70' : ''}`}>
        <h3 className="font-display text-base font-black uppercase leading-tight tracking-wide text-white">
          {car.brand} {car.model}
        </h3>
        <p className="mt-0.5 truncate text-xs text-neutral-400">
          {car.variant} · {car.year}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-neutral-400">
          {specs.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1">
              <Icon className="h-3.5 w-3.5 text-neutral-500" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>

        <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-neutral-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {car.location}
        </p>

        <div className="mt-auto border-t border-white/10 pt-3">
          <p className="font-display text-xl font-black text-white">{formatRupiah(car.price)}</p>
          {!isSold && (
            <p className="mt-0.5 text-xs text-brand-400">
              Cicilan mulai {formatRupiahShort(monthly)}/bln
            </p>
          )}
          {isSold && car.soldPrice > 0 && (
            <p className="mt-0.5 text-xs text-neutral-500">Terjual {formatRupiah(car.soldPrice)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
