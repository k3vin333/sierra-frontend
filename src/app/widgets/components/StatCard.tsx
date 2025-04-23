'use client';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { cn } from '@/lib/utils';
import {
  MoreVertical,
//   TrendingDown,
//   TrendingUp,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { motion, useMotionValue, animate } from 'framer-motion';

type ChartDataPoint = {
  date: string;
  value: number;
};

type StatCardProps = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  chartData: ChartDataPoint[];
  chartColor: string;
  gradient: string;
  menuItems?: {
    label: string;
    onClick: () => void;
  }[];
};

function lightenHexColor(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
  const toHex = (n: number): string => (n.toString(16).padStart(2, '0'));
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function StatCard({
  title,
  value,
  prefix = '',
  suffix = '',
  icon,
  chartData,
  chartColor,
  gradient,
  menuItems,
}: StatCardProps) {
//   const isPositive = change >= 0;
//   const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  const menuRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const motionValue = useMotionValue(0);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 4.0,
      onUpdate: (v) => setAnimatedValue(v),
    });
    return () => controls.stop();
  }, [value]);

  const dateFormatter = useCallback((date: string) => {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const valueFormatter = useCallback(
    (v: number): string => {
      const formatted = new Intl.NumberFormat('en-US', {
        notation: 'compact',
      }).format(v);
      return suffix ? `${formatted}${suffix}` : prefix ? `${prefix}${formatted}` : formatted;
    },
    [prefix, suffix]
  );

  return (
    <motion.div
      className="relative w-full h-[200px] [perspective:1200px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => !isDropdownOpen && setIsFlipped(false)}
    >
      {/* FRONT */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <Card className={`w-full h-full overflow-hidden bg-gradient-to-br ${gradient}`}>
          <CardContent className="p-4 md:p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white bg-opacity-20 text-gray-200 rounded-full">
                  {icon}
                </div>
                <span className="text-lg uppercase font-medium text-white">{title}</span>
              </div>
            </div>
            <div className="flex-grow flex items-center justify-start">
              <span className="text-4xl font-bold text-white">
                {prefix}
                {animatedValue.toFixed(suffix ? 1 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                {suffix}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* BACK */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={{ duration: 0.6 }}
        style={{ backfaceVisibility: 'hidden', rotateY: '180deg' }}
      >
        <Card className={`w-full h-full overflow-hidden bg-gradient-to-br ${gradient}`}>
          <CardContent className="p-4 flex flex-col h-full justify-between">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-white uppercase">{title} Trend</h3>
              {menuItems && (
                <div ref={menuRef}>
                  <DropdownMenu onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {menuItems.map((item) => (
                        <DropdownMenuItem key={item.label} onClick={item.onClick}>
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            <ChartContainer
              config={{
                value: {
                  color: chartColor,
                  label: title,
                },
              }}
              className="aspect-auto h-[calc(100%-2rem)] w-full [&_.recharts-cartesian-axis-tick_text]:!fill-white"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={lightenHexColor(chartColor, 20)}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={dateFormatter}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  tickFormatter={valueFormatter}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator="dashed"
                      labelFormatter={dateFormatter}
                    />
                  }
                />
                <Bar
                  type="monotone"
                  dataKey="value"
                  stroke={lightenHexColor(chartColor, 50)}
                  strokeWidth={0.5}
                  fill={chartColor}
                  name={title}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
