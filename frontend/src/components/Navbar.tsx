'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div>
                        <div className='flex items-center space-x-4'>
                            <Link href="/" className="text-xl font-bold text-gray-800">
                                Harvest App
                            </Link>
                            <Link href="/farms" className="text-gray-700 rounded hover:bg-gray-200 px-3 py-2">
                                Farms
                            </Link>
                             <Link href="/plans" className="text-gray-700 rounded hover:bg-gray-200 px-3 py-2">
                                Plans
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-700 mr-4">Welcome, {user?.username}</span>
                                <Link href="/dashboard" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-200">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-3 py-2 text-gray-700 rounded hover:bg-gray-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/register" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-200">
                                    Register
                                </Link>
                                <Link href="/login" className="px-3 py-2 text-gray-700 rounded hover:bg-gray-200">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
