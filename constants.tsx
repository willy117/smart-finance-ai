
import React from 'react';
import { Category, TransactionType, Account } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: '飲食', type: TransactionType.EXPENSE, icon: '🍔', color: 'bg-orange-100 text-orange-600' },
  { id: 'cat-2', name: '交通', type: TransactionType.EXPENSE, icon: '🚗', color: 'bg-blue-100 text-blue-600' },
  { id: 'cat-3', name: '薪資', type: TransactionType.INCOME, icon: '💰', color: 'bg-green-100 text-green-600' },
  { id: 'cat-4', name: '娛樂', type: TransactionType.EXPENSE, icon: '🎬', color: 'bg-purple-100 text-purple-600' },
  { id: 'cat-5', name: '購物', type: TransactionType.EXPENSE, icon: '🛍️', color: 'bg-pink-100 text-pink-600' },
  { id: 'cat-6', name: '租金', type: TransactionType.EXPENSE, icon: '🏠', color: 'bg-red-100 text-red-600' },
  { id: 'cat-7', name: '獎金', type: TransactionType.INCOME, icon: '🎁', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'cat-8', name: '其他支出', type: TransactionType.EXPENSE, icon: '📦', color: 'bg-gray-100 text-gray-600' },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: '生活費帳戶', bankName: '國泰世華', balance: 50000, color: '#00A650' },
  { id: 'acc-2', name: '儲蓄帳戶', bankName: '玉山銀行', balance: 200000, color: '#10B981' },
];

export const INITIAL_TRANSACTIONS = [
  { id: 't-1', accountId: 'acc-1', categoryId: 'cat-1', amount: 120, date: '2024-05-01', description: '早餐', type: TransactionType.EXPENSE },
  { id: 't-2', accountId: 'acc-1', categoryId: 'cat-3', amount: 45000, date: '2024-05-05', description: '5月薪資', type: TransactionType.INCOME },
  { id: 't-3', accountId: 'acc-1', categoryId: 'cat-6', amount: 15000, date: '2024-05-06', description: '房屋租金', type: TransactionType.EXPENSE },
  { id: 't-4', accountId: 'acc-1', categoryId: 'cat-2', amount: 800, date: '2024-05-10', description: '加油', type: TransactionType.EXPENSE },
  { id: 't-5', accountId: 'acc-1', categoryId: 'cat-5', amount: 2000, date: '2024-05-12', description: '買新鞋', type: TransactionType.EXPENSE },
];
