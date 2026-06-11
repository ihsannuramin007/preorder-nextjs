# PRD.md

# POHub - Home Business Pre Order Management SaaS

Version: 1.0

Status: Approved

---

# Executive Summary

POHub adalah platform SaaS berbasis web yang membantu pelaku usaha rumahan mengelola Pre-Order (PO), pembayaran, perhitungan HPP, kebutuhan bahan baku, dan proses produksi melalui satu link publik yang dapat dibagikan kepada pelanggan.

Platform menggabungkan konsep:

- Linktree
- Product Catalog
- Pre Order System
- HPP Calculator
- Production Planning

Target utama adalah UMKM rumahan yang saat ini masih menggunakan WhatsApp sebagai media utama penjualan.

---

# Product Vision

Menjadi platform pre-order paling sederhana untuk UMKM rumahan tanpa memerlukan pengetahuan akuntansi, inventory management, atau ERP.

---

# Success Metrics

## Business

- 100 toko aktif dalam 3 bulan pertama
- 1.000 transaksi PO pertama
- Retention owner > 60%

---

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
- Melihat laporan

---

## Customer

Tidak memiliki akun.

Hanya dapat:

- Melihat toko
- Melakukan pemesanan
- Upload bukti pembayaran

---

# Product Scope

---

# Module 1 - Authentication

## Purpose

Memberikan akses owner ke dashboard.

---

## Features

### Register

Fields:

- Business Name
- Email
- Password

Validation:

- Email unique
- Password minimum 8 karakter

---

### Login

Fields:

- Email
- Password

---

### Google Login

Optional.

---

### Forgot Password

Email reset link.

---

# Module 2 - Store Management

## Purpose

Membuat halaman publik toko.

---

## Store Profile

Fields:

- Store Name
- Store Slug
- Description
- Logo
- Cover Image
- WhatsApp Number
- Instagram URL

---

## Slug Rules

Unique.

Example:

/kopi-bu-ani

/toko-rumahan-jaya

---

## Public URL

https://pohub.app/kopi-bu-ani

---

# Module 3 - Product Management

## Purpose

Mengelola produk yang dijual.

---

## Product

Fields:

- Name
- Description
- Image
- Category
- Selling Price
- IsActive

---

## Status

- Draft
- Published
- Archived

---

## Product Categories

Default:

- Beverage
- Food
- Dessert
- Frozen Food
- Snack
- Other

---

## Variant

One Product may have multiple variants.

Example:

Coffee

Variant:

250ml
500ml
1L

---

Variant Fields:

- Name
- Price Adjustment
- SKU

---

# Module 4 - Ingredient Management

## Purpose

Menghitung biaya produksi.

---

## Ingredient

Fields:

- Name
- Unit
- Purchase Quantity
- Purchase Price

Example:

Coffee Beans

1kg

180000

---

## Unit Supported

- gram
- kilogram
- ml
- liter
- pcs
- pack

---

# Module 5 - Recipe Builder

## Purpose

Menghubungkan produk dengan bahan baku.

---

## Product Recipe

Example:

Coffee Milk

Coffee Bean

20 gram

Milk

150 ml

Sugar

10 gram

---

Business Rule

One product can have multiple ingredients.

One ingredient can be used by multiple products.

---

# Module 6 - Automatic HPP

## Purpose

Menghitung biaya produksi secara otomatis.

---

## Formula

Ingredient Cost

=

Purchase Price

/

Purchase Quantity

x

Recipe Quantity

---

## HPP Calculation

Sum of all ingredient costs.

---

System should automatically recalculate when:

- Ingredient price changes
- Recipe changes

---

# Module 7 - Pre Order Campaign

## Purpose

Mengatur periode PO.

---

## Campaign

Fields:

- Campaign Name
- Description
- Open Date
- Close Date
- Status

---

Status

Draft

Open

Closed

Production

Completed

Cancelled

---

## Business Rules

Customer can order only when:

Campaign Status = Open

Current Date < Close Date

---

# Module 8 - Public Store

## Purpose

Landing page pelanggan.

---

## Components

Store Header

Store Description

Product List

Open Campaigns

WhatsApp Button

Instagram Button

---

## Mobile First

Mandatory.

---

# Module 9 - Order Form

## Purpose

Pelanggan melakukan pemesanan.

---

## Customer Information

Fields:

- Full Name
- Phone Number
- Address
- Notes

No registration required.

---

## Order Information

Fields:

- Product
- Variant
- Quantity

---

## Order Calculation

Automatically calculate:

Quantity x Price

---

## Payment Upload

Supported:

- jpg
- jpeg
- png
- pdf

Maximum:

10 MB

---

# Module 10 - Order Management

## Purpose

Owner mengelola pesanan.

---

## Order Status

Pending Payment

Payment Review

Paid

Production

Ready

Completed

Cancelled

---

## Features

View Order

Search Order

Filter Order

Update Status

Bulk Update Status

---

# Module 11 - Payment Verification

## Purpose

Memvalidasi pembayaran.

---

## Manual Verification

Owner reviews:

- Payment Proof
- Amount

Actions:

Approve

Reject

---

## Rejection Reason

Required.

---

# Module 12 - Production Planning

## Purpose

Menghasilkan kebutuhan produksi.

---

## Production Sheet

Generated when:

Campaign Status = Closed

---

System calculates:

Total Product Ordered

Total Ingredient Needed

---

Example

200 Coffee Cups

Need:

Coffee Beans 4kg

Milk 30L

Sugar 2kg

---

# Module 13 - Dashboard

## Purpose

Menampilkan kondisi bisnis saat ini.

---

## Widgets

Open Campaign

Pending Payment

Need Verification

Orders Today

Revenue

Estimated Profit

---

# Module 14 - Profit Dashboard

## Purpose

Membantu owner memahami keuntungan.

---

## Metrics

Revenue

Total HPP

Estimated Profit

Profit Margin

---

## Formula

Profit

=

Revenue

-

Total HPP

---

# Module 15 - Reporting

## Purpose

Export data.

---

## Export Formats

CSV

Excel

PDF

---

## Reports

Order Report

Campaign Report

Product Report

Profit Report

Production Report

---

# Non Functional Requirements

---

## Performance

Page Load < 2 seconds

API Response < 500ms

---

## Mobile

Responsive on:

320px

375px

390px

768px

1024px

---

## Security

Supabase Auth

Row Level Security

Rate Limiting

CSRF Protection

Input Sanitization

---

## Accessibility

WCAG AA

Keyboard Navigation

Screen Reader Friendly

---

# Tech Stack

Frontend:

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:

- Next.js Server Actions
- Route Handlers

Database:

- Supabase PostgreSQL

ORM:

- Prisma

Storage:

- Supabase Storage

Authentication:

- Supabase Auth

Validation:

- Zod

Forms:

- React Hook Form

State Management:

- Zustand

Charts:

- Recharts

Hosting:

- Vercel

Email:

- Resend

Monitoring:

- Sentry

Analytics:

- PostHog

---

# Future Roadmap

V2

- Midtrans Integration
- Xendit Integration
- QRIS Dynamic
- WhatsApp API
- Customer Portal
- Repeat Order

V3

- Inventory Management
- Supplier Management
- Purchase Order
- AI Demand Forecasting
- Multi Outlet

---

# MVP Release Criteria

Release can happen when:

- Owner can register
- Owner can create store
- Owner can create ingredient
- Owner can create product
- Owner can create campaign
- Customer can order
- Customer can upload payment proof
- Owner can verify payment
- System can calculate HPP
- System can generate production sheet
- Dashboard shows profit estimation

Only after all criteria are completed, MVP status becomes Production Ready.
