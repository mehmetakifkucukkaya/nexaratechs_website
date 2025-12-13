// lib/firebase.ts
import { initializeApp, getApps as getFirebaseApps, getApp as getFirebaseApp, FirebaseApp } from "firebase/app";
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

// Check if we have minimum required config
const hasConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (hasConfig) {
  app = !getFirebaseApps().length ? initializeApp(firebaseConfig) : getFirebaseApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else if (typeof window !== 'undefined') {
  console.warn(
    "⚠️ Firebase not configured. Please add NEXT_PUBLIC_FIREBASE_* variables to .env.local"
  );
}

// @ts-ignore - These will be undefined if not configured, but we handle that at runtime
export { app, auth, db, storage };

// Data Fetching Utils
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { AppData } from "./data";

export async function getApps(): Promise<AppData[]> {
  if (!db) return [];

  try {
    const appsRef = collection(db, "apps");
    const snapshot = await getDocs(appsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppData));
  } catch (error) {
    console.error("Error fetching apps:", error);
    return [];
  }
}

export async function getApp(slug: string): Promise<AppData | undefined> {
  if (!db) return undefined;

  try {
    const appsRef = collection(db, "apps");
    const q = query(appsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return undefined;

    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as AppData;
  } catch (error) {
    console.error("Error fetching app:", error);
    return undefined;
  }
}


