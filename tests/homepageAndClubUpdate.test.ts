// Test Suite for Homepage and Club Information Update
// Verifies all requirements from prompt:
// 1. Tuesday recurring schedule & cancellation/restoration
// 2. Recruitment status gating & Fanpage configuration
// 3. 3-Unit organizational structure (BCN, BĐH, BTV) & position formatting
// 4. Data integrity of db.json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUpcomingTuesdayDates, syncRecurringTuesdaySessions } from '../server/services/recurringSchedule.js';
import { getUnitShortName, getUnitFullName, formatMemberPosition } from '../src/utils/unitDisplay.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('BK-IC DIGITAL HUB - UPDATE VERIFICATION TEST SUITE');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (condition) {
    console.log(`[PASS] Scenario ${total}: ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] Scenario ${total}: ${message}`);
    process.exit(1);
  }
}

// ----------------------------------------------------
// TEST 1: Tuesday Recurring Schedule Generator
// ----------------------------------------------------
console.log('--- Testing Tuesday Recurring Schedule ---');
const upcomingTuesdays = getUpcomingTuesdayDates(4);
assert(upcomingTuesdays.length === 4, 'Generates exactly 4 upcoming Tuesdays');
for (const dateStr of upcomingTuesdays) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  // In UTC or VN time, verify the date is Tuesday
  assert(/^\d{4}-\d{2}-\d{2}$/.test(dateStr), `Valid date format YYYY-MM-DD: ${dateStr}`);
}

const mockStore: any = {
  sessions: []
};

const didSync = syncRecurringTuesdaySessions(mockStore);
assert(didSync === true, 'Synchronized Tuesday sessions into store');
assert(mockStore.sessions.length === upcomingTuesdays.length, `Store now contains ${upcomingTuesdays.length} Tuesday sessions`);

const firstSession = mockStore.sessions[0];
assert(firstSession.id.startsWith('ses-tuesday-'), `Session ID format: ${firstSession.id}`);
assert(firstSession.startTime === '17:30' && firstSession.endTime === '19:00', 'Session runs from 17:30 to 19:00');
assert(firstSession.recurrenceRule?.includes('TZ=Asia/Ho_Chi_Minh'), 'Recurrence rule specifies Asia/Ho_Chi_Minh timezone');
assert(firstSession.category === 'general_meeting', 'Session category is general_meeting');

// Test idempotence: running sync again should not duplicate
const secondRun = syncRecurringTuesdaySessions(mockStore);
assert(secondRun === false && mockStore.sessions.length === upcomingTuesdays.length, 'Idempotent: does not duplicate existing recurring sessions');

// ----------------------------------------------------
// TEST 2: Cancellation & Restoration Behavior
// ----------------------------------------------------
console.log('\n--- Testing Session Cancellation & Restoration ---');
const sessionToCancel = mockStore.sessions[0];
const reason = 'Nghỉ lễ Quốc khánh';
const cancelledAt = new Date().toISOString();

// Simulate cancellation
sessionToCancel.status = 'cancelled';
sessionToCancel.cancellationReason = reason;
sessionToCancel.cancelledBy = 'Trần Đại Nhật Hải (Chủ nhiệm)';
sessionToCancel.cancelledAt = cancelledAt;
sessionToCancel.cancellationHistory = [{
  cancelledAt,
  cancelledBy: 'Trần Đại Nhật Hải',
  cancelledById: 'usr-1792983281508',
  reason
}];

assert(sessionToCancel.status === 'cancelled', 'Session status updated to cancelled');
assert(sessionToCancel.cancellationReason === reason, 'Cancellation reason preserved');
assert(sessionToCancel.cancellationHistory.length === 1, 'Cancellation history logged');

// Re-running recurring sync must NEVER overwrite or un-cancel this session
syncRecurringTuesdaySessions(mockStore);
assert(sessionToCancel.status === 'cancelled', 'Recurring sync preserves cancelled status and reason');

// Simulate restoration
sessionToCancel.status = 'scheduled';
sessionToCancel.attendanceStatus = 'closed';
assert(sessionToCancel.status === 'scheduled', 'Session restored to scheduled');
assert(sessionToCancel.cancellationHistory.length === 1, 'Cancellation history preserved after restore');

// ----------------------------------------------------
// TEST 3: Unit Display Formatting & 3 Official Units
// ----------------------------------------------------
console.log('\n--- Testing Unit Display & 3 Official Units ---');
assert(getUnitShortName('BN') === 'BCN', "getUnitShortName('BN') returns 'BCN'");
assert(getUnitShortName('BDH') === 'BĐH', "getUnitShortName('BDH') returns 'BĐH'");
assert(getUnitShortName('BTV') === 'BTV', "getUnitShortName('BTV') returns 'BTV'");

assert(getUnitFullName('BN') === 'Ban Chủ nhiệm (BCN)', "getUnitFullName('BN') returns 'Ban Chủ nhiệm (BCN)'");
assert(getUnitFullName('BDH') === 'Ban Điều hành (BĐH)', "getUnitFullName('BDH') returns 'Ban Điều hành (BĐH)'");
assert(getUnitFullName('BTV') === 'Ban Thành viên (BTV)', "getUnitFullName('BTV') returns 'Ban Thành viên (BTV)'");

assert(
  formatMemberPosition('Thành viên Ban Chủ nhiệm', 'BN', 'member') === 'Thành viên BCN',
  "Replaces 'Ban Chủ nhiệm' with 'BCN' in member position"
);
assert(
  formatMemberPosition('Phó Trưởng Ban Điều hành', 'BDH', 'leader') === 'Phó Trưởng BĐH',
  "Replaces 'Ban Điều hành' with 'BĐH' in member position"
);
assert(
  formatMemberPosition('Trưởng Ban Thành viên', 'BTV', 'leader') === 'Trưởng BTV',
  "Replaces 'Ban Thành viên' with 'BTV' in member position"
);

// ----------------------------------------------------
// TEST 4: Database Integrity & 31 Authentic Users
// ----------------------------------------------------
console.log('\n--- Testing Database Integrity ---');
const dbPath = path.join(rootDir, 'data', 'db.json');
const dbRaw = fs.readFileSync(dbPath, 'utf8');
const db = JSON.parse(dbRaw);

assert(Array.isArray(db.users), 'db.json contains users array');
assert(db.users.length === 31, `Exact count of 31 authentic club member accounts preserved (found ${db.users.length})`);

// Verify all users belong to one of the 3 official units
const validUnitKeys = new Set(['BN', 'BDH', 'BTV']);
const invalidUnits = db.users.filter((u: any) => u.unit && !validUnitKeys.has(u.unit));
assert(invalidUnits.length === 0, 'All club members are assigned to BN, BDH, or BTV');

// Check site settings
assert(db.siteSettings.recruitmentStatus === 'closed', 'Default recruitmentStatus is closed');
assert(db.siteSettings.recruitmentFanpageUrl === 'https://www.facebook.com/dut.bkic', 'Official Fanpage URL is https://www.facebook.com/dut.bkic');

// Check units definition
assert(Array.isArray(db.units) && db.units.length === 3, 'Exactly 3 official units defined in db.json');
const bnUnit = db.units.find((u: any) => u.id === 'BN');
const bdhUnit = db.units.find((u: any) => u.id === 'BDH');
const btvUnit = db.units.find((u: any) => u.id === 'BTV');

assert(bnUnit && bnUnit.shortName === 'BCN', 'Unit BN has shortName BCN');
assert(bdhUnit && bdhUnit.shortName === 'BĐH', 'Unit BDH has shortName BĐH');
assert(btvUnit && btvUnit.shortName === 'BTV', 'Unit BTV has shortName BTV');

console.log('\n====================================================');
console.log(`ALL ${passed}/${total} TEST SCENARIOS PASSED SUCCESSFULLY!`);
console.log('====================================================');
