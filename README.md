# # 🚀 Playwright TypeScript Framework with POM, ESLint & Prettier

This project is a **Playwright + TypeScript** test automation framework built using the **Page Object Model (POM)** pattern.  
It comes preconfigured with **ESLint** + **Prettier** to enforce **clean code, consistent style, and best practices**.

---

## 📂 Project Structure

Playwright_Framework/
│
├── pages/ # Page Object classes (LoginPage, InventoryPage, etc.)
├── tests/ # Test files (.spec.ts)
├── fixtures/ # Test data (JSON or static data)
├── common/ # Common reusable helpers (CommonActions.ts)
├── playwright.config.ts # Playwright test runner configuration
├── tsconfig.json # TypeScript configuration
├── eslint.config.js/mjs # ESLint flat config
├── .prettierrc # Prettier rules
└── README.md # Project documentation

---

## 🛠️ Installation

Clone the repo and install dependencies:

git clone <your-repo-url>
cd Playwright_Framework
npm install

## ▶️ Running Tests

npx playwright test

## 🧹 Linting & Formatting

🔎 Check lint issues
npx eslint . --ext .ts

🛠️ Auto-fix lint issues
npx eslint . --ext .ts --fix

🎨 Format with Prettier
npx prettier --write .

## 📏 ESLint & Prettier

- ESLint catches errors and enforces rules such as:
- Missing await in Playwright actions (playwright/missing-playwright-await)
- Unused variables (@typescript-eslint/no-unused-vars)
- Forgotten promises (@typescript-eslint/no-floating-promises)
- Prettier enforces consistent formatting (quotes, semicolons, indentation, etc.)
- Integration: ESLint is configured to run Prettier as a rule (prettier/prettier).

## 🏗️ Page Object Model (POM)

- pages/LoginPage.ts → login actions
- pages/InventoryPage.ts → product list/cart interactions
- pages/CartPage.ts → cart operations
- pages/CheckoutPage.ts → checkout steps
- This design makes tests reusable, readable, and maintainable.

## ✨ Benefits

- Strong type safety with TypeScript
- Enforced code quality & style (ESLint + Prettier)
- Prevents common mistakes (like missing await)
- Reusable Page Object Model structure
- Ready for CI/CD integration
