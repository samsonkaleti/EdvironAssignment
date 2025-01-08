import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";  
import { Link,useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";


const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-semibold text-gray-900">
            School Payments Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
            {!user && (
              <div className="flex gap-3">
                <Link to="/login">
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;

