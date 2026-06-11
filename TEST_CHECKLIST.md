# POHub — Test Checklist

> Jalankan setiap skenario secara manual di browser. Tandai ✅ jika lolos, ❌ jika gagal (catat detail error).
> Prasyarat: `npm run dev` berjalan, Supabase terhubung, `npm run db:push` sudah dijalankan.

---

## 🔐 M1 — Autentikasi

### Daftar Akun
- [ ] Buka `/daftar` → form tampil tanpa error konsol
- [ ] Submit form kosong → muncul pesan validasi (bukan crash)
- [ ] Password < 8 karakter → validasi menolak
- [ ] Email tidak valid → validasi menolak
- [ ] Daftar dengan data valid → redirect / tampil halaman sukses
- [ ] Daftar dengan email yang sudah ada → muncul pesan error "sudah terdaftar"

### Masuk Akun
- [ ] Buka `/masuk` → form tampil tanpa error
- [ ] Submit email/password salah → muncul toast error, tidak crash
- [ ] Masuk dengan kredensial benar → redirect ke `/dashboard`
- [ ] Tombol "Masuk dengan Google" → redirect ke OAuth Google (jika dikonfigurasi)

### Lupa & Reset Password
- [ ] Buka `/lupa-password` → form email tampil
- [ ] Submit email terdaftar → muncul konfirmasi "email terkirim"
- [ ] Submit email tidak terdaftar → tidak bocorkan info (tetap tampil konfirmasi)
- [ ] Buka link reset dari email → form password baru tampil
- [ ] Submit password baru yang cocok → redirect ke `/masuk`

### Proteksi Route
- [ ] Akses `/dashboard` tanpa login → redirect ke `/masuk`
- [ ] Akses `/toko` tanpa login → redirect ke `/masuk`
- [ ] Akses `/masuk` saat sudah login → redirect ke `/dashboard`

---

## 🏪 M2 — Manajemen Toko

- [ ] Buka `/toko` (pertama kali) → form kosong tampil
- [ ] Submit form tanpa nama & slug → validasi menolak
- [ ] Slug dengan huruf kapital atau spasi → validasi menolak (harus lowercase & hyphens)
- [ ] Slug reserved (`api`, `dashboard`, dll.) → validasi menolak
- [ ] Slug duplikat dari toko lain → muncul error "sudah digunakan"
- [ ] Simpan toko valid → toast sukses, data tersimpan di database
- [ ] Edit toko yang sudah ada → data lama tampil di form, bisa diubah & disimpan
- [ ] Tombol "Salin URL Toko" → URL masuk clipboard, toast konfirmasi
- [ ] URL toko publik (`/[slug]`) bisa diakses tanpa login

---

## 📦 M3 — Manajemen Produk

- [ ] Buka `/produk` → daftar kosong + empty state + tombol "Tambah Produk"
- [ ] Buka `/produk/baru` → wizard 3 langkah tampil
- [ ] Step 1: tidak isi nama → tidak bisa lanjut ke step 2
- [ ] Step 2: tambah varian dengan nama & harga → varian muncul di list
- [ ] Step 2: hapus varian → varian hilang dari list
- [ ] Step 3: pilih status "Terbit" → produk tersimpan dengan status PUBLISHED
- [ ] Buat produk → muncul di `/produk` dengan badge status
- [ ] Klik produk → halaman detail produk tampil
- [ ] Edit produk → perubahan tersimpan, toast sukses
- [ ] Hapus produk → dialog konfirmasi muncul; konfirmasi → produk terhapus
- [ ] Filter produk berdasarkan status (Draft / Terbit / Arsip)

---

## 🧪 M4 — Bahan Baku

- [ ] Buka `/bahan-baku` → empty state tampil jika kosong
- [ ] Buka `/bahan-baku/baru` → form tampil
- [ ] Submit tanpa nama → validasi menolak
- [ ] Jumlah beli atau harga beli = 0 atau negatif → validasi menolak
- [ ] Tambah bahan baku valid → muncul di daftar, harga per satuan dihitung otomatis
  - Contoh: beli 500gr seharga Rp 10.000 → tampil Rp 20/gram
- [ ] Edit bahan baku → perubahan tersimpan
- [ ] Hapus bahan baku → dialog konfirmasi; hapus → item hilang

---

## 🍳 M5 — Recipe Builder & M6 — HPP

- [ ] Buka `/produk/[id]/resep` → tampil daftar bahan kosong + total HPP = Rp 0
- [ ] Dropdown pilih bahan → hanya tampilkan bahan yang belum ditambahkan
- [ ] Input jumlah kosong / nol → tidak bisa ditambahkan
- [ ] Tambah bahan ke resep → bahan muncul dengan biaya per bahan dihitung
- [ ] HPP di header berubah setelah bahan ditambah
- [ ] Tambah bahan yang sama dua kali → upsert (update jumlah, bukan duplikat)
- [ ] Hapus bahan dari resep → HPP berkurang sesuai
- [ ] HPP tampil di halaman detail produk (`/produk/[id]`)
- [ ] HPP tampil di daftar produk (`/produk`)

---

## 📅 M7 — Periode PO (Campaign)

- [ ] Buka `/periode-po` → empty state jika kosong
- [ ] Buka `/periode-po/baru` → form tampil
- [ ] Tanggal tutup < tanggal buka → validasi menolak
- [ ] Tidak pilih produk → validasi menolak
- [ ] Produk dalam dropdown hanya yang berstatus PUBLISHED
- [ ] Buat PO valid → muncul di daftar dengan status "Draft"
- [ ] Tombol "Buka PO" → status berubah ke OPEN
- [ ] Tombol "Tutup PO" → status berubah ke CLOSED
- [ ] Tombol "Mulai Produksi" → status berubah ke PRODUCTION
- [ ] Tombol "Tandai Selesai" → status berubah ke COMPLETED
- [ ] Detail PO (`/periode-po/[id]`) → tampil daftar pesanan & ringkasan

---

## 🌐 M8 — Toko Publik

- [ ] Buka `/{slug}` tanpa login → halaman toko tampil
- [ ] Header toko: nama, deskripsi, tombol WA, tombol Instagram (jika diisi)
- [ ] Bagian "Pre-Order Aktif" → tampil campaign berstatus OPEN
- [ ] Campaign CLOSED/DRAFT tidak tampil di halaman publik
- [ ] Grid produk: gambar (jika ada), nama, harga
- [ ] Buka `/{slug-tidak-ada}` → halaman 404
- [ ] Meta tag: title berisi nama toko (cek di browser tab)

---

## 🛒 M9 — Form Pemesanan

- [ ] Klik "Pesan Sekarang" dari halaman toko → buka `/{slug}/pesan/{campaignId}`
- [ ] Halaman form tampil dengan daftar produk & varian
- [ ] Tombol `+` → kuantitas bertambah
- [ ] Tombol `−` → kuantitas berkurang, tidak bisa di bawah 0
- [ ] Total harga berubah real-time sesuai pilihan
- [ ] Submit tanpa pilih produk → error "Pilih minimal 1 produk"
- [ ] Submit tanpa isi nama → HTML required validation
- [ ] Submit dengan data valid → pesanan tersimpan, redirect ke halaman sukses
- [ ] Halaman sukses → tampil nomor pesanan (format PO-YYYY-NNNN)
- [ ] Nomor pesanan berbeda untuk setiap pesanan (tidak duplikat)

---

## 📋 M10 — Manajemen Pesanan

- [ ] Buka `/pesanan` → daftar semua pesanan tampil
- [ ] Filter by status → hanya pesanan dengan status tersebut tampil
- [ ] Search by nama pelanggan → filter realtime
- [ ] Search by nomor pesanan → filter realtime
- [ ] Klik pesanan → buka `/pesanan/[id]`
- [ ] Detail pesanan: info pelanggan, item, total, status, tanggal
- [ ] Tombol update status (Lunas → Produksi → Siap → Selesai) tersedia sesuai status saat ini

---

## 💳 M11 — Verifikasi Pembayaran

- [ ] Card verifikasi HANYA muncul jika status = "Menunggu Verifikasi"
- [ ] Jika belum ada bukti bayar → tampil teks "belum diunggah"
- [ ] Jika ada bukti bayar → tombol "Lihat Bukti Pembayaran" aktif
- [ ] Klik "Lihat Bukti" → dialog/modal terbuka dengan gambar atau link PDF
- [ ] Klik "Setujui" → status berubah ke PAID, `verifiedAt` tersimpan, toast sukses
- [ ] Klik "Tolak" → dialog alasan muncul
- [ ] Submit tolak tanpa alasan → validasi menolak
- [ ] Submit tolak dengan alasan → status kembali ke PENDING_PAYMENT, bukti bayar terhapus
- [ ] Alasan penolakan tampil di halaman detail pesanan

---

## 🏭 M12 — Lembar Produksi

- [ ] Buka `/periode-po/[id]/produksi`
- [ ] Jika belum di-generate → tampil tombol "Generate Lembar Produksi"
- [ ] Klik "Generate" → loading state muncul selama proses
- [ ] Setelah generate: tabel tampil dengan kolom nama bahan, satuan, total, estimasi biaya
- [ ] Total estimasi biaya tampil di footer tabel
- [ ] Hanya pesanan berstatus PAID/PRODUCTION/READY/COMPLETED yang dihitung
- [ ] Klik "Generate" ulang → data diperbarui (bukan duplikat)
- [ ] PO tanpa pesanan lunas → tabel kosong atau pesan info

---

## 📊 M13 — Dashboard

- [ ] Buka `/dashboard` tanpa toko → prompt "Buat Toko Sekarang" tampil
- [ ] Buka `/dashboard` dengan toko → 4 widget metrik tampil
- [ ] Widget "Periode PO Aktif" → angka sesuai jumlah campaign OPEN
- [ ] Widget "Menunggu Pembayaran" → sesuai count status PENDING_PAYMENT
- [ ] Widget "Perlu Verifikasi" → sesuai count status PAYMENT_REVIEW
- [ ] Widget "Pesanan Hari Ini" → sesuai count pesanan hari ini
- [ ] Ringkasan keuangan: pendapatan, HPP, estimasi keuntungan akurat
- [ ] Daftar 5 pesanan terbaru tampil, klik → buka detail pesanan
- [ ] Tombol "Lihat Toko" → buka tab baru halaman publik
- [ ] Tombol "+ Buka PO Baru" → navigasi ke `/periode-po/baru`

---

## 💰 M14 — Dashboard Keuntungan

- [ ] Buka `/keuntungan`
- [ ] 3 kartu metrik tampil: Pendapatan, HPP, Estimasi Keuntungan
- [ ] Nilai metrik sesuai kalkulasi dari pesanan PAID/PRODUCTION/READY/COMPLETED
- [ ] Progress bar margin tampil, warna hijau jika profit positif, merah jika negatif
- [ ] Persentase margin dihitung benar: `(profit / revenue) * 100`
- [ ] Jumlah pesanan lunas tampil di bawah progress bar
- [ ] Bagian "Cara Membaca" tampil sebagai panduan

---

## 📥 M15 — Laporan & Export

- [ ] Buka `/laporan` → 4 tombol unduh tampil
- [ ] Unduh "Laporan Pesanan (CSV)" → file `.csv` terunduh, dapat dibuka di Excel
- [ ] CSV memiliki kolom: Nomor, Nama, HP, Alamat, Total, HPP, Status, Kampanye, Tanggal
- [ ] Unduh "Laporan Pesanan (Excel)" → file `.xlsx` terunduh, dapat dibuka di Excel
- [ ] Unduh "Laporan Keuntungan (CSV)" → file `.csv` dengan data per kampanye
- [ ] CSV keuntungan memiliki kolom: Kampanye, Status, Jumlah Pesanan, Pendapatan, HPP, Keuntungan, Margin
- [ ] File yang diunduh berisi data sesuai toko yang login (bukan data toko lain)

---

## 📱 Non-Fungsional

### Responsivitas
- [ ] `/masuk` dan `/daftar` tampil baik di 390px (mobile)
- [ ] `/{slug}` tampil baik di 390px — produk 1 kolom
- [ ] `/{slug}/pesan/{id}` tampil baik di 390px
- [ ] Dashboard tampil sidebar di ≥768px, bottom nav di <768px
- [ ] Bottom nav: 5 item, touch target minimal 44×44px
- [ ] Semua halaman tidak overflow horizontal di mobile

### UX
- [ ] Loading skeleton tampil saat data sedang dimuat (bukan layar kosong)
- [ ] Empty state dengan ikon & tombol CTA di setiap daftar kosong
- [ ] Toast sukses muncul setelah aksi berhasil
- [ ] Toast error muncul jika aksi gagal
- [ ] Dialog konfirmasi muncul sebelum aksi hapus

### Logger
- [ ] Setelah aksi yang melibatkan error, cek file `logs/yyyy-mm-dd_POHub_logger.log`
- [ ] Log memiliki format: `[timestamp] [LEVEL] [context] pesan`
- [ ] Error log menyertakan full stack trace
- [ ] File baru dibuat otomatis setiap hari

### Keamanan
- [ ] Pengguna A tidak bisa mengakses data toko Pengguna B via URL langsung
- [ ] API `/api/export/*` mengembalikan 401 tanpa session
- [ ] Upload file non-gambar/PDF (`.exe`, `.zip`) ditolak dengan pesan error
- [ ] Upload file > 10MB ditolak dengan pesan error

---

## 🔗 Integrasi End-to-End

### Skenario Utama: Siklus PO Lengkap
- [ ] 1. Owner daftar & login
- [ ] 2. Owner buat toko dengan slug unik
- [ ] 3. Owner tambah 2 bahan baku
- [ ] 4. Owner buat produk dengan 2 varian
- [ ] 5. Owner buka resep produk, tambah bahan → HPP terhitung
- [ ] 6. Owner buka PO baru, pilih produk, buka status OPEN
- [ ] 7. Buka toko publik `/{slug}` → campaign aktif tampil
- [ ] 8. Pelanggan buka form pesan, pilih varian, isi data, kirim → dapat nomor pesanan
- [ ] 9. Owner lihat pesanan di `/pesanan` → status "Menunggu Pembayaran"
- [ ] 10. Pelanggan upload bukti bayar → status berubah ke "Menunggu Verifikasi"
- [ ] 11. Owner setujui pembayaran → status berubah ke "Lunas"
- [ ] 12. Owner generate lembar produksi → kebutuhan bahan tampil
- [ ] 13. Dashboard menampilkan metrik yang benar
- [ ] 14. Owner unduh laporan CSV → file berisi data pesanan yang baru dibuat

---

## Bug Ditemukan & Diperbaiki

| # | File | Deskripsi Bug | Status |
|---|------|---------------|--------|
| 1 | `src/app/[slug]/pesan/[campaignId]/page.tsx` | `import { prisma }` di komponen `"use client"` — Prisma adalah library server-only, menyebabkan bundler error | ✅ Diperbaiki |
| 2 | `src/app/(dashboard)/laporan/page.tsx` | `useTransition` diimport dan di-destructure tapi tidak pernah digunakan | ✅ Diperbaiki |
| 3 | `middleware.ts` | Parameter `cookiesToSet` implicitly any — TypeScript error saat build | ✅ Diperbaiki |
| 4 | `src/lib/supabase/server.ts` | Parameter `cookiesToSet` implicitly any — TypeScript error saat build | ✅ Diperbaiki |
| 5 | `package.json` | `next@15.0.3` tidak kompatibel dengan `react@19.2.7` (stable) — peer dep conflict | ✅ Diperbaiki (upgrade ke 15.5.19) |
| 6 | `postcss.config.mjs` | `autoprefixer` direferensikan tapi tidak ada di `package.json` | ✅ Diperbaiki |
| 7 | `.env` | Password DB mengandung `&`, `#`, `%` yang merusak URL parser — prisma db:push gagal | ✅ Diperbaiki (URL-encode password) |
| 8 | `.env` / `.env.local` | DATABASE_URL ke pgBouncer transaction pooler (port 6543) tanpa `?pgbouncer=true` — Prisma menggunakan prepared statements yang bentrok antar koneksi (PostgresError 08P01) | ✅ Diperbaiki (append `?pgbouncer=true`) |
| 9 | `src/app/[slug]/page.tsx` | `prisma.store.findUnique({ where: { slug, isActive } })` — `isActive` bukan unique field, tidak valid di `findUnique`. Menyebabkan error "bind message supplies 4 parameters, but prepared statement requires 2" | ✅ Diperbaiki (`findUnique` → `findFirst`) |
| 10 | `test-runner.mjs` | Query Supabase REST API menggunakan `is_active` (snake_case) tapi Prisma menyimpan kolom sebagai `isActive` (camelCase tanpa `@map`) | ✅ Diperbaiki |

---

## Status Build

```
✓ TypeScript: 0 error (npx tsc --noEmit)
✓ Build: npm run build → sukses, 24 halaman terkompilasi
✓ DB Push: npm run db:push → sukses, semua tabel tersinkronisasi
```
