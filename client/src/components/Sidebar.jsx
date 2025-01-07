import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, School, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-green-50 border-r border-green-200 shadow-sm h-screen">
      <div className="p-4 border-b border-green-200">
        <h2 className="text-2xl font-bold text-green-800">Dashboard</h2>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-green-800 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <Home className="w-5 h-5 mr-3" />
              Transactions
            </Link>
          </li>
          <li>
            <Link
              to="/school-transactions"
              className="flex items-center px-4 py-3 text-green-800 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <School className="w-5 h-5 mr-3" />
              School Transactions
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className="flex items-center px-4 py-3 text-green-800 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <FileText className="w-5 h-5 mr-3" />
              Reports
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="flex items-center px-4 py-3 text-green-800 hover:bg-green-100 rounded-lg transition-colors duration-200"
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

