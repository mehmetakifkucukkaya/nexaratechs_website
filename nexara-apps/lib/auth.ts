// lib/auth.ts
import { auth } from "./firebase";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from "firebase/auth";

export const loginAdmin = async (email: string, pass: string) => {
    return await signInWithEmailAndPassword(auth, email, pass);
};

export const logoutAdmin = async () => {
    return await signOut(auth);
};

// Note: For server-side auth checking or middleware, we might need 'firebase-admin' or verifyIdToken
// Since this is client-side mostly for the form, this is okay.
// However, Middleware in Next.js runs on Edge, so we need a compatible way to check auth cookies.
// For now, we'll stick to client-side helpers here.
