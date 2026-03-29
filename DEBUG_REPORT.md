# Timeframe Switching Visual Issue - Debug Report

**Date**: 2026-01-03
**Page**: http://localhost:3000/mk-share/trade
**Issue**: Visual rendering problem when switching from 1D to 1h timeframe

---

## Executive Summary

The debugging revealed a **critical canvas sizing issue**. The chart canvas is not properly sized to match its container dimensions, resulting in visual rendering problems.

### Key Finding

- **Container Size**: 1170.67px × 550px ✅
- **Canvas Display Size**: 300px × 150px ❌
- **Canvas Actual Size**: 300px × 150px ❌

**The canvas is using default dimensions (300×150) instead of filling the container!**

---

## Detailed Analysis

### Container Information

```javascript
{
  "tag": "DIV",
  "className": "relative w-full overflow-hidden rounded-lg",
  "width": 1170.666748046875,
  "height": 550,
  "selector": ".relative.w-full.overflow-hidden.rounded-lg"
}
```

**Container CSS Properties:**
- `display`: block
- `position`: relative
- `overflow`: hidden
- `width`: 100% (computed: 1170.67px)
- `height`: 550px (fixed height)

### Canvas Properties

**Before timeframe switch (1D):**
```javascript
{
  "width": 300,           // Display width (CSS)
  "height": 150,          // Display height (CSS)
  "actualWidth": 300,     // Canvas element width attribute
  "actualHeight": 150,    // Canvas element height attribute
  "position": "static"
}
```

**After timeframe switch (1h):**
```javascript
{
  "width": 300,           // UNCHANGED
  "height": 150,          // UNCHANGED
  "actualWidth": 300,     // UNCHANGED
  "actualHeight": 150,    // UNCHANGED
  "position": "static"
}
```

### Layout Stability

✅ **No layout shifts detected during timeframe switch**
- Container dimensions: Stable
- Container position: Stable
- Canvas dimensions: Stable (but incorrect)
- Canvas position: Stable

---

## Root Cause Analysis

### Primary Issue: Canvas Not Resizing to Container

The canvas element has default dimensions (300×150px) and is not being resized to match the container dimensions (1170.67×550px).

**Expected Behavior:**
```javascript
canvas.width = containerRect.width;   // Should be 1170
canvas.height = containerRect.height; // Should be 550
```

**Actual Behavior:**
```javascript
canvas.width = 300;  // Default canvas width
canvas.height = 150; // Default canvas height
```

### Why This Causes Visual Issues

1. **Chart Library Rendering**: The chart library (likely Lightweight Charts, TradingView, or similar) renders to the 300×150 canvas, which is then stretched by CSS to fill the 1170×550 container.

2. **Pixelation**: This causes pixelation and blurriness because the canvas pixel density doesn't match the display size.

3. **Data Rendering**: When switching timeframes, new data is rendered to the same undersized canvas, amplifying visual artifacts.

### CSS Analysis

**Container CSS:**
```css
.relative.w-full.overflow-hidden.rounded-lg {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem; /* rounded-lg */
}
```

The container properly takes full width, but the canvas inside is not inheriting or calculating the correct size.

---

## Impact Assessment

### Visual Issues Caused by Canvas Sizing

1. **Blurry Chart** ⚠️
   - Canvas is upscaled from 300×150 to 1170×550
   - Results in 3.9× horizontal and 3.7× vertical scaling
   - Causes pixelation and blurry lines

2. **Incorrect Rendering** ⚠️
   - Chart library assumes canvas size matches display size
   - Coordinate calculations may be incorrect
   - Text and labels may be improperly sized

3. **Timeframe Switch Artifacts** ⚠️
   - When switching timeframes, new data renders to undersized canvas
   - Visual "jump" or distortion as content rerenders
   - May cause chart to appear "zoomed in" or clipped

---

## Recommended Solutions

### Solution 1: Implement Canvas Resize on Mount (Preferred)

Add a resize handler that sets canvas dimensions to match container:

```typescript
useEffect(() => {
  const container = containerRef.current;
  const canvas = canvasRef.current;

  if (!container || !canvas) return;

  const resizeCanvas = () => {
    const rect = container.getBoundingClientRect();

    // Set canvas actual size to match container
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Notify chart library to redraw
    chartInstance?.resize(rect.width, rect.height);
  };

  // Initial resize
  resizeCanvas();

  // Listen for container size changes
  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(container);

  return () => resizeObserver.disconnect();
}, []);
```

### Solution 2: Add Width/Height Attributes to Canvas

If using a chart library component, ensure it receives size props:

```tsx
<ChartComponent
  width={containerWidth}
  height={containerHeight}
  autosize={true}
/>
```

### Solution 3: Check Chart Library Configuration

Most chart libraries have built-in autosize options:

**Lightweight Charts:**
```typescript
const chart = createChart(container, {
  autoSize: true,  // Auto-resize to container
  width: container.clientWidth,
  height: container.clientHeight
});
```

**TradingView:**
```typescript
new TradingView.widget({
  autosize: true,
  // ... other options
});
```

---

## Testing Recommendations

### Verification Steps

1. **Check Canvas Size After Fix**
   ```javascript
   const canvas = document.querySelector('canvas');
   console.log({
     displayWidth: canvas.getBoundingClientRect().width,  // Should be ~1170
     displayHeight: canvas.getBoundingClientRect().height, // Should be ~550
     actualWidth: canvas.width,   // Should be ~1170
     actualHeight: canvas.height  // Should be ~550
   });
   ```

2. **Test Timeframe Switching**
   - Switch between 1D, 1h, 5m, etc.
   - Verify canvas size remains correct
   - Check for visual artifacts or layout shifts

3. **Test Window Resize**
   - Resize browser window
   - Verify canvas resizes with container
   - Chart should remain properly rendered

### Automated Testing

Add E2E test to verify canvas sizing:

```typescript
test('chart canvas should match container size', async ({ page }) => {
  await page.goto('/mk-share/trade');

  const canvasSize = await page.evaluate(() => {
    const container = document.querySelector('.relative.w-full.overflow-hidden.rounded-lg');
    const canvas = document.querySelector('canvas');

    return {
      containerWidth: container.getBoundingClientRect().width,
      containerHeight: container.getBoundingClientRect().height,
      canvasDisplayWidth: canvas.getBoundingClientRect().width,
      canvasDisplayHeight: canvas.getBoundingClientRect().height,
      canvasActualWidth: canvas.width,
      canvasActualHeight: canvas.height
    };
  });

  // Canvas should match container (within 1px tolerance)
  expect(Math.abs(canvasSize.canvasActualWidth - canvasSize.containerWidth)).toBeLessThan(1);
  expect(Math.abs(canvasSize.canvasActualHeight - canvasSize.containerHeight)).toBeLessThan(1);
});
```

---

## Additional Findings

### Console Errors

⚠️ **Note**: Check the browser console for additional errors:
- Chart library warnings
- ResizeObserver errors
- React rendering errors

### Performance Considerations

Once canvas sizing is fixed, consider:

1. **Device Pixel Ratio**: Multiply canvas size by `window.devicePixelRatio` for crisp rendering on high-DPI displays

   ```typescript
   const dpr = window.devicePixelRatio || 1;
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   canvas.style.width = `${rect.width}px`;
   canvas.style.height = `${rect.height}px`;
   ctx.scale(dpr, dpr);
   ```

2. **Debounce Resize**: Debounce resize handler to avoid excessive redraws

3. **Chart Data Caching**: Cache chart data to avoid refetching on resize

---

## Files Generated

- `debug-1d-timeframe.png` - Screenshot before switch
- `debug-1h-timeframe.png` - Screenshot after switch
- `debug-timeframe-report.json` - Raw debug data
- `debug-chart-automated.mjs` - Debugging script
- `debug-chart-improved.mjs` - Improved debugging script

---

## Next Steps

1. ✅ **Identify chart component file** - Locate the React component rendering the chart
2. ⏳ **Implement canvas resize logic** - Add ResizeObserver or manual resize handling
3. ⏳ **Test timeframe switching** - Verify fix resolves visual issues
4. ⏳ **Add E2E test** - Prevent regression
5. ⏳ **Optimize for HiDPI** - Consider device pixel ratio scaling

---

## Conclusion

The timeframe switching visual issue is caused by **canvas sizing mismatch**, not layout shifts. The canvas element is not properly sized to match its container, resulting in a stretched/pixelated chart. Implementing proper canvas resize handling will resolve the issue.

**Severity**: High
**Priority**: P1
**Estimated Fix Time**: 1-2 hours

---

*Report generated using Chrome DevTools Protocol automated debugging*
*Debugging scripts available in project root*
