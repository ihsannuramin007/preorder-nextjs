import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Module 8 & 9 - Public Store & Order Form", () => {
  const STORE_SLUG = "test-store";

  test.describe("Public Store", () => {
    test("halaman toko publik dapat diakses tanpa login", async ({ page }) => {
      const response = await page.goto(`/${STORE_SLUG}`);
      expect(response?.status()).not.toBe(403);
    });

    test("toko tidak ada menampilkan 404", async ({ page }) => {
      const response = await page.goto("/slug-yang-tidak-ada-xyz-999");
      expect(response?.status()).toBe(404);
    });
  });

  test.describe("Order Form - UI Contract", () => {
    test("form order menampilkan semua field pelanggan", async ({ page }) => {
      await page.goto("/periode-po");
      test.skip(true, "Requires known campaign URL — run after seeding test data");
    });
  });

  test.describe("Order Form - Happy Path", () => {
    test("pelanggan berhasil submit pesanan dan melihat nomor order", async ({ page }) => {
      test.skip(true, "Requires active campaign — run after seeding test data");
    });
  });

  test.describe("Order Form - Validation", () => {
    test("tidak bisa submit tanpa memilih produk", async ({ page }) => {
      test.skip(true, "Requires active campaign — run after seeding test data");
    });

    test("tidak bisa submit tanpa mengisi nama pelanggan", async ({ page }) => {
      test.skip(true, "Requires active campaign — run after seeding test data");
    });
  });
});

test.describe("Module 9 - Order Form (with known campaign)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("form order menampilkan qty controls untuk setiap varian", async ({ page }) => {
    test.fixme(true, "Set CAMPAIGN_URL env var to a known open campaign URL");

    const campaignUrl = process.env.CAMPAIGN_URL;
    if (!campaignUrl) { test.skip(); return; }

    await page.goto(campaignUrl);

    const addBtns = page.getByTestId(/^btn-tambah-qty-/);
    expect(await addBtns.count()).toBeGreaterThan(0);

    const minusBtns = page.getByTestId(/^btn-kurang-qty-/);
    expect(await minusBtns.count()).toBeGreaterThan(0);

    await expect(page.getByTestId("txt-nama-pembeli")).toBeVisible();
    await expect(page.getByTestId("txt-telpon")).toBeVisible();
    await expect(page.getByTestId("ta-alamat")).toBeVisible();
    await expect(page.getByTestId("btn-kirim-pesanan")).toBeVisible();
  });

  test("qty bertambah saat tombol + ditekan", async ({ page }) => {
    test.fixme(true, "Set CAMPAIGN_URL env var to a known open campaign URL");

    const campaignUrl = process.env.CAMPAIGN_URL;
    if (!campaignUrl) { test.skip(); return; }

    await page.goto(campaignUrl);

    const firstAddBtn = page.getByTestId(/^btn-tambah-qty-/).first();
    const addBtnTestId = await firstAddBtn.getAttribute("data-testid");
    const variantId = addBtnTestId?.replace("btn-tambah-qty-", "");

    await firstAddBtn.click();

    const qtyDisplay = page.getByTestId(`qty-${variantId}`);
    await expect(qtyDisplay).toHaveText("1");
  });
});
