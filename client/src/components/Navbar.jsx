import React from 'react';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className="bg-green-50 border-b border-green-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <h1 className="text-lg font-bold text-green-800">
            School Payments Dashboard
          </h1>
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

