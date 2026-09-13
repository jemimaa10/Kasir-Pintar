# Kasir Pintar UMKM 🏪🛒

Aplikasi web **Point of Sale (POS) & Manajemen Inventaris** modern yang dirancang khusus untuk kebutuhan toko kelontong, minimarket, grosir, dan usaha ritel UMKM di Indonesia.

---

## ✨ Fitur Utama

- **🖥️ Mesin Kasir POS (Point of Sale)**
  - Pencarian cepat produk berdasarkan nama, kode SKU, atau barcode.
  - Filter kategori instan (*Sembako, Minyak & Bumbu, Minuman, Snack, Kebersihan*).
  - Keranjang belanja interaktif (*tambah/kurang kuantitas, hapus item, input diskon Rp*).
  - Kalkulasi otomatis Subtotal, Diskon, PPN, dan Total Tagihan.

- **💳 Modal Pembayaran Fleksibel**
  - **Tunai / Cash**: Tombol pecahan Rupiah cepat (Rp 20.000, 50.000, 100.000, Uang Pas) dengan kalkulasi kembalian otomatis.
  - **QRIS**: Tampilan kode QR interaktif untuk pembayaran dompet digital (GoPay, OVO, Dana, ShopeePay, BCA).
  - **Transfer Bank**: Rekening tujuan (BCA, Mandiri, BRI).

- **🖨️ Cetak Struk Thermal (58mm / 80mm)**
  - Format struk mini standar printer thermal kasir.
  - Integrasi tombol cetak langsung browser (`window.print()`) dengan styling CSS print media khusus.
  - Tombol salin teks nota ke clipboard.

- **📦 Manajemen Produk & Inventaris**
  - Katalog produk terperinci dengan perhitungan otomatis margin keuntungan per barang.
  - Tambah, edit, dan hapus produk.
  - Penyesuaian stok manual (*Stock Adjustment*) secara cepat.
  - Indikator peringatan stok menipis (*Low Stock Alerts*).

- **🚚 Manajemen Suplier & Stok Masuk (Kulakan)**
  - Pencatatan kontak distributor/suplier.
  - Formulir penerimaan barang masuk dari suplier yang langsung menambah stok barang di gudang.

- **📊 Laporan Penjualan & Keuntungan**
  - Rekapitulasi finansial: Total Omset, Total Modal (HPP), Total Laba Bersih, dan Nilai Keranjang Rata-rata.
  - Filter waktu: *Hari Ini, 7 Hari Terakhir, Bulan Ini, Semua Waktu*.
  - Riwayat transaksi lengkap dengan opsi cetak ulang struk lama kapan saja.
  - **Export to CSV**: Unduh laporan penjualan ke format Excel (`.csv`).

- **📈 Dashboard Bisnis**
  - KPI harian, grafik tren omset mingguan, dan daftar 5 produk terlaris.

- **💾 Penyimpanan Otomatis (Local Persistence)**
  - Terintegrasi dengan `localStorage` browser sehingga semua data transaksi, produk, dan pengaturan toko tersimpan permanen tanpa perlu setup database rumit.

---

## 🚀 Cara Menjalankan Aplikasi

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 ke atas)

### Langkah Instalasi
```bash
# 1. Clone repository ini
git clone https://github.com/jemimaa10/Kasir-Pintar.git
cd Kasir-Pintar

# 2. Install dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```
Buka browser dan akses: **http://localhost:5173/**

### Build Produksi
```bash
npm run build
```
Hasil build yang siap di-deploy akan berada di dalam folder `dist/`.

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

Dibuat untuk memajukan digitalisasi UMKM Indonesia 🇮🇩.
