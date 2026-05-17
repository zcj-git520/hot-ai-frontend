const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture ALL responses
  page.on('response', async resp => {
    if (resp.url().includes('/admin/learning-paths') && resp.request().method() === 'POST') {
      console.log('=== POST Response ===');
      console.log('Status:', resp.status());
      try {
        const data = await resp.json();
        console.log('Code:', data.code);
        console.log('Message:', data.message);
        console.log('Data:', JSON.stringify(data.data));
      } catch (e) {
        console.log('Parse error:', e.message);
        const text = await resp.text();
        console.log('Raw text:', text.substring(0, 200));
      }
    }
  });
  
  console.log('Loading page...');
  await page.goto('http://localhost:3000/admin/learning-paths', { timeout: 20000, waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2000);
  
  console.log('\nClicking create...');
  await page.click('.btn-create');
  await page.waitForTimeout(500);
  
  console.log('Filling title...');
  await page.fill('input[placeholder*="Python"]', 'Capture测试课程');
  await page.waitForTimeout(200);
  
  console.log('Submitting...');
  await page.click('.btn-submit');
  await page.waitForTimeout(3000);
  
  console.log('\n=== Done ===');
  await browser.close();
})();
