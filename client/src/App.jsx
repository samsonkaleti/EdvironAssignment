import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from "./pages/Login"
import SignupPage from './pages/signup';
import AuthGuard from './components/AuthGuard';
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import TransactionsPage from "./pages/TransactionsPage";
import SchoolTransactionsPage from './pages/SchoolTransactionsPage'
import TransactionStatusCheck from "./pages/TransactionStatusCheck";
import TransactionDashboard from "./pages/TransactionDashboard"

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/" || location.pathname === "/signup";

  const mainClassName = isAuthPage 
    ? "flex-1" 
    : "flex-1 pt-[90px] ml-64 p-6 overflow-auto";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}
      <div className="flex">
        {!isAuthPage && (
          <Sidebar className="flex-shrink-0 w-64" />
        )}
        <main className={mainClassName}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<AuthGuard />}>
              <Route path="/dashboard" element={<TransactionDashboard />} />
              <Route path="/transaction" element={<TransactionsPage />} />
              <Route path="/school-transactions" element={<SchoolTransactionsPage />} />
              <Route path="/transaction-status-check" element={<TransactionStatusCheck />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
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