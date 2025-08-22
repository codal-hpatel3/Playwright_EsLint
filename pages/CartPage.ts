import { Page, Locator, expect } from "@playwright/test";
import { CommonActions } from "../utils/CommonActions";

export class CartPage {
  readonly page: Page;
  readonly actions: CommonActions;

  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actions = new CommonActions(page);

    this.items = page.locator(".cart_item");
    this.checkoutButton = page.locator("#checkout");
  }

  async expectItemCount(n: number) {
    await expect(this.items).toHaveCount(n);
  }

  async checkout() {
    await this.actions.safeClick(this.checkoutButton);
  }
}
