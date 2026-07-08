import { test as setup, expect } from "@playwright/test";
import { testUsers } from "../data/users";
import path from "path";

const authFile = path.join(__dirname, "../fixtures/.auth/user.json");

setup("authenticate", async ({ page }) => {
  await page.goto("/masuk");
  await page.getByTestId("txt-email").fill(testUsers.admin.email);
  await page.getByTestId("txt-password").fill(testUsers.admin.password);
  await page.getByTestId("btn-masuk").click();

  await expect(page).toHaveURL(/\/dashboard/);
  await page.context().storageState({ path: authFile });
});
