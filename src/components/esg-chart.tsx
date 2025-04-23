"use client"

import { AreaChart, Area, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ESGRecord = {
  timestamp: string
  environmental_score: number
  social_score: number
  governance_score: number
}

export function ESGChart({ ticker, historicalData }: { 
  ticker: string 
  historicalData: ESGRecord[] 
}) {
  if (!historicalData?.length) {
    return <p className="text-sm text-red-500">No ESG data found for {ticker}</p>
  }

  const chartData = historicalData.map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString("en-AU", {
      month: "short",
      year: "2-digit",
    }),
    Environmental: entry.environmental_score ?? 0,
    Social: entry.social_score ?? 0,
    Governance: entry.governance_score ?? 0,
  })).reverse()

  return (
    <ChartContainer
      config={{
        Environmental: { label: "Environmental", color: "#047857" },
        Social: { label: "Social", color: "#10b981" },
        Governance: { label: "Governance", color: "#65a30d" },
      }}
      className="w-full h-[300px] overflow-hidden"
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12, top: 12 }}
        width={800}
        height={300}
        className="w-full"
        style={{ maxWidth: "100%" }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="Environmental"
          type="monotone"
          fill="#bbf7d0"
          fillOpacity={0.3}
          stroke="#047857"
          strokeWidth={2}
        />
        <Area
          dataKey="Social"
          type="monotone"
          fill="#6ee7b7"
          fillOpacity={0.4}
          stroke="#10b981"
          strokeWidth={2}
        />
        <Area
          dataKey="Governance"
          type="monotone"
          fill="#d9f99d"
          fillOpacity={0.4}
          stroke="#65a30d"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}