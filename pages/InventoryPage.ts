import { Page, Locator, expect } from "@playwright/test";
import { CommonActions } from "../utils/CommonActions";

export class InventoryPage {
  readonly page: Page;
  readonly actions: CommonActions;

  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly addToCartButtons: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortSelect: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actions = new CommonActions(page);

    this.title = page.locator(".title");
    this.items = page.locator(".inventory_item");
    this.itemNames = page.locator(".inventory_item_name");
    this.addToCartButtons = page.locator('button:has-text("Add to cart")');
    this.cartLink = page.locator(".shopping_cart_link");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.sortSelect = page.locator(".product_sort_container");
    this.menuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async expectLoaded() {
    await expect(this.title).toHaveText("Products");
  }

  async addFirstNItems(n: number) {
    const count = await this.addToCartButtons.count();
    for (let i = 0; i < Math.min(n, count); i++) {
      await this.actions.safeClick(this.addToCartButtons.nth(i));
    }
  }

  async openCart() {
    await this.actions.safeClick(this.cartLink);
  }

  async sortBy(option: "az" | "za" | "lohi" | "hilo") {
    const map = { az: "az", za: "za", lohi: "lohi", hilo: "hilo" };
    await this.actions.selectByValue(this.sortSelect, map[option]);
  }

  async getVisiblePrices(): Promise<number[]> {
    const priceTexts = await this.page
      .locator(".inventory_item_price")
      .allTextContents();
    return priceTexts.map((t) => Number(t.replace("$", "").trim()));
  }

  async logout() {
    await this.actions.safeClick(this.menuButton);
    await this.actions.safeClick(this.logoutLink);
  }
}
