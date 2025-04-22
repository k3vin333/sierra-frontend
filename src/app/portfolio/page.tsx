'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import ReportCharts from '../../components/ReportCharts'

export default function PortfolioPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen flex bg-[#F7EFE6]">
                <div className="w-64">
                    <DashboardSidebar />
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-[#042B0B] mb-6">Portfolio Insights</h1>
                    <ReportCharts companyId="dis" />
                </div>
            </div>
        </ProtectedRoute>

    );
}
