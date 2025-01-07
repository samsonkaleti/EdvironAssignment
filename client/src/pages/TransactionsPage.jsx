import React, { useState } from 'react';
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
        <div className="p-6 bg-amber-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-amber-900">Transactions Overview</h1>

            {/* Show loading or error */}
            {loading && <p className="text-amber-700">Loading transactions...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-amber-300 px-4 py-2 rounded-md bg-amber-100 text-amber-900 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-auto"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-amber-300 px-4 py-2 rounded-md bg-amber-100 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 w-full md:w-auto"
                >
                    <option value="">All Statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILURE">Failed</option>
                </select>
                <div className="flex items-center">
                    <label className="mr-2 text-amber-900">Start Date:</label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, start: e.target.value }))
                        }
                        className="border border-amber-300 px-4 py-2 rounded-md bg-amber-100 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
                <div className="flex items-center">
                    <label className="mr-2 text-amber-900">End Date:</label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, end: e.target.value }))
                        }
                        className="border border-amber-300 px-4 py-2 rounded-md bg-amber-100 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-lg shadow-lg bg-white">
                    <thead className="bg-amber-200">
                        <tr>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">Collect ID</th>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">School ID</th>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">Gateway</th>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">Order Amount</th>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">Transaction Amount</th>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">Status</th>
                            <th className="border border-amber-300 px-4 py-2 text-amber-900">Custom Order ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200">
                        {currentTransactions.map((transaction) => (
                            <tr
                                key={transaction.collect_id}
                                className="hover:bg-amber-100 transition-colors duration-200 ease-in-out"
                            >
                                <td className="border border-amber-300 px-4 py-2 text-amber-900">{transaction.collect_id}</td>
                                <td className="border border-amber-300 px-4 py-2 text-amber-900">{transaction.school_id}</td>
                                <td className="border border-amber-300 px-4 py-2 text-amber-900">{transaction.gateway}</td>
                                <td className="border border-amber-300 px-4 py-2 text-amber-900">₹{transaction.order_amount}</td>
                                <td className="border border-amber-300 px-4 py-2 text-amber-900">₹{transaction.transaction_amount}</td>
                                <td className="border border-amber-300 px-4 py-2">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            transaction.status === 'SUCCESS'
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="border border-amber-300 px-4 py-2 text-amber-900">{transaction.custom_order_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                {Array.from({ length: Math.ceil(transactions.length / itemsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 mx-1 rounded-md ${
                            currentPage === i + 1
                                ? 'bg-amber-500 text-white'
                                : 'bg-amber-200 text-amber-900 hover:bg-amber-300'
                        } transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TransactionsPage;

