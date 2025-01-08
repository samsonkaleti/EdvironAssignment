import { useState, useEffect } from "react";
import axios from "axios";

const SchoolTransactionsPage = () => {
  const [schoolId, setSchoolId] = useState(""); // Selected school ID
  const [transactions, setTransactions] = useState([]); // Filtered transactions
  const [allTransactions, setAllTransactions] = useState([]); // All transactions from the API
  const [schools, setSchools] = useState([]); // Extracted school IDs
  const [searchTerm, setSearchTerm] = useState(""); // Search term for collect_id

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Number of transactions per page

  // Fetch all transactions and extract school IDs
  const fetchAllTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:8080/api/transactions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched All Transactions:", data); // Debugging log
      setAllTransactions(data);

      // Extract unique school IDs from transactions
      const uniqueSchools = [...new Set(data.map((transaction) => transaction.school_id))];
      setSchools(uniqueSchools);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Filter transactions based on selected school ID and search term
  useEffect(() => {
    let filteredTransactions = allTransactions;

    // Filter by school_id if selected
    if (schoolId) {
      filteredTransactions = filteredTransactions.filter(
        (transaction) => transaction.school_id === schoolId
      );
    }

    // Filter by searchTerm if entered
    if (searchTerm) {
      filteredTransactions = filteredTransactions.filter((transaction) =>
        transaction.collect_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTransactions(filteredTransactions);
    setCurrentPage(1); // Reset to the first page when filters change
  }, [schoolId, searchTerm, allTransactions]);

  // Fetch all transactions on component mount
  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // Calculate the current page's transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Calculate the total number of pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Transaction Details by School</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Dropdown for School IDs */}
        <div>
          <label htmlFor="schoolSelect" className="block mb-2 font-semibold text-gray-700">
            Select School
          </label>
          <select
            id="schoolSelect"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="border p-2 rounded w-64 shadow-md"
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div>
          <label htmlFor="searchBar" className="block mb-2 font-semibold text-gray-700">
            Search by Collect ID
          </label>
          <input
            id="searchBar"
            type="text"
            placeholder="Search by collect ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-64 shadow-md"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <table className="w-full border-collapse border border-gray-300 rounded-md shadow-lg">
        <thead>
          <tr className="bg-blue-100 text-blue-900 font-semibold">
            <th className="border p-2">Collect ID</th>
            <th className="border p-2">Gateway</th>
            <th className="border p-2">Order Amount</th>
            <th className="border p-2">Transaction Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Custom Order ID</th>
            <th className="border p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((transaction, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-200`}
              >
                <td className="border p-2">{transaction.collect_id}</td>
                <td className="border p-2">{transaction.gateway}</td>
                <td className="border p-2 text-green-600 font-semibold">
                  ₹{transaction.order_amount.toLocaleString()}
                </td>
                <td className="border p-2 text-green-600 font-semibold">
                  {transaction.transaction_amount
                    ? `₹${transaction.transaction_amount.toLocaleString()}`
                    : "N/A"}
                </td>
                <td
                  className={`border p-2 ${
                    transaction.status === "SUCCESS"
                      ? "text-green-700"
                      : transaction.status === "PENDING"
                      ? "text-yellow-700"
                      : "text-red-700"
                  } font-semibold`}
                >
                  {transaction.status}
                </td>
                <td className="border p-2">{transaction.custom_order_id}</td>
                <td className="border p-2">
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan="7">
                No transactions found for the selected school or criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-semibold">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SchoolTransactionsPage;
