'use client';

import React, { useEffect, useState } from 'react';
import PublicNavbar from '../landing/components/PublicNavbar';
import { columns } from './columns';
import { DataTable } from './data-tables';
import { ESGData } from './columns';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F7EFE6]">
      <PublicNavbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default function TierListPage() {
  const [data, setData] = useState<ESGData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataReady, setDataReady] = useState(false);

  // Redirect to home page if data isn't ready yet
  useEffect(() => {
    if (!dataReady && !loading) {
      // Data is loaded but not marked as ready, now we can show the page
      setDataReady(true);
    }
  }, [loading, dataReady]);

  useEffect(() => {
    // Show a loading indicator while fetching data
    if (!dataReady) {
      document.body.style.cursor = 'wait';
    } else {
      document.body.style.cursor = 'default';
    }

    return () => {
      document.body.style.cursor = 'default';
    };
  }, [dataReady]);

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/api/search/level/total_level/A');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        
        // Filter out companies with name "Unknown"
        const filteredData = (result.companies || []).filter(
          (company: { company_name: string }) => company.company_name !== "Unknown"
        );
        
        setData(filteredData);
      } catch (err) {
        setError('Failed to load ESG data. Please try again later.');
        console.error('Error fetching ESG data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If data isn't ready yet, return an empty div to delay rendering
  // This allows the data to load while the user is still on the landing page
  if (!dataReady) {
    return null;
  }

    let content;
  
 if (error) {
    content = <p className="text-red-500 text-center">{error}</p>;
  } else {
    content = <DataTable columns={columns} data={data} />;
  }

  return (
    <LandingLayout>
      <div className="max-w-6xl mx-auto p-10 border border-gray-200 rounded-lg outline outline-[#042B0B] mt-40">
        <h1 className="text-2xl font-bold text-[#042B0B] mb-4">ESG Tier List - Rating A</h1>
        {content}
      </div>
    </LandingLayout>
  );
}
