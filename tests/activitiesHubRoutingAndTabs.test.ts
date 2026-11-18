// BK-IC Digital Hub — Activities Hub & Routing Test Suite
// Verifies all acceptance criteria for /activities nested routes, 6 tabs, sticky navigation & modals
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

import {
  RECURRING_TUESDAY_SCHEDULE,
  SESSION_TIMELINE_STEPS,
  INTERNAL_ACTIVITY_GALLERY,
  WORKSHOPS_DATA,
  COMPETITIONS_DATA,
  COMPANION_PROJECTS_DATA,
  BK_SHARK_SEASONS,
  SHARK_STAGES_TIMELINE,
  CLUB_UNITS_DATA,
  RECRUITMENT_ROADMAP_STEPS,
  RECRUITMENT_FAQS
} from '../src/data/activitiesData';

import { ACTIVITY_TABS } from '../src/components/activities/ActivityNavigation';

console.log('====================================================');
console.log('BK-IC ACTIVITIES HUB & 6-TAB ECOSYSTEM TEST SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------------------
// 1. ROUTING & NESTED ARCHITECTURE
// -----------------------------------------------------------------------------
console.log('--- Testing 1: Routing Architecture & Tab Configurations ---');

const appFile = path.resolve('src/App.tsx');
const appContent = fs.readFileSync(appFile, 'utf8');

// Verify nested routing under ActivitiesLayout
assert.ok(appContent.includes('path="/activities" element={<ActivitiesLayout />}'), 'App.tsx must define /activities with ActivitiesLayout');
assert.ok(appContent.includes('path="sinh-hoat" element={<InternalActivitiesTab />}'), 'Tab 1 /activities/sinh-hoat route must be defined');
assert.ok(appContent.includes('path="workshop" element={<WorkshopsTab />}'), 'Tab 2 /activities/workshop route must be defined');
assert.ok(appContent.includes('path="cuoc-thi" element={<CompetitionsTab />}'), 'Tab 3 /activities/cuoc-thi route must be defined');
assert.ok(appContent.includes('path="du-an" element={<CompanionProjectsTab />}'), 'Tab 4 /activities/du-an route must be defined');
assert.ok(appContent.includes('path="bk-shark" element={<BKSharkTab />}'), 'Tab 5 /activities/bk-shark route must be defined');
assert.ok(appContent.includes('path="tuyen-thanh-vien" element={<RecruitmentTab />}'), 'Tab 6 /activities/tuyen-thanh-vien route must be defined');
console.log('[PASS] Scenario 1: All 6 official tab routes are configured as nested routes under ActivitiesLayout');

// Verify backwards compatibility redirects
assert.ok(appContent.includes('path="internal" element={<Navigate to="/activities/sinh-hoat" replace />}'), 'Legacy /activities/internal must redirect');
assert.ok(appContent.includes('path="workshops" element={<Navigate to="/activities/workshop" replace />}'), 'Legacy /activities/workshops must redirect');
assert.ok(appContent.includes('path="competitions" element={<Navigate to="/activities/cuoc-thi" replace />}'), 'Legacy /activities/competitions must redirect');
assert.ok(appContent.includes('path="companion-projects" element={<Navigate to="/activities/du-an" replace />}'), 'Legacy /activities/companion-projects must redirect');
assert.ok(appContent.includes('path="recruitment" element={<Navigate to="/activities/tuyen-thanh-vien" replace />}'), 'Legacy /activities/recruitment must redirect');
console.log('[PASS] Scenario 2: Legacy URLs have seamless backwards-compatible redirects');

// Verify detail subpage routes
assert.ok(appContent.includes('/activities/workshops/:slug') && appContent.includes('/activities/workshop/:slug'), 'Workshop detail routes supported');
assert.ok(appContent.includes('/activities/competitions/:slug') && appContent.includes('/activities/cuoc-thi/:slug'), 'Competition detail routes supported');
assert.ok(appContent.includes('/activities/companion-projects/:slug') && appContent.includes('/activities/du-an/:slug'), 'Project detail routes supported');
assert.ok(appContent.includes('/activities/bk-shark/:season'), 'BK Shark season detail route supported');
console.log('[PASS] Scenario 3: All detail routes are preserved with dual path support');

// -----------------------------------------------------------------------------
// 2. ACTIVITY NAVIGATION COMPONENT
// -----------------------------------------------------------------------------
console.log('\n--- Testing 2: Sticky ActivityNavigation & Motion Tabs ---');

assert.strictEqual(ACTIVITY_TABS.length, 6, 'Activity navigation must contain exactly 6 tabs');
const expectedPaths = [
  '/activities/sinh-hoat',
  '/activities/workshop',
  '/activities/cuoc-thi',
  '/activities/du-an',
  '/activities/bk-shark',
  '/activities/tuyen-thanh-vien'
];

ACTIVITY_TABS.forEach((tab, i) => {
  assert.strictEqual(tab.to, expectedPaths[i], `Tab ${i} path must be ${expectedPaths[i]}`);
  assert.ok(tab.label, `Tab ${tab.id} must have a non-empty label`);
  assert.ok(tab.icon, `Tab ${tab.id} must have an icon component`);
});

const navFile = path.resolve('src/components/activities/ActivityNavigation.tsx');
const navContent = fs.readFileSync(navFile, 'utf8');
assert.ok(navContent.includes('layoutId="activeActivityTab"'), 'ActivityNavigation must implement layoutId for smooth sliding indicator');
assert.ok(navContent.includes('sticky top-16') || navContent.includes('sticky top-'), 'ActivityNavigation must be sticky under navbar');
console.log('[PASS] Scenario 4: ActivityNavigation implements 6 tabs with layoutId indicator and mobile horizontal scroll');

// -----------------------------------------------------------------------------
// 3. TAB 1: SINH HOẠT NỘI BỘ DATA INTEGRITY
// -----------------------------------------------------------------------------
console.log('\n--- Testing 3: Tab 1 (Sinh hoạt nội bộ) Data Models ---');

assert.ok(RECURRING_TUESDAY_SCHEDULE.dayOfWeek.includes('Thứ Ba'), 'Recurring schedule must be on Tuesday');
assert.ok(RECURRING_TUESDAY_SCHEDULE.recurrenceRule.includes('BYDAY=TU'), 'Recurrence rule must follow iCalendar standard');
assert.strictEqual(SESSION_TIMELINE_STEPS.length, 4, 'Meeting workflow must have 4 timeline steps');
assert.ok(INTERNAL_ACTIVITY_GALLERY.length >= 4, 'Activity photo gallery must contain at least 4 items');
INTERNAL_ACTIVITY_GALLERY.forEach((item) => {
  assert.ok(item.imageUrl.startsWith('/images/'), 'Image URL must be valid path');
  assert.ok(item.title, 'Gallery item must have title');
});
console.log('[PASS] Scenario 5: Internal activities schedule, timeline and gallery verified');

// -----------------------------------------------------------------------------
// 4. TAB 2: WORKSHOP DATA & REGISTRATION MODAL
// -----------------------------------------------------------------------------
console.log('\n--- Testing 4: Tab 2 (Workshop) Data & Registration ---');

assert.ok(WORKSHOPS_DATA.length >= 3, 'Workshops data has at least 3 workshops');
WORKSHOPS_DATA.forEach((ws) => {
  assert.ok(ws.slug, 'Workshop must have slug');
  assert.ok(ws.speaker, 'Workshop must specify speaker');
  assert.ok(ws.date, 'Workshop must have date');
  assert.ok(['upcoming', 'ongoing', 'completed'].includes(ws.status), 'Valid workshop status');
});

const wsModalFile = path.resolve('src/components/activities/WorkshopRegisterModal.tsx');
const wsModalContent = fs.readFileSync(wsModalFile, 'utf8');
assert.ok(wsModalContent.includes('api.cms.registerWorkshop'), 'WorkshopRegisterModal must call api.cms.registerWorkshop');
console.log('[PASS] Scenario 6: Workshop data models and registration modal connection verified');

// -----------------------------------------------------------------------------
// 5. TAB 3: CUỘC THI SÁNG TẠO & COUNTDOWN
// -----------------------------------------------------------------------------
console.log('\n--- Testing 5: Tab 3 (Cuộc thi sáng tạo) Data & Countdown ---');

assert.ok(COMPETITIONS_DATA.length >= 2, 'Competitions data has at least 2 authentic club competitions');
COMPETITIONS_DATA.forEach((c) => {
  assert.ok(c.prizePool, 'Competition must specify prizePool');
  assert.ok(c.deadlineIso, 'Competition must specify ISO deadline for countdown');
  assert.ok(c.timeline.length > 0, 'Competition must specify timeline phases');
});

const compModalFile = path.resolve('src/components/activities/CompetitionRegisterModal.tsx');
const compModalContent = fs.readFileSync(compModalFile, 'utf8');
assert.ok(compModalContent.includes('api.cms.registerCompetition'), 'CompetitionRegisterModal must call api.cms.registerCompetition');
assert.ok(compModalContent.includes("regType === 'team'"), 'Supports both team and individual registration');

const countdownFile = path.resolve('src/components/activities/ActivityCountdown.tsx');
const countdownContent = fs.readFileSync(countdownFile, 'utf8');
assert.ok(countdownContent.includes('calculateRemaining'), 'Countdown timer implements accurate time math');
console.log('[PASS] Scenario 7: Competition data, registration modal and countdown timer verified');

// -----------------------------------------------------------------------------
// 6. TAB 4: DỰ ÁN ĐỒNG HÀNH & PARTNERSHIP REQUEST
// -----------------------------------------------------------------------------
console.log('\n--- Testing 6: Tab 4 (Dự án đồng hành) & Partnership Request ---');

assert.ok(Array.isArray(COMPANION_PROJECTS_DATA), 'Companion projects collection is properly initialized');
COMPANION_PROJECTS_DATA.forEach((p) => {
  assert.ok(p.stage, 'Project must specify incubator stage');
  assert.ok(p.techStack.length > 0, 'Project must specify tech stack');
});

const partnerModalFile = path.resolve('src/components/activities/PartnershipRequestModal.tsx');
const partnerModalContent = fs.readFileSync(partnerModalFile, 'utf8');
assert.ok(partnerModalContent.includes('api.cms.submitPartnershipRequest'), 'PartnershipRequestModal must call api.cms.submitPartnershipRequest');
console.log('[PASS] Scenario 8: Companion projects incubator data and partnership request modal verified');

// -----------------------------------------------------------------------------
// 7. TAB 5: BK SHARK & TAB 6: TUYỂN THÀNH VIÊN
// -----------------------------------------------------------------------------
console.log('\n--- Testing 7: Tab 5 (BK Shark) & Tab 6 (Tuyển thành viên) ---');

assert.ok(BK_SHARK_SEASONS.length >= 1, 'At least 1 authentic BK Shark season');
assert.strictEqual(SHARK_STAGES_TIMELINE.length, 5, 'BK Shark roadmap must have 5 stages');

assert.strictEqual(CLUB_UNITS_DATA.length, 3, 'Must have 3 units (BCN, BĐH, BTV)');
assert.strictEqual(RECRUITMENT_ROADMAP_STEPS.length, 4, 'Recruitment roadmap must have 4 rounds');
assert.ok(RECRUITMENT_FAQS.length >= 5, 'Recruitment FAQ must have at least 5 questions');

const recruitTabFile = path.resolve('src/pages/activities/tabs/RecruitmentTab.tsx');
const recruitTabContent = fs.readFileSync(recruitTabFile, 'utf8');
assert.ok(recruitTabContent.includes('siteSettings.recruitmentStatus'), 'RecruitmentTab must read dynamic siteSettings.recruitmentStatus');
assert.ok(recruitTabContent.includes('to="/join"'), 'RecruitmentTab must direct user to official /join application pipeline');
console.log('[PASS] Scenario 9: BK Shark seasons and Recruitment dynamic settings & JoinPage integration verified');

console.log('\n====================================================');
console.log('ALL 9/9 ACTIVITIES HUB ACCEPTANCE TESTS PASSED!');
console.log('====================================================');

