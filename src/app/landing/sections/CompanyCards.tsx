'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type ESGData = {
  ticker: string;
  company_name: string;
  historical_ratings: {
    environmental_score: number;
    social_score: number;
    governance_score: number;
    total_score: number;
    rating: string;
    timestamp: string;
  }[];
};

// Fallback logo component that displays company initials when image fails to load
const LogoFallback = ({ name }: { name: string }) => {
  // Get the initials from the company name
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
    
  return (
    <div className="h-full w-full flex items-center justify-start">
      <div className="bg-white/10 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
        {initials}
      </div>
    </div>
  );
};

const CompanyCards = () => {
  const companies = [
    {
      name: 'Amazon',
      domain: 'amazon.com',
      ticker: 'AMZN'
    },
    {
      name: 'Apple',
      domain: 'apple.com',
      ticker: 'AAPL'
    },
    {
      name: 'Google',
      domain: 'google.com',
      ticker: 'GOOGL'
    },
    {
      name: 'Microsoft',
      domain: 'microsoft.com',
      ticker: 'MSFT'
    }
  ];

  const [esgData, setEsgData] = useState<Record<string, ESGData | null>>({});
  const [loading, setLoading] = useState(true);
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchESGData = async () => {
      setLoading(true);

      const results: Record<string, ESGData | null> = {};
      const tickers = ['AMZN', 'AAPL', 'GOOGL', 'MSFT'];
      
      // Fetch ESG data for each company
      await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const response = await fetch(`/api/esg?ticker=${ticker}`);
            if (response.ok) {
              const data = await response.json();
              results[ticker] = data;
            } else {
              results[ticker] = null;
              console.error(`Failed to fetch ESG data for ${ticker}`);
            }
          } catch (error) {
            results[ticker] = null;
            console.error(`Error fetching ESG data for ${ticker}:`, error);
          }
        })
      );

      setEsgData(results);
      setLoading(false);
    };

    fetchESGData();
  }, []);

  // Function to get logo URL via our secure API route
  const getLogoUrl = (domain: string) => {
    return `/api/logo?domain=${encodeURIComponent(domain)}`;
  };

  // Get the most recent ESG score for a company
  const getLatestESGData = (ticker: string) => {
    const data = esgData[ticker];
    if (!data || !data.historical_ratings || data.historical_ratings.length === 0) {
      return null;
    }

    // Sort by timestamp descending to get the most recent
    const sortedRatings = [...data.historical_ratings].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return sortedRatings[0];
  };

  // Handle image load error
  const handleImageError = (domain: string) => {
    console.log(`Failed to load logo for ${domain}`);
    setLogoErrors(prev => ({ ...prev, [domain]: true }));
  };

  return (
    <div className="w-full bg-[#F7EFE6] py-20 min-h-[65vh]">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#042B0B] mb-12 text-center">
          Featured Companies
        </h2>
        <p className="text-center text-[#042B0B] mb-12">
          Using real Sustainalytics ESG risk exposure ratings based on environmental, social, and governance factors
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {companies.map((company) => {
            const latestESG = getLatestESGData(company.ticker);
            const hasLogoError = logoErrors[company.domain] || false;

            return (
                <motion.div
                  key={company.name}
                  className="bg-[#042B0B] p-6 shadow-lg hover:shadow-xl transition-shadow animated-element"
                  initial={{ scale: 0.98 }}
                  whileInView={{ scale: 1.05 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  viewport={{ once: false, margin: "-100px" }}
                >

                  <div className="flex items-center justify-between mb-4">
                    <div className="relative h-10 w-24">
                      {hasLogoError ? (
                        <LogoFallback name={company.name} />
                      ) : (
                        <Image
                          src={getLogoUrl(company.domain)}
                          alt={`${company.name} logo`}
                          fill
                          style={{ objectFit: 'contain', objectPosition: 'left' }}
                          sizes="(max-width: 768px) 100px, 150px"
                          onError={() => handleImageError(company.domain)}
                          unoptimized={true} // Skip the image optimization process
                        />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {loading ? (
                        <span className="text-sm opacity-60">Loading...</span>
                      ) : latestESG ? (
                        latestESG.total_score
                      ) : (
                        <span className="text-sm opacity-60">No data</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {company.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Environmental</span>
                      <span className="font-semibold text-white">
                        {loading ? (
                          "Loading..."
                        ) : latestESG ? (
                          latestESG.environmental_score
                        ) : (
                          "No data"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Social</span>
                      <span className="font-semibold text-white">
                        {loading ? (
                          "Loading..."
                        ) : latestESG ? (
                          latestESG.social_score
                        ) : (
                          "No data"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Governance</span>
                      <span className="font-semibold text-white">
                        {loading ? (
                          "Loading..."
                        ) : latestESG ? (
                          latestESG.governance_score
                        ) : (
                          "No data"
                        )}
                      </span>
                    </div>
                  </div>
              </motion.div>
        );
          })}
      </div>
    </div>
    </div >
  );
};

export default CompanyCards;