import { type Page } from "@playwright/test";

export class ProdukListPage {
  readonly list = this.page.getByTestId("tbl-produk");
  readonly addButton = this.page.getByTestId("btn-buat-produk");
  readonly emptyState = this.page.getByTestId("empty-produk-list");
  readonly loading = this.page.getByTestId("loading-produk");

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/produk");
  }

  rowById(id: string) {
    return this.page.getByTestId(`row-produk-${id}`);
  }
}
