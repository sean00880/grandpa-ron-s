#!/usr/bin/env node
/**
 * Automated Chart Timeframe Debug Script
 * Uses Chrome DevTools Protocol to debug the timeframe switching visual issue
 */

import { writeFile } from 'fs/promises';
import { join } from 'path';

const CHROME_DEBUG_PORT = 9222;
const PAGE_URL = 'http://localhost:3000/mk-share/trade';

// Fetch helper for CDP
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

// CDP command via WebSocket
class ChromeTab {
  constructor(webSocketDebuggerUrl) {
    this.wsUrl = webSocketDebuggerUrl;
    this.ws = null;
    this.messageId = 1;
    this.pendingCallbacks = new Map();
  }

  async connect() {
    const { default: WebSocket } = await import('ws');
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.on('open', () => {
        console.log('✅ Connected to Chrome tab');
        resolve();
      });

      this.ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.id && this.pendingCallbacks.has(message.id)) {
          const callback = this.pendingCallbacks.get(message.id);
          this.pendingCallbacks.delete(message.id);
          if (message.error) {
            callback.reject(new Error(message.error.message));
          } else {
            callback.resolve(message.result);
          }
        }
      });

      this.ws.on('error', reject);
    });
  }

  async send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pendingCallbacks.set(id, { resolve, reject });

      this.ws.send(JSON.stringify({ id, method, params }));

      // Timeout after 30s
      setTimeout(() => {
        if (this.pendingCallbacks.has(id)) {
          this.pendingCallbacks.delete(id);
          reject(new Error(`Timeout waiting for ${method}`));
        }
      }, 30000);
    });
  }

  async close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function debugTimeframeSwitching() {
  console.log('🔍 Chrome DevTools Chart Debug Script\n');

  try {
    // Get list of tabs
    console.log(`📡 Connecting to Chrome at localhost:${CHROME_DEBUG_PORT}...`);
    const tabs = await fetchJson(`http://localhost:${CHROME_DEBUG_PORT}/json`);

    // Find the mk-share/trade tab
    let targetTab = tabs.find(tab => tab.url.includes('mk-share/trade'));

    if (!targetTab) {
      console.log('⚠️  Tab not found. Opening new tab...');
      const newTab = await fetchJson(`http://localhost:${CHROME_DEBUG_PORT}/json/new?${PAGE_URL}`);
      await sleep(2000);
      const updatedTabs = await fetchJson(`http://localhost:${CHROME_DEBUG_PORT}/json`);
      targetTab = updatedTabs.find(tab => tab.url.includes('mk-share/trade'));
    }

    if (!targetTab) {
      throw new Error('Could not find or create mk-share/trade tab');
    }

    console.log(`✅ Found tab: ${targetTab.title}`);
    console.log(`   URL: ${targetTab.url}\n`);

    // Connect to tab via WebSocket
    const tab = new ChromeTab(targetTab.webSocketDebuggerUrl);
    await tab.connect();

    // Enable required domains
    console.log('🔧 Enabling DevTools domains...');
    await tab.send('Page.enable');
    await tab.send('Runtime.enable');
    await tab.send('DOM.enable');
    console.log('✅ Domains enabled\n');

    // Wait for page to be fully loaded
    console.log('⏳ Waiting for page load...');
    await sleep(3000);

    // STEP 1: Get initial state (1D timeframe)
    console.log('═══ STEP 1: Default 1D Timeframe ═══\n');

    const chartInfo1 = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          const container = document.querySelector('[class*="chart"]') ||
                          document.querySelector('canvas')?.parentElement ||
                          document.querySelector('[id*="chart"]');
          const canvas = document.querySelector('canvas');

          if (!container) return { error: 'Chart container not found' };

          const containerRect = container.getBoundingClientRect();
          const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
          const computedStyle = window.getComputedStyle(container);

          return {
            container: {
              selector: container.className || container.id || container.tagName,
              width: containerRect.width,
              height: containerRect.height,
              top: containerRect.top,
              left: containerRect.left,
              display: computedStyle.display,
              position: computedStyle.position,
              overflow: computedStyle.overflow,
              boxSizing: computedStyle.boxSizing
            },
            canvas: canvasRect ? {
              width: canvasRect.width,
              height: canvasRect.height,
              actualWidth: canvas.width,
              actualHeight: canvas.height,
              top: canvasRect.top,
              left: canvasRect.left
            } : null,
            timestamp: Date.now()
          };
        })()
      `,
      returnByValue: true
    });

    const state1 = chartInfo1.result.value;
    console.log('📊 1D Timeframe Chart Info:');
    console.log(JSON.stringify(state1, null, 2));
    console.log('');

    // Take screenshot 1
    console.log('📸 Taking screenshot (1D timeframe)...');
    const screenshot1 = await tab.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });
    const screenshot1Path = join(process.cwd(), 'debug-1d-timeframe.png');
    await writeFile(screenshot1Path, Buffer.from(screenshot1.data, 'base64'));
    console.log(`✅ Screenshot saved: ${screenshot1Path}\n`);

    // STEP 2: Find and click 1h button
    console.log('═══ STEP 2: Clicking 1h Timeframe Button ═══\n');

    const buttonInfo = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          const buttons = Array.from(document.querySelectorAll('button'));
          const hourButton = buttons.find(btn =>
            btn.textContent.trim() === '1h' ||
            btn.textContent.trim() === '1H' ||
            btn.getAttribute('data-timeframe') === '1h'
          );

          if (!hourButton) {
            return {
              error: 'Could not find 1h button',
              availableButtons: buttons
                .filter(b => b.textContent.trim().length < 20)
                .map(b => b.textContent.trim())
            };
          }

          const rect = hourButton.getBoundingClientRect();
          hourButton.click();

          return {
            found: true,
            text: hourButton.textContent.trim(),
            clicked: true,
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };
        })()
      `,
      returnByValue: true
    });

    const buttonResult = buttonInfo.result.value;
    console.log('🖱️  Button Click Result:');
    console.log(JSON.stringify(buttonResult, null, 2));

    if (buttonResult.error) {
      console.error('\n❌ Error:', buttonResult.error);
      if (buttonResult.availableButtons) {
        console.log('\n📋 Available buttons:');
        buttonResult.availableButtons.forEach(btn => console.log(`   - "${btn}"`));
      }
      await tab.close();
      return;
    }

    console.log('');

    // Wait for chart to update
    console.log('⏳ Waiting for chart update (1.5s)...');
    await sleep(1500);

    // STEP 3: Get state after switching to 1h
    console.log('═══ STEP 3: After 1h Timeframe Switch ═══\n');

    const chartInfo2 = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          const container = document.querySelector('[class*="chart"]') ||
                          document.querySelector('canvas')?.parentElement ||
                          document.querySelector('[id*="chart"]');
          const canvas = document.querySelector('canvas');

          if (!container) return { error: 'Chart container not found' };

          const containerRect = container.getBoundingClientRect();
          const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
          const computedStyle = window.getComputedStyle(container);

          return {
            container: {
              selector: container.className || container.id || container.tagName,
              width: containerRect.width,
              height: containerRect.height,
              top: containerRect.top,
              left: containerRect.left,
              display: computedStyle.display,
              position: computedStyle.position,
              overflow: computedStyle.overflow,
              boxSizing: computedStyle.boxSizing
            },
            canvas: canvasRect ? {
              width: canvasRect.width,
              height: canvasRect.height,
              actualWidth: canvas.width,
              actualHeight: canvas.height,
              top: canvasRect.top,
              left: canvasRect.left
            } : null,
            timestamp: Date.now()
          };
        })()
      `,
      returnByValue: true
    });

    const state2 = chartInfo2.result.value;
    console.log('📊 1h Timeframe Chart Info:');
    console.log(JSON.stringify(state2, null, 2));
    console.log('');

    // Take screenshot 2
    console.log('📸 Taking screenshot (1h timeframe)...');
    const screenshot2 = await tab.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true
    });
    const screenshot2Path = join(process.cwd(), 'debug-1h-timeframe.png');
    await writeFile(screenshot2Path, Buffer.from(screenshot2.data, 'base64'));
    console.log(`✅ Screenshot saved: ${screenshot2Path}\n`);

    // STEP 4: Analyze differences
    console.log('═══ STEP 4: Analysis ═══\n');

    const containerWidthChanged = state1.container.width !== state2.container.width;
    const containerHeightChanged = state1.container.height !== state2.container.height;
    const containerMoved = state1.container.top !== state2.container.top || state1.container.left !== state2.container.left;

    console.log('📐 Container Dimensions:');
    console.log(`   Width:  ${state1.container.width}px → ${state2.container.width}px ${containerWidthChanged ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Height: ${state1.container.height}px → ${state2.container.height}px ${containerHeightChanged ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Top:    ${state1.container.top}px → ${state2.container.top}px ${state1.container.top !== state2.container.top ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Left:   ${state1.container.left}px → ${state2.container.left}px ${state1.container.left !== state2.container.left ? '⚠️  CHANGED' : '✅'}`);
    console.log('');

    if (state1.canvas && state2.canvas) {
      const canvasWidthChanged = state1.canvas.width !== state2.canvas.width;
      const canvasHeightChanged = state1.canvas.height !== state2.canvas.height;
      const canvasActualWidthChanged = state1.canvas.actualWidth !== state2.canvas.actualWidth;
      const canvasActualHeightChanged = state1.canvas.actualHeight !== state2.canvas.actualHeight;

      console.log('🖼️  Canvas Dimensions:');
      console.log(`   Display Width:  ${state1.canvas.width}px → ${state2.canvas.width}px ${canvasWidthChanged ? '⚠️  CHANGED' : '✅'}`);
      console.log(`   Display Height: ${state1.canvas.height}px → ${state2.canvas.height}px ${canvasHeightChanged ? '⚠️  CHANGED' : '✅'}`);
      console.log(`   Actual Width:   ${state1.canvas.actualWidth}px → ${state2.canvas.actualWidth}px ${canvasActualWidthChanged ? '⚠️  CHANGED' : '✅'}`);
      console.log(`   Actual Height:  ${state1.canvas.actualHeight}px → ${state2.canvas.actualHeight}px ${canvasActualHeightChanged ? '⚠️  CHANGED' : '✅'}`);
      console.log('');
    }

    // STEP 5: Get CSS details
    console.log('═══ STEP 5: CSS Analysis ═══\n');

    const cssInfo = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          const container = document.querySelector('[class*="chart"]') ||
                          document.querySelector('canvas')?.parentElement;

          if (!container) return { error: 'Container not found' };

          const style = window.getComputedStyle(container);
          const parentStyle = window.getComputedStyle(container.parentElement);

          return {
            container: {
              width: style.width,
              height: style.height,
              minWidth: style.minWidth,
              minHeight: style.minHeight,
              maxWidth: style.maxWidth,
              maxHeight: style.maxHeight,
              padding: style.padding,
              margin: style.margin,
              border: style.border,
              boxSizing: style.boxSizing
            },
            parent: {
              width: parentStyle.width,
              height: parentStyle.height,
              display: parentStyle.display,
              flexDirection: parentStyle.flexDirection,
              gap: parentStyle.gap
            }
          };
        })()
      `,
      returnByValue: true
    });

    console.log('🎨 CSS Properties:');
    console.log(JSON.stringify(cssInfo.result.value, null, 2));
    console.log('');

    // STEP 6: Check for console errors
    console.log('═══ STEP 6: Console Messages ═══\n');

    const consoleCheck = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          // Return info about console state
          return {
            note: 'Check Chrome DevTools Console for runtime errors',
            hasWindowErrors: typeof window.onerror !== 'undefined'
          };
        })()
      `,
      returnByValue: true
    });

    console.log('⚠️  Note: Check Chrome DevTools Console tab for JavaScript errors');
    console.log('');

    // Summary
    console.log('═══ SUMMARY ═══\n');

    const issues = [];
    if (containerWidthChanged) issues.push('Container width changed');
    if (containerHeightChanged) issues.push('Container height changed');
    if (containerMoved) issues.push('Container position changed');

    if (issues.length > 0) {
      console.log('⚠️  ISSUES DETECTED:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('✅ No dimension changes detected');
      console.log('   The issue may be related to:');
      console.log('   - Chart data rendering');
      console.log('   - Canvas drawing operations');
      console.log('   - Chart library internal state');
    }

    console.log('');
    console.log('📁 Screenshots saved to:', process.cwd());
    console.log('   - debug-1d-timeframe.png');
    console.log('   - debug-1h-timeframe.png');
    console.log('');

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      before: state1,
      after: state2,
      css: cssInfo.result.value,
      changes: {
        containerWidthChanged,
        containerHeightChanged,
        containerMoved
      },
      issues
    };

    const reportPath = join(process.cwd(), 'debug-timeframe-report.json');
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Full report saved: ${reportPath}`);

    // Close connection
    await tab.close();

    console.log('\n✅ Debugging complete!');

  } catch (error) {
    console.error('\n❌ Error during debugging:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the debug script
debugTimeframeSwitching();
