import type { Metadata } from 'next';
import Link from 'next/link';

interface Farm {
    id: number;
    name: string;
    location: string;
    description: string;
}

async function getFarms(): Promise<Farm[]> {
    // In a real app, you'd use the environment variable for the base URL.
    const res = await fetch('http://localhost:8080/api/farms', { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch farms');
    }
    return res.json();
}

export const metadata: Metadata = {
    title: 'Explore Farms',
};

export default async function FarmsPage() {
    const farms = await getFarms();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Explore Farms</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farms.map((farm) => (
                    <div key={farm.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">{farm.name}</h2>
                        <p className="text-gray-600 mt-2">{farm.location}</p>
                        <p className="text-gray-800 mt-4 truncate">{farm.description}</p>
                        {/* We can add a link to a farm details page later */}
                        {/* <Link href={`/farms/${farm.id}`} className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">View Details</Link> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
