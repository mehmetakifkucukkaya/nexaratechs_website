// lib/db.ts
import { db } from "./firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";

// Types
export interface AppData {
    id?: string;
    slug: string;
    name: string;
    developer: string;
    shortDescription: string;
    fullDescription: string;
    logoUrl: string; // Image URL
    screenshots: string[]; // URLs
    features: {
        title: string;
        description: string;
        icon: string; // Lucide icon name for features is fine
    }[];
    status: "Beta" | "Live" | "Coming Soon";
    version: string;
    releaseDate: string; // Yayınlanma/Test Tarihi
    category: string;
    downloadUrl?: string;
    privacyUrl?: string;
    order?: number;
    createdAt?: Timestamp;
}

export interface TesterData {
    id?: string;
    fullName: string;
    email: string;
    device: string;
    status?: 'pending' | 'approved' | 'rejected';
    assignedAppId?: string;
    adminNotes?: string;
    appliedAt?: Timestamp;
    updatedAt?: Timestamp;
}

// Collections
const APPS_COLLECTION = "apps";
const TESTERS_COLLECTION = "testers";

// Helper Functions

// Get all Apps
export const getApps = async () => {
    const q = query(collection(db, APPS_COLLECTION), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppData));
};

// Get Single App by ID
export const getAppById = async (id: string) => {
    if (!id) return null;
    const docRef = doc(db, APPS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as AppData;
    }
    return null;
};

// Create a new tester application
export const createTesterApplication = async (data: TesterData) => {
    return await addDoc(collection(db, TESTERS_COLLECTION), {
        ...data,
        appliedAt: serverTimestamp()
    });
};
