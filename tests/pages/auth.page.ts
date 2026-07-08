import { type Page, expect } from "@playwright/test";

export class LoginPage {
  readonly emailInput = this.page.getByTestId("txt-email");
  readonly passwordInput = this.page.getByTestId("txt-password");
  readonly loginButton = this.page.getByTestId("btn-masuk");
  readonly googleButton = this.page.getByTestId("btn-masuk-google");

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/masuk");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

export class RegisterPage {
  readonly businessNameInput = this.page.getByTestId("txt-nama-bisnis");
  readonly emailInput = this.page.getByTestId("txt-email");
  readonly passwordInput = this.page.getByTestId("txt-password");
  readonly registerButton = this.page.getByTestId("btn-daftar");

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/daftar");
  }

  async register(businessName: string, email: string, password: string) {
    await this.businessNameInput.fill(businessName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registerButton.click();
  }
}
