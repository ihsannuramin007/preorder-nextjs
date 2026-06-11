# PRD.md

# POHub - Home Business Pre Order Management SaaS

Version: 1.2

Status: MVP Complete — In Active Development

Last Updated: 2026-06-11

---

# Executive Summary

POHub adalah platform SaaS berbasis web yang membantu pelaku usaha rumahan mengelola Pre-Order (PO), pembayaran, perhitungan HPP, kebutuhan bahan baku, dan proses produksi melalui satu link publik yang dapat dibagikan kepada pelanggan.

Platform menggabungkan konsep:

- Linktree
- Product Catalog
- Pre Order System
- HPP Calculator
- Production Planning
- Group Order Session

Target utama adalah UMKM rumahan yang saat ini masih menggunakan WhatsApp sebagai media utama penjualan.

---

# Product Vision

Menjadi platform pre-order paling sederhana untuk UMKM rumahan tanpa memerlukan pengetahuan akuntansi, inventory management, atau ERP.

---

# Implementation Status Legend

- ✅ Implemented — fitur selesai dan bisa digunakan
- 🚧 Partial — UI ada, sebagian fungsionalitas belum lengkap
- ⬜ Planned — ada di PRD, belum dibangun

---

# MVP Criteria Status

| Criteria                             | Status |
| ------------------------------------ | ------ |
| Owner can register                   | ✅     |
| Owner can create store               | ✅     |
| Owner can create ingredient          | ✅     |
| Owner can create product             | ✅     |
| Owner can create campaign            | ✅     |
| Customer can order                   | ✅     |
| Customer can upload payment proof    | ✅     |
| Owner can verify payment             | ✅     |
| System can calculate HPP             | ✅     |
| System can generate production sheet | ✅     |
| Dashboard shows profit estimation    | ✅     |

**MVP Status: Production Ready ✅**

---

# Success Metrics

## Business

- 100 toko aktif dalam 3 bulan pertama
- 1.000 transaksi PO pertama
- Retention owner > 60%

## Product

- Membuat produk < 5 menit
- Membuat periode PO < 2 menit
- Checkout pelanggan < 60 detik
- Mobile usability score > 90

---

# User Roles

## Owner

Pemilik usaha.

Hak akses:

- Mengelola toko
- Mengelola produk
- Mengelola bahan baku
- Mengelola PO
- Mengelola pesanan
- Mengelola group order
- Melihat laporan

## Customer

Tidak memiliki akun.

Hanya dapat:

- Melihat toko
- Melakukan pemesanan
- Membuat dan bergabung ke group order session
- Upload bukti pembayaran

---

# Product Scope

---

# Module 1 - Authentication ✅

## Purpose

Memberikan akses owner ke dashboard.

## Features

### Register ✅

Fields:

- Business Name
- Email
- Password

Validation:

- Email unique
- Password minimum 8 karakter

### Login ✅

Fields:

- Email
- Password

### Google Login ⬜

Optional. Belum diimplementasi.

### Forgot Password ✅

Email reset link.

### Reset Password ✅

Form untuk set password baru via token dari email.

---

# Module 2 - Store Management ✅

## Purpose

Membuat halaman publik toko.

## Store Profile ✅

Fields:

- Store Name
- Store Slug
- Description
- Logo
- Cover Image
- WhatsApp Number
- Instagram URL

## Slug Rules

Unique.

Example:

/kopi-bu-ani

/toko-rumahan-jaya

## Public URL

https://pohub.app/kopi-bu-ani

---

# Module 3 - Product Management ✅

## Purpose

Mengelola produk yang dijual.

## Product ✅

Fields:

- Name
- Description
- Image ✅ — upload foto ke Supabase Storage (bucket: product-images), max 5MB, format JPG/PNG/WebP
- Category
- Selling Price
- Status

## Create Product Flow ✅

Multi-step form (3 langkah):

1. Informasi Dasar — nama, deskripsi, kategori, foto produk
2. Varian — tambah varian opsional
3. Harga & Publikasi — set harga, review ringkasan, simpan sebagai Draft

## Status ✅

- Draft — default saat dibuat
- Published — terbit di toko publik
- Archived — disembunyikan

## Product Categories ✅

- Beverage (Minuman)
- Food (Makanan)
- Dessert
- Frozen Food
- Snack
- Other (Lainnya)

## Variant ✅

One Product may have multiple variants.

Example:

Coffee → 250ml, 500ml, 1L

Variant Fields:

- Name
- Price Adjustment
- SKU (optional)

## Image Upload ✅

- Komponen `ImageUpload` reusable
- Upload langsung ke Supabase Storage dari browser
- Preview dengan overlay Ganti / Hapus
- Drag & drop supported
- Tersedia di form buat produk (step 1) dan halaman detail produk (sidebar)

---

# Module 4 - Ingredient Management ✅

## Purpose

Menghitung biaya produksi.

## Ingredient ✅

Fields:

- Name
- Unit
- Purchase Quantity
- Purchase Price

Example:

Coffee Beans / 1kg / Rp 180.000

## Unit Supported ✅

- gram
- kilogram
- ml
- liter
- pcs
- pack

## CRUD ✅

- List semua bahan baku
- Tambah bahan baru
- Edit bahan
- Hapus bahan

---

# Module 5 - Recipe Builder ✅

## Purpose

Menghubungkan produk dengan bahan baku.

## Product Recipe ✅

Diakses via `/produk/[id]/resep`

Example:

Coffee Milk → Coffee Bean 20g, Milk 150ml, Sugar 10g

## Business Rules

- One product can have multiple ingredients.
- One ingredient can be used by multiple products.
- Duplicate ingredient dalam satu resep dicegah oleh sistem.

## UI ✅

- Tampilkan HPP yang dihitung otomatis
- List bahan dengan kuantitas dan biaya satuan
- Tambah bahan dari dropdown ingredients
- Hapus bahan dari resep

---

# Module 6 - Automatic HPP ✅

## Purpose

Menghitung biaya produksi secara otomatis.

## Formula

```
Ingredient Cost = (Purchase Price / Purchase Quantity) x Recipe Quantity
HPP = Sum of all ingredient costs
```

## Recalculation ✅

HPP dihitung real-time dari data resep yang aktif. Ditampilkan di:

- Halaman detail produk (grid HPP, Harga Jual, Margin)
- Resep editor (header HPP)
- Dashboard keuntungan

---

# Module 7 - Pre Order Campaign ✅

## Purpose

Mengatur periode PO.

## Campaign ✅

Fields:

- Campaign Name
- Description
- Open Date
- Close Date
- Status

## Status ✅

- Draft
- Open
- Closed
- Production
- Completed
- Cancelled

## Business Rules ✅

Customer can order only when:

- Campaign Status = Open
- Current Date < Close Date

## CRUD ✅

- List kampanye dengan status dan jumlah pesanan
- Buat kampanye baru
- Detail kampanye: list pesanan, total revenue, total HPP
- Ubah status kampanye
- Akses lembar produksi dari detail kampanye

---

# Module 8 - Public Store ✅

## Purpose

Landing page pelanggan.

## Route

`/{slug}` — contoh: `/kopi-bu-ani`

## Components ✅

- Store Header (nama, deskripsi, logo)
- Campaign list (kampanye yang sedang Open)
- Product list per kampanye
- WhatsApp Button
- Instagram Button
- Tombol pesan per kampanye

## Mobile First ✅

Dioptimasi untuk tampilan mobile (320px–768px).

---

# Module 9 - Order Form ✅

## Purpose

Pelanggan melakukan pemesanan.

## Route

`/{slug}/pesan/{campaignId}`

## Customer Information ✅

Fields:

- Full Name
- Phone Number
- Address
- Notes

No registration required.

## Order Information ✅

Fields:

- Product
- Variant (jika ada)
- Quantity

## Order Calculation ✅

Quantity x Price dihitung otomatis.

## Payment Upload ✅

Upload bukti transfer via route `/api/upload`.

Supported:

- jpg
- jpeg
- png
- pdf

Maximum: 10 MB

## Success Page ✅

Setelah submit, customer diarahkan ke halaman konfirmasi pesanan (`/sukses`).

---

# Module 10 - Order Management ✅

## Purpose

Owner mengelola pesanan.

## Route

`/pesanan` — list semua pesanan lintas kampanye

`/pesanan/[id]` — detail pesanan

## Order Status ✅

- Pending Payment
- Payment Review
- Paid
- Production
- Ready
- Completed
- Cancelled

## Features ✅

- View order detail: info pelanggan, produk, total, status
- Update status pesanan
- Verifikasi pembayaran inline dari halaman detail

---

# Module 11 - Payment Verification ✅

## Purpose

Memvalidasi pembayaran.

## Manual Verification ✅

Tampil otomatis di halaman detail pesanan ketika status = Payment Review.

Owner reviews:

- Payment Proof (preview gambar/PDF)
- Amount

Actions:

- Approve → status berubah ke Paid
- Reject → status kembali ke Pending Payment

## Rejection Reason ⬜

Field alasan penolakan belum diimplementasi (approve/reject langsung tanpa catatan).

---

# Module 12 - Production Planning ✅

## Purpose

Menghasilkan kebutuhan produksi.

## Route

`/periode-po/[id]/produksi`

## Production Sheet ✅

Generate lembar produksi dari tombol di halaman detail kampanye.

System calculates:

- Total tiap produk yang dipesan (dari pesanan berstatus Paid)
- Total bahan baku yang dibutuhkan

## Generate Logic ✅

- Server action `generateProductionSheet` membuat kalkulasi dari pesanan paid
- Jika sheet sudah ada, bisa di-regenerate
- Ditampilkan sebagai tabel kebutuhan bahan baku

---

# Module 13 - Dashboard ✅

## Purpose

Menampilkan kondisi bisnis saat ini.

## Route

`/dashboard`

## Widgets ✅

- Open Campaign (kampanye yang sedang buka)
- Pending Payment (menunggu bayar)
- Need Verification (menunggu verifikasi)
- Orders Today
- Revenue
- Estimated Profit

---

# Module 14 - Profit Dashboard ✅

## Purpose

Membantu owner memahami keuntungan.

## Route

`/keuntungan`

## Metrics ✅

- Revenue
- Total HPP
- Estimated Profit
- Profit Margin

## Formula

```
Profit = Revenue - Total HPP
Profit Margin = (Profit / Revenue) x 100%
```

---

# Module 15 - Reporting ✅

## Purpose

Export data.

## Route

`/laporan`

## API Endpoints ✅

- `GET /api/export/csv?type=orders` — laporan pesanan CSV
- `GET /api/export/excel?type=orders` — laporan pesanan Excel
- `GET /api/export/csv?type=profit` — laporan keuntungan CSV
- `GET /api/export/csv?type=production` — laporan produksi CSV
- `GET /api/export/pdf` — export PDF ✅

## Export Formats ✅

- CSV ✅
- Excel ✅
- PDF ✅

## Reports ✅

- Order Report
- Profit Report
- Production Report

---

# Module 16 - Group Order ✅ _(New — tidak ada di PRD awal)_

## Purpose

Memungkinkan sekelompok orang memesan bersama dalam satu sesi, dengan satu orang yang bertanggung jawab atas pembayaran.

## Use Case

Contoh: Arisan kantor, pesan bareng teman kos, order keluarga.

## Flow Customer ✅

1. Customer membuka halaman kampanye di toko publik
2. Klik "Buat Group Order" → sistem generate session code unik
3. Bagikan link session ke teman-teman
4. Tiap anggota membuka link dan memilih produk masing-masing
5. Halaman ringkasan menampilkan total semua anggota
6. Satu orang upload bukti bayar untuk seluruh grup

## Route ✅

- `/{slug}/pesan/{campaignId}/grup` — buat atau mulai group order
- `/{slug}/pesan/{campaignId}/grup/{sessionCode}` — halaman order anggota
- `/{slug}/pesan/{campaignId}/grup/{sessionCode}/ringkasan` — ringkasan seluruh grup
- `/{slug}/pesan/{campaignId}/grup/{sessionCode}/sukses` — konfirmasi

## API ✅

- `GET /api/group-orders/{sessionCode}` — data session
- `GET /api/group-orders/{sessionCode}/members` — list anggota dan pesanan

## Dashboard ✅

- `/pesanan/grup` — list semua group order session
- `/pesanan/grup/[id]` — detail session: anggota, total, status

## Group Order Status ✅

- Collecting — sedang mengumpulkan pesanan
- Closed — sesi ditutup
- Cancelled — dibatalkan

---

# Design System — Randomly ID _(New)_

## Visual Identity

Playful, upbeat, dan sedikit cheeky. Dirancang untuk interaksi cepat dan keputusan low-friction.

## Color Palette

| Token                 | Value     | Penggunaan                        |
| --------------------- | --------- | --------------------------------- |
| Primary (Yellow)      | `#FFD400` | Active states, highlights, hover  |
| Primary Strong (Pink) | `#FF3B6B` | CTA buttons, destructive, accents |
| Secondary             | `#111111` | Text, borders, icon backgrounds   |
| Surface               | `#FFFFFF` | Card backgrounds, inputs          |
| Surface Muted         | `#F7F7F7` | Page background, hover states     |
| Neutral               | `#9A9A9A` | Secondary text, placeholders      |
| Border                | `#E5E7EB` | Default borders                   |
| Border Strong         | `#0D0D0D` | Sticker-effect borders            |

## Typography

Plus Jakarta Sans — semua weight (400, 500, 600, 700, 800).

## Component Signatures

- **Buttons** — pill-shaped (`border-radius: 9999px`), 2px dark border, offset shadow (`3px 3px 0 #0D0D0D`) untuk efek sticker/kartun. Hover mengubah warna (pink → yellow, yellow → pink).
- **Inputs** — pill-shaped, yellow focus ring, dark focus border.
- **Cards** — flat white, border tipis `#E5E7EB`, radius 4px.
- **Sidebar active** — yellow fill dengan sticker shadow.
- **Bottom nav active** — yellow pill dengan sticker shadow.
- **Dialogs** — 2px dark border + sticker shadow besar.
- **Alerts** — yellow untuk warning, pink untuk error.

---

# API Routes

| Route                                     | Method | Purpose                          | Status |
| ----------------------------------------- | ------ | -------------------------------- | ------ |
| `/api/auth/callback`                      | GET    | Supabase OAuth callback          | ✅     |
| `/api/upload`                             | POST   | Upload file (payment proof, dll) | ✅     |
| `/api/export/csv`                         | GET    | Export CSV                       | ✅     |
| `/api/export/excel`                       | GET    | Export Excel                     | ✅     |
| `/api/export/pdf`                         | GET    | Export PDF                       | ✅     |
| `/api/campaigns/[id]`                     | GET    | Data kampanye publik             | ✅     |
| `/api/group-orders/[sessionCode]`         | GET    | Data group order session         | ✅     |
| `/api/group-orders/[sessionCode]/members` | GET    | Anggota group order              | ✅     |

---

# Non Functional Requirements

## Performance

Page Load < 2 seconds

API Response < 500ms

## Mobile

Responsive on:

320px, 375px, 390px, 768px, 1024px

## Security

- Supabase Auth
- Row Level Security
- Rate Limiting
- CSRF Protection
- Input Sanitization

## Accessibility

- WCAG AA
- Keyboard Navigation
- Screen Reader Friendly

---

# Tech Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui (Radix UI)
- Framer Motion (animasi)
- Lucide React (ikon)

## Backend

- Next.js Server Actions
- Next.js Route Handlers

## Database

- Supabase PostgreSQL
- Prisma ORM 5

## Storage

- Supabase Storage
  - Bucket `product-images` — foto produk (public read)

## Authentication

- Supabase Auth (email/password)

## Validation & Forms

- Zod
- React Hook Form

## State Management

- Zustand

## Charts

- Recharts

## Tables

- TanStack React Table

## Hosting

- Vercel

## Email

- Resend

## Monitoring & Analytics

- Sentry (error tracking)
- PostHog (analytics)

---

# Future Roadmap

## V2 — Payment Integration

- Midtrans Integration
- Xendit Integration
- QRIS Dynamic
- WhatsApp API (notifikasi otomatis)
- Customer Portal (lacak status order)
- Repeat Order

## V2 — Pending Small Features

- Rejection reason / catatan saat menolak pembayaran
- Google OAuth Login
- Bulk update status pesanan
- Filter & search pesanan
- Campaign Report di halaman laporan

## V3 — Scale

- Inventory Management
- Supplier Management
- Purchase Order
- AI Demand Forecasting
- Multi Outlet
