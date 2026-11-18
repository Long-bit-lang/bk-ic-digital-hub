// Test Suite for BK-IC Homepage News Crawl Data & CMS Verification
import assert from 'node:assert';
import { HOME_NEWS_DATA } from '../src/data/homeData';
import { INITIAL_NEWS } from '../server/db';

async function runNewsVerificationTests() {
  console.log('====================================================');
  console.log('BK-IC HOMEPAGE NEWS CRAWL & CMS VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. Check exact count of crawl news items
  assert.strictEqual(HOME_NEWS_DATA.length, 5, 'Must contain exactly 5 crawl news items');
  console.log('[PASS] Scenario 1: Exactly 5 items present in HOME_NEWS_DATA');

  // 2. Requirement 1: Status must default to draft (Chưa tự động xuất bản)
  for (const item of HOME_NEWS_DATA) {
    assert.strictEqual(item.status, 'draft', `News "${item.title}" must have status "draft"`);
    assert.ok(item.verificationNotes, `News "${item.title}" must have verification notes`);
  }
  console.log('[PASS] Scenario 2: All items are strictly in "draft" status awaiting BCN confirmation');

  // 3. Requirement 2: No fake permalinks, URL points to official Fanpage
  for (const item of HOME_NEWS_DATA) {
    assert.strictEqual(
      item.sourceUrl,
      'https://www.facebook.com/dut.bkic',
      `News "${item.title}" sourceUrl must be official Fanpage`
    );
    assert.strictEqual(
      item.detailUrl,
      'https://www.facebook.com/dut.bkic',
      `News "${item.title}" detailUrl must point to official Fanpage without fake permalink`
    );
  }
  console.log('[PASS] Scenario 3: All URLs point strictly to official Fanpage (no synthetic permalinks)');

  // 4. Requirement 5: Authentic publication dates preserved
  const dates = HOME_NEWS_DATA.map((n) => n.publishedAt);
  assert.ok(dates.includes('04/11/2026'), 'Must contain News 01 date: 04/11/2026');
  assert.ok(dates.includes('26/09/2026'), 'Must contain News 04 date: 26/09/2026');
  assert.ok(dates.includes('08/09/2026'), 'Must contain News 05 date: 08/09/2026');
  assert.ok(dates.includes('15/04/2026'), 'Must contain News 02 date: 15/04/2026');
  assert.ok(dates.includes('06/04/2026'), 'Must contain News 03 date: 06/04/2026');
  console.log('[PASS] Scenario 4: All original publication dates are precisely preserved');

  // 5. Requirement for News 05: Not prioritized for publishing
  const news05 = HOME_NEWS_DATA.find((n) => n.publishedAt === '08/09/2026');
  assert.ok(news05, 'News 05 must exist');
  assert.strictEqual(news05.priority, 'low', 'News 05 must have priority="low" (Chưa ưu tiên xuất bản)');
  console.log('[PASS] Scenario 5: News 05 (First Meeting) is marked as low priority (Chưa ưu tiên xuất bản)');

  // 6. Backend INITIAL_NEWS schema sync
  assert.strictEqual(INITIAL_NEWS.length, 5, 'INITIAL_NEWS in server/db must have 5 items');
  for (const item of INITIAL_NEWS) {
    assert.strictEqual(item.status, 'draft', 'Database default news must be draft');
  }
  console.log('[PASS] Scenario 6: Backend server database initial seed aligns with client data');

  console.log('\n====================================================');
  console.log('ALL NEWS CRAWL & CMS VERIFICATION TESTS PASSED!');
  console.log('====================================================');
}

runNewsVerificationTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
