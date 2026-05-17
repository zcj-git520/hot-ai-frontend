const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('=== Comprehensive Admin Test ===\n');
  
  // Test 1: Direct API call
  console.log('1. Direct API test:');
  const resp1 = await page.evaluate(async () => {
    const r = await fetch('http://localhost/api/admin/learning-paths?page=1&page_size=10');
    const d = await r.json();
    return { status: r.status, code: d.code, total: d.data.total, listLen: d.data.list.length };
  });
  console.log('   Result:', JSON.stringify(resp1));
  
  // Test 2: Fresh page load with cache cleared
  console.log('\n2. Fresh page load (cache cleared):');
  context.clearCookies();
  await page.goto('http://localhost:3000/admin/learning-paths', { timeout: 20000, waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(3000);
  
  // Test 3: Check both table and empty state
  const state1 = await page.evaluate(() => {
    const tbody = document.querySelector('tbody');
    const emptyEl = document.querySelector('.empty-state');
    const statsEl = document.querySelector('.stats-bar');
    return {
      hasTable: tbody !== null,
      tableRows: tbody?.querySelectorAll('tr').length || 0,
      emptyVisible: emptyEl !== null && getComputedStyle(emptyEl).display !== 'none',
      statsText: statsEl?.innerText || 'not found'
    };
  });
  console.log('   State:', JSON.stringify(state1));
  
  // Test 4: Try the create modal flow again
  console.log('\n3. Create flow test:');
  const createBtn = await page.$('.btn-create');
  if (createBtn) {
    await createBtn.click();
    await page.waitForTimeout(500);
    
    const modalVisible = await page.evaluate(() => document.querySelector('.form-grid') !== null);
    console.log('   Modal visible:', modalVisible);
    
    // Fill minimal form
    const titleInput = await page.$('input[placeholder*="Python"]');
    if (titleInput) {
      await titleInput.fill('综合测试课程');
      await page.waitForTimeout(200);
    }
    
    // Submit
    const submitBtn = await page.$('.btn-submit');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
    }
    
    // Final state
    const state2 = await page.evaluate(() => {
      const tbody = document.querySelector('tbody');
      const emptyEl = document.querySelector('.empty-state');
      return {
        tableRows: tbody?.querySelectorAll('tr').length || 0,
        emptyVisible: emptyEl !== null && getComputedStyle(emptyEl).display !== 'none',
        hasSuccess: document.body.innerText.includes('成功'),
        hasFailure: document.body.innerText.includes('失败')
      };
    });
    console.log('   After create:', JSON.stringify(state2));
  }
  
  // Test 5: API call after operations
  console.log('\n4. API after operations:');
  const resp2 = await page.evaluate(async () => {
    const r = await fetch('http://localhost/api/admin/learning-paths?page=1&page_size=10');
    const d = await r.json();
    return { status: r.status, total: d.data.total, listLen: d.data.list.length };
  });
  console.log('   Result:', JSON.stringify(resp2));
  
  await browser.close();
  console.log('\n=== Test Complete ===');
})();
