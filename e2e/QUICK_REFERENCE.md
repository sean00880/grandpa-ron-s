# Playwright E2E Tests - Quick Reference Card

## Run Tests

```bash
npm run test:e2e           # Run all tests (headless)
npm run test:e2e:ui        # Interactive UI mode ⭐ RECOMMENDED
npm run test:e2e:headed    # Watch browser execute tests
npm run test:e2e:debug     # Debug with Playwright Inspector
npm run test:e2e:report    # View last HTML report
```

## Run Specific Tests

```bash
npx playwright test e2e/sidebar.spec.ts              # One file
npx playwright test -g "should render"               # By name pattern
npx playwright test --project=chromium               # One browser
npx playwright test e2e/sidebar.spec.ts --headed     # Headed mode
```

## Test Files

| File | Description | Tests |
|------|-------------|-------|
| `sidebar.spec.ts` | Comprehensive sidebar tests | 17 tests |
| `example.spec.ts` | Simple example tests | 3 tests |
| `helpers.ts` | Reusable helper functions | - |

## Helper Functions

```typescript
import {
  waitForSidebar,      // Wait for sidebar to load
  toggleSidebar,       // Toggle collapse/expand
  expandNavGroup,      // Expand navigation group
  navigateViaSidebar,  // Click sidebar link
  getLocationLinks,    // Get location registry links
  isNavItemActive,     // Check if item is active
} from './helpers';
```

## Common Selectors

```typescript
// Sidebar
page.locator('[data-sidebar="sidebar"]')

// Toggle button
page.locator('[data-sidebar="trigger"]')

// By role (preferred)
page.getByRole('button', { name: 'Services' })
page.getByRole('link', { name: 'Get a Quote' })

// By text
page.getByText('Menu')

// Location links
page.locator('a[href^="/locations/"]')
```

## Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('selector');

    // Act
    await element.click();

    // Assert
    await expect(element).toBeVisible();
  });
});
```

## Common Assertions

```typescript
await expect(element).toBeVisible()
await expect(element).toHaveText('text')
await expect(element).toHaveAttribute('data-active', 'true')
await expect(page).toHaveURL(/\/path/)
await expect(element).toHaveCount(5)
```

## Wait Strategies

```typescript
// ✅ Good
await expect(element).toBeVisible()
await page.waitForLoadState('networkidle')
await page.waitForSelector('[data-sidebar="sidebar"]')

// ⚠️ Use sparingly
await page.waitForTimeout(300) // Only for animations
```

## Debug Commands

```typescript
// Pause test
await page.pause()

// Screenshot
await page.screenshot({ path: 'debug.png' })

// Console log
console.log(await element.textContent())

// Get element info
const info = await element.evaluate(el => ({
  id: el.id,
  class: el.className,
  text: el.textContent
}))
console.log(info)
```

## Mobile Testing

```typescript
test.use({ viewport: { width: 375, height: 667 } })

test('mobile test', async ({ page }) => {
  // Mobile-specific assertions
})
```

## Browser Selection

```bash
# Run on all browsers (default)
npm run test:e2e

# Single browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## CI/CD

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps chromium

- name: Run tests
  run: npm run test:e2e
  env:
    CI: true
```

## File Locations

```
📁 e2e/
  📄 sidebar.spec.ts         # Main sidebar tests
  📄 example.spec.ts         # Example tests
  📄 helpers.ts              # Helper functions
  📄 README.md               # Full guide
  📄 TESTING_GUIDE.md        # Detailed guide
  📄 QUICK_REFERENCE.md      # This file

📄 playwright.config.ts      # Configuration
📄 PLAYWRIGHT_SETUP.md       # Setup summary
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase timeout in config |
| Element not found | Add wait condition |
| Port in use | `npx kill-port 3000` |
| Browser missing | `npx playwright install chromium` |
| Flaky tests | Add proper waits, avoid race conditions |

## Coverage

### ✅ Currently Tested
- Sidebar rendering
- Toggle/collapse functionality
- Navigation items
- Active state
- Mobile sidebar (sheet)
- Location registry
- Accessibility
- Keyboard navigation

### 📋 To Add
- Service pages
- Quote form
- Contact form
- Blog pages
- Search functionality

## Performance

| Metric | Value |
|--------|-------|
| Total Tests | 20 |
| Test Files | 2 |
| Browsers | 5 |
| Avg Runtime | 30-60s |
| Parallel Workers | 4 |

## Resources

- [Full README](./README.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Playwright Docs](https://playwright.dev)
- [Setup Summary](../PLAYWRIGHT_SETUP.md)

---

**Quick Start**: `npm run test:e2e:ui` 🚀
