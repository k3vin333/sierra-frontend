'use client';

import { useAuth } from '@/context/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardSidebar from '@/app/dashboard/components/DashboardSidebar';

export default function ProtectedRoute({ 
  children,
  delayRender = false
}: { 
  children: React.ReactNode,
  delayRender?: boolean
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isDataLoaded, setIsDataLoaded] = useState(!delayRender);
  const isDashboardPath = pathname?.startsWith('/dashboard') || pathname?.startsWith('/favorites') || pathname?.startsWith('/portfolio');

  useEffect(() => {
    // Allow access to landing page (/) and login/register pages without authentication
    // If the user is not authenticated and is not on the landing page, login page, or register page,
    // then we push the user to the login page
    // Might have to modify this page depending on what pages we want to allow access to without authentication
    if (!isLoading && !isAuthenticated && 
        pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }

    // If delayRender is true, wait a bit to ensure data is fully loaded
    if (delayRender && !isDataLoaded) {
      const timer = setTimeout(() => {
        setIsDataLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router, pathname, delayRender, isDataLoaded]);

  if (isLoading || (delayRender && !isDataLoaded)) {
    // For dashboard paths, show sidebar with beige/white background
    if (isDashboardPath) {
      return (
        <div className="min-h-screen flex">
          <div className="flex-shrink-0">
            <DashboardSidebar />
          </div>
          <div className="flex-1 bg-[#F7EFE6]"></div>
        </div>
      );
    }
    
    // For non-dashboard paths, show a simple loading screen
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7EFE6]">
        <div className="text-[#042B0B] text-lg">Loading...</div>
      </div>
    );
  }

  return children;
} 