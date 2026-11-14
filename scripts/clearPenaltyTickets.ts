// Script to clear all penalty tickets and forgive previous offenses
import { db } from '../server/db.ts';

async function clearPenalties() {
  console.log('--- Clearing Penalty Tickets & Forgiving Previous Infractions ---');
  const store = db.get();

  const originalTicketsCount = store.penaltyTickets?.length || 0;
  console.log(`Current penalty tickets count: ${originalTicketsCount}`);

  // 1. Reset penalty tickets
  store.penaltyTickets = [];

  // 2. Clear penalty ticket references in feedbackEligibility
  let clearedEligibilityCount = 0;
  if (Array.isArray(store.feedbackEligibility)) {
    for (const el of store.feedbackEligibility) {
      if (el.penaltyTicketId) {
        delete el.penaltyTicketId;
        clearedEligibilityCount++;
      }
    }
  }
  console.log(`Cleared penaltyTicketId from ${clearedEligibilityCount} feedback eligibility records.`);

  // 3. Clear penalty ticket notifications
  const beforeNotifCount = store.notifications?.length || 0;
  if (Array.isArray(store.notifications)) {
    store.notifications = store.notifications.filter(
      n => !n.id?.startsWith('notif-ticket-') && 
           !n.title?.includes('Vé phạt') && 
           !n.message?.includes('vé phạt')
    );
  }
  const removedNotifs = beforeNotifCount - (store.notifications?.length || 0);
  console.log(`Removed ${removedNotifs} penalty notifications.`);

  // 4. Ensure past ended sessions won't re-trigger penalties
  const nowMs = Date.now();
  let pastSessionsMarked = 0;
  for (const session of store.sessions || []) {
    if (session.status === 'ended' || (session as any).status === 'closed' || session.status === 'cancelled') {
      if (!session.feedbackPenaltiesIssuedAt) {
        session.feedbackPenaltiesIssuedAt = new Date(nowMs).toISOString();
        pastSessionsMarked++;
      }
    }
  }
  console.log(`Marked ${pastSessionsMarked} past session(s) as already closed/penalties processed.`);

  // 5. Add audit log
  if (Array.isArray(store.auditLogs)) {
    store.auditLogs.unshift({
      id: `audit-${Date.now()}-amnesty`,
      timestamp: new Date(nowMs).toISOString(),
      actorId: 'usr-admin',
      actorName: 'Ban Chủ nhiệm & Quản trị viên',
      actorRole: 'admin',
      actorUnit: 'BN',
      action: 'Ân xá kỷ luật & Xóa toàn bộ vé phạt cũ',
      targetType: 'PenaltyTicket',
      targetId: 'ALL',
      details: `Đã xóa toàn bộ ${originalTicketsCount} vé phạt vi phạm quy chế trước đây và ân xá lỗi cho tất cả các thành viên.`
    });
  }

  // 6. Direct Firestore clear & save changes
  try {
    const { initializeApp, cert, getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    const fs = await import('fs');
    const path = await import('path');
    const saPath = path.resolve('firebase-service-account.json');
    if (fs.existsSync(saPath)) {
      const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
      const app = getApps().length === 0 ? initializeApp({ credential: cert(sa) }) : getApps()[0];
      const firestore = getFirestore(app);
      await firestore.collection('bkic_data').doc('penaltyTickets').set({
        items: [],
        updatedAt: new Date().toISOString()
      });
      console.log('✓ Direct Cloud Firestore penaltyTickets document cleared.');
    }
  } catch (fErr) {
    console.warn('[Firestore] Notice during direct update:', fErr);
  }

  // Save changes to db.json and trigger Firestore sync
  db.save();
  console.log('✓ Successfully saved changes to data/db.json and initiated sync with Firestore.');

  // Wait a moment for firestore sync debounce
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Done!');
  process.exit(0);
}

clearPenalties().catch(err => {
  console.error('Error clearing penalties:', err);
  process.exit(1);
});
