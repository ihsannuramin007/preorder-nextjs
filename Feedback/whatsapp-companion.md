# Feature PRD - WhatsApp Companion Integration (Zero Cost)

## Overview

WhatsApp Companion Integration adalah fitur komunikasi berbasis WhatsApp tanpa menggunakan WhatsApp Business API.

Tujuan utama fitur ini adalah:

- Mengurangi biaya operasional menjadi Rp 0
- Memanfaatkan kebiasaan UMKM yang sudah menggunakan WhatsApp
- Memastikan seluruh aktivitas bisnis tetap tercatat di sistem
- Mempercepat komunikasi antara Customer dan Owner
- Mengurangi kebutuhan integrasi pihak ketiga pada tahap awal produk

---

# Product Principles

## Single Source of Truth

Semua data bisnis wajib tersimpan di aplikasi.

WhatsApp hanya digunakan sebagai media komunikasi.

```text
Order Data      -> Aplikasi
Payment Status  -> Aplikasi
Production      -> Aplikasi
Customer Chat   -> WhatsApp
```

---

## No WhatsApp API Dependency

Sistem tidak menggunakan:

- WhatsApp Business API
- Meta Cloud API
- Twilio
- Qontak
- Wablas
- Fonnte
- Provider WhatsApp lainnya

Komunikasi menggunakan:

```text
https://wa.me/
```

atau

```text
https://api.whatsapp.com/send
```

---

# Core Use Cases

## Customer Create Order

### Flow

```text
Customer
    ↓
Fill PO Form
    ↓
Submit Order
    ↓
Generate Order ID
    ↓
Show Order Detail
    ↓
Open WhatsApp
```

---

### Success Screen

Display:

```text
Order Created Successfully

Order ID:
PO-240616-001

Total:
Rp 135.000
```

Actions:

```text
[ Upload Payment Proof ]
[ Chat Seller ]
```

---

## Chat Seller

### Description

Customer dapat langsung menghubungi Owner melalui WhatsApp.

### Action

Button:

```text
Chat Seller
```

### Generated Message

```text
Halo Kak,

Saya baru membuat pesanan.

Order ID:
PO-240616-001

Nama:
{{customer_name}}

Produk:
{{product_name}}

Qty:
{{quantity}}

Terima kasih.
```

### Deep Link

```text
https://wa.me/{{seller_phone}}?text={{encoded_message}}
```

---

# Payment Confirmation

## Customer Upload Payment Proof

### Flow

```text
Waiting Payment
    ↓
Upload Transfer Receipt
    ↓
Waiting Verification
```

---

### Available Actions

```text
Upload Proof
Chat Seller
```

---

## WhatsApp Message Template

```text
Halo Kak,

Saya sudah melakukan pembayaran.

Order ID:
{{order_id}}

Mohon dibantu cek pembayaran saya.

Terima kasih.
```

---

# Owner Dashboard Integration

## Order List

### Table

| Field    | Description      |
| -------- | ---------------- |
| Order ID | Nomor Order      |
| Customer | Nama Customer    |
| WhatsApp | Nomor WhatsApp   |
| Total    | Total Pembayaran |
| Status   | Status Order     |
| Action   | Action Button    |

---

### Actions

```text
View Detail
Approve Payment
Reject Payment
Open WhatsApp
```

---

## Open WhatsApp

### Description

Owner dapat langsung membuka chat customer.

### Action

```text
https://wa.me/{{customer_phone}}
```

---

# Notification Templates

## Payment Approved

Button:

```text
Notify Customer
```

### Message

```text
Halo Kak,

Pembayaran untuk Order:

{{order_id}}

sudah kami terima.

Pesanan sedang kami proses.

Terima kasih.
```

---

## Payment Rejected

### Message

```text
Halo Kak,

Mohon maaf.

Pembayaran untuk Order:

{{order_id}}

belum dapat kami verifikasi.

Silakan cek kembali bukti transfer atau hubungi kami.

Terima kasih.
```

---

## Production Started

### Message

```text
Halo Kak,

Pesanan:

{{order_id}}

sudah masuk proses produksi.

Kami akan mengabari kembali saat pesanan siap.

Terima kasih.
```

---

## Ready For Pickup

### Message

```text
Halo Kak,

Pesanan:

{{order_id}}

sudah siap diambil.

Silakan datang sesuai jam operasional.

Terima kasih.
```

---

## Delivery Started

### Message

```text
Halo Kak,

Pesanan:

{{order_id}}

saat ini sedang dalam proses pengiriman.

Terima kasih.
```

---

## Order Completed

### Message

```text
Halo Kak,

Pesanan:

{{order_id}}

telah selesai.

Terima kasih sudah melakukan pemesanan.
```

---

# Message Template Engine

## Variables

Supported placeholders:

```text
{{order_id}}
{{customer_name}}
{{customer_phone}}
{{product_name}}
{{quantity}}
{{total_amount}}
{{pickup_date}}
{{delivery_date}}
{{seller_name}}
{{business_name}}
```

---

# Order Detail Page

## Customer View

### Information

```text
Order Information
Payment Information
Production Status
Timeline
```

### Actions

```text
Chat Seller
Upload Payment Proof
Download Invoice
```

---

# Status Flow

```text
Draft
    ↓
Waiting Payment
    ↓
Waiting Verification
    ↓
Confirmed
    ↓
In Production
    ↓
Ready Pickup
    ↓
Completed
```

Alternative:

```text
Draft
    ↓
Waiting Payment
    ↓
Waiting Verification
    ↓
Confirmed
    ↓
In Production
    ↓
Out For Delivery
    ↓
Completed
```

---

# UX Requirements

## Sticky WhatsApp CTA

Pada mobile device:

```text
--------------------------------
|      Chat Seller (WA)        |
--------------------------------
```

Selalu terlihat saat customer membuka detail order.

---

## One Click Communication

Customer tidak boleh mengetik ulang:

- Order ID
- Nama Produk
- Nominal

Sistem wajib mengisi otomatis template WhatsApp.

---

## Context Aware Messaging

Setiap tombol WhatsApp harus mengirimkan context order yang sedang dibuka.

Contoh:

Order A → kirim data Order A

Order B → kirim data Order B

Tidak boleh menggunakan template kosong.

---

# Future Enhancement

## V2

### Custom Template Builder

Owner dapat membuat template sendiri.

### Template Categories

```text
Payment
Production
Pickup
Delivery
Reminder
Marketing
```

---

## V3

### WhatsApp Click Tracking

Track:

```text
Message Sent
Link Clicked
Last Opened
```

Tanpa membutuhkan WhatsApp API.

---

# Technical Requirements

## URL Generator Service

Generate:

```text
wa.me URL
```

berdasarkan:

```text
phone_number
message_template
variables
```

---

## Message Encoding

Wajib support:

- Emoji
- Line Break
- Bahasa Indonesia
- UTF-8 Character

---

## Mobile First

Target penggunaan:

```text
90% Mobile
10% Desktop
```

Semua CTA WhatsApp wajib optimal di perangkat mobile.

---

# Success Metrics

## Operational Metrics

- 80% customer menggunakan tombol WhatsApp
- Mengurangi pertanyaan status pesanan > 50%
- Mengurangi input manual admin > 70%
- Tidak membutuhkan biaya integrasi WhatsApp

## UX Metrics

- Chat Seller CTR > 70%
- Payment Confirmation CTR > 80%
- Order Completion Rate > 90%
- Customer Support Response Time lebih cepat dibanding proses manual
