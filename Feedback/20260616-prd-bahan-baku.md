# PRD - Product Costing, Recipe & Smart Inventory Management

## Version

1.0 Final

## Status

Approved

## Product

FnB Order, Production & Inventory Management System

---

# Executive Summary

Sistem dirancang untuk membantu pemilik usaha FnB mengelola:

- Produk
- Resep
- Harga Pokok Produksi (HPP)
- Persediaan Bahan Baku
- Produksi
- Profitabilitas

tanpa perlu memahami konsep inventory management atau akuntansi biaya.

Prinsip utama sistem:

> User mengelola Produk.
>
> Sistem mengelola Inventory.

---

# Product Vision

Sebagian besar aplikasi inventory memaksa owner berpikir seperti akuntan.

Sistem ini dirancang agar owner tetap berpikir seperti penjual dan pembuat produk.

Mental model yang digunakan:

```text
Saya ingin menjual produk.

↓

Produk membutuhkan resep.

↓

Resep membutuhkan bahan.

↓

Sistem menghitung biaya.

↓

Sistem mengelola stok.
```

Bukan:

```text
Kelola stok

↓

Hitung biaya

↓

Buat produk
```

---

# Goals

## Business Goals

- Mempermudah UMKM menghitung HPP
- Mengurangi kesalahan costing
- Mengetahui profit setiap produk
- Mengetahui kapasitas produksi aktual
- Mengurangi stock out

## User Goals

Owner dapat mengetahui:

- Modal membuat produk
- Profit produk
- Kebutuhan bahan
- Kapasitas produksi

dalam waktu kurang dari 10 detik.

---

# User Roles

## Owner

Dapat:

- Membuat produk
- Membuat resep
- Mengelola harga jual
- Mengelola bahan baku
- Mengelola produksi
- Melihat laporan

## Staff Produksi

Dapat:

- Melihat resep
- Melihat kebutuhan bahan
- Memulai produksi
- Menginput hasil produksi

---

# UX Principles

## Principle 1

Product First

Produk adalah entry point utama.

---

## Principle 2

Recipe Driven

Semua costing berasal dari resep.

---

## Principle 3

Inventory Invisible

Inventory bekerja otomatis.

User tidak perlu melakukan pengurangan stok manual.

---

## Principle 4

Realtime Costing

Perubahan resep langsung memperbarui HPP.

---

## Principle 5

Production Oriented

Fokus dashboard adalah:

```text
Berapa produk yang masih bisa dijual?
```

bukan:

```text
Berapa stok bahan tersisa?
```

---

# Main Navigation

Hanya terdapat 3 menu utama.

```text
Products
Orders
Inventory
```

---

# MODULE 1 - Product Management

## Objective

Produk menjadi pusat seluruh proses bisnis.

---

## Product List

Display:

```text
Photo
Product Name
Selling Price
HPP
Margin
Production Capacity
Status
```

---

## Product Detail

Tabs:

```text
Overview
Recipe
Costing
Production
```

---

# Product Creation Flow

## Step 1

Basic Information

Fields:

```text
Product Name
Category
Description
Photo
Selling Price
```

---

## Step 2

Recipe Builder

User langsung diarahkan ke halaman resep.

---

# MODULE 2 - Recipe Builder

## Objective

Mendefinisikan formula pembuatan produk.

---

# Add Ingredient Flow

Button:

```text
+ Add Ingredient
```

---

Search Modal

```text
Search Ingredient
```

---

Condition A

Ingredient Exists

```text
Select Ingredient
Input Quantity Usage
```

---

Condition B

Ingredient Not Found

```text
+ Create Ingredient
```

Modal muncul tanpa meninggalkan halaman.

---

# Create Ingredient Inline

Fields:

```text
Ingredient Name
Purchase Quantity
Purchase Unit
Purchase Cost
Supplier
```

---

System Auto Calculate

Formula:

```text
Cost Per Unit

=
Purchase Cost
/
Purchase Quantity
```

---

Ingredient langsung tersedia pada Recipe Builder.

---

# Recipe Structure

Example

```text
Brownies Original

Tepung 200 gr
Gula 100 gr
Telur 4 pcs
Mentega 50 gr
```

---

# Realtime HPP Calculation

Saat ingredient ditambahkan:

System langsung menghitung.

---

Formula

```text
Ingredient Cost

=
Usage Qty
x
Cost Per Unit
```

---

Display

```text
Ingredient Breakdown
```

Realtime.

---

# MODULE 3 - Packaging & Additional Cost

## Objective

Menambahkan biaya non bahan baku.

---

Fields

```text
Packaging
Sticker
Paper Bag
Gas
Electricity
Other Costs
```

---

Display

```text
Additional Cost
```

Expandable section.

---

Formula

```text
Additional Cost

=
Total Additional Items
```

---

# MODULE 4 - Automatic HPP Engine

## Objective

Menghasilkan HPP otomatis.

---

Formula

```text
Total HPP

=
Ingredient Cost
+
Additional Cost
```

---

Display

```text
Total Ingredient Cost

Total Additional Cost

Total HPP
```

Realtime.

---

# MODULE 5 - Pricing & Profit Simulator

## Objective

Membantu owner menentukan harga jual.

---

Pricing Modes

### Manual Price

User menentukan harga sendiri.

---

### Target Margin

Input:

```text
Target Margin %
```

---

### Markup

Input:

```text
Multiplier
```

Example:

```text
2x
2.5x
3x
```

---

# Profit Card

Display

```text
Selling Price

HPP

Profit

Margin %

Profit Per Product
```

Realtime.

---

# MODULE 6 - Ingredient Management

## Objective

Menyimpan bahan baku yang digunakan seluruh produk.

---

Ingredient Fields

```text
Name
Category
Unit
Cost Per Unit
Current Stock
Minimum Stock
Supplier
```

---

Inventory Value calculated automatically.

---

# MODULE 7 - Purchasing

## Objective

Menambah stok bahan baku.

---

Purchase Form

Fields:

```text
Ingredient
Purchase Quantity
Purchase Cost
Purchase Date
Supplier
Invoice Number
```

---

System Actions

```text
Increase Stock

Recalculate Average Cost

Create Stock Transaction
```

---

Cost Method

```text
Weighted Average Cost
```

---

# MODULE 8 - Production Capacity Engine

## Objective

Menghitung kapasitas produksi aktual.

---

Formula

Cari ingredient yang paling cepat habis.

---

Example

```text
Current Stock

Tepung 2400 gr

Gula 1200 gr

Telur 48 pcs
```

---

Recipe

```text
Tepung 200 gr

Gula 100 gr

Telur 4 pcs
```

---

Result

```text
Can Produce

12 Products
```

---

Display

```text
Remaining Production Capacity
```

pada Product Card.

---

# MODULE 9 - Order Integration

## Objective

Menghubungkan penjualan dengan kebutuhan produksi.

---

When Order Created

System calculates:

```text
Required Ingredients

Estimated Cost

Required Production
```

---

Example

Order

```text
20 Brownies
```

---

System Generates

```text
Tepung 4 Kg

Gula 2 Kg

Telur 80 pcs
```

---

# Availability Check

Condition A

Enough Stock

```text
Ready For Production
```

---

Condition B

Insufficient Stock

Display:

```text
Missing Ingredients
```

---

Action:

```text
Purchase Ingredient
```

---

# MODULE 10 - Production Flow

## Objective

Mengubah bahan menjadi produk.

---

Button

```text
Start Production
```

---

System Actions

```text
Reserve Ingredients

Deduct Inventory

Create Production Log
```

---

# Production Record

Fields

```text
Product
Quantity
Produced By
Production Date
Status
```

---

# MODULE 11 - Inventory Automation

## Objective

Inventory bekerja otomatis.

---

Triggers

### Purchase

Stock Increase

---

### Production

Stock Deduction

---

### Adjustment

Manual Correction

---

### Waste

Stock Reduction

---

# Stock Adjustment

Reasons

```text
Expired
Lost
Damaged
Waste
Correction
```

Audit trail mandatory.

---

# MODULE 12 - Dashboard

## Main KPI

### Today's Orders

### Revenue

### Production Capacity

### Low Stock Items

### Top Products

---

# Production Capacity Widget

Display

```text
Brownies

120 pcs

Cookies

80 pcs

Banana Cake

30 pcs
```

---

# Low Stock Widget

Display

```text
Ingredient

Remaining Capacity

Action
```

---

# MODULE 13 - Alerts

## Low Stock

Example

```text
Tepung cukup untuk 8 produk lagi.
```

---

## Critical Stock

Example

```text
Brownies tidak dapat diproduksi karena kekurangan telur.
```

---

## Margin Alert

Example

```text
Margin turun karena kenaikan harga bahan baku.
```

---

# Reports

## Product Cost Report

## HPP Report

## Ingredient Usage Report

## Inventory Valuation Report

## Production Report

## Profitability Report

---

# Success Metrics

## KPI

90% pengguna tidak pernah mengubah HPP manual.

100% HPP dihitung otomatis.

100% pengurangan stok terjadi otomatis.

Owner dapat mengetahui profit produk dalam kurang dari 5 detik.

Owner dapat mengetahui kapasitas produksi dalam kurang dari 3 detik.

---

# Future Roadmap

## V2

Supplier Management

Purchase Order Supplier

Recipe Versioning

Batch Production

Multi Warehouse

---

## V3

Demand Forecasting

AI Ingredient Recommendation

Automatic Reorder Point

Production Planning Engine

Multi Branch Inventory

Cost Optimization Recommendation
