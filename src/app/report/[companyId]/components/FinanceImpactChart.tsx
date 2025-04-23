// app/report/[companyId]/components/FinanceImpactChart.tsx
'use client';

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

interface FinanceDataPoint {
    date: string;
    close: number | null;
    esg: number | null;
}

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

export default function FinanceImpactChart({ companyId }: Props) {
    const [data, setData] = useState<FinanceDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFinanceAndESGData = async () => {
            setIsLoading(true);
            const months = generateMonthlyDates(2024, 2025);
            const results: FinanceDataPoint[] = [];

            // Fetch ESG data once
            let esgMap: Record<string, number> = {};
            try {
                const esgRes = await fetch(`https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${companyId}`);
                const esgJson = await esgRes.json();
                esgJson.historical_ratings.forEach((entry: any) => {
                    const date = entry.timestamp.slice(0, 7);
                    esgMap[date] = entry.total_score;
                });
            } catch (err) {
                console.error("Failed to fetch ESG data", err);
            }

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

            setData(results);
            setIsLoading(false);
        };

        fetchFinanceAndESGData();
    }, [companyId]);

    if (isLoading) {
        return <div className="text-base font-medium">Loading financial and ESG data...</div>;
    }

    if (!data.length) {
        return <div className="text-base font-medium">No financial and ESG data available for this company.</div>;
    }

    return (
        <>
            <h2 className="text-xl font-semibold mb-4">
                Monthly Closing Prices & Total ESG Risk Score (2024–2025)
            </h2>
            <ChartContainer 
                className="w-full h-full min-h-[175px]"
                config={{
                    close: { label: "Closing Price", color: "#4caf50" },
                    esg: { label: "ESG Score", color: "#2196f3" }
                }}
            >
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d) => d.slice(0, 7)} />
                    <YAxis yAxisId="left" label={{ value: "Closing Price", angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: "ESG Score", angle: 90, position: 'insideRight' }} />
                    <ChartTooltip 
                        content={
                            <ChartTooltipContent 
                                formatter={(value, name) => name === "Closing Price" ? `$${value}` : value} 
                            />
                        } 
                    />
                    <Line yAxisId="left" type="monotone" dataKey="close" strokeWidth={2} name="Closing Price" dot />
                    <Line yAxisId="right" type="monotone" dataKey="esg" strokeWidth={2} name="ESG Score" dot />
                </LineChart>
            </ChartContainer>
        </>
    );
}