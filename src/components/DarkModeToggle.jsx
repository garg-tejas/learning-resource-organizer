import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DarkModeToggle = () => {
    const { isDarkMode, setIsDarkMode } = useAppContext();

    return (
        <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="relative inline-flex items-center justify-center w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            role="switch"
            aria-checked={isDarkMode}
        >
            <span className="sr-only">Toggle dark mode</span>

            {/* Track */}
            <div
                className={`absolute inset-0 rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}
            />

            {/* Sliding button */}
            <div
                className={`absolute left-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-lg transform transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
            >
                {isDarkMode ? (
                    <Moon className="h-3 w-3 text-gray-800" />
                ) : (
                    <Sun className="h-3 w-3 text-yellow-500" />
                )}
            </div>

            {/* Focus ring */}
            <span
                className={`absolute inset-0 rounded-full ring-2 ring-offset-2 ${isDarkMode ? 'ring-blue-400' : 'ring-yellow-400'
                    } opacity-0 focus-within:opacity-100 transition-opacity`}
            />
        </button>
    );
};

export default DarkModeToggle;
