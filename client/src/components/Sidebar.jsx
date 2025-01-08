import { Link } from 'react-router-dom';
import { Home, FileText, School, Settings } from 'lucide-react'; 
import { AuthContext } from '../context/AuthContext'; 
import { useContext } from 'react';


const Sidebar = () => { 
  const { user } = useContext(AuthContext); 

  return (
    <aside className="w-64 bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 border-r border-purple-300 shadow-sm h-screen">
      <div className="p-4 border-b border-purple-300">
        <h2 className="text-2xl font-bold text-green-800">
          {user ? user.token.username : ""}
        </h2>
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

