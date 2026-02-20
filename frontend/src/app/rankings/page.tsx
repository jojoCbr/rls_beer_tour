'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserRanking {
  username: string;
  total_beers: number;
}

interface BarRanking {
  bar_name: string;
  average_score: string;
}

export default function RankingsPage() {
  const [userRankings, setUserRankings] = useState<UserRanking[]>([]);
  const [barRankings, setBarRankings] = useState<BarRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRankings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      try {
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rankings/users`, { headers });
        const userData = await userRes.json();
        if (!userRes.ok) throw new Error(userData.message || 'Failed to fetch user rankings');
        setUserRankings(userData);

        const barRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/rankings/bars`, { headers });
        const barData = await barRes.json();
        if (!barRes.ok) throw new Error(barData.message || 'Failed to fetch bar rankings');
        setBarRankings(barData);

      } catch (err: any) {
        console.error("Failed to fetch rankings:", err);
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-8">Loading rankings...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Global Rankings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top Beer Drinkers</h2>
        {userRankings.length > 0 ? (
          <ol className="list-decimal list-inside">
            {userRankings.map((ranking, index) => (
              <li key={index} className="py-1">
                {ranking.username}: {ranking.total_beers} beers
              </li>
            ))}
          </ol>
        ) : (
          <p>No user rankings available yet.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Top Bars by Average Beer Score</h2>
        {barRankings.length > 0 ? (
          <ol className="list-decimal list-inside">
            {barRankings.map((ranking, index) => (
              <li key={index} className="py-1">
                {ranking.bar_name}: {parseFloat(ranking.average_score).toFixed(2)} average score
              </li>
            ))}
          </ol>
        ) : (
          <p>No bar rankings available yet.</p>
        )}
      </div>
    </div>
  );
}
