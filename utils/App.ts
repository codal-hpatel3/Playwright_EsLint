import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";

type App = {
  login: LoginPage;
  inventory: InventoryPage;
  cart: CartPage;
  checkout: CheckoutPage;
};

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    let _login: LoginPage | undefined;
    let _inventory: InventoryPage | undefined;
    let _cart: CartPage | undefined;
    let _checkout: CheckoutPage | undefined;

    const app = {
      get login() {
        return (_login ??= new LoginPage(page));
      },
      get inventory() {
        return (_inventory ??= new InventoryPage(page));
      },
      get cart() {
        return (_cart ??= new CartPage(page));
      },
      get checkout() {
        return (_checkout ??= new CheckoutPage(page));
      },
    };

    await use(app);
  },
});

export const expect = base.expect;
