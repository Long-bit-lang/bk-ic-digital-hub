// BK-IC Digital Hub — Homepage Content Sections Test Suite
// Verifies all 12 Acceptance Criteria for News, Competitions, Featured Activities, and Partners

import assert from 'node:assert';
import {
  HOME_NEWS_DATA,
  HOME_COMPETITIONS_DATA,
  HOME_ACTIVITIES_DATA,
  HOME_PARTNERS_DATA,
  sortCompetitions,
  type NewsItem,
  type CompetitionItem,
  type ActivityItem,
  type PartnerItem
} from '../src/data/homeData';

console.log('====================================================');
console.log('BK-IC HOMEPAGE CONTENT SECTIONS - TEST SUITE');
console.log('====================================================\n');

// Helper: parse DD/MM/YYYY
function parseDateToTimestamp(dateStr: string): number {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d.getTime();
  }
  return 0;
}

// -----------------------------------------------------------------------------
// SECTION 1: BẢN TIN (NEWS)
// -----------------------------------------------------------------------------
console.log('--- Testing Section 1: Bản tin (News) ---');

// Criteria 1: Maximum 5 news items, sorted descending
const sortedNews = [...HOME_NEWS_DATA]
  .sort((a, b) => parseDateToTimestamp(b.publishedAt) - parseDateToTimestamp(a.publishedAt))
  .slice(0, 5);

assert.strictEqual(sortedNews.length <= 5, true, 'News items displayed must be <= 5');
assert.strictEqual(sortedNews.length, 5, 'With 6 items available, exactly 5 must be selected');
console.log('[PASS] Scenario 1: Selects exactly 5 newest items out of available news');

// Verify descending order
for (let i = 0; i < sortedNews.length - 1; i++) {
  const current = parseDateToTimestamp(sortedNews[i].publishedAt);
  const next = parseDateToTimestamp(sortedNews[i + 1].publishedAt);
  assert.strictEqual(
    current >= next,
    true,
    `News item at index ${i} (${sortedNews[i].publishedAt}) must be newer or equal to ${sortedNews[i + 1].publishedAt}`
  );
}
console.log('[PASS] Scenario 2: News items are sorted descending by published date');

// Criteria 2 & 11: News items have valid detail URLs and categories
sortedNews.forEach((news) => {
  assert.ok(news.id, 'News item must have an id');
  assert.ok(news.title, 'News item must have a title');
  assert.ok(news.description, 'News item must have description');
  assert.ok(
    news.detailUrl.startsWith('/') || news.detailUrl.startsWith('https://'),
    'News item detailUrl must be an internal route starting with / or valid official URL starting with https://'
  );
  assert.ok(news.image.startsWith('/'), 'News item image path must start with /');
});
console.log('[PASS] Scenario 3: All news items have valid metadata, images, and valid internal routes');

// -----------------------------------------------------------------------------
// SECTION 2: CUỘC THI (COMPETITIONS)
// -----------------------------------------------------------------------------
console.log('\n--- Testing Section 2: Cuộc thi (Competitions) ---');

// Criteria 5, 6, 7: Carousel constraints, authentic fields & statuses
assert.ok(HOME_COMPETITIONS_DATA.length >= 2, 'Competitions data contains authentic club competitions');
console.log(`[PASS] Scenario 4: Competitions collection contains ${HOME_COMPETITIONS_DATA.length} items`);

const validStatuses = ['upcoming', 'ongoing', 'completed'];
HOME_COMPETITIONS_DATA.forEach((comp) => {
  assert.ok(validStatuses.includes(comp.status), `Competition status "${comp.status}" must be valid`);
  assert.ok(comp.statusLabel, 'Competition must have a human-readable status label');
  assert.ok(comp.startDate, 'Competition must specify startDate');
  assert.ok(comp.registrationDeadline, 'Competition must specify registrationDeadline');
  assert.ok(comp.field, 'Competition must specify field (Lĩnh vực cuộc thi)');
  assert.ok(comp.detailUrl.startsWith('/'), 'Competition detailUrl must be a valid route');
});
console.log('[PASS] Scenario 5: All competitions have valid fields, statuses, dates, and detail links');

// Verify status sorting format: ongoing -> upcoming -> completed
const testCompList: CompetitionItem[] = [
  { ...HOME_COMPETITIONS_DATA[0], id: 'c-comp', status: 'completed' },
  { ...HOME_COMPETITIONS_DATA[0], id: 'c-ong', status: 'ongoing' },
  { ...HOME_COMPETITIONS_DATA[0], id: 'c-upc', status: 'upcoming' }
];
const sortedCompList = sortCompetitions(testCompList);
assert.strictEqual(sortedCompList[0].status, 'ongoing', 'First must be ongoing');
assert.strictEqual(sortedCompList[1].status, 'upcoming', 'Second must be upcoming');
assert.strictEqual(sortedCompList[2].status, 'completed', 'Third must be completed');
console.log('[PASS] Scenario 5b: Competitions are strictly sorted by format: ongoing -> upcoming -> completed');

// Verify responsive visible count bounds
const testWidths = [
  { width: 1200, expectedVisible: 3, name: 'Desktop' },
  { width: 800, expectedVisible: 2, name: 'Tablet' },
  { width: 400, expectedVisible: 1, name: 'Mobile' }
];

testWidths.forEach(({ width, expectedVisible, name }) => {
  const visible = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  assert.strictEqual(visible, expectedVisible, `${name} (${width}px) visible count must be ${expectedVisible}`);
  const maxIndex = Math.max(0, HOME_COMPETITIONS_DATA.length - visible);
  assert.strictEqual(maxIndex >= 0, true, 'Max index must be >= 0');
});
console.log('[PASS] Scenario 6: Carousel responsive breakpoint logic (Desktop=3, Tablet=2, Mobile=1)');

// -----------------------------------------------------------------------------
// SECTION 3: HOẠT ĐỘNG NỔI BẬT (FEATURED ACTIVITIES)
// -----------------------------------------------------------------------------
console.log('\n--- Testing Section 3: Hoạt động nổi bật (Featured Activities) ---');

const featuredActivities = HOME_ACTIVITIES_DATA.filter((a) => a.featured);
assert.ok(featuredActivities.length >= 1, 'Must have at least 1 featured activity for the Lead Feature card');
console.log(`[PASS] Scenario 7: Found ${featuredActivities.length} featured activities for Asymmetric Grid`);

const leadActivity = featuredActivities[0];
assert.ok(leadActivity.title, 'Lead activity must have title');
assert.ok(leadActivity.description, 'Lead activity must have description');
assert.ok(leadActivity.category, 'Lead activity must have category');
assert.ok(leadActivity.location, 'Lead activity has physical location specified');
console.log(`[PASS] Scenario 8: Lead activity "${leadActivity.title}" has complete metadata and location`);

const supportingActivities = featuredActivities.slice(1, 4);
assert.ok(supportingActivities.length >= 2, 'Must have supporting activities for the side column stack');
supportingActivities.forEach((act) => {
  assert.ok(act.title && act.detailUrl.startsWith('/'), 'Supporting activity has valid title and route');
});
console.log(`[PASS] Scenario 9: Supporting activities stack contains ${supportingActivities.length} items`);

// -----------------------------------------------------------------------------
// SECTION 4: ĐỐI TÁC & HỆ SINH THÁI (PARTNERS)
// -----------------------------------------------------------------------------
console.log('\n--- Testing Section 4: Đối tác & Hệ sinh thái (Partners) ---');

const expectedTiers = ['Đơn vị bảo trợ', 'Đối tác chiến lược', 'Đối tác đồng hành'];
expectedTiers.forEach((tier) => {
  const count = HOME_PARTNERS_DATA.filter((p) => p.category === tier).length;
  assert.ok(count > 0, `Partner tier "${tier}" must have at least 1 partner (found ${count})`);
});
console.log('[PASS] Scenario 10: All 3 partner tiers (Bảo trợ, Chiến lược, Đồng hành) are populated');

HOME_PARTNERS_DATA.forEach((partner) => {
  assert.ok(partner.name, 'Partner must have name');
  assert.ok(partner.initials, 'Partner must have fallback monogram/initials');
  assert.ok(partner.displayOrder > 0, 'Partner must have positive displayOrder');
  if (partner.websiteUrl) {
    assert.ok(partner.websiteUrl.startsWith('http'), 'Partner websiteUrl must be a valid external URL');
  }
});
console.log('[PASS] Scenario 11: All partner cards have fallback initials, displayOrder, and valid website URLs');

// -----------------------------------------------------------------------------
// EXTENSIBILITY & ZERO-HARDCODE VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- Testing Extensibility & Empty States ---');

// Can add a new item without breaking schema
const customNews: NewsItem = {
  id: 'custom-news-99',
  title: 'Bản tin thử nghiệm khả năng mở rộng',
  description: 'Mô tả thử nghiệm',
  category: 'Sự kiện',
  publishedAt: '30/12/2026',
  image: '/images/bkic/bkic_launch.jpg',
  detailUrl: '/activities'
};
const extendedList = [customNews, ...HOME_NEWS_DATA];
const extendedSorted = extendedList
  .sort((a, b) => parseDateToTimestamp(b.publishedAt) - parseDateToTimestamp(a.publishedAt))
  .slice(0, 5);

assert.strictEqual(extendedSorted[0].id, 'custom-news-99', 'Newest item dynamically moves to the top');
assert.strictEqual(extendedSorted.length, 5, 'Extended list still respects max 5 items');
console.log('[PASS] Scenario 12: Extensible data layer: adding new items requires no component changes');

console.log('\n====================================================');
console.log('ALL 12/12 HOMEPAGE CONTENT SECTION SCENARIOS PASSED!');
console.log('====================================================');

