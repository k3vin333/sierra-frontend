// app/report/[companyId]/components/ESGPrediction.tsx
'use client';

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Info 
} from "lucide-react";

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

                    console.log("Calling prediction with:", lag_1, lag_2, lag_3);

                    // cors error
                    /*const predictionRes = await fetch(
                        `https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/predict?lag_1=${lag_1}&lag_2=${lag_2}&lag_3=${lag_3}`
                    );*/

                    const predictionRes = await fetch(`/api/predict?lag_1=${lag_1}&lag_2=${lag_2}&lag_3=${lag_3}`);
    
                    const predictionJson = await predictionRes.json();
                    setPrediction(Number(predictionJson?.prediction ?? null));

                    
                    // mocking
                    /*const mockedPrediction = lag_3 + Math.round((Math.random() - 0.5) * 6); // +/- up to 3
                    setPrediction(mockedPrediction);*/
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
        
    // Define colors based on trend
    const getColorClasses = () => {
        if (trend === "up") return {
            text: "text-red-600",
            border: "border-l-red-600",
            bg: "bg-red-50"
        };
        if (trend === "down") return {
            text: "text-green-600",
            border: "border-l-green-600",
            bg: "bg-green-50"
        };
        return {
            text: "text-gray-600",
            border: "border-l-gray-600",
            bg: "bg-gray-50"
        };
    };
    
    const colorClasses = getColorClasses();
    
    // Select the appropriate icon based on trend
    const TrendIcon = trend === "up" 
        ? TrendingUp 
        : trend === "down" 
            ? TrendingDown 
            : ArrowRight;

    return (
        <div className="relative mb-4">
            <Card className={`${colorClasses.bg} border-0 border-l-6 ${colorClasses.border} rounded-md shadow-sm`}>
                <CardContent className="p-4">
                    <div className={`flex items-center gap-2 font-bold text-lg ${colorClasses.text} mb-2`}>
                        <TrendIcon className="h-6 w-6" />
                        <span>
                            Total ESG Risk Score Predicted to {trend === "up" ? "Increase" : trend === "down" ? "Decrease" : "Stay the Same"}
                        </span>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-1 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs p-4 text-sm">
                                    This prediction is generated using a model trained on ESG data from the past 5 years. 
                                    It uses the last 3 months of total ESG scores to forecast the next month's score.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <p className="text-base">
                        From <strong>{currentScore}</strong> → <strong>{prediction}</strong>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
