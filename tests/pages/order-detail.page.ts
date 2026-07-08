import { Page, Locator } from "@playwright/test";

export class OrderDetailPage {
  readonly page: Page;
  readonly customerName: Locator;
  readonly statusBadge: Locator;
  readonly totalDisplay: Locator;
  readonly ubahStatusButton: Locator;
  readonly lihatBuktiBayarButton: Locator;
  readonly setujuiButton: Locator;
  readonly tolakButton: Locator;
  readonly modalTolak: Locator;
  readonly alasanPenolakanTextarea: Locator;
  readonly konfirmasiTolakButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.customerName = page.getByTestId("order-detail-customer-name");
    this.statusBadge = page.getByTestId("badge-status-pesanan");
    this.totalDisplay = page.getByTestId("order-detail-total");
    this.ubahStatusButton = page.getByTestId("btn-ubah-status-pesanan");
    this.lihatBuktiBayarButton = page.getByTestId("btn-lihat-bukti-bayar");
    this.setujuiButton = page.getByTestId("btn-setujui-pembayaran");
    this.tolakButton = page.getByTestId("btn-tolak-pembayaran");
    this.modalTolak = page.getByTestId("modal-tolak-pembayaran");
    this.alasanPenolakanTextarea = page.getByTestId("ta-alasan-penolakan");
    this.konfirmasiTolakButton = page.getByTestId("btn-konfirmasi-tolak");
  }

  async goto(id: string) {
    await this.page.goto(`/pesanan/${id}`);
  }

  async rejectPayment(reason: string) {
    await this.tolakButton.click();
    await this.alasanPenolakanTextarea.fill(reason);
    await this.konfirmasiTolakButton.click();
  }
}
