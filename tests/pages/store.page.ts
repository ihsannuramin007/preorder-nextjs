import { Page, Locator } from "@playwright/test";

export class StorePage {
  readonly page: Page;
  readonly namaTokoInput: Locator;
  readonly slugTokoInput: Locator;
  readonly deskripsiTokoTextarea: Locator;
  readonly whatsappInput: Locator;
  readonly instagramInput: Locator;
  readonly simpanButton: Locator;
  readonly salinUrlButton: Locator;
  readonly bukaTokoButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.namaTokoInput = page.getByTestId("txt-nama-toko");
    this.slugTokoInput = page.getByTestId("txt-slug-toko");
    this.deskripsiTokoTextarea = page.getByTestId("ta-deskripsi-toko");
    this.whatsappInput = page.getByTestId("txt-whatsapp");
    this.instagramInput = page.getByTestId("txt-instagram");
    this.simpanButton = page.getByTestId("btn-simpan-toko");
    this.salinUrlButton = page.getByTestId("btn-salin-url-toko");
    this.bukaTokoButton = page.getByTestId("btn-buka-toko");
  }

  async goto() {
    await this.page.goto("/toko");
  }

  async fillAndSave(data: { nama?: string; deskripsi?: string; whatsapp?: string; instagram?: string }) {
    if (data.nama) await this.namaTokoInput.fill(data.nama);
    if (data.deskripsi) await this.deskripsiTokoTextarea.fill(data.deskripsi);
    if (data.whatsapp) await this.whatsappInput.fill(data.whatsapp);
    if (data.instagram) await this.instagramInput.fill(data.instagram);
    await this.simpanButton.click();
  }
}
