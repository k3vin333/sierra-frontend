'use client';

import React, { useState, useRef, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from './components/DashboardSidebar';
import CompanyRatingWidget from '../widgets/components/LevelACompaniesWidget';
import ESGCompanyBarChartsSearch from '../widgets/components/ESGCompanyBarChartsSearch';
import CompanyESGChart from '../widgets/components/CompanyESGChart';
import { ChevronUp, BarChart3, TrendingUp, LineChart, Briefcase } from 'lucide-react';
import AllCompaniesESGChart from '../widgets/components/AllCompaniesESGChart';
import StatCard from '../widgets/components/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';

// Use environment variable if available, otherwise use a placeholder
const getFinnhubApiKey = () => {
  // For client-side code, use NEXT_PUBLIC_ prefix for environment variables
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FINNHUB_API_KEY) {
    return process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  }
  
  // Fallback for development or if env variable is not set
  return 'placeholder_api_key_for_development';
};

// Define types
type ChartDataPoint = {
  date: string;
  value: number;
};

type ESGScoreData = {
  value: number;
  change: number;
  chartData: ChartDataPoint[];
};

// Portfolio Card Component
function PortfolioCard({ onTickerSelect }: { onTickerSelect: (ticker: string) => void }) {
  const [portfolioItems, setPortfolioItems] = useState<Array<{ticker: string, name?: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getTickers } = useAuth();

  // Fetch stock details from API
  const fetchStockDetails = async (ticker: string) => {
    try {
      const apiKey = getFinnhubApiKey();
      const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`);
      const companyData = await res.json();
      
      return {
        ticker,
        name: companyData.name || ticker
      };
    } catch (error) {
      console.error("Error fetching stock details:", error);
      return { ticker, name: ticker };
    }
  };

  useEffect(() => {
    const loadTickers = async () => {
      setIsLoading(true);
      try {
        // Get tickers from the API
        const tickerData = await getTickers();
        
        // Map the tickers to portfolio items with company names
        const portfolioPromises = tickerData.map(async (tickerItem) => {
          return await fetchStockDetails(tickerItem.ticker);
        });
        
        const resolvedPortfolioItems = await Promise.all(portfolioPromises);
        setPortfolioItems(resolvedPortfolioItems);
      } catch (error) {
        console.error("Failed to load tickers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTickers();
  }, [getTickers]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Your Portfolio</CardTitle>
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            Loading your portfolio...
          </div>
        ) : portfolioItems.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No tickers in your portfolio yet.
          </div>
        ) : (
          <div className="space-y-2">
            {portfolioItems.map((item) => (
              <div 
                key={item.ticker} 
                className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
                onClick={() => onTickerSelect(item.ticker)}
              >
                <div className="font-medium">{item.ticker}</div>
                <div className="text-sm text-muted-foreground truncate max-w-[150px]">{item.name}</div>
              </div>
            ))}
            <Link href="/dashboard/reports" className="block w-full">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Manage Portfolio
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
    const [isCompaniesWidgetExpanded, setIsCompaniesWidgetExpanded] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    // State for ESG score data
    const [environmentalScore, setEnvironmentalScore] = useState<ESGScoreData>({ 
      value: 0, 
      change: 0, 
      chartData: [] 
    });
    const [socialScore, setSocialScore] = useState<ESGScoreData>({ 
      value: 0, 
      change: 0, 
      chartData: [] 
    });
    const [governanceScore, setGovernanceScore] = useState<ESGScoreData>({ 
      value: 0, 
      change: 0, 
      chartData: [] 
    });

    const toggleCompaniesWidget = () => {
      setIsCompaniesWidgetExpanded(!isCompaniesWidgetExpanded);
    };

    // Fetch ESG score data from API
    // This is for the stat card.
    const [ticker, setTicker] = useState("");
    const [inputValue, setInputValue] = useState("");

    // Handle ticker selection from portfolio
    const handleTickerSelect = (selectedTicker: string) => {
      setInputValue(selectedTicker);
      setTicker(selectedTicker);
    };

    // Fetch ESG data based on ticker
    useEffect(() => {
      const fetchESGData = async () => {
        if (!ticker) return;
        
        setIsLoading(true);
        try {
          const res = await fetch(`/api/esg?ticker=${ticker}`);
          const data = await res.json();

          const historical = data?.historical_ratings;
          if (!historical || !historical.length) {
            setIsLoading(false);
            return;
          }

          const transform = (key: "environmental_score" | "social_score" | "governance_score") => {
            return historical.map((entry: Record<string, number | string>) => ({
              date: new Date(entry.timestamp as string).toLocaleDateString("en-AU", {
                month: "short",
                year: "2-digit",
              }),
              value: entry[key] ?? 0,
            }));
          };

          const latest = historical[historical.length - 1];
          const previous = historical[historical.length - 2];

          const calculateChange = (curr: number, prev: number) =>
            prev ? ((curr - prev) / prev) * 100 : 0;

          setEnvironmentalScore({
            value: latest.environmental_score,
            change: calculateChange(latest.environmental_score, previous?.environmental_score),
            chartData: transform("environmental_score"),
          });

          setSocialScore({
            value: latest.social_score,
            change: calculateChange(latest.social_score, previous?.social_score),
            chartData: transform("social_score"),
          });

          setGovernanceScore({
            value: latest.governance_score,
            change: calculateChange(latest.governance_score, previous?.governance_score),
            chartData: transform("governance_score"),
          });
        } catch (err) {
          console.error("Failed to fetch ESG data:", err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchESGData();
    }, [ticker]);

    return (
      <ProtectedRoute delayRender={true}>
        <div className="min-h-screen flex">
          <div className="flex flex-row w-full">
            {/* Sidebar */}
            <div className="flex-shrink-0">
              <DashboardSidebar />
            </div>
    
            {/* Main Content Area */}
            <div className="flex-1 bg-[#F7EFE6] px-4 py-4">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Main Widgets */}
                <div className="lg:w-3/4">
                  {/* ESG Chart */}
                  <div className="mb-6 bg-white rounded-lg shadow-sm">
                    <CompanyESGChart selectedTicker={ticker} />
                  </div>
      
                  {/* ESG Rated A Companies */}
                  <div className="mb-6 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                    <div 
                      className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-500"
                      onClick={toggleCompaniesWidget}
                    >
                      <h2 className="text-2xl font-semibold text-gray-700">
                        Top ESG Rated Companies
                      </h2>
                      <div className="transition-transform duration-700" style={{ transform: isCompaniesWidgetExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                        <ChevronUp className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    
                    <div 
                      ref={contentRef}
                      className="transition-all duration-700 ease-out"
                      style={{ 
                        maxHeight: isCompaniesWidgetExpanded ? contentRef.current?.scrollHeight + 'px' || '2000px' : '0',
                        opacity: isCompaniesWidgetExpanded ? 1 : 0,
                        overflow: 'hidden',
                        transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)'
                      }}
                    >
                      <div className="p-6 pt-0">
                        <CompanyRatingWidget />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 bg-white rounded-lg shadow-sm">
                    <ESGCompanyBarChartsSearch />
                  </div>
                  <div className="mb-6 bg-white rounded-lg shadow-sm">
                    <AllCompaniesESGChart />
                  </div>
                </div>

                {/* Right Column - StatCards */}
                <div className="lg:w-1/4 flex flex-col space-y-6">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Search ticker (e.g. DIS)"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setTicker(inputValue.trim().toUpperCase())}
                      className="w-full"
                    />
                    <Button 
                      onClick={() => setTicker(inputValue.trim().toUpperCase())} 
                      variant="outline"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Search'}
                    </Button>
                  </div>
                  
                  {/* Portfolio Card */}
                  <div className="h-auto">
                    <PortfolioCard onTickerSelect={handleTickerSelect} />
                  </div>
                  
                  {/* Environmental Score Card */}
                  <div className="h-auto">
                    <StatCard 
                      title="Environmental"
                      value={environmentalScore.value}
                      suffix=" "
                      icon={<BarChart3 className="h-5 w-5" />}
                      chartData={environmentalScore.chartData}
                      chartColor="#047857"
                      gradient="from-emerald-600 to-emerald-800"
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Social Score Card */}
                  <div className="h-auto">
                    <StatCard 
                      title="Social"
                      value={socialScore.value}
                      suffix=" "
                      icon={<TrendingUp className="h-5 w-5" />}
                      chartData={socialScore.chartData}
                      chartColor="#10b981"
                      gradient="from-emerald-400 to-emerald-600"
                      isLoading={isLoading}
                    />
                  </div>

                  {/* Governance Score Card */}
                  <div className="h-auto">
                    <StatCard 
                      title="Governance"
                      value={governanceScore.value}
                      suffix=" "
                      icon={<LineChart className="h-5 w-5" />}
                      chartData={governanceScore.chartData}
                      chartColor="#65a30d"
                      gradient="from-lime-600 to-lime-800"
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }