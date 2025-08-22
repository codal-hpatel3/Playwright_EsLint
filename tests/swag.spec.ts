import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { CommonActions } from "../utils/CommonActions";

const USERS = {
  valid: { username: "standard_user", password: "secret_sauce" },
  locked: { username: "locked_out_user", password: "secret_sauce" },
};

const CHECKOUT = {
  firstName: "Himen",
  lastName: "Patel",
  postalCode: "390012",
};
const PRODUCTS = { countToAdd: 2 };

test.describe("Sauce Demo - Inline test data", () => {
  /** @groups ui */
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
  });

  test('1) Successful login lands on Products @smoke', async ({ page }) => {
    const login = new LoginPage(page);
    const actions = new CommonActions(page);
    await login.login(USERS.valid.username, USERS.valid.password);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
  });

  test("2) Locked user shows error banner @regession", async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(USERS.locked.username, USERS.locked.password);
    await login.expectLoginError();
  });

  test("3) Add multiple items -> cart badge & cart contents @smoke", async ({
    page,
  }) => {
    const login = new LoginPage(page);
    await login.login(USERS.valid.username, USERS.valid.password);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addFirstNItems(PRODUCTS.countToAdd);

    await expect(inventory.cartBadge).toHaveText(String(PRODUCTS.countToAdd));

    await inventory.openCart();
    const cart = new CartPage(page);
    await cart.expectItemCount(PRODUCTS.countToAdd);
  });

  test("4) Sort by Price (low->high) @smoke", async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(USERS.valid.username, USERS.valid.password);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();

    await inventory.sortBy("lohi");
    const prices = await inventory.getVisiblePrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("5) Full checkout flow", async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(USERS.valid.username, USERS.valid.password);

    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addFirstNItems(1);
    await inventory.openCart();

    const cart = new CartPage(page);
    await cart.expectItemCount(1);
    await cart.checkout();

    const checkout = new CheckoutPage(page);
    await checkout.fillInfo(
      CHECKOUT.firstName,
      CHECKOUT.lastName,
      CHECKOUT.postalCode
    );
    await checkout.finish();
    await checkout.expectSuccess();
  });
});
