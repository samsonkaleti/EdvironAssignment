import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import TransactionTable from '../components/TransactionTable';
import { Base_url } from '../constants'; 
import { LoadingDots, ErrorMessage } from "../utils/Loding"

const TransactionDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    collectId: '',
    gateway: '',
    schoolId: '',
    customOrderId: '',
    status: '',
    amount: ''
  }); 
  const token = localStorage.getItem('token');

  const fetchTransactions = async (endpoint = '/transactions') => {
    setLoading(true);
    try {
      const response = await fetch(`${Base_url}/api${endpoint}`,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    
    if (!value) {
      fetchTransactions();
      return;
    } 

    if (type === 'status') {
      fetchTransactions(`/transactions?status=${value}`);
      return;
    }


    let endpoint = '/transactions';
    switch (type) {
      case 'collectId':
        endpoint = `/transactions/collect/${value}`;
        break;
      case 'gateway':
        endpoint = `/transactions/gateway/${value}`;
        break;
      case 'schoolId':
        endpoint = `/transactions/${value}`;
        break;
      case 'customOrderId':
        endpoint = `/transactions/status/${value}`;
        break;
      case 'status':
        endpoint = `/transactions/`;
        break;
      case 'amount':
        endpoint = `/transactions/${value}`;
        break;
    }
    fetchTransactions(endpoint);
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(() => fetchTransactions(), 60000);
    return () => clearInterval(interval);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Memoized calculations
  const paymentMethodData = React.useMemo(() => {
    const distribution = {};
    transactions.forEach(tx => {
      distribution[tx.payment_method] = (distribution[tx.payment_method] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const gatewayData = React.useMemo(() => {
    const distribution = {};
    transactions.forEach(tx => {
      distribution[tx.gateway] = (distribution[tx.gateway] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const statusData = React.useMemo(() => {
    const distribution = {};
    transactions.forEach(tx => {
      distribution[tx.status] = (distribution[tx.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count
    }));
  }, [transactions]);

  if (loading) {
    return (
        <LoadingDots message="Loading transaction data..." />
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="space-y-6 w-full p-6"> {/* Removed ml-64 and px-6 as they're handled by layout */}
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">School ID</label>
          <input
            type="text"
            value={filters.schoolId}
            onChange={(e) => handleFilterChange('schoolId', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter School ID"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gateway</label>
          <input
            type="text"
            value={filters.gateway}
            onChange={(e) => handleFilterChange('gateway', e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter Gateway"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILURE">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Transactions</h3>
          <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Amount</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{transactions.reduce((sum, tx) => sum + tx.transaction_amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Success Rate</h3>
          <p className="text-2xl font-bold text-purple-600">
            {((statusData.find(s => s.status === 'SUCCESS')?.count || 0) / transactions.length * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Average Amount</h3>
          <p className="text-2xl font-bold text-orange-600">
            ₹{(transactions.reduce((sum, tx) => sum + tx.transaction_amount, 0) / transactions.length || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Payment Methods</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={paymentMethodData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentMethodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Transaction Status</h3>
          <BarChart width={400} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionDashboard; 