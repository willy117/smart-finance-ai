
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// Use named imports for Firebase Auth functions
import { 
  getAuth, 
  onAuthStateChanged as firebaseOnAuthStateChanged, 
  signOut as firebaseSignOut, 
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, 
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, 
  updateProfile as firebaseUpdateProfile 
} from "firebase/auth";
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
let authInstance: any = null;
let dbInstance: any = null;

if (config) {
  try {
    app = initializeApp(config);
    // Use getAuth directly as a function
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Firebase 初始化成功");
  } catch (e) {
    console.error("Firebase 初始化失敗:", e);
  }
}

export const auth = authInstance;
export const db = dbInstance;

// 安全地重新匯出 Auth 方法
// Exporting the functions imported from firebase/auth
export const onAuthStateChanged = firebaseOnAuthStateChanged;
export const signOut = firebaseSignOut;
export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
export const createUserWithEmailAndPassword = firebaseCreateUserWithEmailAndPassword;
export const updateProfile = firebaseUpdateProfile;
