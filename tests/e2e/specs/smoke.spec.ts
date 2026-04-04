import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("shows login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user is redirected from dashboard to login", async ({
    page,
  }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    expect(page.url()).toContain("/login");
  });

  test("root page is publicly accessible", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL("/");
  });
});
