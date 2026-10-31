// Script to purge all ephemeral test data generated during test suites
// Preserves only genuine user-created records and the 31 authentic member accounts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initFirestore, saveCloudData } from '../server/services/firestoreSync.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');

async function runCleanup() {
  const dbPath = path.join(ROOT_DIR, 'data/db.json');
  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);

  // Exact 31 authentic accounts (1 Master Admin + 30 students from Excel)
  const authenticUserIds = new Set([
    'usr-admin',
    'usr-1792903694464', // Nguyễn Hoàng Long
    'usr-1792983281484', // Phạm Lê Tú
    'usr-1792983281486', // Nguyễn Thiện Quốc
    'usr-1792983281487', // Nguyễn Quỳnh Châu
    'usr-1792983281488', // Lê Anh Khoa
    'usr-1792983281489', // Nguyễn Đoàn Anh Thư
    'usr-1792983281490', // Nguyễn Thị Thục Trang
    'usr-1792983281491', // Nguyễn Văn Tùng Dương
    'usr-1792983281492', // Nguyễn Thị Quế Trân
    'usr-1792983281494', // Nguyễn Tuấn Dũng
    'usr-1792983281495', // Nguyễn Trọng Sang
    'usr-1792983281496', // Trần Hoài Thương
    'usr-1792983281497', // Lê Thanh Hằng
    'usr-1792983281498', // Nguyễn Quang Chiến
    'usr-1792983281500', // Huỳnh Phạm Hoàng My
    'usr-1792983281501', // Nguyễn Đăng Lê Hoàng
    'usr-1792983281502', // Phạm Hưng Phát
    'usr-1792983281503', // Trịnh Thị Hồng Hương
    'usr-1792983281504', // Nguyễn Thành Bảo
    'usr-1792983281505', // Huỳnh Ngọc Thuỳ Dung
    'usr-1792983281506', // Nguyễn Hương Giang
    'usr-1792983281507', // Đoàn Hoàng Thiên Phú
    'usr-1792983281508', // Trần Đại Nhật Hải
    'usr-1792983281509', // Trần Nguyên Bình
    'usr-1792983281510', // Lê Hồng Ngân
    'usr-1792983281511', // Huỳnh Phước Phú
    'usr-1792983281512', // Huỳnh Gia Thiên
    'usr-1792983281513', // Nguyễn Thái Minh Thông
    'usr-1792983281514', // Nguyễn Thị Phương Hoà
    'usr-1792983281515'  // Hồ Thị Mỹ Ly
  ]);

  const testUsers = (db.users || []).filter((u: any) => !authenticUserIds.has(u.id));
  const testUserIds = new Set<string>(testUsers.map((u: any) => String(u.id)));
  db.users = (db.users || []).filter((u: any) => authenticUserIds.has(u.id));

  console.log(`[CleanUp] Kept ${db.users.length} authentic users. Removed ${testUsers.length} test users.`);

  // Keep only user-created sessions (e.g. ses-1792984308633 "Meeting ngày 27/10/2026")
  const authenticSessionIds = new Set(['ses-1792984308633']);
  const testSessions = (db.sessions || []).filter((s: any) => !authenticSessionIds.has(s.id));
  const testSessionIds = new Set(testSessions.map((s: any) => s.id));
  db.sessions = (db.sessions || []).filter((s: any) => authenticSessionIds.has(s.id));

  console.log(`[CleanUp] Kept ${db.sessions.length} genuine session(s). Removed ${testSessions.length} test sessions.`);

  // Clear test attendance & requests
  const oldAttendanceCount = (db.attendance || []).length;
  db.attendance = [];
  db.attendanceRecords = [];
  db.attendanceRequests = [];
  console.log(`[CleanUp] Cleared ${oldAttendanceCount} test attendance records.`);

  // Clear test feedbacks
  const oldFeedbackCount = (db.feedbacks || []).length;
  db.feedbacks = [];
  db.feedbackEligibility = [];
  console.log(`[CleanUp] Cleared ${oldFeedbackCount} test feedback records.`);

  // Clear test applications
  const oldAppsCount = (db.applications || []).length;
  db.applications = [];
  console.log(`[CleanUp] Cleared ${oldAppsCount} test applications.`);

  // Clear test tasks & evaluations if any
  db.tasks = [];
  db.evaluations = [];
  db.notifications = [];
  db.exportLogs = [];

  // Filter audit logs to remove test actions
  const oldAuditCount = (db.auditLogs || []).length;
  db.auditLogs = (db.auditLogs || []).filter((log: any) => {
    if (testUserIds.has(log.actorId) || testUserIds.has(log.targetId)) return false;
    if (testSessionIds.has(log.targetId)) return false;
    return true;
  });
  console.log(`[CleanUp] Filtered audit logs from ${oldAuditCount} down to ${db.auditLogs.length}.`);

  // Save cleaned db.json locally
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`[CleanUp] Saved cleaned data/db.json successfully.`);

  // Synchronize and purge Cloud Firestore
  const firestore = initFirestore();
  if (firestore) {
    console.log(`[CleanUp] Connecting to Cloud Firestore to purge test documents...`);

    // 1. Delete test users from root "users" collection
    const usersCol = firestore.collection('users');
    let deletedCount = 0;
    for (const testId of testUserIds) {
      await usersCol.doc(testId).delete();
      deletedCount++;
    }
    console.log(`[CleanUp] Deleted ${deletedCount} test user documents from Firestore root 'users' collection.`);

    // 2. Also ensure any document in root 'users' that is NOT in authenticUserIds is deleted
    const allUsersSnap = await usersCol.get();
    let additionalPurged = 0;
    for (const doc of allUsersSnap.docs) {
      if (!authenticUserIds.has(doc.id)) {
        await doc.ref.delete();
        additionalPurged++;
      }
    }
    if (additionalPurged > 0) {
      console.log(`[CleanUp] Purged ${additionalPurged} additional non-authentic documents from Firestore 'users'.`);
    }

    // 3. Update bkic_data with clean data
    const batch = firestore.batch();
    const bkicDataCol = firestore.collection('bkic_data');
    const keys = Object.keys(db);
    for (const key of keys) {
      batch.set(bkicDataCol.doc(key), {
        items: db[key],
        updatedAt: new Date().toISOString()
      });
    }
    await batch.commit();
    console.log(`[CleanUp] Updated Cloud Firestore 'bkic_data' collection with cleaned dataset.`);

    // Final verification of root users collection
    const finalUsersSnap = await firestore.collection('users').get();
    console.log(`[CleanUp] Final verified count in Firestore 'users' collection: ${finalUsersSnap.size} documents.`);
  }

  console.log(`[CleanUp] ✓ Cleanup completed successfully! Only genuine user data remains.`);
}

runCleanup().catch(err => {
  console.error('[CleanUp] ⚠ Error during cleanup:', err);
  process.exit(1);
});
