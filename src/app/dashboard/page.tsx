'use client';

import React from 'react';
import { useAuth } from '@/context/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      // First navigate away
      router.push('/');
      // Then perform logout after navigation has started
      // Fixes the issue where the logout function is called before the navigation is complete
      // Causing the username to be removed in the navbar before the page is redirected
      setTimeout(() => {
        logout();
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F7EFE6]">
        <nav className="bg-[#042B0B] text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">SIERRA Investments</div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-[#042B0B] px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
} 