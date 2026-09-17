# AUTO18 — Auto Eighteen 🚗🔴

**Jual / Beli Mobil Second Berkualitas.** Aplikasi web showroom mobil bekas: etalase mobil untuk pembeli, formulir jual & tukar tambah untuk penjual, plus panel showroom lengkap (stok mobil, kasir aksesoris, laporan penjualan).

Tampilannya mengikuti materi promosi Auto18: latar hitam, garis diagonal merah, dan tipografi tebal huruf besar.

---

## ✨ Fitur Utama

### 🚘 Beli Mobil (halaman pembeli)
- Hero pencarian cepat: kata kunci, tipe bodi, dan rentang harga.
- Pintasan merek dan tipe bodi lengkap dengan jumlah unit.
- Filter lengkap: merek (multi-pilih), harga, tipe bodi, transmisi, bahan bakar, tahun, kilometer, lokasi, favorit, dan opsi menampilkan mobil terjual.
- Urutan: rekomendasi, terbaru, harga, kilometer, dan tahun.
- Kartu mobil dengan foto, badge status, nilai inspeksi, harga cash, dan estimasi cicilan.
- Detail mobil: spesifikasi lengkap, fitur, laporan inspeksi 7 kategori, simulasi kredit, booking test drive, dan tombol kontak WhatsApp / call center.
- Simpan mobil ke **favorit** (tersimpan di browser).

### 💰 Jual Mobil & Tukar Tambah
- Formulir 3 langkah: data mobil → jadwal inspeksi → data kontak.
- **Estimasi harga instan** dihitung dari merek, model, tahun, kilometer, transmisi, dan kondisi.
- Mode tukar tambah: pilih mobil incaran di showroom dan lihat perkiraan tambahan bayar.
- Permintaan masuk langsung ke panel showroom beserta kode permintaan.

### 🏢 Panel Showroom
- **Stok Mobil**: tambah/edit/hapus unit, atur status (tersedia, dipesan, terjual), tandai "Pilihan Auto18", pantau modal, harga jual, dan margin. Status "terjual" bisa dibatalkan — transaksinya ditandai "Dibatalkan" dan tidak lagi dihitung di Dashboard/Laporan, tapi mobil tukar tambah yang sudah masuk stok dari penjualan itu tidak ikut ditarik.
- **Proses Penjualan**: tunai, transfer, atau kredit (pilih leasing, DP, tenor, bunga flat) dengan opsi tukar tambah. Mobil tukar tambah otomatis masuk stok **hanya** kalau diambil dari permintaan tukar tambah yang sudah diinspeksi; tukar tambah yang diisi manual cuma mengurangi sisa bayar dan mobilnya harus ditambahkan sendiri lewat Tambah Mobil.
- **Permintaan Jual/Tukar Tambah**: jadwalkan inspeksi → catat hasil & penawaran → beli dan masukkan ke stok.
- **Test Drive**: konfirmasi, selesaikan, atau batalkan jadwal, dengan penanda "hari ini".

### 🧾 Kasir Aksesoris & Perawatan (POS)
- Penjualan oli, aki, ban, aksesoris interior, perawatan, dan jasa showroom.
- Keranjang, diskon, PPN opsional, pembayaran tunai/QRIS/transfer, dan cetak struk thermal.
- Manajemen produk & stok (margin otomatis, peringatan stok menipis) serta suplier & stok masuk.

### 📊 Dashboard & Laporan
- KPI harian dan KPI showroom (mobil tersedia, terjual bulan ini, permintaan baru, test drive).
- Grafik omset 7 hari dengan pemisahan penjualan mobil dan aksesoris.
- Laporan penjualan dengan filter waktu, jenis penjualan, dan metode bayar; ekspor CSV; cetak ulang nota.

### 💾 Penyimpanan
Semua data tersimpan otomatis di `localStorage` browser (prefix `auto18_`), tanpa perlu database. Tombol reset mengembalikan data demo.

---

## 🚀 Cara Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 ke atas

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
npm run build            # hasil siap deploy ada di folder dist/
npm run build:standalone # satu file HTML mandiri: aplikasi-kasir-langsung-buka.html
```
File hasil `build:standalone` bisa dibuka langsung dengan klik dua kali, tanpa server (JS, CSS, dan foto mobil ikut ter-inline).

---

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3 (tema kustom `brand` merah & `ink` hitam)
- **Icons**: Lucide React
- **Typography**: Montserrat (judul), Plus Jakarta Sans (teks), JetBrains Mono (angka)

## 📁 Struktur Singkat

```
src/
├─ components/     # Navbar, Footer, halaman, modal, dan bagian bergaya poster
├─ context/        # AppContext: seluruh state & aksi aplikasi
├─ data/           # data awal (mobil, produk, konten poster) & peta foto mobil
├─ utils/          # format Rupiah/tanggal, simulasi kredit, estimasi harga mobil
└─ assets/cars/    # foto mobil + CREDITS.md
```

## 📷 Kredit Foto

Foto mobil berasal dari **Wikimedia Commons** dengan lisensi CC BY-SA 4.0. Daftar penulis, lisensi, dan tautan sumber ada di [`src/assets/cars/CREDITS.md`](src/assets/cars/CREDITS.md) dan ditampilkan pada halaman detail mobil.

---

Dibuat untuk Auto18 — Auto Eighteen 🇮🇩
