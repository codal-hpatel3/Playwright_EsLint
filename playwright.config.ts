import { defineConfig } from "@playwright/test";
import { OrtoniReportConfig } from "ortoni-report";
import * as os from "os";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */

const reportConfig: OrtoniReportConfig = {
  open: process.env.CI ? "never" : "always", // default to never
  folderPath: "report-db",
  filename: "index.html",
  title: "Codal Test Report",
  showProject: !true,
  projectName: "Ortoni-Report",
  testType: "Functional",
  authorName: os.userInfo().username,
  base64Image: false,
  stdIO: false,
  preferredTheme: "light",
  chartType: "doughnut", //doughnut | pie
  meta: {
    project: "Playwright",
    version: "3",
    description: "Playwright test report",
    testCycle: "04121994",
    release: "0.3",
    platform: os.type(),
  },
};

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  /* Run tests in files in parallel */
  fullyParallel: true,
  reporter: [
    [`html`, { outputFolder: "html-report", open: "never" }],
    ["ortoni-report", reportConfig],
  ],
  use: {
    baseURL: "https://www.saucedemo.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on",
    browserName: "chromium",
    headless: false,
  },
});
