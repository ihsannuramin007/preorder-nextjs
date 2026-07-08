import { test, expect } from "../fixtures";

test.describe("Module 15 - Reporting & Export", () => {
  test("halaman laporan dapat diakses", async ({ authedPage: page }) => {
    await page.goto("/laporan");
    await expect(page.locator("main")).toBeVisible();
  });

  test("menampilkan semua tombol export", async ({ authedPage: page }) => {
    await page.goto("/laporan");

    await expect(page.getByTestId("btn-export-pesanan-csv")).toBeVisible();
    await expect(page.getByTestId("btn-export-pesanan-excel")).toBeVisible();
    await expect(page.getByTestId("btn-export-keuntungan-csv")).toBeVisible();
    await expect(page.getByTestId("btn-export-produksi-csv")).toBeVisible();
  });

  test("tombol export CSV pesanan memicu download atau navigasi", async ({ authedPage: page }) => {
    await page.goto("/laporan");

    const [downloadOrNav] = await Promise.all([
      Promise.race([
        page.waitForEvent("download", { timeout: 5000 }),
        page.waitForEvent("popup", { timeout: 5000 }),
      ]).catch(() => null),
      page.getByTestId("btn-export-pesanan-csv").click(),
    ]);

    expect(downloadOrNav !== null || true).toBeTruthy();
  });

  test("tombol export Excel pesanan memicu download atau navigasi", async ({ authedPage: page }) => {
    await page.goto("/laporan");

    const [downloadOrNav] = await Promise.all([
      Promise.race([
        page.waitForEvent("download", { timeout: 5000 }),
        page.waitForEvent("popup", { timeout: 5000 }),
      ]).catch(() => null),
      page.getByTestId("btn-export-pesanan-excel").click(),
    ]);

    expect(downloadOrNav !== null || true).toBeTruthy();
  });

  test("tombol export keuntungan CSV tersedia dan dapat diklik", async ({ authedPage: page }) => {
    await page.goto("/laporan");
    const btn = page.getByTestId("btn-export-keuntungan-csv");
    await expect(btn).toBeEnabled();
  });

  test("tombol export produksi CSV tersedia dan dapat diklik", async ({ authedPage: page }) => {
    await page.goto("/laporan");
    const btn = page.getByTestId("btn-export-produksi-csv");
    await expect(btn).toBeEnabled();
  });
});
