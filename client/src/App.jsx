import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from "./pages/Login"
import SignupPage from './pages/signup';
import AuthGuard from './components/AuthGuard';
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import TransactionsPage from "./pages/TransactionsPage"; 
import SchoolTransactionsPage from './pages/SchoolTransactionsPage'

// Separate Component for Layout Logic
const Layout = () => {
  const location = useLocation();

  // Check if the current route is login or signup
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="flex">
        {!hideLayout && <Sidebar />}
        <div className={`${hideLayout ? 'w-full' : 'flex-1 bg-gray-100 p-6 min-h-screen'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" exact element={<LoginPage />} />
            <Route path="/signup" exact element={<SignupPage />} />

            {/* Protected Routes */}
            <Route element={<AuthGuard />}>
              <Route path="/" element={<TransactionsPage />} />
              <Route path="/school-transactions" element={<SchoolTransactionsPage />} />
            </Route>
          </Routes>
        </div>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
