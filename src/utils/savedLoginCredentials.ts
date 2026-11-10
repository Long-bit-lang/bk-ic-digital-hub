// Device-local saved login credentials helper (stored strictly in browser localStorage)

export interface SavedLoginCredential {
  email: string;
  password: string;
  fullName?: string;
  savedAt: string;
}

export const SAVED_CREDENTIALS_STORAGE_KEY = 'bkic_saved_credentials_v1';
export const REMEMBER_CREDENTIAL_PREF_KEY = 'bkic_remember_login_pref';
const MAX_SAVED_CREDENTIALS = 5;

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function resolveStorage(customStorage?: StorageLike): StorageLike | null {
  if (customStorage) return customStorage;
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function writeSavedCredentials(list: SavedLoginCredential[], storage: StorageLike): void {
  if (list.length === 0) {
    storage.removeItem(SAVED_CREDENTIALS_STORAGE_KEY);
    return;
  }
  storage.setItem(SAVED_CREDENTIALS_STORAGE_KEY, JSON.stringify(list.slice(0, MAX_SAVED_CREDENTIALS)));
}

/**
 * Loads saved login credentials stored on this device, ordered from newest to oldest.
 */
export function getSavedCredentials(customStorage?: StorageLike): SavedLoginCredential[] {
  const storage = resolveStorage(customStorage);
  if (!storage) return [];

  try {
    const raw = storage.getItem(SAVED_CREDENTIALS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is SavedLoginCredential =>
          Boolean(item) &&
          typeof item.email === 'string' &&
          item.email.trim().length > 0 &&
          typeof item.password === 'string' &&
          item.password.length > 0
      )
      .map(item => ({
        email: item.email.trim(),
        password: item.password,
        fullName: typeof item.fullName === 'string' ? item.fullName.trim() : undefined,
        savedAt: typeof item.savedAt === 'string' ? item.savedAt : new Date(0).toISOString()
      }))
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt))
      .slice(0, MAX_SAVED_CREDENTIALS);
  } catch {
    return [];
  }
}

/**
 * Saves or updates a login credential on this device after a successful login.
 */
export function saveLoginCredential(
  entry: { email: string; password: string; fullName?: string },
  customStorage?: StorageLike
): SavedLoginCredential[] {
  const storage = resolveStorage(customStorage);
  const trimmedEmail = entry.email.trim();
  if (!storage || !trimmedEmail || !entry.password) {
    return getSavedCredentials(customStorage);
  }

  const normalized = normalizeEmail(trimmedEmail);
  const existing = getSavedCredentials(storage);
  const previous = existing.find(item => normalizeEmail(item.email) === normalized);
  const filtered = existing.filter(item => normalizeEmail(item.email) !== normalized);

  const nextEntry: SavedLoginCredential = {
    email: trimmedEmail,
    password: entry.password,
    fullName: entry.fullName?.trim() || previous?.fullName,
    savedAt: new Date().toISOString()
  };

  const nextList = [nextEntry, ...filtered].slice(0, MAX_SAVED_CREDENTIALS);
  try {
    writeSavedCredentials(nextList, storage);
  } catch {
    // Ignore storage quota/security errors
  }
  return nextList;
}

/**
 * Updates the saved password for an account if it is already stored on this device.
 */
export function updateSavedPasswordIfPresent(
  email: string,
  newPassword: string,
  customStorage?: StorageLike
): SavedLoginCredential[] {
  const storage = resolveStorage(customStorage);
  const normalized = normalizeEmail(email);
  if (!storage || !normalized || !newPassword) {
    return getSavedCredentials(customStorage);
  }

  const existing = getSavedCredentials(storage);
  const match = existing.find(item => normalizeEmail(item.email) === normalized);
  if (!match) {
    return existing;
  }

  return saveLoginCredential(
    {
      email: match.email,
      password: newPassword,
      fullName: match.fullName
    },
    storage
  );
}

/**
 * Removes a single saved credential by email from this device.
 */
export function removeSavedCredential(email: string, customStorage?: StorageLike): SavedLoginCredential[] {
  const storage = resolveStorage(customStorage);
  if (!storage) return [];

  const normalized = normalizeEmail(email);
  const nextList = getSavedCredentials(storage).filter(
    item => normalizeEmail(item.email) !== normalized
  );
  try {
    writeSavedCredentials(nextList, storage);
  } catch {
    // Ignore storage errors
  }
  return nextList;
}

/**
 * Clears all saved login credentials on this device.
 */
export function clearSavedCredentials(customStorage?: StorageLike): void {
  const storage = resolveStorage(customStorage);
  if (!storage) return;
  try {
    storage.removeItem(SAVED_CREDENTIALS_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Reads whether the user prefers remembering login credentials on this device.
 */
export function getRememberCredentialPreference(customStorage?: StorageLike): boolean {
  const storage = resolveStorage(customStorage);
  if (!storage) return true;
  try {
    const val = storage.getItem(REMEMBER_CREDENTIAL_PREF_KEY);
    return val === null ? true : val !== 'false';
  } catch {
    return true;
  }
}

/**
 * Persists whether the user wants to save login credentials on this device.
 */
export function setRememberCredentialPreference(remember: boolean, customStorage?: StorageLike): void {
  const storage = resolveStorage(customStorage);
  if (!storage) return;
  try {
    storage.setItem(REMEMBER_CREDENTIAL_PREF_KEY, remember ? 'true' : 'false');
  } catch {
    // Ignore storage errors
  }
}

