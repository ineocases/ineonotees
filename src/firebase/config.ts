import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBilkb1oLOaFwiM3LnYU3njrKLNjZWggp8",
  authDomain: "ineonotees.firebaseapp.com",
  projectId: "ineonotees",
  storageBucket: "ineonotees.firebasestorage.app",
  messagingSenderId: "22532007738",
  appId: "1:22532007738:web:9297e6ff345c4151675203",
  measurementId: "G-B31KHX33SG",
};

export const firebaseConfigured = true;
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
