// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjPo67Q2YDshR1A1VbVc0pAAof4B9AOKQ",
  authDomain: "mindmap-f377b.firebaseapp.com",
  projectId: "mindmap-f377b",
  storageBucket: "mindmap-f377b.firebasestorage.app",
  messagingSenderId: "208612764076",
  appId: "1:208612764076:web:798a4d4e22fb4d3e74f209",
  measurementId: "G-TDC9VHLW3H"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
