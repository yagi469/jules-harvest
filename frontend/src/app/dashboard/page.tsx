'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Farm {
    id: number;
    name: string;
    location: string;
    description: string;
}

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchFarms = async () => {
            try {
                const res = await fetch('/api/farms/my-farms');
                if (res.ok) {
                    const data = await res.json();
                    setFarms(data);
                }
            } catch (error) {
                console.error('Failed to fetch farms:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFarms();
    }, [isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>
                <Link href="/dashboard/farms/new" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                    + Add New Farm
                </Link>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-semibold">Your Farms</h2>
                {farms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {farms.map((farm) => (
                            <div key={farm.id} className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold">{farm.name}</h3>
                                <p className="text-gray-600 mt-2">{farm.location}</p>
                                <p className="text-gray-800 mt-4">{farm.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="mt-4 text-gray-500">You haven't registered any farms yet.</p>
                )}
            </div>
        </div>
    );
}
