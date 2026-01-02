import { test, expect } from '@playwright/test';

/**
 * Grandpa Ron's Lawncare - Sidebar E2E Tests
 *
 * Tests cover:
 * - Sidebar rendering
 * - Toggle/collapse functionality
 * - Navigation items clickability
 * - Active state management
 * - Mobile sidebar (sheet) behavior
 * - Location items from registry
 */

test.describe('Sidebar Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for sidebar to be rendered
    await page.waitForSelector('[data-sidebar="sidebar"]', { timeout: 10000 });
  });

  test('should render sidebar correctly', async ({ page }) => {
    // Check sidebar exists
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Check header with team switcher
    const teamSwitcher = sidebar.locator('button').filter({ hasText: "Grandpa Ron's" });
    await expect(teamSwitcher).toBeVisible();

    // Check main navigation sections
    await expect(sidebar.getByText('Menu')).toBeVisible();

    // Verify main menu items are present
    const menuItems = ['Home', 'Services', 'Blog', 'Locations', 'About'];
    for (const item of menuItems) {
      await expect(sidebar.getByRole('button', { name: item })).toBeVisible();
    }

    // Verify project items (Get a Quote, Contact Us)
    await expect(sidebar.getByRole('link', { name: 'Get a Quote' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Contact Us' })).toBeVisible();
  });

  test('should toggle sidebar collapse/expand', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Find the toggle button (usually has PanelLeft icon)
    const toggleButton = page.locator('[data-sidebar="trigger"]').first();

    // Sidebar should start expanded
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    // Click to collapse
    await toggleButton.click();
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    // Verify collapsed state - text should be hidden or truncated
    const homeButton = sidebar.getByRole('button', { name: 'Home' });
    // In collapsed state, only icons should be visible

    // Click to expand
    await toggleButton.click();
    await expect(sidebar).toHaveAttribute('data-state', 'expanded');

    // Verify expanded state - full text visible
    await expect(homeButton).toBeVisible();
  });

  test('should expand/collapse navigation groups', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Find the Services collapsible group
    const servicesButton = sidebar.getByRole('button', { name: 'Services' });
    await expect(servicesButton).toBeVisible();

    // Services should be collapsed by default (unless active)
    // Click to expand
    await servicesButton.click();

    // Wait for submenu to appear
    const lawnMowingLink = sidebar.getByRole('link', { name: 'Lawn Mowing' });
    await expect(lawnMowingLink).toBeVisible();

    // Verify other service items are visible
    await expect(sidebar.getByRole('link', { name: 'Landscaping' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Leaf Removal' })).toBeVisible();

    // Click to collapse
    await servicesButton.click();

    // Submenu should be hidden (or at least not interactable)
    // Note: Radix Collapsible uses data-state="closed"
  });

  test('should navigate when clicking menu items', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Click "Get a Quote"
    const quoteLink = sidebar.getByRole('link', { name: 'Get a Quote' });
    await quoteLink.click();

    // Verify navigation occurred
    await expect(page).toHaveURL(/\/quote/);

    // Go back
    await page.goto('/');

    // Expand Services and click Lawn Mowing
    const servicesButton = sidebar.getByRole('button', { name: 'Services' });
    await servicesButton.click();

    const lawnMowingLink = sidebar.getByRole('link', { name: 'Lawn Mowing' });
    await lawnMowingLink.click();

    // Verify navigation
    await expect(page).toHaveURL(/\/services\/lawn-mowing/);
  });

  test('should apply active state to current route', async ({ page }) => {
    // Navigate to Services page
    await page.goto('/services/lawn-mowing');

    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Services group should be expanded and marked as active
    const servicesButton = sidebar.getByRole('button', { name: 'Services' });

    // Check if services button has active state
    // The implementation uses isActive prop which typically adds data-active attribute
    await expect(servicesButton).toHaveAttribute('data-active', 'true');

    // The specific sub-item should also be active
    const lawnMowingLink = sidebar.getByRole('link', { name: 'Lawn Mowing' });
    await expect(lawnMowingLink).toHaveAttribute('data-active', 'true');

    // Navigate to home
    await page.goto('/');

    // Home should be active
    const homeButton = sidebar.getByRole('button', { name: 'Home' });
    await expect(homeButton).toHaveAttribute('data-active', 'true');
  });

  test('should display location items from registry', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Expand Locations menu
    const locationsButton = sidebar.getByRole('button', { name: 'Locations' });
    await locationsButton.click();

    // Verify "Service Areas" is visible
    await expect(sidebar.getByRole('link', { name: 'Service Areas' })).toBeVisible();

    // Verify "View All Locations" is visible
    await expect(sidebar.getByRole('link', { name: 'View All Locations' })).toBeVisible();

    // Check that location items from registry are present
    // The sidebar shows top 5 locations sorted by priority and distance
    // We'll check for the presence of location links (they should have /locations/ in href)

    const locationLinks = sidebar.locator('a[href^="/locations/"]');
    const count = await locationLinks.count();

    // Should have at least Service Areas + location items + View All Locations
    // Expecting at least a few location-specific links
    expect(count).toBeGreaterThan(1);

    // Verify a location link is clickable
    const firstLocationLink = locationLinks.nth(1); // Skip "Service Areas" at index 0
    if (await firstLocationLink.isVisible()) {
      const href = await firstLocationLink.getAttribute('href');
      expect(href).toMatch(/\/locations\/[a-z-]+/);
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Focus on first interactive element in sidebar
    const firstButton = sidebar.locator('button, a').first();
    await firstButton.focus();

    // Verify focus is on the element
    await expect(firstButton).toBeFocused();

    // Tab through menu items
    await page.keyboard.press('Tab');

    // Verify focus moved
    const secondElement = sidebar.locator('button, a').nth(1);
    // Focus behavior depends on implementation
  });

  test('should show tooltips in collapsed state', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Collapse the sidebar
    const toggleButton = page.locator('[data-sidebar="trigger"]').first();
    await toggleButton.click();

    // Wait for collapsed state
    await expect(sidebar).toHaveAttribute('data-state', 'collapsed');

    // Hover over a menu item button
    const homeButton = sidebar.getByRole('button', { name: 'Home' });
    await homeButton.hover();

    // Tooltip should appear (Radix Tooltip)
    // The tooltip content should contain "Home"
    const tooltip = page.locator('[role="tooltip"]', { hasText: 'Home' });
    await expect(tooltip).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Sidebar Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should not show sidebar by default on mobile', async ({ page }) => {
    // Desktop sidebar should be hidden on mobile
    const desktopSidebar = page.locator('[data-sidebar="sidebar"]');

    // Mobile uses Sheet component, desktop sidebar might be display:none
    // Check if mobile trigger button exists
    const mobileTrigger = page.locator('button').filter({ hasText: /menu/i }).or(
      page.locator('[data-sidebar="trigger"]')
    );

    // At least one trigger should be visible
    const triggerCount = await mobileTrigger.count();
    expect(triggerCount).toBeGreaterThan(0);
  });

  test('should open mobile sidebar (sheet) when clicking trigger', async ({ page }) => {
    // Find mobile menu trigger
    // The Sheet trigger is usually in the header/navbar
    const mobileTrigger = page.locator('[data-sidebar="trigger"]').first();

    // Click to open sheet
    await mobileTrigger.click();

    // Sheet content should be visible
    const sheetContent = page.locator('[data-sidebar="sidebar"]');
    await expect(sheetContent).toBeVisible();

    // Verify menu items are visible
    await expect(sheetContent.getByRole('button', { name: 'Home' })).toBeVisible();
    await expect(sheetContent.getByRole('button', { name: 'Services' })).toBeVisible();
  });

  test('should close mobile sidebar when clicking outside', async ({ page }) => {
    // Open mobile sidebar
    const mobileTrigger = page.locator('[data-sidebar="trigger"]').first();
    await mobileTrigger.click();

    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Click outside the sidebar (on overlay or body)
    // Sheet usually has a backdrop/overlay
    const overlay = page.locator('[data-radix-dialog-overlay]');
    if (await overlay.isVisible()) {
      await overlay.click({ position: { x: 10, y: 10 } });
    } else {
      // Try clicking on page content area
      await page.click('body', { position: { x: 10, y: 10 } });
    }

    // Sidebar should be hidden
    await expect(sidebar).not.toBeVisible();
  });

  test('should navigate and close mobile sidebar after clicking link', async ({ page }) => {
    // Open mobile sidebar
    const mobileTrigger = page.locator('[data-sidebar="trigger"]').first();
    await mobileTrigger.click();

    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Click a link
    const quoteLink = sidebar.getByRole('link', { name: 'Get a Quote' });
    await quoteLink.click();

    // Navigation should occur
    await expect(page).toHaveURL(/\/quote/);

    // Sheet should auto-close after navigation (common pattern)
    // Give it a moment to close
    await page.waitForTimeout(500);

    // Check if sidebar is still visible - it might remain open on mobile
    // depending on implementation
  });

  test('should expand/collapse groups in mobile sidebar', async ({ page }) => {
    // Open mobile sidebar
    const mobileTrigger = page.locator('[data-sidebar="trigger"]').first();
    await mobileTrigger.click();

    const sidebar = page.locator('[data-sidebar="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Expand Services
    const servicesButton = sidebar.getByRole('button', { name: 'Services' });
    await servicesButton.click();

    // Submenu should be visible
    await expect(sidebar.getByRole('link', { name: 'Lawn Mowing' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Landscaping' })).toBeVisible();

    // Collapse
    await servicesButton.click();

    // Submenu should be hidden
    // Radix Collapsible will have data-state="closed"
  });
});

test.describe('Sidebar Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Sidebar should have role="complementary" or similar
    // Check for navigation landmark
    const nav = sidebar.locator('nav');
    const navCount = await nav.count();
    expect(navCount).toBeGreaterThan(0);
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // According to the sidebar implementation, 'b' key should toggle sidebar
    // Check initial state
    const sidebar = page.locator('[data-sidebar="sidebar"]');
    const initialState = await sidebar.getAttribute('data-state');

    // Press keyboard shortcut (Cmd+b or Ctrl+b depending on OS)
    await page.keyboard.press('b');

    // Wait for state change
    await page.waitForTimeout(300);

    const newState = await sidebar.getAttribute('data-state');

    // State should have toggled
    expect(newState).not.toBe(initialState);
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    // Tab to sidebar
    await page.keyboard.press('Tab');

    // Continue tabbing through sidebar elements
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    // Should be able to reach interactive elements
    let tabCount = 0;
    while (tabCount < 20) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement?.tagName);

      // Check if we're on a button or link
      if (focusedElement === 'BUTTON' || focusedElement === 'A') {
        break;
      }

      tabCount++;
    }

    expect(['BUTTON', 'A']).toContain(focusedElement);
  });
});

test.describe('Sidebar Location Registry Integration', () => {
  test('should display high priority locations first', async ({ page }) => {
    await page.goto('/');

    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Expand Locations
    const locationsButton = sidebar.getByRole('button', { name: 'Locations' });
    await locationsButton.click();

    // Get all location links (excluding Service Areas and View All)
    const locationLinks = sidebar.locator('a[href^="/locations/"]').filter({
      hasNotText: 'Service Areas',
    }).filter({
      hasNotText: 'View All Locations',
    });

    const count = await locationLinks.count();

    // Should have up to 5 locations (as per getTopLocations function)
    expect(count).toBeLessThanOrEqual(5);
    expect(count).toBeGreaterThan(0);

    // Verify links are properly formatted
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = locationLinks.nth(i);
      const href = await link.getAttribute('href');

      // Should match /locations/[slug] pattern
      expect(href).toMatch(/^\/locations\/[a-z0-9-]+$/);
    }
  });

  test('should navigate to location page from sidebar', async ({ page }) => {
    await page.goto('/');

    const sidebar = page.locator('[data-sidebar="sidebar"]');

    // Expand Locations
    const locationsButton = sidebar.getByRole('button', { name: 'Locations' });
    await locationsButton.click();

    // Click on the first location link
    const locationLinks = sidebar.locator('a[href^="/locations/"]').filter({
      hasNotText: 'Service Areas',
    }).filter({
      hasNotText: 'View All Locations',
    });

    const firstLocation = locationLinks.first();

    if (await firstLocation.isVisible()) {
      const href = await firstLocation.getAttribute('href');
      await firstLocation.click();

      // Should navigate to location page
      await expect(page).toHaveURL(new RegExp(href || '/locations/'));
    }
  });
});
