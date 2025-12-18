
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// Standard modular imports for Firebase Auth. 
// Consolidating to a single line can help resolve issues with certain bundlers or TypeScript configurations.
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const getValidFirebaseConfig = () => {
  const rawConfig = process.env.FIREBASE_CONFIG;
  if (!rawConfig || rawConfig === 'undefined' || rawConfig === '{}') return null;

  try {
    let cleanConfig = rawConfig.trim();
    if (cleanConfig.includes('{') && (cleanConfig.startsWith('const') || cleanConfig.startsWith('let'))) {
      const match = cleanConfig.match(/\{[\s\S]*\}/);
      if (match) cleanConfig = match[0];
    }
    // 處理可能的單引號或不規範 JSON
    return JSON.parse(cleanConfig.replace(/'/g, '"').replace(/(\w+):/g, '"$1":'));
  } catch (e) {
    console.warn("Firebase Config Parse Error:", e);
    return null;
  }
};

const config = getValidFirebaseConfig();

let app: FirebaseApp | undefined;
// Use any for authInstance to avoid "no exported member 'Auth'" error, ensuring compatibility across different Firebase version types.
let authInstance: any = null;
let dbInstance: Firestore | null = null;

if (config) {
  try {
    app = initializeApp(config);
    // Initialize Auth and Firestore using the modular pattern.
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Firebase 初始化成功");
  } catch (e) {
    console.error("Firebase 初始化失敗:", e);
  }
}

export const auth = authInstance;
export const db = dbInstance;

// Re-export modular auth functions directly.
export { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
};
