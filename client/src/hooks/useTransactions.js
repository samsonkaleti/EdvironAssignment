import { useState, useEffect } from 'react';
import { fetchTransactions } from '../services/transactionService';

const useTransactions = (statusFilter) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(statusFilter, token);
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [filters]); // Re-fetch data whenever filters change

  return { transactions, loading, error, reload: loadTransactions };
};

export default useTransactions;
