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
                <Typography variant="h4" gutterBottom>
                    ESG Report for {companyId}
                </Typography>

                <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="Total ESG Trend" />
                    <Tab label="ESG Factors" />
                    <Tab label="ESG Level" />
                    <Tab label="Finance Impact" />
                </Tabs>

                <Paper elevation={3} sx={{ p: 2 }}>
                    {tabIndex === 0 && <ESGTrendChart companyId={companyId} />}
                    {tabIndex === 1 && <ESGFactorsChart companyId={companyId} />}
                    {tabIndex === 2 && <ESGLevelChart companyId={companyId} />}
                </Paper>
            </Box>
        </Layout>
    );
}

/*               
                {tabIndex === 3 && <FinanceImpactChart companyId={companyId} />}
                */
