'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Beer {
  id: number;
  name: string;
  brewery: string;
}

interface Bar {
  id: number;
  name: string;
  location: string;
}

export default function LogBeerPage() {
  const router = useRouter();
  const [beers, setBeers] = useState<Beer[]>([]);
  const [bars, setBars] = useState<Bar[]>([]);
  const [beerName, setBeerName] = useState('');
  const [barName, setBarName] = useState('');
  const [score, setScore] = useState<number>(5); // Default score
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
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
        // Fetch Beers
        const beerRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/beers`, { headers });
        const beerData = await beerRes.json();
        if (!beerRes.ok) throw new Error(beerData.message || 'Failed to fetch beers');
        setBeers(beerData);

        // Fetch Bars
        const barRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bars`, { headers });
        const barData = await barRes.json();
        if (!barRes.ok) throw new Error(barData.message || 'Failed to fetch bars');
        setBars(barData);
      } catch (err: any) {
        console.error("Error fetching dropdown data:", err);
        setError(err.message || 'An unknown error occurred');
        localStorage.removeItem('token'); // Clear invalid token
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const formData = new FormData();
    formData.append('beerName', beerName);
    if (barName) formData.append('barName', barName);
    formData.append('score', score.toString());
    formData.append('notes', notes);
    if (image) formData.append('image', image);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/beerlogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log beer.');
      }

      setSubmitMessage('Beer logged successfully!');
      // Reset form
      setBeerName('');
      setBarName('');
      setScore(5);
      setNotes('');
      setImage(null);
    } catch (err: any) {
      console.error("Error logging beer:", err);
      setError(err.message || 'An unknown error occurred');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading form data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Log a New Beer</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        {submitMessage && <p className="text-green-500 text-center">{submitMessage}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="beer">
            Beer
          </label>
          <input
            id="beer"
            list="beer-options"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={beerName}
            onChange={(e) => setBeerName(e.target.value)}
            placeholder="Type or select a beer"
            required
          />
          <datalist id="beer-options">
            {beers.map((beer) => (
              <option key={beer.id} value={beer.name}>
                {beer.brewery ? `${beer.name} (${beer.brewery})` : beer.name}
              </option>
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bar">
            Bar (Optional)
          </label>
          <input
            id="bar"
            list="bar-options"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={barName}
            onChange={(e) => setBarName(e.target.value)}
            placeholder="Type or select a bar"
          />
          <datalist id="bar-options">
            {bars.map((bar) => (
              <option key={bar.id} value={bar.name}>
                {bar.location ? `${bar.name} (${bar.location})` : bar.name}
              </option>
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="score">
            Score (1-5)
          </label>
          <input
            id="score"
            type="number"
            min="1"
            max="5"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value) || 0)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Beer Picture
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            capture="environment"
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Log Beer
        </button>
      </form>
    </div>
  );
}