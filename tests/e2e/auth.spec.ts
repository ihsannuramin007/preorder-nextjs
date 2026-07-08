import { test, expect } from "@playwright/test";
import { LoginPage, RegisterPage } from "../pages/auth.page";
import { testUsers } from "../data/users";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Module 1 - Authentication", () => {
  test.describe("Halaman Login - UI Contract", () => {
    test("menampilkan semua elemen UI yang diperlukan", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.googleButton).toBeVisible();
      await expect(page.getByTestId("link-lupa-password")).toBeVisible();
      await expect(page.getByTestId("link-daftar")).toBeVisible();
    });

    test("link Lupa Password mengarah ke halaman reset", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await page.getByTestId("link-lupa-password").click();
      await expect(page).toHaveURL(/lupa-password/);
    });

    test("link Daftar mengarah ke halaman registrasi", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await page.getByTestId("link-daftar").click();
      await expect(page).toHaveURL(/daftar/);
    });
  });

  test.describe("Login - Happy Path", () => {
    test("berhasil login dan redirect ke dashboard", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.admin.email, testUsers.admin.password);
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    });
  });

  test.describe("Login - Negative Cases", () => {
    test("menampilkan error jika email tidak terdaftar", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login("tidakada@email.com", "password123");
      await expect(page.getByRole("status").or(page.locator("[data-sonner-toast]"))).toBeVisible({ timeout: 5000 });
    });

    test("menampilkan error jika password salah", async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(testUsers.admin.email, "passwordsalah999");
      await expect(page.getByRole("status").or(page.locator("[data-sonner-toast]"))).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Halaman Register - UI Contract", () => {
    test("menampilkan semua elemen form registrasi", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();

      await expect(registerPage.businessNameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.registerButton).toBeVisible();
      await expect(page.getByTestId("link-masuk")).toBeVisible();
    });

    test("link Masuk mengarah ke halaman login", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await page.getByTestId("link-masuk").click();
      await expect(page).toHaveURL(/masuk/);
    });
  });

  test.describe("Register - Validasi", () => {
    test("register dengan data valid menampilkan konfirmasi email", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.register(
        "Toko Test Playwright",
        `test-${Date.now()}@pohub.app`,
        "password123"
      );
      await expect(page.getByText(/cek email/i)).toBeVisible({ timeout: 5000 });
    });
  });
});
