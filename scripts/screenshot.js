// Dev helper: screenshot the running dev server.
// Usage: node scripts/screenshot.js <url> <outfile> [waitMs] [mouseX] [mouseY]
// mouseX/mouseY are in [-1, 1] viewport coords to simulate the look-around.
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const [url, outfile, waitMs = '8000', mouseX, mouseY] = process.argv.slice(2);

const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATHS.find((p) => fs.existsSync(p)),
    headless: 'new',
    args: ['--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();
  page.on('console', (msg) => console.log('[console]', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

  if (mouseX !== undefined) {
    const px = ((parseFloat(mouseX) + 1) / 2) * 1280;
    const py = ((1 - parseFloat(mouseY)) / 2) * 800;
    await page.mouse.move(px, py, { steps: 10 });
  }

  await new Promise((r) => setTimeout(r, parseInt(waitMs, 10)));
  await page.screenshot({ path: outfile });
  await browser.close();
  console.log('saved', outfile);
})();
