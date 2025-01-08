import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchTransactionsService } from "../services/transactionService"

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      const data = await fetchTransactionsService({
        status: statusFilter,
        startDate: dateRange[0],
        endDate: dateRange[1],
      });

      // Add dummy dates for filtering
      const enrichedData = data.map((transaction, index) => ({
        ...transaction,
        createdAt: new Date(2025, 0, index + 1), // Dummy dates for testing
      }));

      setTransactions(enrichedData);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, dateRange]);

  // Filter and Search Logic
  useEffect(() => {
    let filteredData = transactions;

    // Filter by search term
    if (searchTerm) {
      filteredData = filteredData.filter((transaction) =>
        transaction.collect_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter(
        (transaction) =>
          new Date(transaction.createdAt) >= dateRange[0] &&
          new Date(transaction.createdAt) <= dateRange[1]
      );
    }

    setFilteredTransactions(filteredData);
  }, [searchTerm, dateRange, transactions]);

  // Pagination Logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">Transactions Overview</h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Collect ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/3 shadow-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        >
          <option value="">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILURE">Failed</option>
        </select>
        <ReactDatePicker
          selectsRange
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={(update) => setDateRange(update)}
          isClearable
          placeholderText="Select date range"
          className="border p-2 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
        />
      </div>

      {/* Table */}
      <div className=" w-full shadow-xl rounded-lg overflow-hidden ">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 text-left">Collect ID</th>
              <th className="p-3 text-left">School ID</th>
              <th className="p-3 text-left">Gateway</th>
              <th className="p-3 text-left">Order Amount</th>
              <th className="p-3 text-left">Transaction Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Custom Order ID</th>
              <th className="p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo- transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 ease-in-out transform  hover:cursor-pointer"
                >
                  <td className="p-3 border-t">{transaction.collect_id}</td>
                  <td className="p-3 border-t">{transaction.school_id}</td>
                  <td className="p-3 border-t">{transaction.gateway}</td>
                  <td className="p-3 border-t text-green-600 font-semibold">  
                    ₹{transaction.order_amount.toLocaleString()}
                  </td>
                  <td className="p-3 border-t text-green-600 font-semibold">
                    ₹{transaction.transaction_amount.toLocaleString()}
                  </td>
                  <td
                    className={`p-3 border-t font-semibold ${
                      transaction.status === "SUCCESS"
                        ? "text-green-600"
                        : transaction.status === "PENDING"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.status}
                  </td>
                  <td className="p-3 border-t">{transaction.custom_order_id}</td>
                  <td className="p-3 border-t">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan="7">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-l-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-white border-t border-b">
          {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-r-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsPage;

