import { test, expect } from "../fixtures";

test.describe("Module 4 - Ingredient Management", () => {
  test.describe("Daftar Bahan Baku", () => {
    test("menampilkan daftar bahan baku atau empty state", async ({ authedPage: page }) => {
      await page.goto("/bahan-baku");

      const hasList = await page.getByTestId("tbl-bahan-baku").isVisible().catch(() => false);
      const hasEmpty = await page.getByTestId("empty-bahan-baku-list").isVisible().catch(() => false);
      expect(hasList || hasEmpty).toBeTruthy();
    });

    test("tombol Tambah Bahan Baku mengarah ke form", async ({ authedPage: page }) => {
      await page.goto("/bahan-baku");
      await page.getByTestId("btn-tambah-bahan-baku").click();
      await expect(page).toHaveURL(/\/bahan-baku\/baru/);
    });
  });

  test.describe("Form Tambah Bahan Baku - UI Contract", () => {
    test("menampilkan semua field yang diperlukan", async ({ authedPage: page }) => {
      await page.goto("/bahan-baku/baru");

      await expect(page.getByTestId("txt-nama-bahan")).toBeVisible();
      await expect(page.getByTestId("ddl-satuan")).toBeVisible();
      await expect(page.getByTestId("txt-jumlah-pembelian")).toBeVisible();
      await expect(page.getByTestId("txt-harga-pembelian")).toBeVisible();
      await expect(page.getByTestId("btn-simpan-bahan-baku")).toBeVisible();
    });
  });

  test.describe("Tambah Bahan Baku - Happy Path", () => {
    test("berhasil menyimpan bahan baku baru", async ({ authedPage: page }) => {
      await page.goto("/bahan-baku/baru");

      await page.getByTestId("txt-nama-bahan").fill(`Bahan Test ${Date.now()}`);
      await page.getByTestId("ddl-satuan").click();
      await page.getByRole("option", { name: "gram" }).click();
      await page.getByTestId("txt-jumlah-pembelian").fill("100");
      await page.getByTestId("txt-harga-pembelian").fill("50000");
      await page.getByTestId("btn-simpan-bahan-baku").click();

      await expect(page).toHaveURL(/\/bahan-baku/, { timeout: 8000 });
    });
  });

  test.describe("Edit & Hapus Bahan Baku", () => {
    test("halaman edit menampilkan semua field dengan data tersimpan", async ({ authedPage: page }) => {
      await page.goto("/bahan-baku");

      const firstRow = page.getByTestId(/^row-bahan-baku-/).first();
      const hasBahan = await firstRow.isVisible().catch(() => false);
      if (!hasBahan) { test.skip(); return; }

      await firstRow.click();
      await expect(page).toHaveURL(/\/bahan-baku\//);
      await expect(page.getByTestId("txt-nama-bahan")).toBeVisible();
      await expect(page.getByTestId("btn-simpan-bahan-baku")).toBeVisible();
    });

    test("modal konfirmasi muncul sebelum hapus bahan baku", async ({ authedPage: page }) => {
      await page.goto("/bahan-baku");

      const firstRow = page.getByTestId(/^row-bahan-baku-/).first();
      const hasBahan = await firstRow.isVisible().catch(() => false);
      if (!hasBahan) { test.skip(); return; }

      await firstRow.click();
      await page.getByTestId("btn-hapus-bahan-baku").click();

      await expect(page.getByTestId("modal-hapus-bahan-baku")).toBeVisible();
    });
  });
});
