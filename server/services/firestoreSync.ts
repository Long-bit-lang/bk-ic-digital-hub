// Cloud Firestore Synchronization Engine for BK-IC Digital Hub
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { DatabaseSchema } from '../db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

let firestoreInstance: Firestore | null = null;
let isInitialized = false;

function getServiceAccountCredentials(): any | null {
  // 1. Check environment variable (Used on Render / Production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
      return JSON.parse(raw);
    } catch (err) {
      console.error('[FirestoreSync] ⚠ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:', err);
    }
  }

  // 2. Check Render secret file path: /etc/secrets/firebase-service-account.json
  const renderSecretPath = '/etc/secrets/firebase-service-account.json';
  if (fs.existsSync(renderSecretPath)) {
    try {
      const raw = fs.readFileSync(renderSecretPath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[FirestoreSync] ⚠ Failed to read Render secret file:', err);
    }
  }

  // 3. Check local root file: firebase-service-account.json
  const localSecretPath = path.join(ROOT_DIR, 'firebase-service-account.json');
  if (fs.existsSync(localSecretPath)) {
    try {
      const raw = fs.readFileSync(localSecretPath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[FirestoreSync] ⚠ Failed to read local firebase-service-account.json file:', err);
    }
  }

  return null;
}

export function initFirestore(): Firestore | null {
  if (isInitialized) return firestoreInstance;
  isInitialized = true;

  const credentials = getServiceAccountCredentials();
  if (!credentials) {
    console.log('[FirestoreSync] ℹ No Firebase service account credentials found. Using local JSON storage mode.');
    return null;
  }

  try {
    const existingApps = getApps();
    let app: App;
    if (existingApps.length === 0) {
      app = initializeApp({
        credential: cert(credentials),
        projectId: credentials.project_id || 'bk-ic-digital-hub'
      });
    } else {
      app = existingApps[0];
    }

    firestoreInstance = getFirestore(app);
    firestoreInstance.settings({ ignoreUndefinedProperties: true });
    console.log(`[FirestoreSync] ✓ Connected to Cloud Firestore database for project: ${credentials.project_id}`);
    return firestoreInstance;
  } catch (err) {
    console.error('[FirestoreSync] ⚠ Error initializing Firebase Admin SDK:', err);
    return null;
  }
}

/**
 * Load complete dataset from Cloud Firestore on server boot.
 * If Cloud Firestore is empty (first run), seeds it with local data.
 */
export async function loadCloudData(localFallback: DatabaseSchema): Promise<DatabaseSchema> {
  const db = initFirestore();
  if (!db) return localFallback;

  try {
    const colRef = db.collection('bkic_data');
    const snapshot = await colRef.get();

    if (snapshot.empty) {
      console.log('[FirestoreSync] ℹ Cloud Firestore is empty. Initializing and seeding with current BK-IC dataset...');
      await saveCloudData(localFallback);
      return localFallback;
    }

    const merged: Partial<DatabaseSchema> = { ...localFallback };
    snapshot.forEach(doc => {
      const docData = doc.data();
      if (docData && docData.items !== undefined) {
        (merged as any)[doc.id] = docData.items;
      }
    });

    // Also check root "users" collection to ensure all member profiles are loaded
    try {
      const usersSnap = await db.collection('users').get();
      if (!usersSnap.empty) {
        const rootUsers: any[] = [];
        usersSnap.forEach(uDoc => {
          rootUsers.push(uDoc.data());
        });
        if (rootUsers.length > (merged.users?.length || 0)) {
          merged.users = rootUsers as any;
        }
      }
    } catch (uErr) {
      console.warn('[FirestoreSync] Could not read root users collection:', uErr);
    }

    console.log(`[FirestoreSync] ✓ Successfully loaded and synced ${snapshot.size} collections from Cloud Firestore (users: ${merged.users?.length || 0}).`);
    return merged as DatabaseSchema;
  } catch (err) {
    console.error('[FirestoreSync] ⚠ Failed to load data from Cloud Firestore, using local data:', err);
    return localFallback;
  }
}

let syncTimeout: NodeJS.Timeout | null = null;
let pendingData: DatabaseSchema | null = null;

/**
 * Save complete dataset to Cloud Firestore.
 * Uses atomic batch commits with a debounce to prevent excessive write rates.
 */
export async function saveCloudData(data: DatabaseSchema): Promise<void> {
  const db = initFirestore();
  if (!db) return;

  pendingData = data;

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(async () => {
    if (!pendingData) return;
    const currentData = pendingData;
    pendingData = null;

    try {
      const colRef = db.collection('bkic_data');
      const batch = db.batch();
      const keys = Object.keys(currentData) as (keyof DatabaseSchema)[];

      for (const key of keys) {
        const docRef = colRef.doc(String(key));
        batch.set(docRef, {
          items: currentData[key],
          updatedAt: new Date().toISOString()
        });
      }

      // Also mirror each user into root "users" collection for immediate visibility in Firebase Console
      if (Array.isArray(currentData.users)) {
        for (const u of currentData.users) {
          if (u && u.id) {
            const userDocRef = db.collection('users').doc(u.id);
            batch.set(userDocRef, JSON.parse(JSON.stringify(u)));
          }
        }
      }

      await batch.commit();
      console.log(`[FirestoreSync] ✓ Cloud Firestore updated successfully (${keys.length} sections and ${currentData.users?.length || 0} users synchronized).`);
    } catch (err) {
      console.error('[FirestoreSync] ⚠ Error committing batch update to Cloud Firestore:', err);
    }
  }, 300);
}
