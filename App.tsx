
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { User, Account, Transaction } from './types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS } from './constants';
import { auth, onAuthStateChanged, signOut } from './firebase';
import { loadUserData, syncUserData } from './services/firebaseService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    // 核心修正：檢查 Firebase Auth 模組是否可用
    if (!auth) {
      setIsConfigured(false);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '使用者'
          };
          setUser(userData);
          
          const cloudData = await loadUserData(firebaseUser.uid);
          if (cloudData && cloudData.accounts && cloudData.accounts.length > 0) {
            setAccounts(cloudData.accounts);
            setTransactions(cloudData.transactions);
          } else {
            setAccounts(INITIAL_ACCOUNTS);
            setTransactions(INITIAL_TRANSACTIONS);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Auth Listener Error:", error);
      setIsConfigured(false);
      setLoading(false);
    }
  }, []);

  // 自動同步資料到 Firebase
  useEffect(() => {
    if (user && !loading && auth && isConfigured) {
      const timeoutId = setTimeout(() => {
        syncUserData(user.id, accounts, transactions);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [accounts, transactions, user, loading, isConfigured]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      setAccounts([]);
      setTransactions([]);
    }
  };

  // 1. 如果尚未配置 Secrets 的處理畫面
  if (!isConfigured) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">尚未偵測到 Firebase 配置</h2>
        <p className="text-slate-600 max-w-md mb-8">
          請前往 GitHub Repository 的 <b>Settings &gt; Secrets and variables &gt; Actions</b> 新增名為 <code>FIREBASE_CONFIG</code> 的 Secret。
        </p>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-sm font-mono text-slate-500">
          格式範例：<br/>
          {`{"apiKey": "AIza...", "authDomain": "...", ...}`}
        </div>
      </div>
    );
  }

  // 2. 載入中畫面
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">安全連接中...</p>
      </div>
    );
  }

  // 3. 登入畫面
  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  // 4. 主應用畫面
  return (
    <HashRouter>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar onLogout={handleLogout} />
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard accounts={accounts} transactions={transactions} />} />
            <Route path="/accounts" element={<Accounts accounts={accounts} setAccounts={setAccounts} />} />
            <Route path="/transactions" element={<Transactions transactions={transactions} setTransactions={setTransactions} accounts={accounts} setAccounts={setAccounts} />} />
            <Route path="/reports" element={<Reports transactions={transactions} accounts={accounts} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
