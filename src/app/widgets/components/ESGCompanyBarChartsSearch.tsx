'use client';

import { useState, useRef } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis } from 'recharts';
import { ChevronUp, TrendingUp } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ChartDataPoint = {
  date: string;
  Environmental: number;
  Social: number;
  Governance: number;
};

export default function ESGCompanyBarCharts() {
  const [groupedData, setGroupedData] = useState<Record<string, ChartDataPoint[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(0);
  const pageSize = 5;

  const fetchCompanies = async (query: string) => {
    try {
      console.log('Fetching companies with query:', query);
      const res = await fetch(`/api/company-search/${query}`);
      console.log('Response status:', res.status);
      const json = await res.json();
      console.log('API response:', json);
      
      if (!json || !json.companies) {
        console.error('Invalid API response structure:', json);
        setGroupedData({});
        return;
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tickers = [...new Set(json.companies.map((c: any) => c.ticker.toLowerCase()))];
      console.log('Extracted tickers:', tickers);

      const grouped: Record<string, ChartDataPoint[]> = {};

      for (const ticker of tickers) {
        console.log('Fetching ESG data for ticker:', ticker);
        const historyRes = await fetch(`/api/esg?ticker=${ticker}`);
        const data = await historyRes.json();
        console.log('ESG data for ticker:', ticker, data);

        if (data?.historical_ratings?.length) {
          const key = `${data.historical_ratings[0].company_name}::${data.ticker.toUpperCase()}`;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const chartData: ChartDataPoint[] = data.historical_ratings.map((entry: any) => ({
            date: new Date(entry.timestamp).toLocaleDateString('en-AU', {
              year: '2-digit',
              month: 'short',
            }),
            Environmental: entry.environmental_score,
            Social: entry.social_score,
            Governance: entry.governance_score,
          }));

          const allZero = chartData.every(
            (e) => e.Environmental === 0 && e.Social === 0 && e.Governance === 0
          );

          if (!allZero) {
            grouped[key] = chartData.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
          }
        }
      }

      console.log('Final grouped data:', grouped);
      setPage(0);
      setGroupedData(grouped);
    } catch (error) {
      console.error('Failed to search companies', error);
      setGroupedData({});
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      fetchCompanies(searchQuery.trim());
    }
  };

  const toggleSection = () => setIsExpanded((prev) => !prev);

  const allCompanies = Object.entries(groupedData);
  const totalPages = Math.ceil(allCompanies.length / pageSize);
  const currentSlice = allCompanies.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <div
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-500"
        onClick={toggleSection}
      >
        <h2 className="text-2xl font-semibold text-gray-700">
          ESG Score Evolution (Search Companies)
        </h2>
        <div
          className="transition-transform duration-700"
          style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
        >
          <ChevronUp className="h-6 w-6 text-gray-500" />
        </div>
      </div>

      <div
        ref={contentRef}
        className="transition-all duration-700 ease-out"
        style={{
          maxHeight: isExpanded ? contentRef.current?.scrollHeight + 'px' || '2000px' : '0',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
        }}
      >
        <div className="p-6 pt-0 space-y-6">
          {/* Search Box */}
          <div className="flex gap-3">
            <Input
              placeholder="Search company (e.g. dis)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Company Charts */}
          {currentSlice.map(([key, chartData]) => {
            const [companyName, ticker] = key.split('::');

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>
                    {companyName} ({ticker.toUpperCase()})
                  </CardTitle>
                  <CardDescription>ESG Trends Over Time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      Environmental: { label: 'Environmental', color: '#047857' },
                      Social: { label: 'Social', color: '#10b981' },
                      Governance: { label: 'Governance', color: '#65a30d' },
                    }}
                  >
                    <BarChart data={chartData} accessibilityLayer>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                      />
                      <Bar dataKey="Environmental" fill="#047857" radius={4} />
                      <Bar dataKey="Social" fill="#10b981" radius={4} />
                      <Bar dataKey="Governance" fill="#65a30d" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex gap-2 items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-700" />
                  ESG historical data across multiple years
                </CardFooter>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
