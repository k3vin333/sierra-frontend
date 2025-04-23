// app/report/[companyId]/components/ESGFactorsChart.tsx
'use client';

import { useEffect, useState } from "react";
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

interface ESGFactorData {
    timestamp: string;
    environmental_score: number;
    social_score: number;
    governance_score: number;
}

// Green color palette for ESG metrics
const ESG_COLORS = {
    environmental: {
        stroke: "#047857", // Dark green
        fill: "#bbf7d0"    // Light green
    },
    social: {
        stroke: "#10b981", // Medium green
        fill: "#6ee7b7"    // Medium light green
    },
    governance: {
        stroke: "#65a30d", // Olive green
        fill: "#d9f99d"    // Light olive green
    }
};

export default function ESGFactorsChart({ companyId }: Props) {
    const [data, setData] = useState<ESGFactorData[]>([]);
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
                        environmental_score: entry.environmental_score,
                        social_score: entry.social_score,
                        governance_score: entry.governance_score,
                    })).reverse();
                    setData(formatted);
                } else {
                    console.error("Unexpected response format:", json);
                }
            } catch (err) {
                console.error("Failed to fetch ESG factor data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    if (isLoading) {
        return <div className="text-base font-medium">Loading ESG factor chart...</div>;
    }

    if (!data.length) {
        return <div className="text-base font-medium">No ESG factor data available for this company.</div>;
    }

    // Format dates for better readability
    const formattedData = data.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit"
        })
    }));

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">
                ESG Factors Over Time
            </h2>
            <ChartContainer 
                className="w-full h-full max-h-[350px]"
                config={{
                    environmental_score: { label: 'Environmental', color: ESG_COLORS.environmental.stroke },
                    social_score: { label: 'Social', color: ESG_COLORS.social.stroke },
                    governance_score: { label: 'Governance', color: ESG_COLORS.governance.stroke }
                }}
            >
                <LineChart 
                    data={formattedData} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }} 
                    accessibilityLayer
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="timestamp" 
                        tickMargin={10} 
                    />
                    <YAxis />
                    <ChartTooltip
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                    />
                    <Line 
                        type="monotone" 
                        dataKey="environmental_score" 
                        strokeWidth={2} 
                        name="Environmental" 
                        stroke={ESG_COLORS.environmental.stroke}
                        dot={{ stroke: ESG_COLORS.environmental.stroke, strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="social_score" 
                        strokeWidth={2} 
                        name="Social" 
                        stroke={ESG_COLORS.social.stroke}
                        dot={{ stroke: ESG_COLORS.social.stroke, strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="governance_score" 
                        strokeWidth={2} 
                        name="Governance" 
                        stroke={ESG_COLORS.governance.stroke}
                        dot={{ stroke: ESG_COLORS.governance.stroke, strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                </LineChart>
            </ChartContainer>
        </>
    );
}
