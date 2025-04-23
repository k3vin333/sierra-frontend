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
    const [initialLoading, setInitialLoading] = useState(true);
    const [tickersLoaded, setTickersLoaded] = useState<Record<string, boolean>>({});
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [loadedPredictions, setLoadedPredictions] = useState<Record<string, boolean>>({});
    const [renderedCharts, setRenderedCharts] = useState<Record<string, React.ReactNode>>({});

    // First effect: Load tickers data
    useEffect(() => {
        const loadTickers = async () => {
            try {
                const data = await getTickers();
                if (Array.isArray(data)) {
                    const tickersList = data.map(t => t.ticker.toLowerCase());
                    setTickers(tickersList);
                    
                    // Initialize all tickers as not loaded
                    if (tickersList.length > 0) {
                        const initialLoadState: Record<string, boolean> = {};
                        tickersList.forEach(ticker => {
                            initialLoadState[ticker] = false;
                        });
                        setTickersLoaded(initialLoadState);
                    } else {
                        // We need to add a delay even if there are no tickers
                        // to prevent the "no companies" message from flashing
                        setTimeout(() => {
                            setInitialLoading(false);
                            setLoading(false);
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error("Error loading tickers:", error);
            } finally {
                // Always mark initial loading as complete after a delay
                setTimeout(() => {
                    setInitialLoading(false);
                }, 1000);
            }
        };
        
        loadTickers();
    }, [getTickers]);

    // Second effect: Check if all tickers are loaded
    useEffect(() => {
        // Skip if we're still in initial loading or there are no tickers
        if (initialLoading || tickers.length === 0) return;
        
        const allLoaded = tickers.every(ticker => tickersLoaded[ticker]);
        if (allLoaded) {
            // Add a small delay for better UX
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);
            
            return () => clearTimeout(timer);
        }
    }, [tickers, tickersLoaded, initialLoading]);

    // Pre-render all charts as soon as tickers are loaded to avoid delay
    useEffect(() => {
        if (tickers.length === 0 || loading) return;

        const charts: Record<string, React.ReactNode> = {};
        
        tickers.forEach(ticker => {
            charts[ticker] = (
                <ReportCharts 
                    companyId={ticker} 
                    onLoad={!loadedPredictions[ticker] ? () => handleTickerLoaded(ticker) : undefined} 
                />
            );
        });
        
        setRenderedCharts(charts);
    }, [tickers, loading, loadedPredictions]);

    // Handler for when a ticker's data is loaded
    const handleTickerLoaded = (ticker: string) => {
        setTickersLoaded(prev => ({
            ...prev,
            [ticker]: true
        }));
        setLoadedPredictions(prev => ({
            ...prev,
            [ticker]: true
        }));
    };

    // Handle accordion value change
    const handleAccordionValueChange = (value: string) => {
        setExpandedItem(value || null);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex bg-[#F7EFE6]">
                <div className="w-64">
                    <DashboardSidebar />
                </div>
                <div className="flex-1 p-8 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-[#042B0B] mb-6">Your Portfolio</h1>
                    
                    {loading || initialLoading ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm flex items-center justify-center h-64">
                            <p className="text-[#042B0B] text-lg font-medium">
                                {initialLoading
                                    ? "Loading your portfolio..."
                                    : tickers.length === 0 
                                        ? "Loading your portfolio..." 
                                        : `Loading data for ${Object.entries(tickersLoaded).filter(([_, isLoaded]) => isLoaded).length} of ${tickers.length} companies...`
                                }
                            </p>
                        </div>
                    ) : (
                        tickers.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                                <p className="text-lg text-gray-700 mb-4">You haven't added any companies to your portfolio yet.</p>
                                <p className="text-gray-600">Visit the ESG Ratings page to explore companies and add them to your portfolio.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Accordion 
                                    type="single" 
                                    collapsible
                                    value={expandedItem || undefined}
                                    onValueChange={handleAccordionValueChange}
                                >
                                    {tickers.map(ticker => (
                                        <AccordionItem 
                                            key={ticker} 
                                            value={ticker} 
                                            className="border rounded-lg overflow-hidden mb-3"
                                        >
                                            <AccordionTrigger className="bg-[#042B0B] text-white px-4 py-3 font-bold hover:no-underline hover:bg-[#0a3c14]">
                                                {ticker.toUpperCase()}
                                            </AccordionTrigger>
                                            <AccordionContent className="bg-[#F7EFE6] p-4">
                                                {/* Use pre-rendered chart component to avoid delay */}
                                                {renderedCharts[ticker]}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
