import { Page, Locator } from '@playwright/test';

/**
 * Test helper functions for Grandpa Ron E2E tests
 */

/**
 * Wait for sidebar to be fully loaded and visible
 */
export async function waitForSidebar(page: Page): Promise<Locator> {
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  await sidebar.waitFor({ state: 'visible', timeout: 10000 });
  return sidebar;
}

/**
 * Toggle sidebar collapse/expand state
 */
export async function toggleSidebar(page: Page): Promise<void> {
  const toggleButton = page.locator('[data-sidebar="trigger"]').first();
  await toggleButton.click();
  // Wait for animation to complete
  await page.waitForTimeout(300);
}

/**
 * Expand a collapsible navigation group
 */
export async function expandNavGroup(
  page: Page,
  groupName: string
): Promise<void> {
  const sidebar = await waitForSidebar(page);
  const groupButton = sidebar.getByRole('button', { name: groupName });
  await groupButton.click();
  // Wait for animation
  await page.waitForTimeout(200);
}

/**
 * Collapse a navigation group
 */
export async function collapseNavGroup(
  page: Page,
  groupName: string
): Promise<void> {
  const sidebar = await waitForSidebar(page);
  const groupButton = sidebar.getByRole('button', { name: groupName });

  // Check if already collapsed
  const state = await groupButton.getAttribute('data-state');
  if (state !== 'closed') {
    await groupButton.click();
    await page.waitForTimeout(200);
  }
}

/**
 * Navigate to a route via sidebar
 */
export async function navigateViaSidebar(
  page: Page,
  linkText: string
): Promise<void> {
  const sidebar = await waitForSidebar(page);
  const link = sidebar.getByRole('link', { name: linkText });
  await link.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Check if sidebar is in collapsed state
 */
export async function isSidebarCollapsed(page: Page): Promise<boolean> {
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  const state = await sidebar.getAttribute('data-state');
  return state === 'collapsed';
}

/**
 * Check if sidebar is in expanded state
 */
export async function isSidebarExpanded(page: Page): Promise<boolean> {
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  const state = await sidebar.getAttribute('data-state');
  return state === 'expanded';
}

/**
 * Open mobile sidebar (Sheet)
 */
export async function openMobileSidebar(page: Page): Promise<void> {
  const trigger = page.locator('[data-sidebar="trigger"]').first();
  await trigger.click();
  // Wait for sheet animation
  await page.waitForTimeout(300);
}

/**
 * Close mobile sidebar
 */
export async function closeMobileSidebar(page: Page): Promise<void> {
  // Click on overlay or backdrop
  const overlay = page.locator('[data-radix-dialog-overlay]');
  if (await overlay.isVisible()) {
    await overlay.click({ position: { x: 10, y: 10 } });
  }
  await page.waitForTimeout(300);
}

/**
 * Get all location links from the Locations menu
 */
export async function getLocationLinks(page: Page): Promise<Locator> {
  const sidebar = await waitForSidebar(page);

  // Expand Locations if not already expanded
  await expandNavGroup(page, 'Locations');

  // Get location links (exclude Service Areas and View All)
  return sidebar.locator('a[href^="/locations/"]').filter({
    hasNotText: 'Service Areas',
  }).filter({
    hasNotText: 'View All Locations',
  });
}

/**
 * Check if a navigation item is active
 */
export async function isNavItemActive(
  page: Page,
  itemName: string
): Promise<boolean> {
  const sidebar = await waitForSidebar(page);
  const item = sidebar.getByRole('button', { name: itemName }).or(
    sidebar.getByRole('link', { name: itemName })
  );

  const isActive = await item.getAttribute('data-active');
  return isActive === 'true';
}

/**
 * Get all main navigation items
 */
export async function getMainNavItems(page: Page): Promise<string[]> {
  const sidebar = await waitForSidebar(page);

  // Get all navigation buttons/links
  const items = sidebar.locator('[data-sidebar="menu"] button, [data-sidebar="menu"] a');
  const count = await items.count();

  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    const text = await items.nth(i).textContent();
    if (text) {
      names.push(text.trim());
    }
  }

  return names;
}
