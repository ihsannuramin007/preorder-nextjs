import { test, expect } from "../fixtures";

test.describe("Module 10 - Order Management", () => {
  test.describe("Daftar Pesanan", () => {
    test("menampilkan daftar pesanan atau empty state", async ({ authedPage: page }) => {
      await page.goto("/pesanan");

      const hasList = await page.getByTestId("tbl-pesanan").isVisible().catch(() => false);
      const hasEmpty = await page.getByTestId("empty-pesanan-list").isVisible().catch(() => false);
      expect(hasList || hasEmpty).toBeTruthy();
    });

    test("baris pesanan dapat diklik untuk menuju detail", async ({ authedPage: page }) => {
      await page.goto("/pesanan");

      const firstRow = page.getByTestId(/^row-pesanan-/).first();
      const hasOrders = await firstRow.isVisible().catch(() => false);
      if (!hasOrders) { test.skip(); return; }

      await firstRow.click();
      await expect(page).toHaveURL(/\/pesanan\//);
    });
  });

  test.describe("Detail Pesanan", () => {
    test("halaman detail menampilkan info customer dan status", async ({ authedPage: page }) => {
      await page.goto("/pesanan");

      const firstRow = page.getByTestId(/^row-pesanan-/).first();
      const hasOrders = await firstRow.isVisible().catch(() => false);
      if (!hasOrders) { test.skip(); return; }

      await firstRow.click();

      await expect(page.getByTestId("order-detail-customer-name")).toBeVisible();
      await expect(page.getByTestId("badge-status-pesanan")).toBeVisible();
      await expect(page.getByTestId("order-detail-total")).toBeVisible();
    });

    test("tombol ubah status pesanan tersedia", async ({ authedPage: page }) => {
      await page.goto("/pesanan");

      const firstRow = page.getByTestId(/^row-pesanan-/).first();
      const hasOrders = await firstRow.isVisible().catch(() => false);
      if (!hasOrders) { test.skip(); return; }

      await firstRow.click();
      await expect(page.getByTestId("btn-ubah-status-pesanan")).toBeVisible();
    });
  });
});
