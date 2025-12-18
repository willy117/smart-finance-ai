
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where,
  deleteDoc
} from 'firebase/firestore';
import { Account, Transaction } from '../types';

export const syncUserData = async (userId: string, accounts: Account[], transactions: Transaction[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      lastUpdated: new Date().toISOString()
    });

    // 儲存帳戶
    const accountsRef = collection(db, 'users', userId, 'accounts');
    for (const acc of accounts) {
      await setDoc(doc(accountsRef, acc.id), acc);
    }

    // 儲存交易
    const transRef = collection(db, 'users', userId, 'transactions');
    for (const trans of transactions) {
      await setDoc(doc(transRef, trans.id), trans);
    }
  } catch (e) {
    console.error("Error syncing data: ", e);
  }
};

export const loadUserData = async (userId: string) => {
  try {
    const accountsSnapshot = await getDocs(collection(db, 'users', userId, 'accounts'));
    const transactionsSnapshot = await getDocs(collection(db, 'users', userId, 'transactions'));

    const accounts = accountsSnapshot.docs.map(doc => doc.data() as Account);
    const transactions = transactionsSnapshot.docs.map(doc => doc.data() as Transaction);

    return { accounts, transactions };
  } catch (e) {
    console.error("Error loading data: ", e);
    return { accounts: [], transactions: [] };
  }
};
