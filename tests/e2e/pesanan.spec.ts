import { test, expect } from "../fixtures";

test.describe("Pesanan", () => {
  test("menampilkan halaman pesanan dengan list atau empty state", async ({ authedPage: page }) => {
    await page.goto("/pesanan");

    await expect(page).toHaveURL(/\/pesanan/);

    const hasList = await page.getByTestId("tbl-pesanan").isVisible().catch(() => false);
    const hasEmpty = await page.getByTestId("empty-pesanan-list").isVisible().catch(() => false);

    expect(hasList || hasEmpty).toBeTruthy();
  });
});
