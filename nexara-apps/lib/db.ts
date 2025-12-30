// lib/db.ts
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    runTransaction,
    serverTimestamp,
    Timestamp,
    where
} from "firebase/firestore";
import { db } from "./firebase";

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
// Subscribe to newsletter
export const subscribeToNewsletter = async (email: string) => {
    // Check if already subscribed
    const q = query(collection(db, "subscribers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return { success: true, message: "Already subscribed" };
    }

    await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: serverTimestamp(),
        source: "footer_newsletter"
    });

    return { success: true };
};

// Subscribe to beta program
// Subscribe to beta program
export const subscribeToBeta = async (email: string) => {
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Check for duplicates in betaEmails (the strict uniqueness check)
            const emailRef = doc(db, "betaEmails", email);
            const emailDoc = await transaction.get(emailRef);

            if (emailDoc.exists()) {
                throw new Error("ALREADY_REGISTERED");
            }

            // 2. Get current counter
            const counterRef = doc(db, "counters", "beta");
            const counterDoc = await transaction.get(counterRef);

            let newCount = 1;
            if (counterDoc.exists()) {
                const data = counterDoc.data();
                newCount = (data.count || 0) + 1;
            }

            // 3. Commit changes (Atomically)

            // a. Lock the email to prevent duplicates
            transaction.set(emailRef, { registeredAt: serverTimestamp() });

            // b. Update the counter
            transaction.set(counterRef, { count: newCount });

            // c. Create the user document with sequential ID
            const userRef = doc(db, "betaUsers", `user_${newCount}`);
            transaction.set(userRef, {
                email,
                registeredAt: serverTimestamp(),
                status: "pending",
                source: "website_form",
                id: `user_${newCount}`
            });
        });

        return { success: true, alreadyExists: false };
    } catch (error: any) {
        // Handle our custom error
        if (error.message === "ALREADY_REGISTERED") {
            return { success: true, alreadyExists: true, message: "Already registered for beta" };
        }

        console.error("Error subscribing to beta:", error);
        throw error;
    }
};

