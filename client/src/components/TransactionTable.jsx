// eslint-disable-next-line react/prop-types
const TransactionTable = ({ transactions }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Collect ID</th>
              <th className="px-4 py-2 text-left">School ID</th>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
              <th className="px-4 py-2 text-left">Gateway</th>
              <th className="px-4 py-2 text-left">Date</th> 
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((tx) => (
              <tr key={tx.collect_id} className="border-t transition-all hover:-translate-y-0.5 hover:shadow-lg duration-200 ease-in-out transform">
                <td className="px-4 py-4">{tx.collect_id}</td>
                <td className="px-4 py-4">{tx.school_id}</td>
                <td className="px-4 py-4">{tx.custom_order_id}</td>
                <td className="px-4 py-4">₹{tx.transaction_amount}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 
                    tx.status === 'FAILURE' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-2">{tx.payment_method}</td>
                <td className="px-4 py-2">{tx.gateway}</td>
                <td className="px-4 py-2">{tx.createdAt? new Date(tx.createdAt).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }; 
    export default TransactionTable;