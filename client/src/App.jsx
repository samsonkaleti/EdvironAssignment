import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchoolTransactionsPage from './pages/SchoolTransactionsPage';
import TransactionsPage from './pages/TransactionsPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const App = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <Router>
            <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <main className="flex-1 overflow-y-auto p-6 bg-white">
                        <Routes>
                            <Route path="/" element={<TransactionsPage />} />
                            <Route path="/school-transactions" element={<SchoolTransactionsPage />} />
                            {/* Add more routes as needed */}
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default App;

