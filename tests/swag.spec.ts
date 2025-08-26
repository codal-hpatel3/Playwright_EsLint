import { test, expect } from "../utils/App";
import { readJSON } from "../utils/JsonReader";

const data: Record<string, any> = readJSON("fixtures/testData.json");

test.describe("Sauce Demo - Inline test data", () => {
  test.beforeEach(async ({ app }) => {
    await app.login.goto();
  });

  test("1) Successful login lands on Products @smoke", async ({ app }) => {
    await app.login.login(
      data.users.validUser.username,
      data.users.validUser.password
    );
    await app.inventory.expectLoaded();
  });

  test("2) Locked user shows error banner @regession", async ({ app }) => {
    await app.login.login(
      data.users.lockedUser.username,
      data.users.lockedUser.password
    );
    await app.login.expectLoginError();
  });

  test("3) Add multiple items -> cart badge & cart contents @smoke", async ({
    app,
  }) => {
    await app.login.login(
      data.users.validUser.username,
      data.users.validUser.password
    );

    await app.inventory.expectLoaded();
    await app.inventory.addFirstNItems(data.products.countToAdd);

    await expect(app.inventory.cartBadge).toHaveText(
      String(data.products.countToAdd)
    );

    await app.inventory.openCart();
    await app.cart.expectItemCount(data.products.countToAdd);
  });

  test("4) Sort by Price (low->high) @smoke", async ({ app }) => {
    await app.login.login(
      data.users.validUser.username,
      data.users.validUser.password
    );

    await app.inventory.expectLoaded();

    await app.inventory.sortBy("lohi");
    const prices = await app.inventory.getVisiblePrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("5) Full checkout flow", async ({ app }) => {
    await app.login.login(
      data.users.validUser.username,
      data.users.validUser.password
    );

    await app.inventory.expectLoaded();
    await app.inventory.addFirstNItems(1);
    await app.inventory.openCart();

    await app.cart.expectItemCount(1);
    await app.cart.checkout();

    await app.checkout.fillInfo(
      data.checkout.firstName,
      data.checkout.lastName,
      data.checkout.postalCode
    );
    await app.checkout.finish();
    await app.checkout.expectSuccess();
  });
});
