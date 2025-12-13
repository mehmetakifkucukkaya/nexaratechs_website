// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Lazy initialization - only initialize when accessed
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    // Validate environment variables at runtime
    const requiredEnvVars = [
      { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', name: 'API Key' },
      { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', name: 'Auth Domain' },
      { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', name: 'Project ID' },
    ] as const;

    const missingVars = requiredEnvVars.filter(
      ({ key }) => !process.env[key]
    );

    if (missingVars.length > 0 && typeof window !== 'undefined') {
      console.error(
        `🔥 Firebase Configuration Error:\nMissing environment variables:\n${missingVars
          .map(({ name, key }) => `  - ${name} (${key})`)
          .join('\n')}\n\nPlease check your .env.local file.`
      );
    }

    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

// Export getters that lazily initialize
export const auth: Auth = new Proxy({} as Auth, {
  get(_, prop) {
    if (!_auth) {
      _auth = getAuth(getFirebaseApp());
    }
    return (_auth as unknown as Record<string | symbol, unknown>)[prop];
  }
});

export const db: Firestore = new Proxy({} as Firestore, {
  get(_, prop) {
    if (!_db) {
      _db = getFirestore(getFirebaseApp());
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  }
});

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_, prop) {
    if (!_storage) {
      _storage = getStorage(getFirebaseApp());
    }
    return (_storage as unknown as Record<string | symbol, unknown>)[prop];
  }
});
