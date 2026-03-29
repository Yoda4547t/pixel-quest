import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase gracefully
let app = null;
let auth: any = null;
let db: any = null;

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.error("=========================================================");
    console.error("⚠️ MISSING FIREBASE CONFIGURATION ⚠️");
    console.error("Please create a .env.local file in the root folder and add your Firebase keys!");
    console.error("Check the README.md for the exact variable names needed. App is running in preview mode.");
    console.error("=========================================================");
}

try {
    if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        
        // Try initializing with long-polling in case WebSockets are blocked by Antivirus/Local Network
        try {
            db = initializeFirestore(app, { experimentalForceLongPolling: true });
        } catch {
            // Fallback to standard if already initialized
            db = getFirestore(app);
        }
    }
} catch (e) {
    console.error("Firebase init failed:", e);
}

export { app, auth, db };
