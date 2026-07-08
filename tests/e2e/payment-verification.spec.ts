import { test, expect } from "../fixtures";

test.describe("Module 11 - Payment Verification", () => {
  async function goToOrderWithPaymentReview(page: any) {
    await page.goto("/pesanan");

    const rows = page.getByTestId(/^row-pesanan-/);
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      await rows.nth(i).click();

      const hasVerification = await page
        .getByTestId("btn-setujui-pembayaran")
        .isVisible()
        .catch(() => false);

      if (hasVerification) return true;

      await page.goto("/pesanan");
    }

    return false;
  }

  test("kartu verifikasi pembayaran tampil saat ada bukti bayar", async ({ authedPage: page }) => {
    const found = await goToOrderWithPaymentReview(page);
    if (!found) { test.skip(); return; }

    await expect(page.getByTestId("btn-setujui-pembayaran")).toBeVisible();
    await expect(page.getByTestId("btn-tolak-pembayaran")).toBeVisible();
  });

  test("tombol lihat bukti pembayaran tersedia", async ({ authedPage: page }) => {
    const found = await goToOrderWithPaymentReview(page);
    if (!found) { test.skip(); return; }

    await expect(page.getByTestId("btn-lihat-bukti-bayar")).toBeVisible();
  });

  test("menyetujui pembayaran mengubah tampilan halaman", async ({ authedPage: page }) => {
    const found = await goToOrderWithPaymentReview(page);
    if (!found) { test.skip(); return; }

    await page.getByTestId("btn-setujui-pembayaran").click();

    await expect(page.getByTestId("btn-setujui-pembayaran")).not.toBeVisible({ timeout: 5000 });
  });

  test("modal tolak muncul saat klik tombol Tolak", async ({ authedPage: page }) => {
    const found = await goToOrderWithPaymentReview(page);
    if (!found) { test.skip(); return; }

    await page.getByTestId("btn-tolak-pembayaran").click();
    await expect(page.getByTestId("modal-tolak-pembayaran")).toBeVisible();
    await expect(page.getByTestId("ta-alasan-penolakan")).toBeVisible();
    await expect(page.getByTestId("btn-konfirmasi-tolak")).toBeVisible();
  });

  test("tidak bisa tolak pembayaran tanpa mengisi alasan", async ({ authedPage: page }) => {
    const found = await goToOrderWithPaymentReview(page);
    if (!found) { test.skip(); return; }

    await page.getByTestId("btn-tolak-pembayaran").click();
    await expect(page.getByTestId("modal-tolak-pembayaran")).toBeVisible();

    await page.getByTestId("btn-konfirmasi-tolak").click();

    await expect(page.getByTestId("modal-tolak-pembayaran")).toBeVisible();
  });

  test("menolak pembayaran dengan alasan", async ({ authedPage: page }) => {
    const found = await goToOrderWithPaymentReview(page);
    if (!found) { test.skip(); return; }

    await page.getByTestId("btn-tolak-pembayaran").click();
    await page.getByTestId("ta-alasan-penolakan").fill("Jumlah transfer tidak sesuai");
    await page.getByTestId("btn-konfirmasi-tolak").click();

    await expect(page.getByTestId("modal-tolak-pembayaran")).not.toBeVisible({ timeout: 5000 });
  });
});
