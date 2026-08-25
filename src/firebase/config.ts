import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Prefer Vite environment variables when they are available. The fallback
// values keep the existing project configuration working after deployment.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBilkb1oLOaFwiM3LnYU3njrKLNjZWggp8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ineonotees.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ineonotees",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ineonotees.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "22532007738",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:22532007738:web:9297e6ff345c4151675203",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-B31KHX33SG",
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
