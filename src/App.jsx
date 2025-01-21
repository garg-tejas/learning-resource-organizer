import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rack from './components/Rack';
import AddResourceModal from './components/AddResourceModal';
import FilterBar from './components/FilterBar';
import DarkModeToggle from './components/DarkModeToggle';
import TagManagement from './components/TagManagement';
import LoginModal from './components/LoginModal';
import { useAppContext } from './context/AppContext';
import { useAuth } from './context/AuthContext';

function App() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isTagManagementOpen, setIsTagManagementOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { tags, loading } = useAppContext();
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Learning Resources
                        </h1>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={user.photoURL}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <button
                                        onClick={logout}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                >
                                    Sync to Cloud
                                </button>
                            )}
                            <button
                                onClick={() => setIsTagManagementOpen(true)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                Manage Tags
                            </button>
                            <DarkModeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {user ? 'Syncing with cloud...' : 'Loading local resources...'}
                    </p>
                </div>
            )}

            {/* Main Content */}
            {!loading && (
                <>
                    <FilterBar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="space-y-8">
                            {tags.map(tag => (
                                <Rack key={tag} field={tag} />
                            ))}
                        </div>
                    </main>
                </>
            )}

            {/* Floating Action Button */}
            {!loading && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors duration-200"
                    aria-label="Add Resource"
                >
                    +
                </button>
            )}

            {/* Modals */}
            {isAddModalOpen && <AddResourceModal onClose={() => setIsAddModalOpen(false)} />}
            {isTagManagementOpen && <TagManagement onClose={() => setIsTagManagementOpen(false)} />}
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default App;
