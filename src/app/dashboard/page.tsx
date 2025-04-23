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
  
  // Use environment variable for API key
  const getFinnhubApiKey = () => {
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FINNHUB_API_KEY) {
      return process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    }
    return 'placeholder_api_key_for_development';
  };

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
          const res = await fetch(`