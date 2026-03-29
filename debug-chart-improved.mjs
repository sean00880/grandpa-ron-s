#!/usr/bin/env node
/**
 * Improved Chart Timeframe Debug Script
 * Better container detection logic
 */

import { writeFile } from 'fs/promises';
import { join } from 'path';

const CHROME_DEBUG_PORT = 9222;
const PAGE_URL = 'http://localhost:3000/mk-share/trade';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

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
      setTimeout(() => {
        if (this.pendingCallbacks.has(id)) {
          this.pendingCallbacks.delete(id);
          reject(new Error(`Timeout waiting for ${method}`));
        }
      }, 30000);
    });
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function debugTimeframeSwitching() {
  console.log('🔍 Improved Chart Debug Script\n');

  try {
    console.log(`📡 Connecting to Chrome at localhost:${CHROME_DEBUG_PORT}...`);
    const tabs = await fetchJson(`http://localhost:${CHROME_DEBUG_PORT}/json`);

    let targetTab = tabs.find(tab => tab.url.includes('mk-share/trade'));

    if (!targetTab) {
      console.log('⚠️  Tab not found. Opening new tab...');
      await fetchJson(`http://localhost:${CHROME_DEBUG_PORT}/json/new?${PAGE_URL}`);
      await sleep(2000);
      const updatedTabs = await fetchJson(`http://localhost:${CHROME_DEBUG_PORT}/json`);
      targetTab = updatedTabs.find(tab => tab.url.includes('mk-share/trade'));
    }

    if (!targetTab) throw new Error('Could not find or create mk-share/trade tab');

    console.log(`✅ Found tab: ${targetTab.title}`);
    console.log(`   URL: ${targetTab.url}\n`);

    const tab = new ChromeTab(targetTab.webSocketDebuggerUrl);
    await tab.connect();

    console.log('🔧 Enabling DevTools domains...');
    await tab.send('Page.enable');
    await tab.send('Runtime.enable');
    await tab.send('DOM.enable');
    console.log('✅ Domains enabled\n');

    console.log('⏳ Waiting for page load...');
    await sleep(3000);

    // IMPROVED: Find the actual chart container
    console.log('═══ STEP 0: Identifying Chart Container ═══\n');

    const findContainer = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          // Strategy 1: Find all canvases and their parents
          const canvases = Array.from(document.querySelectorAll('canvas'));

          console.log('Found', canvases.length, 'canvas elements');

          // Get the largest canvas (most likely the chart)
          const largestCanvas = canvases.reduce((largest, canvas) => {
            const size = canvas.width * canvas.height;
            const largestSize = largest ? largest.width * largest.height : 0;
            return size > largestSize ? canvas : largest;
          }, null);

          if (!largestCanvas) {
            return { error: 'No canvas found' };
          }

          // Find the parent container (should be larger than 16x16)
          let container = largestCanvas.parentElement;
          while (container) {
            const rect = container.getBoundingClientRect();
            if (rect.width > 100 && rect.height > 100) {
              // Found a suitable container
              break;
            }
            container = container.parentElement;
          }

          if (!container) {
            container = largestCanvas.parentElement;
          }

          const containerRect = container.getBoundingClientRect();
          const canvasRect = largestCanvas.getBoundingClientRect();

          // Add data attributes for easy selection
          container.setAttribute('data-debug-container', 'true');
          largestCanvas.setAttribute('data-debug-canvas', 'true');

          return {
            found: true,
            container: {
              tag: container.tagName,
              className: container.className,
              id: container.id,
              width: containerRect.width,
              height: containerRect.height,
              selector: container.className ? '.' + container.className.split(' ').join('.') : container.tagName
            },
            canvas: {
              width: canvasRect.width,
              height: canvasRect.height,
              actualWidth: largestCanvas.width,
              actualHeight: largestCanvas.height
            },
            allCanvases: canvases.map(c => ({
              width: c.width,
              height: c.height,
              parent: c.parentElement.className || c.parentElement.tagName
            }))
          };
        })()
      `,
      returnByValue: true
    });

    const containerInfo = findContainer.result.value;
    console.log('🔎 Container Detection Result:');
    console.log(JSON.stringify(containerInfo, null, 2));
    console.log('');

    if (containerInfo.error) {
      throw new Error(containerInfo.error);
    }

    // STEP 1: Get initial state with correct container
    console.log('═══ STEP 1: Default 1D Timeframe ═══\n');

    const chartInfo1 = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          const container = document.querySelector('[data-debug-container="true"]');
          const canvas = document.querySelector('[data-debug-canvas="true"]');

          if (!container || !canvas) return { error: 'Marked elements not found' };

          const containerRect = container.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(container);
          const canvasStyle = window.getComputedStyle(canvas);

          return {
            container: {
              className: container.className,
              width: containerRect.width,
              height: containerRect.height,
              top: containerRect.top,
              left: containerRect.left,
              display: computedStyle.display,
              position: computedStyle.position,
              overflow: computedStyle.overflow,
              flexGrow: computedStyle.flexGrow,
              flexShrink: computedStyle.flexShrink
            },
            canvas: {
              width: canvasRect.width,
              height: canvasRect.height,
              actualWidth: canvas.width,
              actualHeight: canvas.height,
              top: canvasRect.top,
              left: canvasRect.left,
              position: canvasStyle.position
            },
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
    const screenshot1 = await tab.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const screenshot1Path = join(process.cwd(), 'debug-1d-timeframe.png');
    await writeFile(screenshot1Path, Buffer.from(screenshot1.data, 'base64'));
    console.log(`✅ Screenshot saved: ${screenshot1Path}\n`);

    // STEP 2: Click 1h button
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
            clicked: true
          };
        })()
      `,
      returnByValue: true
    });

    console.log('🖱️  Button Click Result:');
    console.log(JSON.stringify(buttonInfo.result.value, null, 2));
    console.log('');

    if (buttonInfo.result.value.error) {
      console.error('❌ Error:', buttonInfo.result.value.error);
      await tab.close();
      return;
    }

    // Wait for chart update
    console.log('⏳ Waiting for chart update (2s)...');
    await sleep(2000);

    // STEP 3: Get state after switch
    console.log('═══ STEP 3: After 1h Timeframe Switch ═══\n');

    const chartInfo2 = await tab.send('Runtime.evaluate', {
      expression: `
        (function() {
          const container = document.querySelector('[data-debug-container="true"]');
          const canvas = document.querySelector('[data-debug-canvas="true"]');

          if (!container || !canvas) return { error: 'Marked elements not found' };

          const containerRect = container.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(container);
          const canvasStyle = window.getComputedStyle(canvas);

          return {
            container: {
              className: container.className,
              width: containerRect.width,
              height: containerRect.height,
              top: containerRect.top,
              left: containerRect.left,
              display: computedStyle.display,
              position: computedStyle.position,
              overflow: computedStyle.overflow,
              flexGrow: computedStyle.flexGrow,
              flexShrink: computedStyle.flexShrink
            },
            canvas: {
              width: canvasRect.width,
              height: canvasRect.height,
              actualWidth: canvas.width,
              actualHeight: canvas.height,
              top: canvasRect.top,
              left: canvasRect.left,
              position: canvasStyle.position
            },
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
    const screenshot2 = await tab.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    const screenshot2Path = join(process.cwd(), 'debug-1h-timeframe.png');
    await writeFile(screenshot2Path, Buffer.from(screenshot2.data, 'base64'));
    console.log(`✅ Screenshot saved: ${screenshot2Path}\n`);

    // STEP 4: Analysis
    console.log('═══ STEP 4: Detailed Analysis ═══\n');

    const changes = {
      containerWidth: state1.container.width !== state2.container.width,
      containerHeight: state1.container.height !== state2.container.height,
      containerPosition: state1.container.top !== state2.container.top || state1.container.left !== state2.container.left,
      canvasDisplayWidth: state1.canvas.width !== state2.canvas.width,
      canvasDisplayHeight: state1.canvas.height !== state2.canvas.height,
      canvasActualWidth: state1.canvas.actualWidth !== state2.canvas.actualWidth,
      canvasActualHeight: state1.canvas.actualHeight !== state2.canvas.actualHeight,
      canvasPosition: state1.canvas.top !== state2.canvas.top || state1.canvas.left !== state2.canvas.left
    };

    console.log('📐 Container Analysis:');
    console.log(`   Width:  ${state1.container.width}px → ${state2.container.width}px ${changes.containerWidth ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Height: ${state1.container.height}px → ${state2.container.height}px ${changes.containerHeight ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Top:    ${state1.container.top.toFixed(2)}px → ${state2.container.top.toFixed(2)}px ${state1.container.top !== state2.container.top ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Left:   ${state1.container.left.toFixed(2)}px → ${state2.container.left.toFixed(2)}px ${state1.container.left !== state2.container.left ? '⚠️  CHANGED' : '✅'}`);
    console.log('');

    console.log('🖼️  Canvas Analysis:');
    console.log(`   Display Width:  ${state1.canvas.width}px → ${state2.canvas.width}px ${changes.canvasDisplayWidth ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Display Height: ${state1.canvas.height}px → ${state2.canvas.height}px ${changes.canvasDisplayHeight ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Actual Width:   ${state1.canvas.actualWidth}px → ${state2.canvas.actualWidth}px ${changes.canvasActualWidth ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Actual Height:  ${state1.canvas.actualHeight}px → ${state2.canvas.actualHeight}px ${changes.canvasActualHeight ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Top:    ${state1.canvas.top.toFixed(2)}px → ${state2.canvas.top.toFixed(2)}px ${state1.canvas.top !== state2.canvas.top ? '⚠️  CHANGED' : '✅'}`);
    console.log(`   Left:   ${state1.canvas.left.toFixed(2)}px → ${state2.canvas.left.toFixed(2)}px ${state1.canvas.left !== state2.canvas.left ? '⚠️  CHANGED' : '✅'}`);
    console.log('');

    // Summary
    console.log('═══ SUMMARY ═══\n');

    const issues = [];
    if (changes.containerWidth) issues.push(`Container width: ${state1.container.width}px → ${state2.container.width}px`);
    if (changes.containerHeight) issues.push(`Container height: ${state1.container.height}px → ${state2.container.height}px`);
    if (changes.containerPosition) issues.push('Container position shifted');
    if (changes.canvasDisplayWidth || changes.canvasDisplayHeight) issues.push('Canvas display size changed');
    if (changes.canvasActualWidth || changes.canvasActualHeight) issues.push('Canvas actual size changed');
    if (changes.canvasPosition) issues.push('Canvas position shifted');

    if (issues.length > 0) {
      console.log('⚠️  ISSUES DETECTED:');
      issues.forEach(issue => console.log(`   ❌ ${issue}`));
      console.log('');
      console.log('💡 Potential Causes:');
      console.log('   - CSS layout recalculation on data change');
      console.log('   - Chart library triggering resize');
      console.log('   - Container flex/grid properties changing');
      console.log('   - Missing width/height constraints');
    } else {
      console.log('✅ No layout shifts detected!');
      console.log('   The visual issue may be related to:');
      console.log('   - Chart rendering (data points, scales, etc.)');
      console.log('   - Chart library internal state');
      console.log('   - Animation/transition effects');
    }

    console.log('');

    // Save report
    const report = {
      timestamp: new Date().toISOString(),
      containerInfo,
      before: state1,
      after: state2,
      changes,
      issues
    };

    const reportPath = join(process.cwd(), 'debug-timeframe-report.json');
    await writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Full report: ${reportPath}`);
    console.log(`📁 Screenshots: ${process.cwd()}`);

    await tab.close();
    console.log('\n✅ Debugging complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

debugTimeframeSwitching();
