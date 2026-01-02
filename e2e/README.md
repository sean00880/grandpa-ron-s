# Grandpa Ron Next.js - E2E Tests

This directory contains end-to-end tests for the Grandpa Ron Lawncare application using Playwright.

## Overview

The E2E test suite covers:
- Sidebar rendering and functionality
- Navigation and routing
- Mobile responsive behavior
- Accessibility features
- Location registry integration

## Running Tests

### All Tests (Headless)

```bash
npm run test:e2e
```

### Interactive UI Mode

```bash
npm run test:e2e:ui
```

This opens Playwright's test runner UI where you can:
- Run tests individually
- Watch tests run in real-time
- Inspect test steps
- Debug failures

### Headed Mode (Watch Browser)

```bash
npm run test:e2e:headed
```

### Debug Mode

```bash
npm run test:e2e:debug
```

Step through tests with Playwright Inspector.

### View Last Test Report

```bash
npm run test:e2e:report
```

## Test Organization

### `sidebar.spec.ts`

Comprehensive tests for the application sidebar:

**Desktop Tests:**
- Sidebar renders correctly
- Toggle collapse/expand functionality
- Navigation group expansion
- Active state management
- Location registry integration
- Keyboard navigation
- Tooltip display

**Mobile Tests:**
- Mobile sidebar (Sheet) behavior
- Opening/closing mobile menu
- Navigation on mobile
- Touch interactions

**Accessibility Tests:**
- ARIA labels
- Keyboard shortcuts
- Keyboard-only navigation

### `helpers.ts`

Reusable helper functions for tests:
- `waitForSidebar()` - Wait for sidebar to load
- `toggleSidebar()` - Toggle sidebar state
- `expandNavGroup()` - Expand navigation groups
- `navigateViaSidebar()` - Navigate using sidebar links
- `getLocationLinks()` - Get location links from registry
- And more...

## Writing New Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { waitForSidebar, expandNavGroup } from './helpers';

test('my new test', async ({ page }) => {
  await page.goto('/');

  const sidebar = await waitForSidebar(page);
  await expandNavGroup(page, 'Services');

  // Your test assertions
  await expect(sidebar.getByText('Lawn Mowing')).toBeVisible();
});
```

### Best Practices

1. **Use Locators Properly**
   - Prefer `getByRole()`, `getByText()`, `getByLabel()`
   - Use data attributes for dynamic elements: `[data-testid]`

2. **Wait for Elements**
   - Use `waitFor()` or `waitForSelector()` instead of `waitForTimeout()`
   - Exception: Animation timing where necessary

3. **Isolation**
   - Each test should be independent
   - Use `beforeEach()` for common setup
   - Don't rely on test execution order

4. **Assertions**
   - Be specific with assertions
   - Test both positive and negative cases
   - Use meaningful error messages

## Configuration

### `playwright.config.ts`

The Playwright configuration includes:

- **Test Directory:** `./e2e`
- **Timeout:** 30 seconds per test
- **Browsers:** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Base URL:** http://localhost:3000
- **Web Server:** Automatically starts Next.js dev server
- **Reporters:** HTML and list
- **Artifacts:** Screenshots and videos on failure

### Environment Variables

You can override test settings:

```bash
# Use different base URL
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3001 npm run test:e2e

# Run in CI mode
CI=true npm run test:e2e
```

## Debugging Tests

### Visual Debugging

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:
- Step through each test action
- Inspect the DOM at each step
- See console logs
- Modify selectors on the fly

### Screenshots

Screenshots are automatically captured on test failures and saved to `test-results/`.

### Videos

Videos are recorded for failed tests and saved to `test-results/`.

### Traces

Traces are captured on retry and can be viewed with:

```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## CI/CD Integration

The test suite is configured for CI environments:

- Retries: 2 retries on failure in CI
- Workers: Single worker in CI for stability
- `forbidOnly`: Prevents `.only()` in CI
- Web server auto-starts before tests

### Example GitHub Actions

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps chromium

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    CI: true

- name: Upload Test Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Coverage

Currently testing:
- ✅ Sidebar desktop functionality
- ✅ Sidebar mobile functionality
- ✅ Navigation and routing
- ✅ Active state management
- ✅ Location registry integration
- ✅ Accessibility features

### Future Coverage

- [ ] Service pages
- [ ] Blog pages
- [ ] Quote form
- [ ] Contact form
- [ ] Location pages
- [ ] Search functionality

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill existing process
npx kill-port 3000

# Or use different port
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3001 npm run test:e2e
```

### Tests Timing Out

- Check if dev server started correctly
- Increase timeout in `playwright.config.ts`
- Check network conditions

### Flaky Tests

- Add proper wait conditions
- Avoid `waitForTimeout()` when possible
- Use `toBeVisible()` with retries
- Check for race conditions

### Browser Not Installed

```bash
npx playwright install chromium
```

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing)

## Support

For issues or questions about E2E tests:
1. Check this README
2. Review Playwright documentation
3. Check existing test examples
4. Consult the main project CLAUDE.md
