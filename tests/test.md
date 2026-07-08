# TESTABILITY_GUIDELINE.md

Version: 1.0
Stack: Next.js + TypeScript + Playwright + Claude Code/Codex

## Purpose

Dokumen ini mendefinisikan standar penulisan kode agar:

1. Aplikasi mudah diotomasi menggunakan Playwright.
2. Claude Code/Codex dapat memahami struktur UI dan business flow.
3. Locator stabil dan tidak mudah rusak saat refactoring.
4. Test automation dapat di-generate dan di-maintain oleh AI.

---

# Fundamental Principles

1. Testability First Development
2. Automation Friendly UI
3. Semantic HTML First
4. Stable Locator Contract
5. No Dynamic Selector Dependency
6. AI Readable Structure
7. Convention Over Configuration

---

# Definition of Done (DoD)

Sebuah fitur dianggap selesai apabila:

* [ ] Semua elemen interaktif memiliki data-testid.
* [ ] Semua form memiliki label atau aria-label.
* [ ] Tidak menggunakan locator berbasis CSS dinamis.
* [ ] Tidak menggunakan locator berbasis posisi (nth-child).
* [ ] Semua state dapat di-observe automation.
* [ ] Semua modal, toast, dan loading memiliki identifier.
* [ ] Business flow terdokumentasi dalam Gherkin.
* [ ] Test scenario dapat di-generate oleh AI tanpa intervensi manual.

---

# HTML Rules

## Wajib menggunakan semantic element

GOOD

<button>Login</button> <input /> <select />

<form />
<table />

BAD

<div onClick={login} />
<span onClick={submit} />

---

# data-testid Rules

Semua elemen interaktif wajib memiliki data-testid.

GOOD

<button data-testid="btn-login">
<input data-testid="txt-email">
<select data-testid="ddl-bank">

BAD

<button className="btn-primary">
<input placeholder="Email">

---

# Naming Convention

## Button

Format:

btn-{action}

Examples:

btn-login
btn-submit
btn-save
btn-delete

---

## Textbox

Format:

txt-{field}

Examples:

txt-email
txt-password
txt-agent-name
txt-account-number

---

## Textarea

Format:

ta-{field}

Examples:

ta-description
ta-notes

---

## Dropdown

Format:

ddl-{field}

Examples:

ddl-bank
ddl-role
ddl-status

---

## Checkbox

Format:

chk-{field}

Examples:

chk-agreement
chk-is-active

---

## Radio

Format:

rdo-{field}-{value}

Examples:

rdo-gender-male
rdo-gender-female

---

## Table

Format:

tbl-{entity}

Examples:

tbl-agent
tbl-transaction
tbl-user

---

## Table Row

Format:

row-{entity}-{id}

Examples:

row-agent-12345
row-user-987

---

## Modal

Format:

modal-{name}

Examples:

modal-confirm
modal-transfer
modal-delete-agent

---

## Loading

Format:

loading-{name}

Examples:

loading-dashboard
loading-transaction

---

## Toast

Format:

toast-{type}-{name}

Examples:

toast-success-login
toast-error-login
toast-success-transfer

---

# Accessibility Rules

Semua form field wajib memiliki:

1. label
   atau
2. aria-label

GOOD

<label htmlFor="email">Email</label> <input id="email" data-testid="txt-email" />

GOOD

<input
aria-label="Email"
data-testid="txt-email"
/>

BAD

<input placeholder="Email" />

---

# Forbidden Locator Patterns

FORBIDDEN

page.locator('div > div > button')
page.locator('.css-123abc')
page.locator('button').nth(2)
xpath=//*[@id="root"]/div[2]/div[3]

ALLOWED

page.getByTestId()
page.getByRole()
page.getByLabel()
page.getByText()

Priority:

1. getByTestId
2. getByRole
3. getByLabel
4. getByText

---

# State Identifiers

## Loading

<div data-testid="loading-dashboard">

## Empty State

<div data-testid="empty-agent-list">

## Error State

<div data-testid="error-agent-fetch">

## Success State

<div data-testid="success-transfer">

---

# Form Validation Rules

Semua validation message wajib memiliki identifier.

GOOD

<span data-testid="error-email-required">
Email wajib diisi
</span>

GOOD

<span data-testid="error-invalid-account">
Nomor rekening tidak valid
</span>

---

# Modal Rules

GOOD

<div data-testid="modal-confirm-transfer">
<button data-testid="btn-confirm-transfer">
<button data-testid="btn-cancel-transfer">

---

# Table Rules

GOOD

<table data-testid="tbl-agent">
<tr data-testid="row-agent-123">
<button data-testid="btn-edit-agent-123">
<button data-testid="btn-delete-agent-123">

---

# Next.js Component Rules

Semua reusable component wajib menerima:

type TestableProps = {
dataTestId?: string;
};

Example:

<Button
data-testid="btn-login"
/>

<Input
data-testid="txt-email"
/>

---

# Async Rules

FORBIDDEN

await page.waitForTimeout(5000);

ALLOWED

await expect(
page.getByTestId('loading-dashboard')
).toBeHidden();

ALLOWED

await page.waitForResponse();

---

# Repository Structure

src/
├── app/
├── components/
├── hooks/
├── services/
├── lib/
├── utils/

tests/
├── e2e/
├── pages/
├── fixtures/
├── data/
├── mocks/

docs/
├── prd/
├── gherkin/
├── test-matrix/

.ai/
├── testability-guideline.md
├── coding-standards.md
├── playwright-rules.md
├── prompts/

---

# AI Agent Rules

Claude Code/Codex MUST:

1. Use Page Object Model.
2. Use getByTestId as primary locator.
3. Never use nth().
4. Never use dynamic CSS selectors.
5. Never use hard wait.
6. Generate tests from Gherkin first.
7. Generate fixtures and mock data separately.
8. Preserve data-testid contract.
9. Prefer reusable helper methods.
10. Auto-analyze screenshots, traces, and failures.

---

# Test Generation Flow

PRD
↓
Acceptance Criteria
↓
BDD Gherkin
↓
Test Matrix
↓
Page Object
↓
Playwright Spec
↓
Execution
↓
Report
↓
AI Failure Analysis
↓
Self-Healing
↓
Pull Request

---

This document is a contractual agreement between Product Experience, Developer, QA, and AI Agents. Breaking this convention may significantly reduce automation stability and AI-assisted testing effectiveness.