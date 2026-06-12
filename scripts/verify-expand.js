/* Drives the live app with puppeteer-core to verify the screen-expand
   interaction: hover shows grab cursor + EXPAND tag, click zooms in and
   shows the close button, Escape zooms back out. */
const puppeteer = require('puppeteer-core');

const URL = process.env.APP_URL || 'http://localhost:3000';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text());
  });

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('canvas');
  await sleep(5000); // let the GLB models load and the scene settle

  await page.screenshot({ path: 'scripts/shot-1-room.png' });

  // Probe a grid of points until the grab cursor appears (a screen hotspot).
  // The camera eases toward the mouse, so settle on each point briefly.
  async function findHotspot() {
    for (let fy = 0.25; fy <= 0.6; fy += 0.05) {
      for (let fx = 0.25; fx <= 0.75; fx += 0.05) {
        const x = Math.round(1280 * fx);
        const y = Math.round(800 * fy);
        await page.mouse.move(x, y);
        await sleep(150);
        let cursor = await page.evaluate(() => document.body.style.cursor);
        if (cursor !== 'grab') continue;
        // Let the camera finish easing toward this mouse position, then
        // confirm the point is still over the glass. Nudge the mouse a
        // pixel so a fresh pointermove re-raycasts at the settled view.
        await sleep(900);
        await page.mouse.move(x + 1, y);
        await sleep(150);
        cursor = await page.evaluate(() => document.body.style.cursor);
        if (cursor === 'grab') return { x: x + 1, y };
      }
    }
    return null;
  }
  const hit = await findHotspot();
  console.log('hover hotspot found:', JSON.stringify(hit));
  if (!hit) throw new Error('no screen hotspot produced a grab cursor');

  // EXPAND tag should be visible beside the cursor.
  const hint = await page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find((d) =>
      d.textContent.trim().startsWith('EXPAND')
    );
    return el ? getComputedStyle(el).display : 'missing';
  });
  console.log('EXPAND tag display:', hint);
  await page.screenshot({ path: 'scripts/shot-2-hover.png' });

  // The portfolio Html overlays must be click-through while zoomed out.
  const overlayPe = await page.evaluate(() => {
    const a = [...document.querySelectorAll('a')].find((el) =>
      el.textContent.includes('OPEN')
    );
    return a ? getComputedStyle(a).pointerEvents : 'no-links-found';
  });
  console.log('portfolio link pointer-events (zoomed out):', overlayPe);

  // Click to expand, wait for the camera to dolly in. The camera kept
  // easing during the checks above, so re-find the hotspot first and click
  // while the cursor confirms it's over the glass.
  const hit2 = await findHotspot();
  if (!hit2) throw new Error('lost the hotspot before clicking');
  await page.mouse.click(hit2.x, hit2.y);
  await sleep(2000);
  const closeBtn = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((el) =>
      el.textContent.includes('CLOSE')
    );
    return b ? 'visible' : 'missing';
  });
  console.log('close button after click:', closeBtn);
  await page.screenshot({ path: 'scripts/shot-3-expanded.png' });

  // Escape should zoom back out and remove the close button.
  await page.keyboard.press('Escape');
  await sleep(2000);
  const closeAfterEsc = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find((el) =>
      el.textContent.includes('CLOSE')
    );
    return b ? 'still-visible' : 'gone';
  });
  console.log('close button after Escape:', closeAfterEsc);
  await page.screenshot({ path: 'scripts/shot-4-back.png' });

  console.log('page errors:', errors.length ? errors : 'none');
  await browser.close();
})().catch((e) => {
  console.error('VERIFY FAILED:', e.message);
  process.exit(1);
});
