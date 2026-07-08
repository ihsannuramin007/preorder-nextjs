import { test, expect } from "../fixtures";

test.describe("Module 3 - Product Management", () => {
  test.describe("Daftar Produk", () => {
    test("menampilkan daftar produk atau empty state", async ({ authedPage: page }) => {
      await page.goto("/produk");

      const hasList = await page.getByTestId("tbl-produk").isVisible().catch(() => false);
      const hasEmpty = await page.getByTestId("empty-produk-list").isVisible().catch(() => false);
      expect(hasList || hasEmpty).toBeTruthy();
    });

    test("tombol Buat Produk mengarah ke form wizard", async ({ authedPage: page }) => {
      await page.goto("/produk");
      await page.getByTestId("btn-buat-produk").click();
      await expect(page).toHaveURL(/\/produk\/baru/);
    });
  });

  test.describe("Form Buat Produk - UI Contract", () => {
    test("step 1 menampilkan semua field informasi dasar", async ({ authedPage: page }) => {
      await page.goto("/produk/baru");

      await expect(page.getByTestId("txt-nama-produk")).toBeVisible();
      await expect(page.getByTestId("ta-deskripsi-produk")).toBeVisible();
      await expect(page.getByTestId("ddl-kategori")).toBeVisible();
      await expect(page.getByTestId("btn-lanjut-step-1")).toBeVisible();
    });

    test("navigasi wizard step 1 ke step 2", async ({ authedPage: page }) => {
      await page.goto("/produk/baru");

      await page.getByTestId("txt-nama-produk").fill("Kopi Susu Test");
      await page.getByTestId("btn-lanjut-step-1").click();

      await expect(page.getByTestId("btn-tambah-varian")).toBeVisible();
      await expect(page.getByTestId("btn-kembali-step-2")).toBeVisible();
      await expect(page.getByTestId("btn-lanjut-step-2")).toBeVisible();
    });

    test("navigasi wizard step 2 ke step 3", async ({ authedPage: page }) => {
      await page.goto("/produk/baru");

      await page.getByTestId("txt-nama-produk").fill("Kopi Susu Test");
      await page.getByTestId("btn-lanjut-step-1").click();
      await page.getByTestId("btn-lanjut-step-2").click();

      await expect(page.getByTestId("txt-harga-dasar")).toBeVisible();
      await expect(page.getByTestId("btn-kembali-step-3")).toBeVisible();
      await expect(page.getByTestId("btn-buat-produk-submit")).toBeVisible();
    });

    test("dapat menambah varian produk", async ({ authedPage: page }) => {
      await page.goto("/produk/baru");

      await page.getByTestId("txt-nama-produk").fill("Produk Varian Test");
      await page.getByTestId("btn-lanjut-step-1").click();
      await page.getByTestId("btn-tambah-varian").click();

      await expect(page.locator("input[placeholder='Nama varian (mis: 250ml)']")).toBeVisible();
    });
  });

  test.describe("Membuat Produk - Happy Path", () => {
    test("membuat produk baru dan redirect ke halaman resep", async ({ authedPage: page }) => {
      await page.goto("/produk/baru");

      await page.getByTestId("txt-nama-produk").fill(`Produk Test ${Date.now()}`);
      await page.getByTestId("btn-lanjut-step-1").click();
      await page.getByTestId("btn-lanjut-step-2").click();
      await page.getByTestId("txt-harga-dasar").fill("25000");
      await page.getByTestId("btn-buat-produk-submit").click();

      await expect(page).toHaveURL(/\/produk\/.*\/resep/, { timeout: 10000 });
    });
  });

  test.describe("Status Produk", () => {
    test("halaman detail produk menampilkan tombol status sesuai kondisi", async ({ authedPage: page }) => {
      await page.goto("/produk");

      const firstRow = page.getByTestId(/^row-produk-/).first();
      const hasProducts = await firstRow.isVisible().catch(() => false);
      if (!hasProducts) {
        test.skip();
        return;
      }

      await firstRow.click();
      await expect(page).toHaveURL(/\/produk\//);
      await expect(page.getByTestId("btn-hapus-produk")).toBeVisible();
    });
  });

  test.describe("Resep Produk - UI Contract", () => {
    test("halaman resep menampilkan form tambah bahan", async ({ authedPage: page }) => {
      await page.goto("/produk");

      const firstRow = page.getByTestId(/^row-produk-/).first();
      const hasProducts = await firstRow.isVisible().catch(() => false);
      if (!hasProducts) {
        test.skip();
        return;
      }

      const href = await firstRow.getAttribute("href");
      if (!href) { test.skip(); return; }

      await page.goto(`${href}/resep`);

      await expect(page.getByTestId("ddl-pilih-bahan").or(page.getByText("Semua bahan sudah ditambahkan"))).toBeVisible({ timeout: 5000 });
    });
  });
});
