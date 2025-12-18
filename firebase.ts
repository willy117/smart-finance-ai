
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const getValidFirebaseConfig = () => {
  const rawConfig = process.env.FIREBASE_CONFIG;
  
  if (!rawConfig || rawConfig === 'undefined' || rawConfig === '{}') {
    console.warn("⚠️ Firebase 配置為空，請檢查 GitHub Secrets 是否設定名稱為 FIREBASE_CONFIG");
    return null;
  }

  try {
    let configStr = rawConfig;
    
    // 如果字串被雙重引號包裹（常見於注入錯誤），嘗試修復
    if (configStr.startsWith('"') && configStr.endsWith('"')) {
      configStr = JSON.parse(configStr);
    }

    // 處理貼上整個變數的情況 (例如 const firebaseConfig = { ... };)
    if (configStr.includes('{')) {
      const match = configStr.match(/\{[\s\S]*\}/);
      if (match) configStr = match[0];
    }

    // 格式化：將單引號換成雙引號，並確保 Key 有雙引號 (處理非標準 JSON)
    const formattedJson = configStr
      .replace(/'/g, '"')
      .replace(/(\s*?)([a-zA-Z0-9_]+?)\s*?:/g, '$1"$2":');
      
    const parsed = JSON.parse(formattedJson);
    return parsed;
  } catch (e) {
    console.error("❌ Firebase 配置解析失敗。請確認 Secret 內容是正確的 JSON 格式。");
    return null;
  }
};

const config = getValidFirebaseConfig();

let app: FirebaseApp | undefined;
let authInstance: any = null;
let dbInstance: Firestore | null = null;

if (config && config.apiKey) {
  try {
    app = initializeApp(config);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Firebase 初始化成功");
  } catch (e) {
    console.error("🔥 Firebase 初始化發生錯誤:", e);
  }
} else {
  console.log("ℹ️ 應用程式目前運行於離線模式（無 Firebase 配置）。");
}

export const auth = authInstance;
export const db = dbInstance;

export { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
};
