# Pohub — Business Value Report

*Prepared as sales-engineering foundation for GTM / Business Model Canvas analysis.*
*Date: 2026-07-08*

---

## 1. Executive Summary

Pohub is a preorder & batch-production management platform built for Indonesian UMKM (micro/small businesses) — home-based F&B producers, craft sellers, and other made-to-order sellers who sell via preorder ("PO") cycles and group buys ("open PO grup"). It replaces the spreadsheet + WhatsApp-thread workflow most UMKM sellers run today with a structured system: product & recipe costing (HPP), PO period (campaign) management, raw material inventory, order collection (individual + group), manual payment verification, production planning, and profit/report exports.

Core value prop: **turn a WhatsApp-based preorder hustle into an auditable, cost-aware small business, without requiring the owner to be an accountant or a developer.**

---

## 2. Product Overview

**Target persona**: solo/small-team UMKM owner (often mobile-first, non-technical) running recurring PO batches — e.g. home bakery, frozen food, craft/fashion made-to-order, F&B group-buy organizers ("bunda-bunda arisan PO").

**Core workflow** (mirrors the app's dashboard structure):

1. **Toko** — set up storefront (`/{slug}`): logo, cover, WA number, Instagram, Google Maps (if offline store).
2. **Produk** — add products with photos (up to 5), price, and either a **recipe (resep)** built from **bahan baku** (raw materials) for auto-calculated HPP (COGS), or a manual cost entry for simpler products.
3. **Bahan Baku** — track raw material stock, purchases, and adjustments (waste/expired/lost/damaged) with running average cost.
4. **Periode PO** (Campaign) — open a PO window (open/close date), attach products, collect orders.
5. **Pesanan** — customers order via public storefront, individually or via **group order** (a facilitator collects orders from multiple members under one session, one combined payment).
6. **Payment verification** — customer uploads payment proof; owner approves/rejects manually (no payment gateway).
7. **Produksi** — system generates a production sheet (aggregated ingredient needs) from paid orders; owner logs production records.
8. **Laporan & Keuntungan** — profit and reports, exportable to PDF/Excel.

---

## 3. Feature → Business Value Mapping

| Feature | Business Problem Solved | Value Delivered | Beneficiary |
|---|---|---|---|
| Multi-tenant storefront (`/{slug}`) | UMKM has no branded online presence beyond a WA/IG bio | Instant shareable storefront link, no dev/hosting needed | Owner (brand), customer (trust) |
| Recipe-based HPP costing (RecipeItem + Ingredient) | Owners price products by guesswork, don't know true margin | Auto-computed cost-of-goods from ingredient costs; margin visibility per product | Owner (pricing decisions, profitability) |
| Manual cost mode fallback | Not every product has a clean recipe (services, resale goods) | Flexibility without forcing rigid data entry, faster onboarding | Owner (lower setup friction) |
| Raw material inventory + stock movement audit trail | No visibility into stock levels or waste, restocking is reactive | Purchase/deduction/adjustment history with reasons (expired/lost/damaged/waste) enables shrinkage tracking and reorder timing | Owner (inventory control, loss reduction) |
| PO Campaign (periode PO) management | PO sellers run distinct time-boxed batches, hard to track manually per batch | Clear open/close windows, status lifecycle (draft→open→closed→production→completed) | Owner (operational clarity) |
| Individual order flow + tracking (`/lacak/{orderId}`) | Customers repeatedly ask "sudah sampai mana pesanan saya" via chat | Self-service order status tracking reduces customer-service load | Owner (support cost), customer (transparency) |
| Group order (facilitator + members, session code) | Group-buy organizers manually total up orders from many people in a chat thread | Structured collection, per-member subtotals, one combined payment/verification | Facilitator (time saved), owner (bigger average order size) |
| Payment proof upload + verify/reject workflow | No integrated payment gateway available/affordable for micro sellers | Works with any payment method (bank transfer, QRIS, e-wallet) sellers already use, at zero gateway fee | Owner (no dependency, no fees) |
| Production sheet (auto-aggregated ingredient needs) | Owner manually recalculates "berapa banyak bahan yang dibutuhkan" per batch | Automatic shopping/production list from confirmed orders, reduces prep errors | Owner (operational efficiency) |
| Production record logging | No record of what was actually produced vs planned | Historical production data ties back to cost and campaign performance | Owner (accountability, reporting) |
| Laporan & Keuntungan (profit reports, PDF/Excel export) | Owner has no P&L visibility, can't show numbers to banks/partners | Exportable, presentable business reports without spreadsheet work | Owner (financial literacy, funding readiness) |
| Mobile-first UX (bottom nav, currency input) | Owners run their business from a phone, not a desktop | Fast one-thumb navigation, no manual comma-formatting errors on money fields | Owner (daily usability) |
| Multi-photo product gallery (cover badge) | Single photo undersells handmade/food products online | Better product presentation drives storefront conversion | Owner (sales conversion) |
| WhatsApp / Instagram / Google Maps integration | Customers expect to verify a business via WA/social before buying | Builds trust signal directly on storefront, keeps WA as the familiar customer channel | Owner (trust), customer (channel comfort) |

---

## 4. Technical Differentiators (Competitive/Demo Angle)

- **Recipe-driven auto-costing vs. manual entry everywhere** — most low-end "link-in-bio" or generic order-form tools don't compute COGS at all; Pohub ties pricing to actual ingredient cost.
- **Stock movement audit trail with typed reasons** — most micro-seller tools have no inventory concept; this gives shrinkage/loss accountability competitors in this segment typically lack.
- **Group-order-native flow** — session-coded, facilitator/member structure is purpose-built for the "open PO grup" pattern extremely common in Indonesian social commerce, not a generic cart bolted onto that use case.
- **Gateway-agnostic payments** — no dependency on a specific payment processor means it works day one with whatever payment method the seller's customers already trust (bank transfer, QRIS, e-wallet), with zero transaction fees; tradeoff noted below.
- **Full campaign lifecycle** (draft → open → closed → production → completed) tying orders, production sheet, and production records together — most competitors handle orders and inventory as separate, disconnected tools.

---

## 5. Gaps / Risks for GTM

- **No integrated payment gateway** — manual proof verification doesn't scale past a certain order volume and introduces fraud/delay risk; likely the #1 upsell/partnership opportunity (Midtrans/Xendit/QRIS integration).
- **No monetization model yet** — no plan/tier/subscription/quota code exists anywhere in the codebase. Product is currently free/flat; revenue model is a blank canvas, not a decision already made.
- **Single admin per store, 1:1 User↔Store** — no staff roles or multi-store-per-owner support; limits growth into slightly larger UMKM or multi-outlet sellers.
- **No automated notifications** — WhatsApp integration is deep-link/manual-trigger based (`whatsapp.ts` composes messages), not automated push notifications on order status change; a notification engine (WA Business API, email via existing Resend dependency) is an untapped retention lever.
- **No analytics/insights layer beyond basic reports** — Recharts is in the stack but no evidence yet of predictive/trend features (best-sellers, repeat-customer rate) that would strengthen a "grow your business" pitch beyond bookkeeping.

---

## 6. BMC Seed Inputs *(draft — validate against real market data before finalizing)*

- **Customer Segments**: home-based F&B/UMKM PO sellers; group-buy facilitators (arisan/komunitas PO); craft/fashion made-to-order sellers.
- **Value Propositions**: turn WA-thread PO chaos into a costed, trackable mini-business; know your real margin; look professional with a branded storefront link.
- **Channels**: direct-to-seller acquisition via social media/community groups (Facebook UMKM groups, Instagram, TikTok Shop-adjacent sellers), possible partnership with UMKM associations/bank UMKM programs.
- **Revenue Streams**: currently none — options to evaluate: freemium + paid tier (multi-store, staff roles, automated WA notifications), payment gateway integration take-rate, report/export premium features.
- **Key Resources**: Supabase infra (auth/storage/DB), Next.js app, product/engineering team, UMKM domain knowledge embedded in workflow (HPP, PO culture).
- **Key Activities**: product development (per fast git commit cadence), customer onboarding/education (non-technical users), storefront reliability/performance.
- **Cost Structure**: hosting (Supabase/Vercel-class), engineering time, customer support/onboarding for non-technical users.
- **Customer Relationships**: currently self-serve; no visible onboarding/support tooling beyond in-app tooltips (per recent commit) — opportunity for community/WA-based support channel matching the target persona's comfort zone.
- **Key Partners**: potential payment gateway (Midtrans/Xendit/QRIS provider), WhatsApp Business API provider, UMKM enablement programs/bank fintech partnerships, logistics/shipping aggregators (not yet integrated).

---

*This report is a technical-to-business translation layer. Customer segment sizing, pricing willingness-to-pay, and competitive landscape require external market research beyond what the codebase can reveal.*
