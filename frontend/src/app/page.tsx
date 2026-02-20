'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';

interface SimpleUser {
  username: string;
}

export default function Home() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (e.g., by checking localStorage for a token)
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would verify the token with your backend
      // For now, we'll just assume a token means logged in and set a dummy user
      setUser({ username: 'Logged In User' }); // Replace with actual user data from token verification
    }
  }, []);

  const handleAuthSuccess = (userData: SimpleUser) => {
    setUser(userData);
    setShowRegister(false); // Hide forms after successful login/registration
    router.push('/dashboard'); // Automatically redirect to dashboard
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {!user ? (
          <>
            {showRegister ? (
              <RegisterForm onRegisterSuccess={handleAuthSuccess} />
            ) : (
              <LoginForm onLoginSuccess={handleAuthSuccess} />
            )}
            <p className="text-center mt-4">
              {showRegister ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setShowRegister(false)} className="text-blue-500 hover:underline">
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => setShowRegister(true)} className="text-blue-500 hover:underline">
                    Register
                  </button>
                </>
              )}
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.username}!</h2>
            <p className="mb-4">You are logged in.</p>
            <div className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}