import { useState, useCallback } from 'react';
import axios from 'axios';
import { Base_url } from '../constants';

export const useTransactions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchTransactions = useCallback(async ({ status, startDate, endDate }) => {
      const token = localStorage.getItem('token');
      setLoading(true);
      setError(null);
  
      try {
        const { data } = await axios.get(`${Base_url}/api/transactions`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          params: {
            status,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
          },
        });
        return data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch transactions';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    }, []);
  
    return {
      loading,
      error,
      fetchTransactions,
    };
  };
  