# POHub — Checklist Fitur MVP

> Tandai setiap fitur yang sudah selesai diimplementasikan dan diuji.

---

## Module 1 — Autentikasi

- [ ] Halaman daftar: form nama bisnis, email, password
- [ ] Validasi email unik di database
- [ ] Validasi password minimal 8 karakter
- [ ] Konfirmasi email via Supabase (cek inbox setelah daftar)
- [ ] Halaman masuk: form email dan password
- [ ] Login dengan Google (OAuth via Supabase)
- [ ] Halaman lupa password: kirim link reset ke email
- [ ] Halaman reset password: buat password baru dari link email
- [ ] Middleware redirect ke `/masuk` jika belum login
- [ ] Redirect ke `/dashboard` setelah berhasil login

---

## Module 2 — Manajemen Toko

- [ ] Form profil toko: nama, slug, deskripsi, nomor WA, Instagram
- [ ] Upload logo toko ke Supabase Storage
- [ ] Upload gambar cover toko ke Supabase Storage
- [ ] Validasi slug unik (tidak boleh sama dengan toko lain)
- [ ] Validasi format slug: huruf kecil, angka, tanda hubung saja
- [ ] Slug tidak boleh sama dengan reserved words (api, dashboard, dll)
- [ ] Preview URL toko publik (`pohub.app/[slug]`)
- [ ] Tombol salin URL toko ke clipboard

---

## Module 3 — Manajemen Produk

- [ ] Wizard pembuatan produk 3 langkah (Info, Varian, Harga)
- [ ] Step 1: nama produk, deskripsi, kategori
- [ ] Step 2: tambah varian (nama, selisih harga, SKU opsional)
- [ ] Step 3: harga dasar dan status publikasi
- [ ] Upload gambar produk ke Supabase Storage
- [ ] Produk disimpan sebagai Draft secara default
- [ ] Daftar produk menampilkan status, harga, dan HPP
- [ ] Edit produk (nama, deskripsi, harga, status)
- [ ] Hapus produk dengan konfirmasi
- [ ] Filter produk berdasarkan status (Draft / Terbit / Arsip)
- [ ] Badge status produk ditampilkan di list

---

## Module 4 — Manajemen Bahan Baku

- [ ] Form tambah bahan baku: nama, satuan, jumlah beli, harga beli
- [ ] Pilihan satuan: gram, kg, ml, liter, pcs, pack
- [ ] Daftar bahan baku dengan harga per satuan dihitung otomatis
- [ ] Edit bahan baku (semua field)
- [ ] Hapus bahan baku dengan konfirmasi
- [ ] Kalkulasi ulang HPP produk saat harga bahan berubah (otomatis)

---

## Module 5 — Recipe Builder

- [ ] Halaman resep per produk (`/produk/[id]/resep`)
- [ ] Dropdown pilih bahan baku (hanya yang belum ada di resep)
- [ ] Input jumlah bahan yang digunakan
- [ ] Tambah bahan ke resep (upsert: update jika sudah ada)
- [ ] Hapus bahan dari resep
- [ ] Tampilkan biaya per bahan secara real-time
- [ ] Tampilkan total HPP di atas halaman resep

---

## Module 6 — Kalkulasi HPP Otomatis

- [ ] Rumus: biaya bahan = (harga beli / jumlah beli) × jumlah di resep
- [ ] HPP = jumlah semua biaya bahan dalam resep
- [ ] HPP ditampilkan di halaman detail produk
- [ ] HPP ditampilkan di daftar produk
- [ ] HPP di-snapshot ke `orderItems.unitHpp` saat pesanan dibuat
- [ ] Margin keuntungan dihitung dari harga jual − HPP

---

## Module 7 — Periode PO (Campaign)

- [ ] Form buat periode PO: nama, deskripsi, tanggal buka, tanggal tutup
- [ ] Pilih produk yang tersedia (hanya produk berstatus Terbit)
- [ ] Periode PO disimpan sebagai Draft secara default
- [ ] Alur status: Draft → Buka → Tutup → Produksi → Selesai
- [ ] Tombol ubah status dengan konfirmasi
- [ ] Daftar periode PO dengan badge status dan jumlah pesanan
- [ ] Detail periode PO: ringkasan pesanan dan pendapatan
- [ ] Validasi: pesanan hanya diterima saat status = Buka dan tanggal belum lewat

---

## Module 8 — Toko Publik

- [ ] Halaman publik di `/[slug]`
- [ ] Header: logo, nama toko, deskripsi, tombol WA, tombol Instagram
- [ ] Bagian "Pre-Order Aktif": daftar kampanye yang sedang buka
- [ ] Tombol "Pesan Sekarang" di setiap kampanye aktif
- [ ] Grid produk: gambar, nama, harga (1 kolom di mobile, 2 kolom di desktop)
- [ ] Halaman 404 saat slug tidak ditemukan
- [ ] Meta tags SEO: title, description, OG image dari logo toko
- [ ] Mobile-first layout (optimal di 390px)

---

## Module 9 — Form Pemesanan

- [ ] Halaman form di `/[slug]/pesan/[campaignId]`
- [ ] Pilih varian produk dan atur jumlah (tombol +/−)
- [ ] Total harga dihitung otomatis berdasarkan pilihan
- [ ] Form data pelanggan: nama, nomor HP, alamat, catatan
- [ ] Tidak perlu registrasi (tanpa akun pelanggan)
- [ ] Validasi semua field wajib sebelum kirim
- [ ] Pesanan tersimpan ke database dengan status "Menunggu Pembayaran"
- [ ] Nomor pesanan dibuat otomatis (format: PO-2024-0001)
- [ ] Halaman sukses menampilkan nomor pesanan
- [ ] Upload bukti pembayaran (jpg, jpeg, png, pdf, maks 10MB) via API

---

## Module 10 — Manajemen Pesanan

- [ ] Daftar semua pesanan dengan nama, nomor, total, status, tanggal
- [ ] Klik pesanan untuk melihat detail lengkap
- [ ] Filter pesanan berdasarkan status
- [ ] Cari pesanan berdasarkan nama pelanggan atau nomor pesanan
- [ ] Tampilkan item-item dalam pesanan beserta subtotal
- [ ] Update status pesanan (Lunas → Produksi → Siap → Selesai)
- [ ] Alur status pesanan lengkap: Menunggu → Verifikasi → Lunas → Produksi → Siap → Selesai

---

## Module 11 — Verifikasi Pembayaran

- [ ] Card verifikasi muncul saat status pesanan = "Verifikasi"
- [ ] Tampilkan bukti pembayaran yang diunggah pelanggan
- [ ] Tombol "Setujui" → status berubah ke Lunas, catat `verifiedAt`
- [ ] Tombol "Tolak" → buka dialog isi alasan penolakan (wajib diisi)
- [ ] Setelah tolak: status kembali ke Menunggu Pembayaran, `paymentProofUrl` dihapus
- [ ] Alasan penolakan ditampilkan di halaman detail pesanan

---

## Module 12 — Perencanaan Produksi

- [ ] Halaman lembar produksi di `/periode-po/[id]/produksi`
- [ ] Tombol "Generate" untuk menghitung kebutuhan bahan baku
- [ ] Hitung total bahan dari semua pesanan yang sudah Lunas
- [ ] Tampilkan tabel: nama bahan, satuan, jumlah total, estimasi biaya
- [ ] Total estimasi biaya bahan ditampilkan di footer tabel
- [ ] Lembar produksi bisa di-generate ulang kapan saja

---

## Module 13 — Dashboard

- [ ] Widget: jumlah periode PO aktif
- [ ] Widget: pesanan menunggu pembayaran
- [ ] Widget: pesanan perlu verifikasi
- [ ] Widget: pesanan hari ini
- [ ] Kartu ringkasan keuangan: pendapatan, HPP, estimasi keuntungan
- [ ] Daftar 5 pesanan terbaru dengan link ke detail
- [ ] Tombol aksi cepat: buka toko, buat PO baru
- [ ] Tampilkan pesan "Buat toko" jika toko belum ada

---

## Module 14 — Dashboard Keuntungan

- [ ] Metrik: total pendapatan dari pesanan lunas
- [ ] Metrik: total HPP dari pesanan lunas
- [ ] Metrik: estimasi keuntungan (pendapatan − HPP)
- [ ] Indikator margin keuntungan (%) dengan progress bar
- [ ] Warna hijau jika profit positif, merah jika negatif
- [ ] Penjelasan cara membaca metrik (sederhana, ramah UMKM)

---

## Module 15 — Laporan

- [ ] Halaman laporan menampilkan semua opsi export
- [ ] Export laporan pesanan ke CSV
- [ ] Export laporan pesanan ke Excel (.xlsx)
- [ ] Export laporan keuntungan per kampanye ke CSV
- [ ] File terunduh langsung ke perangkat pengguna

---

## Non-Fungsional

- [ ] Semua halaman responsif di lebar 320px, 375px, 390px, 768px, 1024px
- [ ] Bottom navigation di mobile (5 item: Beranda, Pesanan, Produk, Toko, Akun)
- [ ] Sidebar 240px di desktop
- [ ] Skeleton loader di setiap halaman saat data sedang dimuat
- [ ] Empty state dengan ikon dan tombol CTA di setiap daftar kosong
- [ ] Toast notifikasi untuk setiap aksi berhasil atau gagal
- [ ] Konfirmasi dialog sebelum aksi hapus atau destruktif
- [ ] Semua teks antarmuka dalam Bahasa Indonesia
- [ ] Row Level Security (RLS) dikonfigurasi di Supabase untuk semua tabel
- [ ] Supabase Storage bucket dibuat: `product-images`, `store-assets`, `payment-proofs`
- [ ] Environment variables dikonfigurasi di Vercel
- [ ] App berjalan tanpa error di `npm run build`

---

## MVP Release Criteria

Aplikasi siap produksi jika semua item berikut selesai:

- [ ] Owner bisa daftar dan masuk
- [ ] Owner bisa membuat toko dengan slug unik
- [ ] Owner bisa menambah bahan baku
- [ ] Owner bisa membuat produk dengan varian
- [ ] Owner bisa membuat resep dan HPP terhitung otomatis
- [ ] Owner bisa membuat periode PO dan memilih produk
- [ ] Pelanggan bisa memesan di halaman publik toko
- [ ] Pelanggan bisa mengunggah bukti pembayaran
- [ ] Owner bisa memverifikasi pembayaran (setujui/tolak)
- [ ] Sistem menghitung lembar produksi dari pesanan lunas
- [ ] Dashboard menampilkan estimasi keuntungan
