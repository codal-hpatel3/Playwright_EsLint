import { Page, Locator, expect } from "@playwright/test";
import { CommonActions } from "../utils/CommonActions";

export class CheckoutPage {
  readonly page: Page;
  readonly actions: CommonActions;

  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly successHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.actions = new CommonActions(page);

    this.firstName = page.locator("#first-name");
    this.lastName = page.locator("#last-name");
    this.postalCode = page.locator("#postal-code");
    this.continueButton = page.locator("#continue");
    this.finishButton = page.locator("#finish");
    this.successHeader = page.locator(".complete-header");
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.actions.safeFill(this.firstName, first);
    await this.actions.safeFill(this.lastName, last);
    await this.actions.safeFill(this.postalCode, zip);
    await this.actions.safeClick(this.continueButton);
  }

  async finish() {
    await this.actions.safeClick(this.finishButton);
  }

  async expectSuccess() {
    await expect(this.successHeader).toHaveText(/Thank you for your order!/i);
  }
}
