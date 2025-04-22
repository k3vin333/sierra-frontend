'use client';

import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
} from "recharts";

interface Props {
    companyId: string;
}

interface RatingData {
    timestamp: string;
    numeric_rating: number;
    rating: string;
}

const ratingScale: Record<string, number> = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
};

export default function ESGLevelChart({ companyId }: Props) {
    const [data, setData] = useState<RatingData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${companyId}`
                );
                const json = await res.json();

                const formatted = json.historical_ratings.map((entry: any) => ({
                    timestamp: entry.timestamp,
                    numeric_rating: ratingScale[entry.rating] || 0,
                    rating: entry.rating,
                })).reverse();

                setData(formatted);
            } catch (err) {
                console.error("Failed to fetch ESG rating data", err);
            }
        };

        fetchData();
    }, [companyId]);

    if (!data.length) {
        return <Typography>Loading ESG Level Chart...</Typography>;
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                ESG Rating Over Time
                <Tooltip title="ESG ratings range from A (best performance) to E (worst performance), reflecting overall ESG risk level."
                    placement="right"
                    componentsProps={{
                        tooltip: {
                            sx: {
                                fontSize: '0.9rem',
                                maxWidth: 300,
                                padding: 1.5,
                            },
                        },
                    }}
                >
                    <InfoOutlinedIcon sx={{ ml: 1, fontSize: 20, verticalAlign: 'middle', cursor: 'pointer' }} />
                </Tooltip>
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis
                        type="number"
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tickFormatter={(value) => {
                            const label = Object.entries(ratingScale).find(([k, v]) => v === value);
                            return label ? label[0] : value;
                        }}
                    />
                    <RechartsTooltip
                        formatter={(_: any, __: any, props: any) => `Rating: ${props.payload.rating}`}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line type="monotone" dataKey="numeric_rating" stroke="#ff9800" strokeWidth={2} name="Rating" dot />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
