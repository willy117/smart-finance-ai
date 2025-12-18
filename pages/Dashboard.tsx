
import React, { useState, useMemo } from 'react';
import { Account, Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { getFinancialAdvice } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions }) => {
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalBalance, income, expense };
  }, [accounts, transactions]);

  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const cat = CATEGORIES.find(c => c.id === t.categoryId);
        if (cat) {
          categoryTotals[cat.name] = (categoryTotals[cat.name] || 0) + t.amount;
        }
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const advice = await getFinancialAdvice(transactions, accounts, CATEGORIES);
    setAiAdvice(advice);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">歡迎回來！👋</h2>
        <p className="text-slate-500">這是您的個人財務概況</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">總資產餘額</p>
          <p className="text-3xl font-bold text-slate-800">${stats.totalBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">本月收入</p>
          <p className="text-3xl font-bold text-green-600">+${stats.income.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 mb-1">本月支出</p>
          <p className="text-3xl font-bold text-red-600">-${stats.expense.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenditure Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">支出分佈</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Section */}
        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>🤖</span> AI 財務分析建議
            </h3>
            <button
              onClick={handleAiAnalysis}
              disabled={isAnalyzing}
              className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? '分析中...' : '生成分析'}
            </button>
          </div>
          <div className="bg-indigo-500/30 rounded-xl p-4 min-h-[150px] whitespace-pre-wrap leading-relaxed text-indigo-50">
            {aiAdvice || "點擊按鈕，讓 AI 為您的財務狀況提供專業建議。"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
