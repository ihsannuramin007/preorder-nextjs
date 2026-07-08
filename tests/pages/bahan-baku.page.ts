import { type Page, expect } from "@playwright/test";

export class BahanBakuListPage {
  readonly list = this.page.getByTestId("tbl-bahan-baku");
  readonly addButton = this.page.getByTestId("btn-tambah-bahan-baku");
  readonly emptyState = this.page.getByTestId("empty-bahan-baku-list");
  readonly loading = this.page.getByTestId("loading-bahan-baku");

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/bahan-baku");
  }

  rowById(id: string) {
    return this.page.getByTestId(`row-bahan-baku-${id}`);
  }
}

export class BahanBakuFormPage {
  readonly nameInput = this.page.getByTestId("txt-nama-bahan");
  readonly unitSelect = this.page.getByTestId("ddl-satuan");
  readonly purchaseQtyInput = this.page.getByTestId("txt-jumlah-pembelian");
  readonly purchasePriceInput = this.page.getByTestId("txt-harga-pembelian");
  readonly saveButton = this.page.getByTestId("btn-simpan-bahan-baku");
  readonly deleteButton = this.page.getByTestId("btn-hapus-bahan-baku");
  readonly deleteModal = this.page.getByTestId("modal-hapus-bahan-baku");
  readonly confirmDeleteButton = this.page.getByTestId("modal-hapus-bahan-baku-btn-konfirmasi");

  constructor(private page: Page) {}

  async gotoNew() {
    await this.page.goto("/bahan-baku/baru");
  }

  async gotoEdit(id: string) {
    await this.page.goto(`/bahan-baku/${id}`);
  }

  async fillForm(data: { name: string; purchaseQty: string; purchasePrice: string }) {
    await this.nameInput.fill(data.name);
    await this.purchaseQtyInput.fill(data.purchaseQty);
    await this.purchasePriceInput.fill(data.purchasePrice);
  }
}
