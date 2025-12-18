
import React, { useState } from 'react';
import { User } from '../types';
import { 
  auth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from '../firebase';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!auth) {
      setError('Firebase 尚未配置完成，請聯繫管理員。');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Use non-null assertion as we already checked auth above
        const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        const newUser: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: name,
        };
        onLogin(newUser);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth!, email, password);
        const existingUser: User = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || '使用者',
        };
        onLogin(existingUser);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setError('此電子郵件已被註冊');
      else if (err.code === 'auth/invalid-credential') setError('電子郵件或密碼錯誤');
      else if (err.code === 'auth/weak-password') setError('密碼強度不足（至少6位）');
      else setError('發生錯誤：' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">SmartFinance AI</h1>
          <p className="text-slate-500">{isRegister ? '建立您的個人理財帳戶' : '歡迎回來，請登入管理您的財務'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">顯示名稱</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="您的稱呼"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">電子郵件</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">密碼</label>
            <input
              required
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {loading ? '處理中...' : (isRegister ? '立即註冊' : '登入系統')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 text-sm font-semibold hover:underline"
          >
            {isRegister ? '已經有帳號了？立即登入' : '還沒有帳號？點此註冊'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
