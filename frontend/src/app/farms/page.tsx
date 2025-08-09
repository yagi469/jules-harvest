'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import type { Metadata } from 'next';
import Link from 'next/link';

interface Farm {
  id: number;
  name: string;
  location: string;
  description: string;
}

async function getFarms(): Promise<Farm[]> {
  const res = await fetch('http://localhost:8082/api/farms', {
    cache: 'no-store',
    credentials: 'include', // 追加
  });
  if (!res.ok) {
    throw new Error('Failed to fetch farms');
  }
  return res.json();
}



export default function FarmsPage() {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure authentication status is checked before fetching
        await checkAuth(); 
        if (isAuthenticated) { // Check isAuthenticated after checkAuth completes
          const fetchedFarms = await getFarms();
          setFarms(fetchedFarms);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
        setError('Failed to load farms. Please try again later.');
        router.push('/login'); // Redirect to login on error or unauthenticated
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, [isAuthenticated, checkAuth, router]); // Depend on isAuthenticated, checkAuth, and router

  if (loading) {
    return <div className="text-center py-8">Loading farms...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Farms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farms.length > 0 ? (
          farms.map((farm) => (
            <div key={farm.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold">{farm.name}</h2>
              <p className="text-gray-600 mt-2">{farm.location}</p>
              <p className="text-gray-800 mt-4 truncate">{farm.description}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No farms found.</p>
        )}
      </div>
    </div>
  );
}

