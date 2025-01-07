import  { useState } from 'react';
import useTransactions from '../hooks/useTransactions';

const TransactionsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Use custom hook
    const { transactions, loading, error } = useTransactions(statusFilter, dateRange);

    // Handle pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = transactions
        .filter((t) =>
            Object.values(t)
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Transactions Overview</h1>

            {/* Show loading or error */}
            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-4 py-2 rounded"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">All Statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILURE">Failed</option>
                </select>
                <div>
                    <label className="mr-2">Start Date:</label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, start: e.target.value }))
                        }
                        className="border px-4 py-2 rounded"
                    />
                </div>
                <div>
                    <label className="mr-2">End Date:</label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, end: e.target.value }))
                        }
                        className="border px-4 py-2 rounded"
                    />
                </div>
            </div>

            {/* Transactions Table */}
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
                    {currentTransactions.map((transaction) => (
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

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(transactions.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 mx-1 rounded ${
                            currentPage === i + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TransactionsPage;
