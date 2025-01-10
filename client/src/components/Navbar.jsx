import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";  
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 md:left-56 w-full md:w-[calc(100%-14rem)] z-10 transition-all duration-300">
      <div className="max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[84px]">
          <h1 className="text-3xl text-gray-500 font-semibold"> 
            School Payments Dashboard 
          </h1>
          <div className="flex items-center gap-4 border-2 border-gray-200 rounded-lg">
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
