import { test, expect } from "../fixtures";
import { BahanBakuListPage, BahanBakuFormPage } from "../pages/bahan-baku.page";
import { testIngredient } from "../data/products";

test.describe("Bahan Baku", () => {
  test("menampilkan daftar bahan baku atau empty state", async ({ authedPage: page }) => {
    const listPage = new BahanBakuListPage(page);
    await listPage.goto();

    await expect(page).toHaveURL(/\/bahan-baku/);

    const hasList = await listPage.list.isVisible().catch(() => false);
    const hasEmpty = await listPage.emptyState.isVisible().catch(() => false);

    expect(hasList || hasEmpty).toBeTruthy();
  });

  test("tombol tambah bahan baku tersedia", async ({ authedPage: page }) => {
    const listPage = new BahanBakuListPage(page);
    await listPage.goto();
    await expect(listPage.addButton).toBeVisible();
  });

  test("form tambah bahan baku memiliki semua field", async ({ authedPage: page }) => {
    const formPage = new BahanBakuFormPage(page);
    await formPage.gotoNew();

    await expect(formPage.nameInput).toBeVisible();
    await expect(formPage.unitSelect).toBeVisible();
    await expect(formPage.purchaseQtyInput).toBeVisible();
    await expect(formPage.purchasePriceInput).toBeVisible();
    await expect(formPage.saveButton).toBeVisible();
  });
});
