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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [companyId]);

    if (isLoading) {
        return <div className="text-base font-medium">Loading ESG Level Chart...</div>;
    }

    if (!data.length) {
        return <div className="text-base font-medium">No ESG rating data available for this company.</div>;
    }

    return (
        <>
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold">
                    ESG Rating Over Time
                </h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="ml-2">
                                <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs p-4 text-sm">
                            ESG ratings range from A (best performance) to E (worst performance), reflecting overall ESG risk level.
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <ChartContainer 
                className="w-full h-full max-h-[350px]"
                config={{
                    numeric_rating: { label: 'ESG Rating', color: '#ff9800' }
                }}
            >
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} accessibilityLayer>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis
                        type="number"
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tickFormatter={(value) => {
                            const label = Object.entries(ratingScale).find(([, v]) => v === value);
                            return label ? label[0] : value;
                        }}
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent 
                                formatter={(_: any, __: any, props: any) => `Rating: ${props.payload.rating}`}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                        }
                    />
                    <Line type="monotone" dataKey="numeric_rating" strokeWidth={2} name="Rating" dot />
                </LineChart>
            </ChartContainer>
        </>
    );
}
