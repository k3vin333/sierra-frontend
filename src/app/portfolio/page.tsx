// app/portfolio/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import ReportCharts from '@/components/ReportCharts';
import { useAuth } from '@/context/useAuth';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PortfolioPage() {
    const { getTickers } = useAuth();
    const [tickers, setTickers] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [tickersLoaded, setTickersLoaded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const loadTickers = async () => {
            const data = await getTickers();
            if (Array.isArray(data) && data.length > 0) {
                const tickersList = data.map(t => t.ticker.toLowerCase());
                setTickers(tickersList);
                
                // Initialize all tickers as not loaded
                const initialLoadState: Record<string, boolean> = {};
                tickersList.forEach(ticker => {
                    initialLoadState[ticker] = false;
                });
                setTickersLoaded(initialLoadState);
            } else {
                // If no tickers, we can stop loading
                setLoading(false);
            }
        };
        loadTickers();
    }, [getTickers]);

    // Check if all tickers are loaded
    useEffect(() => {
        if (tickers.length === 0) return;
        
        const allLoaded = tickers.every(ticker => tickersLoaded[ticker]);
        if (allLoaded) {
            // Add a small delay for better UX
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [tickers, tickersLoaded]);

    // Handler for when a ticker's data is loaded
    const handleTickerLoaded = (ticker: string) => {
        setTickersLoaded(prev => ({
            ...prev,
            [ticker]: true
        }));
    };

    return (
        <ProtectedRoute>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-[#F7EFE6]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#042B0B]"></div>
                        <p className="text-[#042B0B] font-medium">
                            {tickers.length === 0 
                                ? "Loading your portfolio..." 
                                : `Loading data for ${Object.entries(tickersLoaded).filter(([_, isLoaded]) => isLoaded).length} of ${tickers.length} companies...`
                            }
                        </p>
                    </div>
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
                            <div className="space-y-3">
                                {tickers.map(ticker => (
                                    <Accordion
                                        type="single"
                                        collapsible
                                        key={ticker}
                                        className="border rounded-lg overflow-hidden"
                                    >
                                        <AccordionItem value={ticker} className="border-0">
                                            <AccordionTrigger className="bg-[#042B0B] text-white px-4 py-3 font-bold hover:no-underline hover:bg-[#0a3c14]">
                                                {ticker.toUpperCase()}
                                            </AccordionTrigger>
                                            <AccordionContent className="bg-[#fdf3e7] p-4">
                                                <ReportCharts companyId={ticker} onLoad={() => handleTickerLoaded(ticker)} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}
