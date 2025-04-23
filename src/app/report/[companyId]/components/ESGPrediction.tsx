// app/report/[companyId]/components/ESGPrediction.tsx
'use client';

import { useEffect, useState, useRef } from "react";
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
    onLoad?: () => void;
}

interface HistoricalRating {
    timestamp: string;
    total_score: number;
}

// Cache for prediction results to avoid redundant API calls
const predictionCache: Record<string, {
  prediction: number;
  currentScore: number;
  timestamp: number;
}> = {};

// Component to show a loading placeholder while data is loading
function PredictionSkeleton() {
  return (
    <div className="relative mb-4">
      <Card className="bg-gray-50 border-0 border-l-6 border-l-gray-300 rounded-md shadow-sm">
        <CardContent className="p-4">
          <div className="animate-pulse flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ESGPrediction({ companyId, onLoad }: Props) {
    const [prediction, setPrediction] = useState<number | null>(null);
    const [currentScore, setCurrentScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Check if we already have a cached prediction that's less than 30 minutes old
        const cachedData = predictionCache[companyId];
        const now = Date.now();
        const cacheTimeout = 30 * 60 * 1000; // 30 minutes
        
        if (cachedData && (now - cachedData.timestamp) < cacheTimeout) {
            // Use cached data immediately
            setPrediction(cachedData.prediction);
            setCurrentScore(cachedData.currentScore);
            setIsLoading(false);
            
            // Call onLoad if provided
            if (onLoad) {
                onLoad();
            }
            return;
        }
        
        // Prevent duplicate fetches within same component lifecycle
        if (hasFetched.current) return;
        
        const fetchPrediction = async () => {
            hasFetched.current = true;
            setIsLoading(true);
            
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

                    // Avoid duplicate fetches in the console
                    console.log(`Fetching prediction for ${companyId} with values:`, lag_1, lag_2, lag_3);

                    const predictionRes = await fetch(`/api/predict?lag_1=${lag_1}&lag_2=${lag_2}&lag_3=${lag_3}`);
    
                    const predictionJson = await predictionRes.json();
                    const predictionValue = Number(predictionJson?.prediction ?? null);
                    setPrediction(predictionValue);

                    // Cache the prediction
                    predictionCache[companyId] = {
                        prediction: predictionValue,
                        currentScore: lag_1,
                        timestamp: Date.now()
                    };
                }
                
                // Call onLoad if provided
                if (onLoad) {
                    onLoad();
                }
            } catch (err) {
                console.error(`Failed to fetch prediction for ${companyId}:`, err);
                // Still call onLoad on error if provided
                if (onLoad) {
                    onLoad();
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrediction();
        
        // Cleanup function
        return () => {
            hasFetched.current = false;
        };
    }, [companyId, onLoad]);

    // Show a loading skeleton while data is loading
    if (isLoading) {
        return <PredictionSkeleton />;
    }

    // If no data is available after loading completes, return null
    if (prediction === null || currentScore === null) return null;

    // Round both values to 1 decimal place for display
    const roundedCurrentScore = Math.round(currentScore * 10) / 10;
    const roundedPrediction = Math.round(prediction * 10) / 10;
    
    const diff = roundedPrediction - roundedCurrentScore;
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
            
    // Create more detailed message for "same" trend
    const getTrendMessage = () => {
        if (trend === "up") return "Increase";
        if (trend === "down") return "Decrease";
        return "Remain Stable";
    };

    return (
        <div className="relative mb-4">
            <Card className={`${colorClasses.bg} border-0 border-l-6 ${colorClasses.border} rounded-md shadow-sm`}>
                <CardContent className="p-4">
                    <div className={`flex items-center gap-2 font-bold text-lg ${colorClasses.text} mb-2`}>
                        <TrendIcon className="h-6 w-6" />
                        <span>
                            Total ESG Risk Score Predicted to {getTrendMessage()}
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
                        From <strong>{roundedCurrentScore}</strong> → <strong>{roundedPrediction}</strong>
                        {trend === "same" && 
                            <span className="ml-2 text-gray-600 text-sm italic">
                                (No significant change expected)
                            </span>
                        }
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
