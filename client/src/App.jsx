import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchoolTransactionsPage from './components/SchoolTransactionsPage';
import TransactionsPage from './components/TransactionsPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TransactionsPage />} />
                <Route path="/school-transactions" element={<SchoolTransactionsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
