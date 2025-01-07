import  { useState } from 'react';
import useTransactions from '../hooks/useTransactions';

const SchoolTransactionsPage = () => {
    const [schoolId, setSchoolId] = useState('');
    const { transactions, loading, error } = useTransactions({ school_id: schoolId });

    const handleSchoolChange = (e) => {
        setSchoolId(e.target.value);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Transactions by School</h1>

            {/* School Selector */}
            <div className="mb-4">
                <label htmlFor="school-id" className="block text-sm font-medium mb-2">
                    Select School ID:
                </label>
                <input
                    id="school-id"
                    type="text"
                    placeholder="Enter School ID"
                    value={schoolId}
                    onChange={handleSchoolChange}
                    className="border px-4 py-2 rounded w-full"
                />
            </div>

            {/* Loading and Error Messages */}
            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {/* Transactions Table */}
            {transactions.length > 0 ? (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">collect_id</th>
                            <th className="border px-4 py-2">school_id</th>
                            <th className="border px-4 py-2">gateway</th>
                            <th className="border px-4 py-2">order_amount</th>
                            <th className="border px-4 py-2">transaction_amount</th>
                            <th className="border px-4 py-2">status</th>
                            <th className="border px-4 py-2">custom_order_id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.collect_id}>
                                <td className="border px-4 py-2">{transaction.collect_id}</td>
                                <td className="border px-4 py-2">{transaction.school_id}</td>
                                <td className="border px-4 py-2">{transaction.gateway}</td>
                                <td className="border px-4 py-2">{transaction.order_amount}</td>
                                <td className="border px-4 py-2">{transaction.transaction_amount}</td>
                                <td className="border px-4 py-2">{transaction.status}</td>
                                <td className="border px-4 py-2">{transaction.custom_order_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !loading && <p>No transactions found for this school.</p>
            )}
        </div>
    );
};

export default SchoolTransactionsPage;
