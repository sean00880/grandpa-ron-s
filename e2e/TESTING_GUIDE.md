# E2E Testing Guide - Grandpa Ron Next.js

## Quick Start

```bash
# Install dependencies (already done)
npm install

# Run all E2E tests
npm run test:e2e

# Run tests with UI (recommended for development)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/sidebar.spec.ts

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug a specific test
npx playwright test e2e/sidebar.spec.ts --debug
```

## Test Structure

### Sidebar Tests (`e2e/sidebar.spec.ts`)

The sidebar tests are organized into several test suites:

#### 1. Sidebar Desktop Tests

Tests the main sidebar functionality on desktop viewport:

```typescript
test.describe('Sidebar Desktop', () => {
  // Tests run at 1280x720 (default desktop size)
  test('should render sidebar correctly', async ({ page }) => {
    // Verifies sidebar structure, menu items, and visibility
  });

  test('should toggle sidebar collapse/expand', async ({ page }) => {
    // Tests collapsing and expanding the sidebar
  });

  test('should expand/collapse navigation groups', async ({ page }) => {
    // Tests collapsible menu groups (Services, Locations, etc.)
  });

  test('should navigate when clicking menu items', async ({ page }) => {
    // Tests navigation functionality
  });

  test('should apply active state to current route', async ({ page }) => {
    // Tests active state highlighting
  });

  test('should display location items from registry', async ({ page }) => {
    // Tests location registry integration
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tests keyboard accessibility
  });

  test('should show tooltips in collapsed state', async ({ page }) => {
    // Tests tooltip behavior when sidebar is collapsed
  });
});
```

#### 2. Sidebar Mobile Tests

Tests sidebar behavior on mobile devices:

```typescript
test.describe('Sidebar Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should not show sidebar by default on mobile', async ({ page }) => {
    // Verifies sidebar is hidden on mobile
  });

  test('should open mobile sidebar (sheet) when clicking trigger', async ({ page }) => {
    // Tests opening the mobile menu
  });

  test('should close mobile sidebar when clicking outside', async ({ page }) => {
    // Tests dismissing the mobile menu
  });

  test('should navigate and close mobile sidebar after clicking link', async ({ page }) => {
    // Tests navigation on mobile
  });
});
```

#### 3. Accessibility Tests

Tests accessibility features:

```typescript
test.describe('Sidebar Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    // Verifies semantic HTML and ARIA attributes
  });

  test('should support keyboard shortcuts', async ({ page }) => {
    // Tests keyboard shortcuts (e.g., 'b' to toggle)
  });

  test('should be navigable with keyboard only', async ({ page }) => {
    // Tests tab navigation through sidebar
  });
});
```

#### 4. Location Registry Integration Tests

Tests integration with the location registry:

```typescript
test.describe('Sidebar Location Registry Integration', () => {
  test('should display high priority locations first', async ({ page }) => {
    // Verifies locations are sorted by priority
  });

  test('should navigate to location page from sidebar', async ({ page }) => {
    // Tests location link navigation
  });
});
```

## Understanding Test Selectors

### Data Attributes

The sidebar uses specific data attributes for testing:

```typescript
// Sidebar container
page.locator('[data-sidebar="sidebar"]')

// Sidebar toggle button
page.locator('[data-sidebar="trigger"]')

// Sidebar state
await sidebar.getAttribute('data-state') // 'expanded' or 'collapsed'

// Active state
await element.getAttribute('data-active') // 'true' or 'false'
```

### Role-Based Selectors (Preferred)

```typescript
// Navigation button
page.getByRole('button', { name: 'Services' })

// Navigation link
page.getByRole('link', { name: 'Get a Quote' })

// Generic text
page.getByText('Menu')
```

### CSS Selectors (When Necessary)

```typescript
// Links starting with /locations/
page.locator('a[href^="/locations/"]')

// Radix UI Dialog overlay
page.locator('[data-radix-dialog-overlay]')

// Radix UI Tooltip
page.locator('[role="tooltip"]')
```

## Helper Functions

The `helpers.ts` file provides reusable functions:

```typescript
import { waitForSidebar, expandNavGroup, navigateViaSidebar } from './helpers';

test('my test', async ({ page }) => {
  await page.goto('/');

  // Wait for sidebar to load
  const sidebar = await waitForSidebar(page);

  // Expand a navigation group
  await expandNavGroup(page, 'Services');

  // Navigate via sidebar
  await navigateViaSidebar(page, 'Get a Quote');

  // Check if sidebar is collapsed
  const isCollapsed = await isSidebarCollapsed(page);
});
```

## Common Patterns

### Testing Collapsible Groups

```typescript
test('should expand/collapse groups', async ({ page }) => {
  const sidebar = page.locator('[data-sidebar="sidebar"]');

  // Click to expand
  const servicesButton = sidebar.getByRole('button', { name: 'Services' });
  await servicesButton.click();

  // Verify submenu is visible
  await expect(sidebar.getByRole('link', { name: 'Lawn Mowing' })).toBeVisible();

  // Click to collapse
  await servicesButton.click();

  // Submenu should be hidden
  // (Radix Collapsible adds data-state="closed")
});
```

### Testing Navigation

```typescript
test('should navigate correctly', async ({ page }) => {
  await page.goto('/');

  // Click a link
  await page.getByRole('link', { name: 'Get a Quote' }).click();

  // Verify URL changed
  await expect(page).toHaveURL(/\/quote/);

  // Or wait for specific element on new page
  await expect(page.getByRole('heading', { name: 'Quote Request' })).toBeVisible();
});
```

### Testing Active States

```typescript
test('should show active state', async ({ page }) => {
  await page.goto('/services/lawn-mowing');

  const sidebar = page.locator('[data-sidebar="sidebar"]');

  // Parent group should be active
  const servicesButton = sidebar.getByRole('button', { name: 'Services' });
  await expect(servicesButton).toHaveAttribute('data-active', 'true');

  // Specific item should be active
  const lawnMowingLink = sidebar.getByRole('link', { name: 'Lawn Mowing' });
  await expect(lawnMowingLink).toHaveAttribute('data-active', 'true');
});
```

### Testing Mobile Behavior

```typescript
test('mobile sidebar', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto('/');

  // Open mobile sidebar
  const trigger = page.locator('[data-sidebar="trigger"]').first();
  await trigger.click();

  // Verify sidebar is visible
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  await expect(sidebar).toBeVisible();

  // Close by clicking overlay
  const overlay = page.locator('[data-radix-dialog-overlay]');
  await overlay.click({ position: { x: 10, y: 10 } });

  // Sidebar should be hidden
  await expect(sidebar).not.toBeVisible();
});
```

## Waiting Strategies

### Good Practices

```typescript
// ✅ Wait for element to be visible
await expect(element).toBeVisible();

// ✅ Wait for network to be idle
await page.waitForLoadState('networkidle');

// ✅ Wait for specific element
await page.waitForSelector('[data-sidebar="sidebar"]');

// ✅ Wait for navigation
await page.waitForURL('/services');
```

### Avoid

```typescript
// ❌ Arbitrary timeouts (flaky)
await page.waitForTimeout(1000);

// Use only for animations where necessary:
// ⚠️ Acceptable for animation timing
await page.waitForTimeout(300); // Animation duration
```

## Debugging Tips

### Visual Debugging

```bash
# Step through test with Playwright Inspector
npm run test:e2e:debug

# Or debug specific test
npx playwright test e2e/sidebar.spec.ts:25 --debug
```

### Console Logs

```typescript
test('debug test', async ({ page }) => {
  // Listen to console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Get element text
  const text = await element.textContent();
  console.log('Element text:', text);

  // Get all attributes
  const attrs = await element.evaluate(el => ({
    id: el.id,
    className: el.className,
    dataset: el.dataset,
  }));
  console.log('Element attributes:', attrs);
});
```

### Screenshots

```typescript
test('capture screenshot', async ({ page }) => {
  await page.goto('/');

  // Full page screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });

  // Element screenshot
  const sidebar = page.locator('[data-sidebar="sidebar"]');
  await sidebar.screenshot({ path: 'sidebar.png' });
});
```

### Trace Viewer

```typescript
// In playwright.config.ts
use: {
  trace: 'on-first-retry', // Capture trace on retry
}
```

Then view trace:
```bash
npx playwright show-trace test-results/example-test/trace.zip
```

## Running Specific Tests

```bash
# Run single test file
npx playwright test e2e/sidebar.spec.ts

# Run specific test by name
npx playwright test -g "should render sidebar correctly"

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests matching pattern
npx playwright test sidebar

# Run tests in headed mode
npx playwright test --headed

# Run tests with specific viewport
npx playwright test --project="Mobile Chrome"
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npm run test:e2e
        env:
          CI: true

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Performance

### Test Execution Time

- Parallel execution: Tests run in parallel across multiple workers
- Browser reuse: Browsers are reused between tests when possible
- Network optimization: Tests can run in headless mode for faster execution

### Optimize Slow Tests

```typescript
// Increase timeout for slow tests
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds

  // Your test code
});

// Skip slow tests in development
test.skip(({ browserName }) => browserName === 'webkit', 'Skip on WebKit');
```

## Best Practices Summary

1. **Use Data Attributes**: Add `data-testid` for dynamic content
2. **Prefer Role Selectors**: Use `getByRole()` for better accessibility
3. **Wait Properly**: Use `waitFor()` instead of `waitForTimeout()`
4. **Test Isolation**: Each test should be independent
5. **Descriptive Names**: Write clear test descriptions
6. **Helper Functions**: Reuse common patterns via helpers
7. **Mobile Testing**: Test responsive behavior
8. **Accessibility**: Include a11y tests
9. **Error Messages**: Add custom error messages to assertions
10. **Maintenance**: Update tests when UI changes

## Troubleshooting

### Common Issues

**Test Timeout:**
- Increase timeout in `playwright.config.ts`
- Check if dev server started
- Look for infinite loops or network issues

**Element Not Found:**
- Verify selector is correct
- Check if element is in DOM (might be conditional)
- Wait for element to appear

**Flaky Tests:**
- Add proper wait conditions
- Avoid race conditions
- Use `retry` for flaky actions

**Browser Not Launching:**
```bash
# Reinstall browsers
npx playwright install --with-deps
```

## Resources

- [Playwright Docs](https://playwright.dev)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [Playwright Selectors](https://playwright.dev/docs/selectors)
