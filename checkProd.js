const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating to https://pakbani.netlify.app...');
  try {
    await page.goto('https://pakbani.netlify.app', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Navigation complete. Checking page content...');
  } catch (err) {
    console.error('Error during navigation:', err);
  }

  await browser.close();
})();
