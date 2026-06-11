# POHub — Panduan Setup

Panduan lengkap untuk menjalankan POHub di lingkungan lokal dan men-deploy ke Vercel.

---

## Prasyarat

Pastikan sudah terpasang:

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk bersama Node.js)
- **Git** — [git-scm.com](https://git-scm.com)
- **Akun Supabase** (gratis) — [supabase.com](https://supabase.com)
- **Akun Vercel** (gratis) — [vercel.com](https://vercel.com)
- **Akun Resend** (gratis, untuk email) — [resend.com](https://resend.com)

---

## Langkah 1 — Install Dependensi

```bash
cd D:\VibeCode\Claude\POHub
npm install
```

---

## Langkah 2 — Setup Supabase

### 2.1 Buat Project Baru

1. Buka [supabase.com/dashboard](https://supabase.com/dashboard)
2. Klik **"New project"**
3. Isi:
   - **Name**: pohub (atau nama lain)
   - **Database Password**: catat password ini, diperlukan nanti
   - **Region**: Southeast Asia (Singapore)
4. Klik **"Create new project"** dan tunggu ±2 menit

### 2.2 Konfigurasi Email Authentication

1. Buka **Authentication → Providers**
2. Pastikan **Email** provider sudah aktif (default: aktif)
3. Opsional: matikan "Confirm email" untuk mempermudah testing

### 2.3 Konfigurasi Google OAuth (Opsional)

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru → **APIs & Services → Credentials → Create OAuth 2.0 Client**
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   https://[PROJECT_REF].supabase.co/auth/v1/callback
   ```
5. Salin **Client ID** dan **Client Secret**
6. Kembali ke Supabase → **Authentication → Providers → Google**
7. Tempel Client ID dan Client Secret, lalu aktifkan

### 2.4 Konfigurasi URL Redirect

1. Supabase → **Authentication → URL Configuration**
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

### 2.5 Buat Storage Buckets

Buka **Storage → Buckets** dan buat tiga bucket berikut:

| Bucket Name      | Public   | Keterangan                |
| ---------------- | -------- | ------------------------- |
| `product-images` | ✅ Ya    | Gambar produk             |
| `store-assets`   | ✅ Ya    | Logo dan cover toko       |
| `payment-proofs` | ❌ Tidak | Bukti pembayaran (privat) |

### 2.6 Ambil Kredensial API

Buka **Project Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

Buka **Project Settings → Database → Connection String**:

- Pilih tab **"Transaction"** (port 6543) → `DATABASE_URL`
  ```
  postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- Pilih tab **"Session"** atau **"Direct"** (port 5432) → `DIRECT_URL`
  ```
  postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
  ```

---

## Langkah 3 — Konfigurasi Environment Variables

Salin file contoh dan isi dengan nilai yang sudah kamu dapatkan:

```bash
copy .env.example .env.local
```

Buka `.env.local` dan isi semua nilai:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=POHub

NEXT_PUBLIC_STORAGE_BUCKET_PRODUCTS=product-images
NEXT_PUBLIC_STORAGE_BUCKET_STORES=store-assets
NEXT_PUBLIC_STORAGE_BUCKET_PAYMENTS=payment-proofs

RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@pohub.app
```

---

## Langkah 4 — Setup Database

### 4.1 Push Prisma Schema ke Supabase

```bash
npm run db:push
```

Perintah ini akan membuat semua tabel di Supabase sesuai `prisma/schema.prisma`.

### 4.2 Generate Prisma Client

```bash
npm run db:generate
```

### 4.3 Setup Row Level Security (RLS)

Buka **Supabase → SQL Editor** dan jalankan SQL berikut:

```sql
-- Aktifkan RLS di semua tabel
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_sheet_items ENABLE ROW LEVEL SECURITY;

-- Policy: user hanya bisa akses data miliknya sendiri
CREATE POLICY "Users can manage own data"
ON users FOR ALL
USING ("supabaseId" = auth.uid()::text);

-- Policy: owner toko hanya akses data tokonya
CREATE POLICY "Store owners can manage their store"
ON stores FOR ALL
USING ("userId" IN (
  SELECT id FROM users WHERE "supabaseId" = auth.uid()::text
));

-- Policy: toko aktif bisa dibaca publik (untuk halaman publik)
CREATE POLICY "Public can read active stores"
ON stores FOR SELECT
USING ("isActive" = true);

-- Policy: produk dikelola owner, dibaca publik jika published
CREATE POLICY "Store owners can manage products"
ON products FOR ALL
USING ("storeId" IN (
  SELECT s.id FROM stores s
  JOIN users u ON s."userId" = u.id
  WHERE u."supabaseId" = auth.uid()::text
));

CREATE POLICY "Public can read published products"
ON products FOR SELECT
USING (status = 'PUBLISHED');

-- Ulangi pola serupa untuk tabel lainnya sesuai kebutuhan
-- Untuk pesanan publik (pelanggan tidak login):
CREATE POLICY "Anyone can create orders"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Store owners can read their orders"
ON orders FOR SELECT
USING ("campaignId" IN (
  SELECT c.id FROM campaigns c
  JOIN stores s ON c."storeId" = s.id
  JOIN users u ON s."userId" = u.id
  WHERE u."supabaseId" = auth.uid()::text
));
```

### 4.4 Setup Storage Policy

Di Supabase → **Storage → Policies**, tambahkan:

**Bucket `product-images` (public read)**:

```sql
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

**Bucket `payment-proofs` (private)**:

```sql
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Store owners can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');
```

---

## Langkah 5 — Jalankan Secara Lokal

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

Kamu akan diarahkan ke halaman masuk. Daftar akun baru dan mulai menggunakan POHub!

### Akses Prisma Studio (opsional)

Untuk melihat data database secara visual:

```bash
npm run db:studio
```

---

## Langkah 6 — Deploy ke Vercel

### 6.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 6.2 Login ke Vercel

```bash
vercel login
```

### 6.3 Link Project ke Vercel

```bash
vercel link
```

Ikuti instruksi: buat project baru atau pilih yang sudah ada.

### 6.4 Set Environment Variables di Vercel

Cara paling mudah melalui dashboard Vercel:

1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Pilih project POHub → **Settings → Environment Variables**
3. Tambahkan semua variabel dari `.env.local`
4. Pastikan set untuk **Production**, **Preview**, dan **Development**

Atau via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add DATABASE_URL
# ... ulangi untuk semua variabel
```

### 6.5 Update URL di Supabase untuk Production

Setelah deploy pertama, salin URL production kamu (mis: `https://pohub-xxxx.vercel.app`).

Buka Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://pohub-xxxx.vercel.app`
- **Redirect URLs**: tambahkan `https://pohub-xxxx.vercel.app/auth/callback`

### 6.6 Deploy ke Production

```bash
vercel --prod
```

---

## Troubleshooting

### Error: "Invalid API key" atau "JWT malformed"

- Periksa `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`
- Pastikan tidak ada spasi ekstra di awal/akhir nilai

### Error: "relation does not exist"

- Jalankan `npm run db:push` untuk membuat tabel
- Periksa `DATABASE_URL` sudah benar

### Error: "Row Level Security violation"

- Jalankan SQL RLS policies di Langkah 4.3
- Pastikan user sudah ter-autentikasi

### Error: Build gagal di Vercel

- Jalankan `npm run build` di lokal terlebih dahulu untuk cek error
- Pastikan semua env vars sudah diset di Vercel dashboard

### Upload file tidak berhasil

- Pastikan bucket sudah dibuat di Supabase Storage
- Periksa Storage Policies sudah dikonfigurasi
- Cek ukuran file tidak melebihi 10MB

### Google Login tidak bekerja

- Verifikasi Authorized redirect URI di Google Console sudah benar
- Pastikan Google provider sudah diaktifkan di Supabase

---

## Perintah yang Sering Digunakan

```bash
# Jalankan dev server
npm run dev

# Build untuk production
npm run build

# Push schema ke database
npm run db:push

# Buka Prisma Studio
npm run db:studio

# Generate Prisma client setelah ubah schema
npm run db:generate

# Deploy preview ke Vercel
vercel

# Deploy production ke Vercel
vercel --prod
```

---

## Struktur Direktori

```
POHub/
├── prisma/
│   └── schema.prisma      # Definisi database
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Halaman login/daftar
│   │   ├── (dashboard)/   # Halaman owner (protected)
│   │   ├── [slug]/        # Halaman publik toko
│   │   └── api/           # API routes
│   ├── actions/           # Server Actions
│   ├── components/        # React components
│   ├── lib/               # Utilities, validations, constants
│   ├── stores/            # Zustand state stores
│   └── hooks/             # Custom hooks
├── .env.example           # Template environment variables
├── CHECKLIST.md           # Checklist fitur MVP
└── SETUP.md               # Panduan ini
```
