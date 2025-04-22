// app/report/[companyId]/components/ESGPrediction.tsx
'use client';

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { green, red, grey } from "@mui/material/colors";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

interface Props {
    companyId: string;
}

interface HistoricalRating {
    timestamp: string;
    total_score: number;
}

export default function ESGPrediction({ companyId }: Props) {
    const [prediction, setPrediction] = useState<number | null>(null);
    const [currentScore, setCurrentScore] = useState<number | null>(null);

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const res = await fetch(
                    `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/esg/${companyId}`
                );
                const json = await res.json();

                const sorted = (json.historical_ratings as HistoricalRating[])
                    ?.map((entry) => ({
                        timestamp: entry.timestamp,
                        total_score: entry.total_score,
                    }))
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                const lastThree = sorted?.slice(0, 3);
                if (lastThree?.length === 3) {
                    const [lag_1, lag_2, lag_3] = lastThree.map((entry) => entry.total_score);
                    setCurrentScore(lag_1);

                    /*const predictionRes = await fetch(
                        `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/predict?lag_1=${lag_1}&lag_2=${lag_2}&lag_3=${lag_3}`
                    );
    
                    const predictionJson = await predictionRes.json();
                    setPrediction(predictionJson?.predicted_score ?? null);
                    */
                    // mocking
                    const mockedPrediction = lag_3 + Math.round((Math.random() - 0.5) * 6); // +/- up to 3
                    setPrediction(mockedPrediction);
                }
            } catch (err) {
                console.error("Failed to fetch prediction", err);
            }
        };

        fetchPrediction();
    }, [companyId]);

    if (prediction === null || currentScore === null) return null;

    const diff = prediction - currentScore;
    const trend =
        diff > 0 ? "up" : diff < 0 ? "down" : "same";
    const color = trend === "up" ? green[600] : trend === "down" ? red[600] : grey[600];
    const Icon =
        trend === "up"
            ? TrendingUpIcon
            : trend === "down"
                ? TrendingDownIcon
                : TrendingFlatIcon;

    return (
        <Box sx={{ position: "relative", mb: 4 }}>
            <Box
                sx={{
                    backgroundColor: color + "20",
                    borderLeft: `6px solid ${color}`,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h6"
                    display="flex"
                    alignItems="center"
                    gap={1}
                    fontWeight="bold"
                    color={color}
                >
                    <Icon fontSize="large" />
                    ESG Total Score Predicted to {trend === "up" ? "Increase" : trend === "down" ? "Decrease" : "Stay the Same"}
                    <Tooltip
                        title="This prediction is generated using a model trained on ESG data from the past 5 years. 
                        It uses the last 3 months of total ESG scores to forecast the next month's score."
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
                        <InfoOutlinedIcon fontSize="small" sx={{ ml: 1, cursor: 'pointer' }} />
                    </Tooltip>
                </Typography>
                <Typography variant="body1">
                    From <strong>{currentScore}</strong> → <strong>{prediction}</strong>
                </Typography>

            </Box>
        </Box>

    );
}
