// app/report/[companyId]/components/ESGFactorsChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

interface Props {
    companyId: string;
}

interface ESGFactorData {
    timestamp: string;
    environmental_score: number;
    social_score: number;
    governance_score: number;
}

export default function ESGFactorsChart({ companyId }: Props) {
    const [data, setData] = useState<ESGFactorData[]>([]);

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
            }
        };

        fetchData();
    }, [companyId]);

    if (!data.length) {
        return <Typography>Loading ESG factor chart...</Typography>;
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                ESG Factors Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="environmental_score" stroke="#66bb6a" strokeWidth={2} name="Environmental" />
                    <Line type="monotone" dataKey="social_score" stroke="#42a5f5" strokeWidth={2} name="Social" />
                    <Line type="monotone" dataKey="governance_score" stroke="#ef5350" strokeWidth={2} name="Governance" />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
