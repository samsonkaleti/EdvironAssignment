import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from "./pages/Login"
import SignupPage from './pages/signup';
import AuthGuard from './components/AuthGuard';
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import TransactionsPage from "./pages/TransactionsPage"; 
import SchoolTransactionsPage from './pages/SchoolTransactionsPage'
import TransactionStatusCheck from "./pages/TransactionStatusCheck"; 
import RealTimeChart from "./pages/RealTimeChart"


// Separate Component for Layout Logic
const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideLayout && <Navbar />}
      <div className="flex">
        {!hideLayout && <Sidebar />}
        <main className={`${hideLayout ? "w-full" : "flex-1 p-6"}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<AuthGuard />}>
              <Route path="/" element={<RealTimeChart />} />
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


