import { chromium } from '@playwright/test';

async function testAdminPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  try {
    // Test 1: Admin Dashboard
    console.log('Testing /admin...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
    const dashboardTitle = await page.textContent('h1');
    console.log('Dashboard title:', dashboardTitle);
    results.push({ test: 'Admin Dashboard', status: dashboardTitle ? 'PASS' : 'FAIL' });

    // Test 2: Course Management Page
    console.log('Testing /admin/learning-paths...');
    await page.goto('http://localhost:3000/admin/learning-paths', { waitUntil: 'networkidle' });
    const pageTitle = await page.textContent('h1');
    console.log('Page title:', pageTitle);
    results.push({ test: 'Course Management Page', status: pageTitle ? 'PASS' : 'FAIL' });

    // Test 3: Check dropdown filter exists
    const filterSelect = await page.locator('.filter-select').count();
    console.log('Filter selects found:', filterSelect);
    results.push({ test: 'Filter Dropdowns', status: filterSelect >= 2 ? 'PASS' : 'FAIL' });

    // Test 4: Check table exists
    const table = await page.locator('.data-table').count();
    console.log('Data tables found:', table);
    results.push({ test: 'Data Table', status: table >= 1 ? 'PASS' : 'FAIL' });

    // Test 5: Check create button exists
    const createBtn = await page.locator('button:has-text("新建课程")').count();
    console.log('Create button found:', createBtn);
    results.push({ test: 'Create Button', status: createBtn >= 1 ? 'PASS' : 'FAIL' });

    // Test 6: Check stats bar
    const statsBar = await page.locator('.stats-bar').count();
    console.log('Stats bar found:', statsBar);
    results.push({ test: 'Stats Bar', status: statsBar >= 1 ? 'PASS' : 'FAIL' });

    // Test 7: Check pagination
    const pagination = await page.locator('.pagination').count();
    console.log('Pagination found:', pagination);
    results.push({ test: 'Pagination', status: 'INFO' });

    // Test 8: Check for any console errors (Error level only)
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await page.reload();
    await page.waitForTimeout(1000);
    results.push({
      test: 'No Console Errors',
      status: consoleErrors.length === 0 ? 'PASS' : `FAIL (${consoleErrors.length} errors)`
    });

  } catch (error) {
    console.error('Test error:', error.message);
    results.push({ test: 'Overall', status: `ERROR: ${error.message}` });
  } finally {
    await browser.close();
  }

  console.log('\n=== Test Results ===');
  results.forEach(r => console.log(`${r.status}: ${r.test}`));
  const passCount = results.filter(r => r.status === 'PASS').length;
  console.log(`\nPassed: ${passCount}/${results.length}`);

  return passCount === results.length;
}

testAdminPages().then(success => {
  process.exit(success ? 0 : 1);
});