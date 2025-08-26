import { test, expect, request } from "@playwright/test";

test.describe("AutomationExercise API", () => {
  test.only("GET /productsList returns a non-empty products array", async () => {
    const api = await request.newContext({
      baseURL: "https://automationexercise.com/api"
    });

    const res = await api.get("/productsList");
    expect(res.status(), "Status should be 200").toBe(200);

    const text = await res.text();
    let body: any;
    try {
      body = JSON.parse(text);
    } catch {
      // Fallback if it's already an object (rare) or malformed
      body = text;
    }

    // Basic shape checks
    expect(typeof body).toBe("object");
    expect(body).toHaveProperty("products");
    expect(Array.isArray(body.products)).toBeTruthy();
    expect(body.products.length).toBeGreaterThan(0);

    // Spot-check first product
    const first = body.products[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");

    await api.dispose();
  });
});
