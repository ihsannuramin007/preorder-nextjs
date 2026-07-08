import { Page, Locator } from "@playwright/test";

export class CampaignListPage {
  readonly page: Page;
  readonly table: Locator;
  readonly emptyState: Locator;
  readonly buatButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.getByTestId("tbl-periode-po");
    this.emptyState = page.getByTestId("empty-periode-po-list");
    this.buatButton = page.getByTestId("btn-buat-periode-po");
  }

  async goto() {
    await this.page.goto("/periode-po");
  }

  getRow(id: string) {
    return this.page.getByTestId(`row-periode-po-${id}`);
  }
}

export class CampaignFormPage {
  readonly page: Page;
  readonly namaInput: Locator;
  readonly deskripsiTextarea: Locator;
  readonly tanggalBukaInput: Locator;
  readonly tanggalTutupInput: Locator;
  readonly buatButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.namaInput = page.getByTestId("txt-nama-periode-po");
    this.deskripsiTextarea = page.getByTestId("ta-deskripsi-periode-po");
    this.tanggalBukaInput = page.getByTestId("txt-tanggal-buka");
    this.tanggalTutupInput = page.getByTestId("txt-tanggal-tutup");
    this.buatButton = page.getByTestId("btn-buat-periode-po");
  }

  async goto() {
    await this.page.goto("/periode-po/baru");
  }

  getProductCheckbox(productId: string) {
    return this.page.getByTestId(`chk-produk-${productId}`);
  }
}

export class CampaignDetailPage {
  readonly page: Page;
  readonly statusBadge: Locator;
  readonly bukaButton: Locator;
  readonly tutupButton: Locator;
  readonly mulaiProduksiButton: Locator;
  readonly selesaikanButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.statusBadge = page.getByTestId("badge-status-kampanye");
    this.bukaButton = page.getByTestId("btn-buka-kampanye");
    this.tutupButton = page.getByTestId("btn-tutup-kampanye");
    this.mulaiProduksiButton = page.getByTestId("btn-mulai-produksi");
    this.selesaikanButton = page.getByTestId("btn-selesaikan-kampanye");
  }

  async goto(id: string) {
    await this.page.goto(`/periode-po/${id}`);
  }
}
