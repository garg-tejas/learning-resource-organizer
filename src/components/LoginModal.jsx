import React from 'react';
import { Chrome, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ onClose }) => {
    const { loginWithGoogle } = useAuth();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Sync Your Resources</h2>
                <div className="space-y-4">
                    <button
                        onClick={loginWithGoogle}
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Chrome size={20} />
                        Continue with Google
                    </button>
                </div>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Your resources will be safely stored in the cloud and accessible from any device
                </p>
            </div>
        </div>
    );
};

export default LoginModal;