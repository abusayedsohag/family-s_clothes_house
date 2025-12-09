import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_USER,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_USER,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_USER,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_USER,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_USER,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_USER,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESUREMENT_ID_USER
};

const apps = getApps().some(app => app.name === "apps")
    ? getApp("apps")
    : initializeApp(firebaseConfig, "apps");
export const auth = getAuth(apps)
