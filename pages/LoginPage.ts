// pages/LoginPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { CommonActions } from "../utils/CommonActions";

export class LoginPage {
  readonly page: Page;
  readonly a: CommonActions;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.a = new CommonActions(page);
    this.username = page.locator("#user-name");
    this.password = page.locator("#password");
    this.loginButton = page.locator("#login-button");
    this.error = page.locator('[data-test="error"]');
  }

  /**
   * Navigate to the SauceDemo login page.
   * @returns {Promise<void>}
   */
  async goto(): Promise<void> {
    await this.a.goto("/");
  }

  /**
   * Perform login with given username and password.
   * @param {string} user - The username to enter
   * @param {string} pass - The password to enter
   * @returns {Promise<void>}
   */
  async login(user: string, pass: string): Promise<void> {
    await this.a.safeFill(this.username, user);
    await this.a.safeFill(this.password, pass);
    await this.a.safeClick(this.loginButton);
  }

  /**
   * Assert that login error banner is visible.
   * Useful for negative login test cases.
   * @returns {Promise<void>}
   */
  async expectLoginError(): Promise<void> {
    await expect(this.error).toBeVisible();
  }
}
