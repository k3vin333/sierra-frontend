// app/dashboard/page.tsx

'use client';

import LevelACompaniesWidget from "../widgets/components/LevelACompaniesWidget";
import CompanyESGChart from "../widgets/components/CompanyESGChart";

export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Level A Companies</h1>
      <LevelACompaniesWidget />
      <CompanyESGChart />
    </main>
  );
}
