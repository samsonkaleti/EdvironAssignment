import { useContext } from "react"; 
import { AuthContext } from "../context/AuthContext";  
import { Link,useNavigate } from "react-router-dom";


const Navbar = () => {  
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); 
  
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token"); 
    navigate("/login");
  };
  return (
    <nav className="bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 border-b border-purple-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <h1 className="text-lg font-bold text-green-800">
            School Payments Dashboard
          </h1>
          <div className="flex items-center">  
            <div className="">
            </div>
            {user && ( 
              <div> 
                
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 rounded-md text-sm"
              >
                Logout
              </button> 
              </div>
            )}
            {!user && (
              <Link to="/login">
                <button className="ml-4 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-md">
                  Login
                </button>
              </Link>
            )}
            {!user && (
              <Link to="/signup">
                <button className="ml-4 bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-md">
                  Sign Up
                </button>
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

