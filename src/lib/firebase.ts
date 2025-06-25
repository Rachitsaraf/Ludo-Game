import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
// Check if Firebase has already been initialized
if (!getApps().length) {
    // Check if the project ID is available (ensuring config is loaded)
    if (firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
    }
} else {
    // If already initialized, get the default app
    app = getApp();
}

// Get a Firestore instance if the app was initialized
const db = app ? getFirestore(app) : null;

export { app, db };
