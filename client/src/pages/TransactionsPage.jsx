import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchTransactionsService } from "../services/transactionService"
import TransactionTable from "../components/TransactionTable";
import {ChevronLeft,ChevronRight} from 'lucide-react' 
import { LoadingDots } from "../utils/Loding";


const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([null, null]); 
  const [loading, setLoading] = useState(false);
  

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactionsService({
        status: statusFilter,
        startDate: dateRange[0],
        endDate: dateRange[1],
      });

      const enrichedData = data.map((transaction, index) => ({
        ...transaction,
        createdAt: new Date(2025, 0, index + 1), // Dummy dates for testing
      }));

      setTransactions(enrichedData);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, dateRange]);

  useEffect(() => {
    let filteredData = transactions;

    if (searchTerm) {
      filteredData = filteredData.filter((transaction) =>
        transaction.custom_order_id
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (dateRange[0] && dateRange[1]) {
      filteredData = filteredData.filter(
        (transaction) =>
          new Date(transaction.createdAt) >= dateRange[0] &&
          new Date(transaction.createdAt) <= dateRange[1]
      );
    }

    setFilteredTransactions(filteredData);
  }, [searchTerm, dateRange, transactions]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage); 

  if(loading) {
    return <LoadingDots message="Loading transactions..." />;
  }

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-2 text-[#2869aa]">All Transactions </h1>
      <p className=" text-sm text-gray-500 mb-6">View and manage  transaction details</p>


      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID"
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

      <div className=" w-full shadow-xl rounded-lg overflow-hidden ">
        <TransactionTable transactions = {currentTransactions} />

        
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
  );
};

export default TransactionsPage;

