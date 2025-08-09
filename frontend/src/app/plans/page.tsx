import type { Metadata } from 'next';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  eventDate: string; // Keep as string for simplicity
  farm: {
    name: string;
    location: string;
  };
}

async function getPlans(): Promise<Plan[]> {
  const res = await fetch('http://localhost:8082/api/plans', {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch plans');
  }
  return res.json();
}

export const metadata: Metadata = {
  title: 'Explore Harvest Plans',
};

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Harvest Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="text-gray-700 font-semibold mt-2">
              {plan.farm.name} - {plan.farm.location}
            </p>
            <p className="text-gray-800 mt-4">{plan.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-lg font-bold text-indigo-600">
                ${plan.price.toFixed(2)}
              </p>
              <p className="text-gray-600">
                {new Date(plan.eventDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
