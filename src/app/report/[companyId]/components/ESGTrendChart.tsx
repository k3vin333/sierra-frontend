// app/report/[companyId]/components/ESGTrendChart.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

interface Props {
    companyId: string;
}

interface ESGData {
    timestamp: string;
    total_score: number;
}

export default function ESGTrendChart({ companyId }: Props) {
    const [data, setData] = useState<ESGData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
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
            }
        };

        fetchData();
    }, [companyId]);


    if (!data.length) {
        return <Typography>Loading chart...</Typography>;
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Total ESG Score Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total_score" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </>
    );

}
