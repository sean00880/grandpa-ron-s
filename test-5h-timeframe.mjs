import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const TEST_URL = 'http://localhost:3000/mk-share/trade';

async function test5HTimeframe() {
  console.log('🚀 Starting 5H Timeframe Test...\n');

  // Launch browser with DevTools
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // Track network requests
  const apiCalls = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/chart') || url.includes('/api/quote')) {
      apiCalls.push({
        url,
        method: request.method(),
        timestamp: new Date().toISOString()
      });
    }
  });

  try {
    // Step 1: Navigate to the page
    console.log('📍 Step 1: Navigating to', TEST_URL);
    await page.goto(TEST_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: 'test-5h-initial.png',
      fullPage: true
    });
    console.log('✅ Initial screenshot saved: test-5h-initial.png\n');

    // Step 2: Find all timeframe buttons
    console.log('📍 Step 2: Locating timeframe buttons...');
    const timeframeButtons = await page.locator('[data-testid^="timeframe-"], button:has-text("1m"), button:has-text("5m"), button:has-text("15m"), button:has-text("1h"), button:has-text("4h"), button:has-text("5H"), button:has-text("1D"), button:has-text("1W")').all();

    console.log(`Found ${timeframeButtons.length} timeframe buttons\n`);

    // Get button texts
    const buttonTexts = [];
    for (const btn of timeframeButtons) {
      const text = await btn.textContent();
      buttonTexts.push(text.trim());
    }
    console.log('📊 Timeframe buttons found:', buttonTexts.join(', '));

    // Step 3: Check if 5H button exists
    const has5H = buttonTexts.some(text => text === '5H');
    console.log(`\n🔍 5H Button Present: ${has5H ? '✅ YES' : '❌ NO'}`);

    if (!has5H) {
      console.error('\n❌ FAILURE: 5H button not found!');
      await browser.close();
      return;
    }

    // Step 4: Test each timeframe
    console.log('\n📍 Step 3: Testing all timeframe buttons...\n');

    const timeframeTests = [
      { label: '1m', expectedParam: 'tf=1m' },
      { label: '5m', expectedParam: 'tf=5m' },
      { label: '15m', expectedParam: 'tf=15m' },
      { label: '1h', expectedParam: 'tf=1h' },
      { label: '4h', expectedParam: 'tf=4h' },
      { label: '5H', expectedParam: 'tf=5h' },  // NEW ONE
      { label: '1D', expectedParam: 'tf=24h' },
      { label: '1W', expectedParam: 'tf=7d' }
    ];

    const results = [];

    for (const test of timeframeTests) {
      console.log(`\n🧪 Testing ${test.label}...`);

      // Clear previous API calls
      apiCalls.length = 0;

      // Find and click the button
      const button = page.locator(`button:has-text("${test.label}")`).first();
      const exists = await button.count() > 0;

      if (!exists) {
        console.log(`  ⚠️  Button not found: ${test.label}`);
        results.push({
          timeframe: test.label,
          found: false,
          clicked: false,
          apiCallCorrect: false
        });
        continue;
      }

      await button.click();
      console.log(`  ✅ Clicked ${test.label} button`);

      // Wait for API call
      await page.waitForTimeout(1500);

      // Check API calls
      const chartApiCall = apiCalls.find(call => call.url.includes('/api/chart'));

      if (chartApiCall) {
        const hasCorrectParam = chartApiCall.url.includes(test.expectedParam);
        console.log(`  📡 API Call: ${chartApiCall.url}`);
        console.log(`  ${hasCorrectParam ? '✅' : '❌'} Parameter Check: ${test.expectedParam} ${hasCorrectParam ? 'FOUND' : 'MISSING'}`);

        results.push({
          timeframe: test.label,
          found: true,
          clicked: true,
          apiCallCorrect: hasCorrectParam,
          apiUrl: chartApiCall.url
        });
      } else {
        console.log(`  ⚠️  No API call detected`);
        results.push({
          timeframe: test.label,
          found: true,
          clicked: true,
          apiCallCorrect: false,
          apiUrl: null
        });
      }

      // Take screenshot for this timeframe
      const screenshotPath = `test-5h-${test.label}.png`;
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });
      console.log(`  📸 Screenshot saved: ${screenshotPath}`);
    }

    // Step 5: Generate report
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60) + '\n');

    const allPassed = results.every(r => r.found && r.clicked && r.apiCallCorrect);
    const fiveHResult = results.find(r => r.timeframe === '5H');

    console.log('Overall Status:', allPassed ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED');
    console.log('\n5H Timeframe Specific:');
    console.log('  - Button Found:', fiveHResult?.found ? '✅' : '❌');
    console.log('  - Button Clicked:', fiveHResult?.clicked ? '✅' : '❌');
    console.log('  - Correct API Call:', fiveHResult?.apiCallCorrect ? '✅' : '❌');
    if (fiveHResult?.apiUrl) {
      console.log('  - API URL:', fiveHResult.apiUrl);
    }

    console.log('\n\nDetailed Results:');
    console.table(results);

    // Save results to JSON
    const reportData = {
      timestamp: new Date().toISOString(),
      testUrl: TEST_URL,
      overallStatus: allPassed ? 'PASS' : 'FAIL',
      fiveHTimeframe: fiveHResult,
      allResults: results,
      screenshots: [
        'test-5h-initial.png',
        ...timeframeTests.map(t => `test-5h-${t.label}.png`)
      ]
    };

    writeFileSync('test-5h-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Full report saved: test-5h-report.json\n');

    // Keep browser open for manual inspection
    console.log('🔍 Browser will remain open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n✅ Test complete. Browser closed.');
  }
}

// Run the test
test5HTimeframe().catch(console.error);
