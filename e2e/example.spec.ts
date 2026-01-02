import { test, expect } from '@playwright/test';

/**
 * Example Playwright Test
 *
 * This is a simple test to verify Playwright is set up correctly.
 * Run with: npm run test:e2e
 */

test.describe('Example Tests', () => {
  test('should load the homepage', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check that page loaded
    await expect(page).toHaveURL('/');

    // Wait for page to be interactive
    await page.waitForLoadState('networkidle');

    // Basic assertion - page should have some content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');

    // Check page title contains expected text
    // Adjust this based on your actual page title
    await expect(page).toHaveTitle(/Grandpa Ron|Lawncare/);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });
});
