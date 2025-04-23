// app/report/[companyId]/components/ESGTrendChart.tsx
"use client";

import { useEffect, useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
    companyId: string;
}

interface ESGData {
    timestamp: string;
    total_score: number;
}

export default function ESGTrendChart({ companyId }: Props) {
    const [data, setData] = useState<ESGData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(
                    `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${companyId}`
                );
                const json = await res.json();

                if (Array.isArray(json.historical_ratings)) {
                    const formatted = json.historical_ratings.map((entry: any) => ({
                        timestamp: entry.timestamp,
                        total_score: entry.total_score,
                    })).reverse(); // chronological order
                    setData(formatted);
                } else {
                    console.error("Unexpected response format:", json);
                }
            } catch (err) {
                console.error("Failed to fetch ESG data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [companyId]);


    if (isLoading) {
        return <div className="text-base font-medium">Loading chart...</div>;
    }

    if (!data.length) {
        return <div className="text-base font-medium">No ESG data available for this company.</div>;
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">
                Total ESG Score Over Time
            </h2>
            <ChartContainer
                className="w-full h-full max-h-[350px]"
                config={{
                    total_score: { label: 'ESG Score', color: '#1976d2' }
                }}
            >
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <ChartTooltip 
                        content={<ChartTooltipContent indicator="line" />} 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="total_score" 
                        strokeWidth={2} 
                    />
                </LineChart>
            </ChartContainer>
        </>
    );
}
