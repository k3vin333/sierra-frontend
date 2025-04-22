// app/report/[companyId]/components/FinanceImpactChart.tsx
'use client';

import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
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

interface FinanceDataPoint {
    date: string;
    close: number | null;
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

    useEffect(() => {
        const fetchFinanceData = async () => {
            const months = generateMonthlyDates(2023, 2025);
            const results: FinanceDataPoint[] = [];

            for (const month of months) {
                let found = false;
                let finalClose: number | null = null;

                for (let day = 1; day <= 3; day++) {
                    const date = `${month}-${day.toString().padStart(2, '0')}`;
                    try {
                        const res = await fetch(`https://8a38hm2y70.execute-api.ap-southeast-2.amazonaws.com/v1/stocks/historicalSingular/${companyId.toLowerCase()}/${date}`);
                        if (res.ok) {
                            const json = await res.json();
                            const close = json?.historicalPoint?.close;
                            if (close != null) {
                                finalClose = close;
                                results.push({ date, close });
                                found = true;
                                break;
                            }
                        }
                    } catch (err) {
                        console.error(`Finance data fetch failed for ${date}`, err);
                    }
                }

                if (!found) {
                    results.push({ date: `${month}-01`, close: null });
                }
            }

            setData(results);
        };

        fetchFinanceData();
    }, [companyId]);

    if (!data.length) {
        return <Typography>Loading financial data...</Typography>;
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Monthly Closing Prices (2023–2025)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(d) => d.slice(0, 7)} />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => (value ? `$${value}` : "No data")} />
                    <Line type="monotone" dataKey="close" stroke="#4caf50" strokeWidth={2} name="Closing Price" dot />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}