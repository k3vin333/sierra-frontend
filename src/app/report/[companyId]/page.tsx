// app/report/[companyId]/page.tsx
'use client';

import { useParams } from "next/navigation";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import { useState } from "react";
import Layout from "../layout";
import ESGTrendChart from "./components/ESGTrendChart";
import ESGFactorsChart from "./components/ESGFactorsChart";
import ESGLevelChart from "./components/ESGLevelChart";
import FinanceImpactChart from "./components/FinanceImpactChart";
import ESGPrediction from "./components/ESGPrediction";
import ReportCharts from "../../../components/ReportCharts"


export default function ReportPage() {
    //const { companyId } = useParams();
    const { companyId } = useParams() as { companyId: string };

    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <ESGPrediction companyId={companyId} />
                <Typography variant="h4" gutterBottom>
                    ESG Report for {companyId}
                </Typography>

                <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Total ESG Risk Trend" />
                    <Tab label="ESG Factors" />
                    <Tab label="ESG Level" />
                    <Tab label="Finance Impact" />
                </Tabs>

                <ReportCharts companyId={companyId} />
            </Box>
        </Layout>
    );
}
