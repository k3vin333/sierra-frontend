// src/components/ReportCharts.tsx
'use client';

import { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import ESGTrendChart from "@/app/report/[companyId]/components/ESGTrendChart";
import ESGFactorsChart from "@/app/report/[companyId]/components/ESGFactorsChart";
import ESGLevelChart from "@/app/report/[companyId]/components/ESGLevelChart";
import FinanceImpactChart from "@/app/report/[companyId]/components/FinanceImpactChart";
import ESGPrediction from "@/app/report/[companyId]/components/ESGPrediction";

export default function ReportCharts({ companyId, onLoad }: { companyId: string; onLoad?: () => void }) {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Box sx={{ p: 4 }}>
            <ESGPrediction companyId={companyId} onLoad={onLoad} />
            <Typography variant="h4" gutterBottom>
                ESG Report for {companyId.toUpperCase()}
            </Typography>

            <Tabs
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                sx={{ mb: 3 }}
            >
                <Tab label="Total ESG Risk Trend" />
                <Tab label="ESG Factors" />
                <Tab label="ESG Level" />
                <Tab label="Finance Impact" />
            </Tabs>

            <Paper
                elevation={1}
                sx={{ p: 2, backgroundColor: '#f6eee2', borderRadius: 2,
                    border: '1px solid #E1DED6',
                }}
            >
                {tabIndex === 0 && <ESGTrendChart companyId={companyId} />}
                {tabIndex === 1 && <ESGFactorsChart companyId={companyId} />}
                {tabIndex === 2 && <ESGLevelChart companyId={companyId} />}
                {tabIndex === 3 && <FinanceImpactChart companyId={companyId} />}
            </Paper>
        </Box>
    );
}
