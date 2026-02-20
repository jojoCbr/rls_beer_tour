'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          RLS Beer on TOUR
        </Link>
        
        {/* Hamburger Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
              <Link href="/log-beer" className="mr-4 hover:text-gray-300">Log Beer</Link>
              <Link href="/rankings" className="mr-4 hover:text-gray-300">Rankings</Link>
              <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
            </>
          ) : (
            <Link href="/" className="hover:text-gray-300">Login/Register</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-gray-700 rounded px-2">Dashboard</Link>
              <Link href="/log-beer" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-gray-700 rounded px-2">Log Beer</Link>
              <Link href="/rankings" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-gray-700 rounded px-2">Rankings</Link>
              <button onClick={handleLogout} className="block w-full text-left py-2 hover:bg-gray-700 rounded px-2">Logout</button>
            </>
          ) : (
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:bg-gray-700 rounded px-2">Login/Register</Link>
          )}
        </div>
      )}
    </nav>
  );
}
