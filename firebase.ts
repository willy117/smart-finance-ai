
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
  // 從 Vite define 注入的環境變數獲取配置
  const rawConfig = process.env.FIREBASE_CONFIG;
  
  if (!rawConfig || rawConfig === 'undefined' || rawConfig === '{}') {
    return null;
  }

  try {
    // 確保 rawConfig 是字串再進行處理
    let cleanConfig = typeof rawConfig === 'string' ? rawConfig.trim() : JSON.stringify(rawConfig);
    
    // 如果包含變數聲明（例如直接貼上整個物件），則嘗試提取 JSON 部分
    if (cleanConfig.includes('{')) {
      const match = cleanConfig.match(/\{[\s\S]*\}/);
      if (match) cleanConfig = match[0];
    }
    
    // 處理非標準 JSON 格式（如單引號或無引號鍵名）
    const parsed = JSON.parse(cleanConfig.replace(/'/g, '"').replace(/(\w+):/g, '"$1":'));
    return parsed;
  } catch (e) {
    console.warn("Firebase Config Parse Warning:", e);
    return null;
  }
};

const config = getValidFirebaseConfig();

let app: FirebaseApp | undefined;
let authInstance: any = null;
let dbInstance: Firestore | null = null;

// 只有在配置有效且包含 apiKey 時才初始化
if (config && config.apiKey) {
  try {
    app = initializeApp(config);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    console.log("✅ Firebase 初始化成功");
  } catch (e) {
    console.error("Firebase 初始化失敗:", e);
  }
} else {
  console.log("ℹ️ Firebase Secrets 尚未設定或格式不正確，目前運行於離線模式。");
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
