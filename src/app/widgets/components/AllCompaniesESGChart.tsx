'use client';

import { useEffect, useRef, useState } from 'react';
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
import { Button } from '@/components/ui/button';

type RawEntry = {
  company_name: string;
  ticker: string;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  timestamp: string;
};

type ChartDataPoint = {
  date: string;
  Environmental: number;
  Social: number;
  Governance: number;
};

export default function AllCompaniesESGChart() {
  const [groupedData, setGroupedData] = useState<Record<string, ChartDataPoint[]>>({});
  const [page, setPage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const pageSize = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/all-companies');
        const json = await res.json();
        const raw: RawEntry[] = json.data;

        const grouped: Record<string, ChartDataPoint[]> = {};

        raw.forEach((entry) => {
          const key = `${entry.company_name}::${entry.ticker.toUpperCase()}`;

          if (!grouped[key]) grouped[key] = [];

          grouped[key].push({
            date: new Date(entry.timestamp).toLocaleDateString('en-AU', {
              year: '2-digit',
              month: 'short',
            }),
            Environmental: entry.environmental_score,
            Social: entry.social_score,
            Governance: entry.governance_score,
          });
        });

        // Sort and remove all-zero data companies
        Object.entries(grouped).forEach(([key, entries]) => {
          entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          const allZero = entries.every(
            (e) => e.Environmental === 0 && e.Social === 0 && e.Governance === 0
          );

          if (allZero) delete grouped[key];
        });

        setGroupedData(grouped);
      } catch (error) {
        console.error('Failed to fetch all companies', error);
      }
    }

    fetchData();
  }, []);

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
          ESG Score Evolution (All Companies)
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
          {currentSlice.map(([key, chartData]) => {
            const [companyName, ticker] = key.split('::');

            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle>
                    {companyName} ({ticker})
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
                  ESG data from 2020–2025
                </CardFooter>
              </Card>
            );
          })}

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
