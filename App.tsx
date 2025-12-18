
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
  const [configError, setConfigError] = useState(false);

  useEffect(() => {
    // 如果 auth 沒被正確初始化（可能是因為 Secrets 沒設），顯示錯誤引導
    if (!auth) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '使用者'
        };
        setUser(userData);
        
        try {
          const cloudData = await loadUserData(firebaseUser.uid);
          if (cloudData.accounts.length > 0) {
            setAccounts(cloudData.accounts);
            setTransactions(cloudData.transactions);
          } else {
            setAccounts(INITIAL_ACCOUNTS);
            setTransactions(INITIAL_TRANSACTIONS);
          }
        } catch (e) {
          console.error("載入資料失敗", e);
          setAccounts(INITIAL_ACCOUNTS);
          setTransactions(INITIAL_TRANSACTIONS);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !loading && auth) {
      const timeoutId = setTimeout(() => {
        syncUserData(user.id, accounts, transactions);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [accounts, transactions, user, loading]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      setAccounts([]);
      setTransactions([]);
    }
  };

  if (configError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="text-6-xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">配置尚未完成</h2>
        <p className="text-slate-600 max-w-md">
          請確保您已在 GitHub Secrets 中設定了 <b>FIREBASE_CONFIG</b>。<br/>
          設定完成後，請重新執行 GitHub Actions 佈署。
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">系統同步中...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

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
