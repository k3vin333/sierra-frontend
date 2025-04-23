// app/portfolio/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import ReportCharts from '@/components/ReportCharts';
import { useAuth } from '@/context/useAuth';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function PortfolioPage() {
    const { getTickers } = useAuth();
    const [tickers, setTickers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTickers = async () => {
            const data = await getTickers();
            if (Array.isArray(data) && data.length > 0) {
                setTickers(data.map(t => t.ticker.toLowerCase()));
            }
            setLoading(false);
        };
        loadTickers();
    }, [getTickers]);


    return (
        <ProtectedRoute>
            {loading || tickers.length === 0 ? (
                <div className="min-h-screen flex items-center justify-center bg-[#F7EFE6]">
                    <CircularProgress />
                </div>
            ) : (
                <div className="min-h-screen flex bg-[#F7EFE6]">
                    <div className="w-64">
                        <DashboardSidebar />
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto">
                        <h1 className="text-3xl font-bold text-[#042B0B] mb-6">Your Portfolio</h1>
                        {tickers.length === 0 ? (
                            <p>You haven't added any companies yet.</p>
                        ) : (
                            tickers.map(ticker => (
                                <Accordion
                                    key={ticker}
                                    sx={{
                                        mb: 3,
                                        backgroundColor: '#fdf3e7',
                                        borderRadius: 2,
                                        boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.04)',
                                        '&::before': { display: 'none' },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
                                        sx={{
                                            backgroundColor: '#042B0B',
                                            color: '#fff',
                                            borderTopLeftRadius: 8,
                                            borderTopRightRadius: 8,
                                        }}
                                    >
                                        <Typography fontWeight="bold">{ticker.toUpperCase()}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <ReportCharts companyId={ticker} />
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        )}
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
