import { test, expect } from "../fixtures";
import { ProdukListPage } from "../pages/produk.page";

test.describe("Produk", () => {
  test("menampilkan daftar produk atau empty state", async ({ authedPage: page }) => {
    const listPage = new ProdukListPage(page);
    await listPage.goto();

    await expect(page).toHaveURL(/\/produk/);

    const hasList = await listPage.list.isVisible().catch(() => false);
    const hasEmpty = await listPage.emptyState.isVisible().catch(() => false);

    expect(hasList || hasEmpty).toBeTruthy();
  });

  test("tombol buat produk tersedia", async ({ authedPage: page }) => {
    const listPage = new ProdukListPage(page);
    await listPage.goto();
    await expect(listPage.addButton).toBeVisible();
  });

  test("tombol buat produk mengarah ke form baru", async ({ authedPage: page }) => {
    const listPage = new ProdukListPage(page);
    await listPage.goto();
    await listPage.addButton.click();
    await expect(page).toHaveURL(/\/produk\/baru/);
  });
});
