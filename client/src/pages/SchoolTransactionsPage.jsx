import { useState, useEffect } from "react";
import axios from "axios"; 
import {ChevronRight,ChevronLeft,Search } from "lucide-react"

const SchoolTransactionsPage = () => {
  const [schoolId, setSchoolId] = useState(""); // Selected school ID
  const [transactions, setTransactions] = useState([]); // Filtered transactions
  const [allTransactions, setAllTransactions] = useState([]); // All transactions from the API
  const [schools, setSchools] = useState([]); // Extracted school IDs
  const [searchTerm, setSearchTerm] = useState(""); // Search term for collect_id

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 8; // Number of transactions per page

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
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">School Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage school-wise transaction details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="text-sm font-medium text-gray-700">School</label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm py-2 pl-3 pr-10 text-sm"
            >
              <option value="">All Schools</option>
              {schools.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-200 pl-10 text-sm"
                placeholder="Search by collect ID"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collect ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gateway</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.collect_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.gateway}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{transaction.order_amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${transaction.status === "SUCCESS" ? "bg-green-100 text-green-800" : 
                          transaction.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.created_at ? new Date(transaction.created_at).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(page => page - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(page => page + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastTransaction, transactions.length)}
                  </span>{" "}
                  of <span className="font-medium">{transactions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(page => page - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(page => page + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolTransactionsPage;
