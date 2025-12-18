
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
// Import modular auth functions directly from firebase/auth
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile
} from "firebase/auth";
// Use import type for types to avoid confusion with values
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

/**
 * 驗證並解析來自環境變數的 Firebase 配置。
 */
const getValidFirebaseConfig = () => {
  const rawConfig = process.env.FIREBASE_CONFIG;
  
  if (!rawConfig || rawConfig === 'undefined' || rawConfig === '{}') {
    // 這裡不使用 console.error 拋出錯誤，而是回傳 null 讓 UI 顯示引導訊息
    return null;
  }

  try {
    let cleanConfig = rawConfig.trim();
    // 支援從 Firebase Console 複製過來的 JS 物件格式
    if (cleanConfig.includes('{') && (cleanConfig.startsWith('const') || cleanConfig.startsWith('let'))) {
      const match = cleanConfig.match(/\{[\s\S]*\}/);
      if (match) cleanConfig = match[0];
    }
    return JSON.parse(cleanConfig);
  } catch (e) {
    console.warn("Firebase 配置解析失敗，請檢查 GitHub Secrets 格式是否為正確的 JSON");
    return null;
  }
};

const config = getValidFirebaseConfig();

// 初始化實例
let app: FirebaseApp | undefined;
let authInstance: Auth | any = null;
let dbInstance: Firestore | any = null;

if (config) {
  try {
    app = initializeApp(config);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Firebase 初始化成功");
  } catch (e) {
    console.error("Firebase 初始化失敗:", e);
  }
}

// 匯出實例與方法
export const auth = authInstance;
export const db = dbInstance;

// 重新匯出 Auth 方法。注意：如果 auth 未初始化，這些方法呼叫會失敗，
// 因此在 App.tsx 中需要判斷 auth 是否存在。
export { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
};
