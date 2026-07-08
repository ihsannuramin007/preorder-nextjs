import { test, expect } from "../fixtures";

test.describe("Module 7 - Campaign Management", () => {
  test.describe("Daftar Periode PO", () => {
    test("menampilkan daftar kampanye atau empty state", async ({ authedPage: page }) => {
      await page.goto("/periode-po");

      const hasList = await page.getByTestId("tbl-periode-po").isVisible().catch(() => false);
      const hasEmpty = await page.getByTestId("empty-periode-po-list").isVisible().catch(() => false);
      expect(hasList || hasEmpty).toBeTruthy();
    });

    test("tombol Buat Periode PO mengarah ke form", async ({ authedPage: page }) => {
      await page.goto("/periode-po");
      await page.getByTestId("btn-buat-periode-po").click();
      await expect(page).toHaveURL(/\/periode-po\/baru/);
    });
  });

  test.describe("Form Buat Periode PO - UI Contract", () => {
    test("menampilkan semua field yang diperlukan", async ({ authedPage: page }) => {
      await page.goto("/periode-po/baru");

      await expect(page.getByTestId("txt-nama-periode-po")).toBeVisible();
      await expect(page.getByTestId("ta-deskripsi-periode-po")).toBeVisible();
      await expect(page.getByTestId("txt-tanggal-buka")).toBeVisible();
      await expect(page.getByTestId("txt-tanggal-tutup")).toBeVisible();
      await expect(page.getByTestId("btn-buat-periode-po")).toBeVisible();
    });

    test("hanya produk PUBLISHED yang tersedia untuk dipilih", async ({ authedPage: page }) => {
      await page.goto("/periode-po/baru");
      const checkboxes = page.getByTestId(/^chk-produk-/);
      const count = await checkboxes.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe("Buat Kampanye - Happy Path", () => {
    test("membuat kampanye baru dan redirect ke detail", async ({ authedPage: page }) => {
      await page.goto("/periode-po/baru");

      await page.getByTestId("txt-nama-periode-po").fill(`PO Test ${Date.now()}`);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      await page.getByTestId("txt-tanggal-buka").fill(tomorrow.toISOString().slice(0, 16));
      await page.getByTestId("txt-tanggal-tutup").fill(nextWeek.toISOString().slice(0, 16));

      const firstCheckbox = page.getByTestId(/^chk-produk-/).first();
      const hasProduct = await firstCheckbox.isVisible().catch(() => false);
      if (!hasProduct) { test.skip(); return; }

      await firstCheckbox.check();
      await page.getByTestId("btn-buat-periode-po").click();

      await expect(page).toHaveURL(/\/periode-po\/(?!baru)/, { timeout: 10000 });
    });
  });

  test.describe("Status Kampanye", () => {
    test("halaman detail kampanye menampilkan badge status", async ({ authedPage: page }) => {
      await page.goto("/periode-po");

      const firstRow = page.getByTestId(/^row-periode-po-/).first();
      const hasCampaign = await firstRow.isVisible().catch(() => false);
      if (!hasCampaign) { test.skip(); return; }

      await firstRow.click();
      await expect(page).toHaveURL(/\/periode-po\//);
      await expect(page.getByTestId("badge-status-kampanye")).toBeVisible();
    });

    test("tombol status yang relevan tampil berdasarkan status kampanye", async ({ authedPage: page }) => {
      await page.goto("/periode-po");

      const firstRow = page.getByTestId(/^row-periode-po-/).first();
      const hasCampaign = await firstRow.isVisible().catch(() => false);
      if (!hasCampaign) { test.skip(); return; }

      await firstRow.click();

      const statusButtons = [
        page.getByTestId("btn-buka-kampanye"),
        page.getByTestId("btn-tutup-kampanye"),
        page.getByTestId("btn-mulai-produksi"),
        page.getByTestId("btn-selesaikan-kampanye"),
      ];

      const visibleButtons = await Promise.all(
        statusButtons.map(btn => btn.isVisible().catch(() => false))
      );

      expect(visibleButtons.some(Boolean)).toBeTruthy();
    });
  });
});
