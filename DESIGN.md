# Design.md

# Product Design System

Project: POHub

Version: 1.0

---

# Design Reference

Primary Inspiration:

- Saweria
- Trakteer
- Stripe
- Linear
- Notion

The application MUST adopt the same design philosophy as Saweria:

- Clean
- Friendly
- Modern
- Minimal
- Fast
- Mobile-first
- Creator Economy Style

This is NOT an enterprise application.

This is NOT an ERP.

This is NOT an accounting software.

Users are home business owners who need simplicity.

---

# Core UX Philosophy

## Rule 1

Every screen must answer only one question.

Bad:

Dashboard shows 20 metrics.

Good:

Dashboard shows what needs attention today.

---

## Rule 2

Reduce thinking.

The user should never need training.

The interface should guide the workflow naturally.

---

## Rule 3

Action First.

Primary actions must always be visually dominant.

Example:

Create Product

Open PO

Verify Payment

must always be more prominent than statistics.

---

## Rule 4

Mobile Experience Comes First.

Every screen must be designed for:

390px width

before desktop.

Desktop is an enhancement.

Mobile is mandatory.

---

# Visual Personality

Brand Attributes:

- Friendly
- Helpful
- Modern
- Cheerful
- Trustworthy

Avoid:

- Corporate
- Enterprise
- Government Style
- Financial Institution Style
- Heavy Business Software Style

---

# Color Palette

## Primary

Orange

500
#F97316

600
#EA580C

700
#C2410C

---

## Success

#10B981

---

## Warning

#F59E0B

---

## Error

#EF4444

---

## Info

#3B82F6

---

## Background

#FAFAFA

---

## Card

#FFFFFF

---

## Border

#E5E7EB

---

## Text Primary

#111827

---

## Text Secondary

#6B7280

---

# Typography

Font Family:

Plus Jakarta Sans

Fallback:

Inter

Fallback:

system-ui

sans-serif

---

# Font Scale

Hero

36px

Weight 700

---

Page Title

30px

Weight 700

---

Section Title

24px

Weight 600

---

Card Title

18px

Weight 600

---

Body

16px

Weight 400

---

Caption

14px

Weight 400

---

Small

12px

Weight 400

---

# Layout System

## Content Width

Landing Page

1280px

Dashboard

1440px

Forms

720px

---

## Spacing System

Use only:

4
8
12
16
24
32
48
64

Never use arbitrary spacing.

---

## Border Radius

Button

12px

Input

12px

Card

16px

Modal

24px

Drawer

24px

---

# Component Design

## Cards

Inspired by Saweria.

Requirements:

- White background
- Soft border
- Light shadow
- Rounded corners
- Large padding

Example Style:

Background:
White

Border:
1px solid #E5E7EB

Shadow:
Very subtle

Padding:
24px

Radius:
16px

---

## Buttons

Primary

Filled Orange

Height:

48px

Radius:

12px

Weight:

600

---

Secondary

Outline

White background

Orange border

---

Ghost

Transparent

No border

---

Danger

Red

Requires confirmation.

---

# Form Design

Forms are the heart of the application.

Every form must:

- Use labels
- Use helper text
- Show validation instantly

Never rely on placeholders only.

Bad:

[ Enter Product ]

Good:

Product Name

[________________]

Example:
Visible label above input.

---

# Navigation

## Mobile

Bottom Navigation

Maximum 5 Items

Home

Orders

Products

Store

Account

---

## Desktop

Sidebar Navigation

Collapsed by default.

Width:

240px

---

# Dashboard Design

Dashboard should feel similar to Saweria.

Not a data warehouse.

Not an admin panel.

Not analytics heavy.

---

## Dashboard Structure

Section 1

Welcome Card

Store Name

Quick Actions

---

Section 2

Today's Metrics

Orders

Revenue

Pending Payments

Open PO

---

Section 3

Action Queue

Need Verification

Need Production

Need Delivery

---

Section 4

Recent Orders

Latest Activities

---

# Public Store Design

The Public Store is the most important page.

The feeling should be:

Linktree + Modern E-Commerce

---

## Header

Logo

Store Name

Description

WhatsApp Button

Instagram Button

---

## Product Grid

Mobile

1 Column

Desktop

2-3 Columns

---

## Product Card

Image

Product Name

Price

PO Status

Order Button

Nothing more.

---

# Product Creation UX

Must be wizard-based.

Step 1

Basic Information

---

Step 2

Variants

---

Step 3

Ingredients

---

Step 4

Pricing

---

Step 5

Publish

This reduces user confusion.

---

# Empty State Design

Every page must have an empty state.

Include:

Illustration

Short Message

Primary CTA

Example:

No Products Yet

Create your first product and start accepting orders.

[ Create Product ]

---

# Loading States

Always use Skeleton Loaders.

Never show:

Loading...

text alone.

---

# Animations

Animation Duration

150ms - 250ms

Only.

---

Allowed

Fade

Scale

Slide

---

Avoid

Bounce

Spin

Complex motion

Heavy animation

---

# Tables

Avoid traditional enterprise tables.

Prefer:

Card List

Order Cards

Responsive Lists

Only use tables when absolutely necessary.

---

# Mobile Rules

Touch Target

Minimum 44px

---

Buttons

Full Width

---

Forms

Single Column

Always.

---

Modals

Use Bottom Sheet

Instead of Center Modal

for mobile.

---

# Copywriting Rules

Language:

Bahasa Indonesia

Simple and friendly.

---

Bad

"Synchronize Inventory"

Good

"Perbarui Stok"

---

Bad

"Margin Analysis"

Good

"Keuntungan"

---

Bad

"Campaign"

Good

"Periode PO"

---

# Performance Requirements

Lighthouse

Performance > 90

Accessibility > 90

SEO > 90

Best Practices > 90

---

# Technical UI Requirements

Framework:

shadcn/ui

Icons:

lucide-react

Animation:

framer-motion

Charts:

recharts

Forms:

react-hook-form

Validation:

zod

Tables:

tanstack-table

---

# Final Design Requirement

When designing any screen:

Think:

"Would this feel natural if it were added to Saweria tomorrow?"

If the answer is no,

redesign the screen.

The application should feel like a modern creator-economy product, not a traditional business management application.
