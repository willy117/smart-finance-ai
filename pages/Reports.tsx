
import React, { useMemo } from 'react';
import { Transaction, Account, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
  accounts: Account[];
}

const Reports: React.FC<ReportsProps> = ({ transactions, accounts }) => {
  const monthlyTrendData = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    
    // Sort and fill missing months if needed (simplified here for last 6 months)
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { income: 0, expense: 0 };
      }
      
      if (t.type === TransactionType.INCOME) {
        months[monthYear].income += t.amount;
      } else {
        months[monthYear].expense += t.amount;
      }
    });

    return Object.entries(months)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [transactions]);

  const categoryData = useMemo(() => {
    const res: Record<string, number> = {};
    transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      const cat = CATEGORIES.find(c => c.id === t.categoryId);
      if (cat) {
        res[cat.name] = (res[cat.name] || 0) + t.amount;
      }
    });
    return Object.entries(res).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">統計分析報表</h2>
        <p className="text-slate-500">深入了解您的財務健康狀況</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">收支趨勢圖</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="income" name="收入" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="支出" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">支出細目分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" name="金額" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <h4 className="text-xl font-bold text-slate-800 mb-4">需要更多個人化理財見解嗎？</h4>
        <p className="text-slate-500 mb-6">回到儀表板，使用 AI 助理分析您的數據，獲得專屬您的理財建議。</p>
        <button 
          onClick={() => window.location.hash = '/'}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          前往儀表板
        </button>
      </div>
    </div>
  );
};

export default Reports;
