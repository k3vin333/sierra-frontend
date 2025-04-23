'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
// import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/useAuth';

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

const tickersMap: Record<string, string[]> = {
  // Environmental
  '2_1': ['NVDA', 'INTU'],
  // Social
  '2_2': ['AAPL', 'MSFT'],
  // Governance
  '2_3': ['JPM', 'BAC'],
  // News companies
  '3_2': ['INTC', 'GOOGL'],
  // Tech companies
  '3_1': ['ADBE', 'AVGO'],
  // Finance
  '3_3': ['GS', 'V'],
  // Food
  '3_4': ['MCD', 'SBUX']
};

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="w-full bg-[#F7EFE6] py-20 min-h-[65vh] flex items-center justify-center">
      <div className="text-[#042B0B] text-xl">Loading questionnaire results...</div>
    </div>
  );
}

// Main content component that uses useSearchParams
function CompletePageContent() {
  const { saveTicker } = useAuth();
  // const router = useRouter();

  const searchParams = useSearchParams();

  const answer2 = searchParams?.get('2') ?? '';
  const answer3 = searchParams?.get('3') ?? '';

  const recommendedTickers = useMemo(() => {
    const key2 = answer2 ? `2_${answer2}` : '';
    const key3 = answer3 ? `3_${answer3}` : '';
    const tickers = new Set([
      ...(tickersMap[key2] || []),
      ...(tickersMap[key3] || [])
    ]);
    return Array.from(tickers);
  }, [answer2, answer3]);

  const [esgData, setEsgData] = useState<Record<string, ESGData | null>>({});  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchESGData = async () => {
        setLoading(true);
        
        const results: Record<string, ESGData | null> = {};
        
        // Fetch ESG data for each company
        await Promise.all(
          recommendedTickers.map(async (ticker) => {
            try {
              const response = await fetch(`/api/esg?ticker=${ticker}`);
              if (response.ok) {
                const data = await response.json();
                saveTicker(ticker);
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
        
        setEsgData(results)
        setLoading(false);
      };
  
      fetchESGData();
    }, [recommendedTickers, saveTicker]);

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
    
    return {
      name: data.company_name, 
      rating: sortedRatings[0]
    };
  };

  // const fetchData = async () => {
  //   const response = await fetch('https://gh4vkppgue.execute-api.us-east-1.amazonaws.com/prod/auth/questionnaire/completed', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ token, answer2, answer3 })
  //   });
  //   const result = await response.json();
  // };

  // fetchData();

  return (
    <div className="w-full bg-[#F7EFE6] py-20 min-h-[65vh]">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#042B0B] mb-12 text-center">
          Thank you for completing the questionnaire!
        </h2>
        <p className="text-center text-[#042B0B] mb-12">
          We have collected some companies we think you may be interested in...
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 justify-items-center">
          {recommendedTickers.map((ticker) => {
            const companyName = getLatestESGData(ticker)?.name;
            const latestESG = getLatestESGData(ticker)?.rating;

            return (
              <motion.div
                key={ticker}
                className="bg-[#042B0B] p-6 shadow-lg hover:shadow-xl transition-shadow animated-element rounded-2xl w-full max-w-xs"
                initial={{ scale: 0.98 }}
                whileInView={{ scale: 1.05 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                viewport={{ once: false, margin: '-100px' }}
              >
                <div className="flex items-center justify-between mb-4">
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
                  {companyName || ticker}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Environmental</span>
                    <span className="font-semibold text-white">
                      {loading ? (
                        'Loading...'
                      ) : latestESG ? (
                        latestESG.environmental_score
                      ) : (
                        'No data'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Social</span>
                    <span className="font-semibold text-white">
                      {loading ? (
                        'Loading...'
                      ) : latestESG ? (
                        latestESG.social_score
                      ) : (
                        'No data'
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Governance</span>
                    <span className="font-semibold text-white">
                      {loading ? (
                        'Loading...'
                      ) : latestESG ? (
                        latestESG.governance_score
                      ) : (
                        'No data'
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="/dashboard"
            className="bg-[#042B0B] hover:bg-[#064d13] text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function CompletePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CompletePageContent />
    </Suspense>
  );
} 