// utils/CommonActions.ts
import { Page, Locator, expect, type Frame } from "@playwright/test";
import * as fs from "fs/promises";

export class CommonActions {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ---------------- Waits ----------------
  /** Wait for element to be visible before interacting */
  async waitForVisible(locator: Locator, timeout = 5000) {
    await expect(locator).toBeVisible({ timeout });
  }

  /** Wait for element to be hidden */
  async waitForHidden(locator: Locator, timeout = 5000) {
    await expect(locator).toBeHidden({ timeout });
  }

  /** Wait for element to be enabled */
  async waitForEnabled(locator: Locator, timeout = 5000) {
    await expect(locator).toBeEnabled({ timeout });
  }

  /** Wait for network idle */
  async waitForNetworkIdle(timeout = 10000) {
    await this.page.waitForLoadState("networkidle", { timeout });
  }

  // ---------------- Navigation ----------------
  async goto(
    urlOrPath: string,
    wait: "load" | "domcontentloaded" | "networkidle" = "load"
  ) {
    await this.page.goto(urlOrPath);
    await this.page.waitForLoadState(wait);
  }

  async reload(wait: "load" | "domcontentloaded" | "networkidle" = "load") {
    await this.page.reload();
    await this.page.waitForLoadState(wait);
  }

  async goBack(wait: "load" | "domcontentloaded" | "networkidle" = "load") {
    await this.page.goBack();
    await this.page.waitForLoadState(wait);
  }

  async goForward(wait: "load" | "domcontentloaded" | "networkidle" = "load") {
    await this.page.goForward();
    await this.page.waitForLoadState(wait);
  }

  // ---------------- Interactions ----------------
  /** Click element safely (waits for visibility + enabled state) */
  async safeClick(locator: Locator) {
    await this.waitForVisible(locator);
    await this.waitForEnabled(locator);
    await locator.click();
  }

  /** Double-click */
  async dblClick(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.dblclick();
  }

  /** Right-click */
  async rightClick(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.click({ button: "right" });
  }

  /** Type text into an input (clears it first) */
  async safeType(locator: Locator, text: string) {
    await this.waitForVisible(locator);
    await locator.fill("");
    await locator.type(text);
  }

  /** Fill (no typing delay) */
  async safeFill(locator: Locator, text: string) {
    await this.waitForVisible(locator);
    await locator.fill(text);
  }

  /** Type with delay */
  async typeSlow(locator: Locator, text: string, delayMs = 50) {
    await this.waitForVisible(locator);
    await locator.type(text, { delay: delayMs });
  }

  /** Clear input */
  async clear(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.fill("");
  }

  /** Check / Uncheck */
  async check(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.check();
  }

  async uncheck(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.uncheck();
  }

  /** Selects */
  async selectByValue(locator: Locator, value: string | string[]) {
    await this.waitForVisible(locator);
    await locator.selectOption(value);
  }

  async selectByLabel(locator: Locator, label: string | string[]) {
    await this.waitForVisible(locator);
    await locator.selectOption({ label: label as string });
  }

  /** Hover / focus / blur */
  async hover(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.hover();
  }

  async focus(locator: Locator) {
    await this.waitForVisible(locator);
    await locator.focus();
  }

  async blur(locator: Locator) {
    await locator.evaluate((el: Element) => (el as HTMLElement).blur());
  }

  // ---------------- Keyboard & Mouse ----------------
  async press(key: string) {
    await this.page.keyboard.press(key);
  }

  async keyboardType(text: string, delayMs = 0) {
    await this.page.keyboard.type(text, { delay: delayMs });
  }

  // ---------------- Drag & Drop ----------------
  async dragAndDrop(source: Locator, target: Locator) {
    await this.waitForVisible(source);
    await this.waitForVisible(target);
    await source.dragTo(target);
  }

  // ---------------- Files: Upload / Download ----------------
  async uploadFile(fileInput: Locator, filePath: string | string[]) {
    await this.waitForVisible(fileInput);
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Clicks something that triggers a download and returns file info.
   * Usage:
   * const info = await actions.downloadThrough(() => actions.safeClick(exportBtn));
   */
  async downloadThrough(trigger: () => Promise<void>) {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      trigger(),
    ]);
    const path = await download.path();
    return { suggestedFilename: download.suggestedFilename(), path };
  }

  // ---------------- Screenshots ----------------
  /** Take screenshot with timestamp */
  async takeScreenshot(fileName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await this.page.screenshot({
      path: `screenshots/${fileName}-${timestamp}.png`,
      fullPage: true,
    });
  }

  async takeElementScreenshot(locator: Locator, fileName: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await locator.screenshot({
      path: `screenshots/${fileName}-${timestamp}.png`,
    });
  }

  // ---------------- Scrolling & Viewport ----------------
  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToTop() {
    await this.page.evaluate(() =>
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
    );
  }

  async scrollToBottom() {
    await this.page.evaluate(() =>
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "instant" as ScrollBehavior,
      })
    );
  }

  async setViewport(width: number, height: number) {
    await this.page.setViewportSize({ width, height });
  }

  // ---------------- Assertions ----------------
  /** Assert that text is present on page */
  async expectTextVisible(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async expectText(
    locator: Locator,
    expected: string | RegExp,
    timeout = 5000
  ) {
    await expect(locator).toHaveText(expected, { timeout });
  }

  async expectContains(
    locator: Locator,
    expected: string | RegExp,
    timeout = 5000
  ) {
    await expect(locator).toContainText(expected, { timeout });
  }

  async expectCount(locator: Locator, count: number, timeout = 5000) {
    await expect(locator).toHaveCount(count, { timeout });
  }

  async expectAttribute(
    locator: Locator,
    name: string,
    value: string | RegExp,
    timeout = 5000
  ) {
    await expect(locator).toHaveAttribute(name, value, { timeout });
  }

  async expectURLContains(part: string | RegExp, timeout = 5000) {
    await expect(this.page).toHaveURL(part, { timeout });
  }

  // ---------------- Dialogs ----------------
  async acceptNextDialog(promptText?: string) {
    this.page.once("dialog", async (d) => {
      await d.accept(promptText);
    });
  }

  async dismissNextDialog() {
    this.page.once("dialog", async (d) => {
      await d.dismiss();
    });
  }

  // ---------------- Frames ----------------
  frameByName(name: string): Frame | null {
    return this.page.frame({ name }) ?? null;
  }

  frameByUrlPart(urlPart: string): Frame | null {
    return this.page.frame({ url: new RegExp(urlPart) }) ?? null;
  }

  async inFrame<T>(
    frame: Frame | null,
    fn: (f: Frame) => Promise<T>
  ): Promise<T> {
    if (!frame) throw new Error("Frame not found");
    return fn(frame);
  }

  // ---------------- New tabs / popups ----------------
  async withNewPage(trigger: () => Promise<void>) {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      trigger(),
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  // ---------------- Network: stub / spy ----------------
  async stub(
    url: string | RegExp,
    body: unknown,
    status = 200,
    contentType = "application/json"
  ) {
    await this.page.route(url, async (route) => {
      await route.fulfill({
        status,
        contentType,
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
    });
  }

  async spy(url: string | RegExp) {
    const calls: { url: string; method: string; postData?: string }[] = [];
    await this.page.route(url, async (route) => {
      const req = route.request();
      calls.push({
        url: req.url(),
        method: req.method(),
        postData: req.postData() ?? undefined,
      });
      await route.continue();
    });
    return calls;
  }

  async unroute(url: string | RegExp) {
    await this.page.unroute(url);
  }

  // ---------------- Storage & Cookies ----------------
  async setLocalStorage(key: string, value: string) {
    await this.page.evaluate(
      ([k, v]) => localStorage.setItem(k, v),
      [key, value]
    );
  }

  async getLocalStorage(key: string) {
    return this.page.evaluate((k) => localStorage.getItem(k as string), key);
  }

  async clearLocalStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }

  async setSessionStorage(key: string, value: string) {
    await this.page.evaluate(
      ([k, v]) => sessionStorage.setItem(k, v),
      [key, value]
    );
  }

  async getSessionStorage(key: string) {
    return this.page.evaluate((k) => sessionStorage.getItem(k as string), key);
  }

  async clearSessionStorage() {
    await this.page.evaluate(() => sessionStorage.clear());
  }

  async readJson<T>(path: string): Promise<T> {
    const rawData = await fs.readFile(path, "utf-8");
    return JSON.parse(rawData) as T;
  }

  async addCookie(name: string, value: string, url?: string) {
    await this.page
      .context()
      .addCookies([{ name, value, url: url ?? this.page.url() }]);
  }

  async getCookies() {
    return this.page.context().cookies();
  }

  async clearCookies() {
    // Best practice is new context per test; included for completeness:
    // Playwright does not have a direct "clearCookies" on context in all versions.
    const ctx = this.page.context();
    const cookies = await ctx.cookies();
    if (cookies.length) {
      // Workaround: create a new context in test setup for isolation.
      await this.page.context().clearCookies?.();
    }
  }

  // ---------------- Query helpers ----------------
  byTestId(id: string) {
    return this.page.getByTestId(id);
  }

  byRole(
    role: Parameters<Page["getByRole"]>[0],
    options?: Parameters<Page["getByRole"]>[1]
  ) {
    return this.page.getByRole(role, options as any);
  }

  byText(text: string | RegExp) {
    return this.page.getByText(text);
  }

  // ---------------- Utilities ----------------
  /** Generate a random string (useful for dummy data) */
  generateRandomString(length = 6): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
