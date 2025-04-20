'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from './components/DashboardSidebar';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-[#F7EFE6]">
        <DashboardSidebar />
      </div>
    </ProtectedRoute>
  );
}
