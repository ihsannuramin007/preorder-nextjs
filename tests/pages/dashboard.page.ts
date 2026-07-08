import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly widgetOpenCampaign: Locator;
  readonly widgetPendingPayment: Locator;
  readonly widgetNeedVerification: Locator;
  readonly widgetOrdersToday: Locator;
  readonly widgetRevenue: Locator;
  readonly widgetTotalHpp: Locator;
  readonly widgetEstimatedProfit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.widgetOpenCampaign = page.getByTestId("widget-open-campaign");
    this.widgetPendingPayment = page.getByTestId("widget-pending-payment");
    this.widgetNeedVerification = page.getByTestId("widget-need-verification");
    this.widgetOrdersToday = page.getByTestId("widget-orders-today");
    this.widgetRevenue = page.getByTestId("widget-revenue");
    this.widgetTotalHpp = page.getByTestId("widget-total-hpp");
    this.widgetEstimatedProfit = page.getByTestId("widget-estimated-profit");
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async getWidgetValue(testId: string): Promise<string> {
    const widget = this.page.getByTestId(testId);
    return (await widget.textContent()) ?? "";
  }
}
