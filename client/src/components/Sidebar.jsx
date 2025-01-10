import { Link } from 'react-router-dom';
import { Home, FileText, School } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <aside className="flex-shrink-0 fixed top-0 left-0 w-64 bg-white text-gray-900 h-screen overflow-y-auto z-10 shadow-md border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {user?.email || 'User Email'}
            </h2>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-3">
          {[
            { path: '/dashboard', icon: Home, label: 'Dashboard' },
            { path: '/transaction', icon: FileText, label: 'Transactions' },
            { path: '/school-transactions', icon: School, label: 'School Transactions' },
            { path: '/transaction-status-check', icon: FileText, label: 'Status Check' },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center gap-4 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-all"
              >
                <item.icon className="w-5 h-5 text-gray-500" />
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
