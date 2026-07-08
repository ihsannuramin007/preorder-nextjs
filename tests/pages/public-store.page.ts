import { type Page } from "@playwright/test";

export class PublicOrderFormPage {
  readonly loadingState = this.page.getByTestId("loading-form-pesan");
  readonly customerNameInput = this.page.getByTestId("txt-nama-pembeli");
  readonly customerPhoneInput = this.page.getByTestId("txt-telpon");
  readonly customerAddressInput = this.page.getByTestId("ta-alamat");
  readonly customerNotesInput = this.page.getByTestId("txt-catatan");
  readonly submitButton = this.page.getByTestId("btn-kirim-pesanan");

  constructor(private page: Page) {}

  async goto(slug: string, campaignId: string) {
    await this.page.goto(`/${slug}/pesan/${campaignId}`);
  }

  addQtyButton(variantId: string) {
    return this.page.getByTestId(`btn-tambah-qty-${variantId}`);
  }

  removeQtyButton(variantId: string) {
    return this.page.getByTestId(`btn-kurang-qty-${variantId}`);
  }

  qtyDisplay(variantId: string) {
    return this.page.getByTestId(`qty-${variantId}`);
  }

  async fillCustomerInfo(data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes?: string;
  }) {
    await this.customerNameInput.fill(data.customerName);
    await this.customerPhoneInput.fill(data.customerPhone);
    await this.customerAddressInput.fill(data.customerAddress);
    if (data.customerNotes) {
      await this.customerNotesInput.fill(data.customerNotes);
    }
  }
}
