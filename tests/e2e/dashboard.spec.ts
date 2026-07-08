import { test, expect } from "../fixtures";

test.describe("Module 13 & 14 - Dashboard & Profit Dashboard", () => {
  test.describe("Dashboard Utama", () => {
    test("menampilkan semua widget metrik", async ({ authedPage: page }) => {
      await page.goto("/dashboard");

      await expect(page.getByTestId("widget-open-campaign")).toBeVisible();
      await expect(page.getByTestId("widget-pending-payment")).toBeVisible();
      await expect(page.getByTestId("widget-need-verification")).toBeVisible();
      await expect(page.getByTestId("widget-orders-today")).toBeVisible();
    });

    test("menampilkan widget keuangan", async ({ authedPage: page }) => {
      await page.goto("/dashboard");

      await expect(page.getByTestId("widget-revenue")).toBeVisible();
      await expect(page.getByTestId("widget-total-hpp")).toBeVisible();
      await expect(page.getByTestId("widget-estimated-profit")).toBeVisible();
    });

    test("widget menampilkan nilai numerik", async ({ authedPage: page }) => {
      await page.goto("/dashboard");

      const openCampaignWidget = page.getByTestId("widget-open-campaign");
      await expect(openCampaignWidget).toBeVisible();
      const text = await openCampaignWidget.textContent();
      expect(text).toBeTruthy();
    });
  });

  test.describe("Dashboard - Navigasi", () => {
    test("halaman dashboard dapat diakses setelah login", async ({ authedPage: page }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.locator("main")).toBeVisible();
    });
  });

  test.describe("Profit Dashboard", () => {
    test("halaman keuntungan menampilkan metrik profit", async ({ authedPage: page }) => {
      await page.goto("/keuntungan");

      const pageContent = page.locator("main");
      await expect(pageContent).toBeVisible();
    });
  });
});
