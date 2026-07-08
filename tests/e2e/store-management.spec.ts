import { test, expect } from "../fixtures";

test.describe("Module 2 - Store Management", () => {
  test("halaman toko menampilkan form profil toko", async ({ authedPage: page }) => {
    await page.goto("/toko");
    await expect(page.getByTestId("txt-nama-toko")).toBeVisible();
    await expect(page.getByTestId("txt-slug-toko")).toBeVisible();
    await expect(page.getByTestId("ta-deskripsi-toko")).toBeVisible();
    await expect(page.getByTestId("txt-whatsapp")).toBeVisible();
    await expect(page.getByTestId("txt-instagram")).toBeVisible();
    await expect(page.getByTestId("btn-simpan-toko")).toBeVisible();
  });

  test("menyimpan profil toko", async ({ authedPage: page }) => {
    await page.goto("/toko");

    const namaToko = page.getByTestId("txt-nama-toko");
    await namaToko.fill("Toko Test Playwright");

    await page.getByTestId("ta-deskripsi-toko").fill("Toko untuk testing otomatis");
    await page.getByTestId("btn-simpan-toko").click();

    await expect(page.locator("[data-sonner-toast]")).toBeVisible({ timeout: 5000 });
  });

  test("slug auto-generate dari nama toko", async ({ authedPage: page }) => {
    await page.goto("/toko");

    const namaToko = page.getByTestId("txt-nama-toko");
    const slugInput = page.getByTestId("txt-slug-toko");

    await namaToko.fill("Toko Roti Manis");
    await expect(slugInput).toHaveValue(/toko-roti-manis/, { timeout: 2000 });
  });

  test("URL toko publik tampil setelah toko disimpan", async ({ authedPage: page }) => {
    await page.goto("/toko");

    const namaToko = page.getByTestId("txt-nama-toko");
    await namaToko.fill("Kopi Bu Ani");
    await page.getByTestId("btn-simpan-toko").click();

    await page.waitForTimeout(1000);
    await page.reload();

    await expect(page.getByTestId("btn-salin-url-toko")).toBeVisible();
    await expect(page.getByTestId("btn-buka-toko")).toBeVisible();
  });
});
