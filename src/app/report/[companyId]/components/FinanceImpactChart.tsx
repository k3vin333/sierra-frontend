// app/report/[companyId]/components/FinanceImpactChart.tsx
'use client';

import { useEffect, useState, useRef } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
    companyId: string;
}

interface FinanceDataPoint {
    date: string;
    close: number | null;
    esg: number | null;
}

interface CacheItem {
    data: FinanceDataPoint[];
    timestamp: number;
}

// Module-level cache to store data in memory during the session
const sessionCache: Record<string, CacheItem> = {};

// Cache expiration time - 24 hours (in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Storage key prefix for localStorage
const STORAGE_KEY_PREFIX = 'finance-impact-cache-';

const generateMonthlyDates = (startYear: number, endYear: number): string[] => {
    const dates: string[] = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const paddedMonth = month.toString().padStart(2, '0');
            dates.push(`${year}-${paddedMonth}`);
        }
    }
    return dates;
};

// A skeleton loader for the chart while data is loading
function ChartSkeleton() {
    return (
        <div className="animate-pulse w-full h-[350px] bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-gray-400">Loading financial and ESG data...</div>
        </div>
    );
}

export default function FinanceImpactChart({ companyId }: Props) {
    const [data, setData] = useState<FinanceDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Avoid multiple fetches in development mode with React strict mode
        if (hasFetched.current) return;
        
        const fetchFinanceAndESGData = async () => {
            setIsLoading(true);
            hasFetched.current = true;
            
            const storageKey = `${STORAGE_KEY_PREFIX}${companyId}`;
            
            // Try to get data from session cache first
            if (sessionCache[companyId]) {
                console.log(`Using session cache for ${companyId} finance data`);
                setData(sessionCache[companyId].data);
                setIsLoading(false);
                return;
            }
            
            // Try to get data from localStorage
            try {
                const cachedData = localStorage.getItem(storageKey);
                if (cachedData) {
                    const { data: storedData, timestamp } = JSON.parse(cachedData) as CacheItem;
                    const now = Date.now();
                    
                    // Check if the cache is still valid
                    if (now - timestamp < CACHE_EXPIRATION) {
                        console.log(`Using localStorage cache for ${companyId} finance data`);
                        setData(storedData);
                        
                        // Also update session cache
                        sessionCache[companyId] = {
                            data: storedData,
                            timestamp
                        };
                        
                        setIsLoading(false);
                        return;
                    } else {
                        console.log(`Cache for ${companyId} expired, fetching fresh data`);
                        // Cache expired, remove it
                        localStorage.removeItem(storageKey);
                    }
                }
            } catch (err) {
                console.error('Error reading from cache:', err);
                // Continue with API fetch if cache read fails
            }
            
            // If we get here, we need to fetch fresh data
            const months = generateMonthlyDates(2024, 2025);
            const results: FinanceDataPoint[] = [];

            // Fetch ESG data once
            const esgMap: Record<string, number> = {};

            try {
                const esgRes = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${companyId}`);
                const esgJson = await esgRes.json();
                
                if (esgJson.historical_ratings && Array.isArray(esgJson.historical_ratings)) {
                    esgJson.historical_ratings.forEach((entry: any) => {
                        const date = entry.timestamp.slice(0, 7);
                        esgMap[date] = entry.total_score;
                    });
                }
            } catch (err) {
                console.error("Failed to fetch ESG data", err);
            }

            // Fetch finance data with better error handling
            for (const month of months) {
                let found = false;

                for (let day = 1; day <= 3; day++) {
                    const date = `${month}-${day.toString().padStart(2, '0')}`;
                    try {
                        const res = await fetch(`https://8a38hm2y70.execute-api.ap-southeast-2.amazonaws.com/v1/stocks/historicalSingular/${companyId.toLowerCase()}/${date}`);
                        if (res.ok) {
                            const json = await res.json();
                            const close = json?.historicalPoint?.close;
                            if (close != null) {
                                const esg = esgMap[month] ?? null;
                                results.push({ date, close, esg });
                                found = true;
                                break;
                            }
                        }
                    } catch (err) {
                        console.error(`Finance data fetch failed for ${date}`, err);
                    }
                }

                if (!found) {
                    results.push({ date: `${month}-01`, close: null, esg: esgMap[month] ?? null });
                }
            }

            // Update state with the fetched data
            setData(results);
            
            // Store in session cache
            sessionCache[companyId] = {
                data: results,
                timestamp: Date.now()
            };
            
            // Store in localStorage for future visits
            try {
                localStorage.setItem(storageKey, JSON.stringify({
                    data: results,
                    timestamp: Date.now()
                }));
                console.log(`Cached finance data for ${companyId}`);
            } catch (err) {
                console.error('Error storing in cache:', err);
                // Continue even if cache write fails
            }
            
            setIsLoading(false);
        };

        fetchFinanceAndESGData();
        
        // Cleanup function
        return () => {
            hasFetched.current = false;
        };
    }, [companyId]);

    if (isLoading) {
        return <ChartSkeleton />;
    }

    if (!data.length) {
        return <div className="text-base font-medium">No financial and ESG data available for this company.</div>;
    }

    // Format the dates to be more readable
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit'
        })
    }));

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">
                Monthly Closing Prices & Total ESG Risk Score (2024–2025)
            </h2>
            <ChartContainer 
                className="w-full h-full min-h-[350px]"
                config={{
                    close: { label: "Closing Price", color: "#4caf50" },
                    esg: { label: "ESG Score", color: "#2196f3" }
                }}
            >
                <LineChart 
                    data={formattedData} 
                    margin={{ top: 20, right: 30, left: 5, bottom: 20 }} 
                    accessibilityLayer
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date" 
                        tickMargin={10}
                    />
                    <YAxis 
                        yAxisId="left" 
                        label={{ value: "Closing Price", angle: -90, position: 'insideLeft', dx: -15 }} 
                    />
                    <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        label={{ value: "ESG Score", angle: 90, position: 'insideRight', dx: 15 }} 
                    />
                    <ChartTooltip 
                        content={
                            <ChartTooltipContent 
                                formatter={(value, name) => name === "Closing Price" ? `$${value}` : value} 
                            />
                        } 
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                    />
                    <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="close" 
                        strokeWidth={2} 
                        name="Closing Price" 
                        dot={{ stroke: "#4caf50", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                    <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="esg" 
                        strokeWidth={2} 
                        name="ESG Score" 
                        stroke="#2196f3"
                        dot={{ stroke: "#2196f3", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ChartContainer>
        </>
    );
}