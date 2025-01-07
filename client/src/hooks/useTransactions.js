import { useState, useEffect } from 'react';
import axios from 'axios';

const useTransactions = (filters = {}) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/transactions', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzM2MjU0MjYyLCJleHAiOjE3MzYzNDA2NjJ9.48CTo5fOHzrBE-DuI8Wa_3g2k4uD9tMS2zcYRfa5RFo`,
                },
                params: filters, // Dynamically pass all filters
            });
            setTransactions(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters]); // Re-fetch data whenever filters change

    return { transactions, loading, error, fetchTransactions };
};

export default useTransactions;
