import { test, expect } from '@playwright/test';

test('demo controls — sample scan, start/stop demo and screenshot', async ({ page }) => {
  // Make sure a static server is running (e.g. `python -m http.server 8000` at the repo root)
  await page.goto('http://127.0.0.1:8000/index.html');
  await page.waitForSelector('#scan-button');

  // Run a single demo scan and assert the UI updated
  await page.click('#demo-once');
  await expect(page.locator('#scan-summary')).toContainText('Last scan', { timeout: 2000 });

  // Start the automated demo, wait for a couple of steps, then stop
  await page.click('#demo-start');
  // Wait long enough for at least two demo steps (5s per step)
  await page.waitForTimeout(11000);
  await page.click('#demo-stop');

  // Check database status changed from the initial 'Pending' value
  const dbStatus = await page.locator('#db-status').textContent();
  expect(dbStatus).not.toBe('Pending');

  // Capture a screenshot of the page (saved relative to test run directory)
  await page.screenshot({ path: 'test-results/demo-scan.png', fullPage: true });
});
