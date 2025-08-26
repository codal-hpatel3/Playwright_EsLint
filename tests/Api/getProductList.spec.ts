import { test, expect, request } from "@playwright/test";

test.describe("AutomationExercise API", () => {
  test("GET /productsList returns a non-empty products array", async () => {
    const api = await request.newContext({
      baseURL: "https://automationexercise.com/api",
    });

    const res = await api.get("/productsList");
    expect(res.status(), "Status should be 200").toBe(200);
  });
});
