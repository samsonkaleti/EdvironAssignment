

import { Link } from 'react-router-dom';
import { Home, FileText, School } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';


const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </h2>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-1">
          {[
            { path: "/", icon: Home, label: "Dashboard" },
            { path: "/transaction", icon: FileText, label: "Transactions" },
            { path: "/school-transactions", icon: School, label: "School Transactions" },
            { path: "/transaction-status-check", icon: FileText, label: "Status Check" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

