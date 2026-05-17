const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Capture ALL requests with method and URL
  const requests = [];
  page.on('request', req => {
    if (req.url().includes('localhost:3000') && (req.url().includes('/admin') || req.url().includes('/api'))) {
      requests.push({ method: req.method(), url: req.url() });
    }
  });
  
  // Capture responses to /admin paths
  page.on('response', async resp => {
    if (resp.url().includes('/admin/learning-paths')) {
      const status = resp.status();
      const contentType = resp.headers()['content-type'];
      const text = await resp.text().catch(() => 'error');
      console.log(`Response: ${resp.request().method()} ${resp.url()}`);
      console.log(`  Status: ${status}, Content-Type: ${contentType}`);
      console.log(`  Body preview: ${text.substring(0, 100)}`);
    }
  });
  
  console.log('Loading page and creating...');
  await page.goto('http://localhost:3000/admin/learning-paths', { timeout: 20000, waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(1000);
  
  // Trigger create
  await page.click('.btn-create').catch(() => {});
  await page.waitForTimeout(300);
  await page.fill('input[placeholder*="Python"]', 'Proxy测试').catch(() => {});
  await page.waitForTimeout(200);
  await page.click('.btn-submit').catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('\nAll captured requests:');
  requests.forEach(r => console.log(`  ${r.method} ${r.url}`));
  
  await browser.close();
})();
