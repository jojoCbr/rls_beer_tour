'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

interface User {
  id: number;
  email: string;
}

interface BeerLog {
  id: number;
  beer_name: string;
  beer_style: string;
  beer_brewery: string;
  score: number;
  bar_name?: string;
  bar_location?: string;
  notes?: string;
  image_url?: string;
  consumed_at: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [beerLogs, setBeerLogs] = useState<BeerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const decodedToken = jwtDecode<User>(token);
        setUser({ id: decodedToken.id, email: decodedToken.email }); // Set user from token

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/beerlogs`, { headers });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch beer logs.');
        }
        setBeerLogs(data);

      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || 'An unknown error occurred');
        localStorage.removeItem('token'); // Clear invalid token
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  if (!user) { // Should not happen if token is valid, but good for type safety
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard, {user.email}!</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Recent Beer Logs</h2>
        {beerLogs.length > 0 ? (
          <ul>
            {beerLogs.map((log) => (
              <li key={log.id} className="mb-4 p-4 border rounded-lg border-gray-200 last:border-b-0 flex flex-col md:flex-row gap-4">
                {log.image_url && (
                  <div className="w-full md:w-48 h-48 relative flex-shrink-0">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${log.image_url}`} 
                      alt={log.beer_name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
                <div>
                  <p><strong>Beer:</strong> {log.beer_name} ({log.beer_style}) from {log.beer_brewery}</p>
                  <p><strong>Score:</strong> {log.score}/5</p>
                  {log.bar_name && <p><strong>At:</strong> {log.bar_name} ({log.bar_location})</p>}
                  <p><strong>Notes:</strong> {log.notes || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Logged on: {new Date(log.consumed_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No beer logs yet. Go to "Log Beer" to add your first entry!</p>
        )}
      </div>
    </div>
  );
}