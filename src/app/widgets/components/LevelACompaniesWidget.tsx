// components/widgets/LevelACompaniesWidget.tsx

'use client';

import { useEffect, useState } from 'react';
import WidgetCard from './WidgetCard';

type Company = {
  company_name: string;
  ticker: string;
  rating: string;
  total_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  last_processed_date: string;
};

export default function LevelACompaniesWidget() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetch('/api/level-a')
      .then((res) => res.json())
      .then((data) => setCompanies(data.companies || []));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <WidgetCard
          key={company.ticker}
          title={company.company_name}
          subtitle={`Ticker: ${company.ticker.toUpperCase()}`}
          info={
            <>
              <span className="text-green-700 font-medium">E:</span> {company.environmental_score},{' '}
              <span className="text-blue-700 font-medium">S:</span> {company.social_score},{' '}
              <span className="text-purple-700 font-medium">G:</span> {company.governance_score}
            </>
          }
          badge={`Rating: ${company.rating}`}
          footer={`Last updated: ${company.last_processed_date}`}
        />
      ))}
    </div>
  );
}

