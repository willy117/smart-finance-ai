
import React, { useState } from 'react';
import { Account } from '../types';

interface AccountsProps {
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [balance, setBalance] = useState<number>(0);

  const resetForm = () => {
    setName('');
    setBankName('');
    setBalance(0);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAccounts(prev => prev.map(a => a.id === editingId ? { ...a, name, bankName, balance } : a));
    } else {
      const newAccount: Account = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        bankName,
        balance,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      };
      setAccounts(prev => [...prev, newAccount]);
    }
    resetForm();
  };

  const handleEdit = (account: Account) => {
    setEditingId(account.id);
    setName(account.name);
    setBankName(account.bankName);
    setBalance(account.balance);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除此帳戶嗎？所有相關資料將會移除。')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">銀行帳戶管理</h2>
          <p className="text-slate-500">管理您的銀行存款與資產帳戶</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + 新增帳戶
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: account.color }}>
                  {account.bankName.substring(0, 1)}
                </div>
                <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(account)} className="text-slate-400 hover:text-indigo-600">編輯</button>
                  <button onClick={() => handleDelete(account.id)} className="text-slate-400 hover:text-red-600">刪除</button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800">{account.name}</h3>
              <p className="text-sm text-slate-500">{account.bankName}</p>
            </div>
            <div className="mt-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">可用餘額</p>
              <p className="text-2xl font-bold text-slate-800">${account.balance.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scaleIn">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{editingId ? '編輯帳戶' : '新增帳戶'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">帳戶名稱</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="例如：生活費、薪轉"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">銀行名稱</label>
                <input
                  required
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="例如：中信、台新"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">初始餘額</label>
                <input
                  required
                  type="number"
                  value={balance}
                  onChange={e => setBalance(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  確認儲存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
