'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFDDC9] flex">
      {/* Left half - empty (will put some images here later) */}
      <div className="w-1/2"></div>
      
      {/* Right half - login form */}
      <div className="w-1/2 flex bg-[#F7EFE6] items-center justify-center">
        <div className="max-w-md w-full p-10">
          <h1 className="text-3xl font-bold text-[#042B0B] mb-6">Login</h1>
          <p className="text-gray-600 mb-8">
            Not a member of SIERRA? <Link href="/register" className="font-bold">Register</Link>.
          </p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#042B0B] mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#042B0B] text-[#042B0B]" 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#042B0B] mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#042B0B] text-[#042B0B]" 
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#042B0B] text-white py-2 px-4 rounded hover:bg-[#1D4023] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 