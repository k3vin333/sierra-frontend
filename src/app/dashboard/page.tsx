'use client';

import React, { useState, useRef } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from './components/DashboardSidebar';
import CompanyRatingWidget from '../widgets/components/LevelACompaniesWidget';
import CompanyESGChart from '../widgets/components/CompanyESGChart';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardPage() {
    const [isCompaniesWidgetExpanded, setIsCompaniesWidgetExpanded] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggleCompaniesWidget = () => {
      setIsCompaniesWidgetExpanded(!isCompaniesWidgetExpanded);
    };

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
              <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <div 
                  className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-500"
                  onClick={toggleCompaniesWidget}
                >
                  <h2 className="text-2xl font-semibold text-gray-700">
                    Top ESG Rated Companies
                  </h2>
                  <div className="transition-transform duration-700" style={{ transform: isCompaniesWidgetExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                    <ChevronUp className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                
                <div 
                  ref={contentRef}
                  className="transition-all duration-700 ease-out"
                  style={{ 
                    maxHeight: isCompaniesWidgetExpanded ? contentRef.current?.scrollHeight + 'px' || '2000px' : '0',
                    opacity: isCompaniesWidgetExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)'
                  }}
                >
                  <div className="p-6 pt-0">
                    <CompanyRatingWidget />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }