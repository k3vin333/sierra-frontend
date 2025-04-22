'use client';

import { useAuth } from '@/context/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow access to landing page (/) and login/register pages without authentication
    // If the user is not authenticated and is not on the landing page, login page, or register page,
    // then we push the user to the login page
    // Might have to modify this page depending on what pages we want to allow access to without authentication
    if (!isLoading && !isAuthenticated && 
        pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      // This is a loading spinner that is displayed while the user is being authenticated
      // This is to prevent the user from seeing a blank page while the user is being authenticated
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#042B0B]"></div>
      </div>
    );
  }

  return children;
} 