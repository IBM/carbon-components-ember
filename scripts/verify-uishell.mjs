import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4321/2-components/ui-shell';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
const consoleMsgs = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => consoleMsgs.push(`[pageerror] ${e.message}`));

await page.goto(url, { waitUntil: 'commit', timeout: 60000 });
for (let i = 0; i < 60; i++) {
  const n = await page.locator('h1').count().catch(() => 0);
  if (n > 0) break;
  await page.waitForTimeout(10000);
  if (i % 6 === 5) console.log(`still waiting... ${(i + 1) * 10}s`);
}
await page.waitForTimeout(15000);

const headers = await page.locator('.cds--header').count();
const sidenavs = await page.locator('.cds--side-nav__navigation').count();
const globalActions = await page.locator('.cds--header__global button').count();
const bodyText = (await page.locator('body').innerText()).slice(0, 400);

console.log('URL:', page.url());
console.log('cds--header count:', headers);
console.log('side-nav count:', sidenavs);
console.log('global action buttons:', globalActions);

// Containment: the fixed-position header must stay inside its wrapper box,
// not overlay the whole viewport.
const headerBox = await page.locator('.cds--header').first().boundingBox();
const viewport = page.viewportSize();
console.log('header box:', JSON.stringify(headerBox));
const contained =
  headerBox && headerBox.y > 40 && headerBox.width < viewport.width - 40;
console.log('header contained in preview box:', contained ? 'YES' : 'NO');

// Expansion: clicking "Category 1" must expand its submenu.
const submenuBtn = page.locator('.cds--side-nav__submenu', { hasText: 'Category 1' });
console.log('Category 1 submenu button count:', await submenuBtn.count());
const before = await page.locator('.cds--side-nav__menu-item').count();
await submenuBtn.first().click();
await page.waitForTimeout(500);
const after = await page.locator('.cds--side-nav__menu-item').count();
console.log(`submenu items before click: ${before}, after click: ${after}`);
console.log('Category 1 expands on click:', after > before ? 'YES' : 'NO');
await page.screenshot({ path: '/tmp/uishell-preview-expanded.png', fullPage: false });

// collapse again
await submenuBtn.first().click();
await page.waitForTimeout(500);
const collapsed = await page.locator('.cds--side-nav__menu-item').count();
console.log('collapses back on second click:', collapsed === before ? 'YES' : 'NO');

console.log('--- console errors/warnings ---');
console.log(consoleMsgs.slice(0, 30).join('\n') || '(none)');

await page.screenshot({ path: '/tmp/uishell-preview.png', fullPage: false });
await browser.close();
