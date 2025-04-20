'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from './components/DashboardSidebar';
import CompanyRatingWidget from '../widgets/components/LevelACompaniesWidget';
import CompanyESGChart from '../widgets/components/CompanyESGChart';

export default function DashboardPage() {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex bg-[#F7EFE6]">
          {/* Sidebar */}
          <DashboardSidebar />
  
          {/* Content */}
          <div className="flex-1 p-8">
            <div className="space-y-10">
              {/* <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1> */}
  
              {/* ESG Chart */}
              <div className="w-full">
                <CompanyESGChart />
              </div>
  
              {/* ESG Rated A Companies */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                  Top ESG Rated Companies
                </h2>
                
                <CompanyRatingWidget />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }