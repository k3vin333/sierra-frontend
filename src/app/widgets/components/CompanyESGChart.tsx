"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Search } from "lucide-react"
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type ESGRecord = {
  timestamp: string
  environmental_score: number
  social_score: number
  governance_score: number
}

export default function CompanyESGChart() {
  const [ticker, setTicker] = useState("")
  const [inputValue, setInputValue] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    if (!ticker) return;
    async function fetchData() {
      setError("")
      try {
        const res = await fetch(`/api/esg?ticker=${ticker}`)
        const data = await res.json()

        if (!data?.historical_ratings?.length) {
          setError("No ESG data found for this ticker.")
          setChartData([])
          return
        }

        const transformed = data.historical_ratings.map((entry: ESGRecord) => ({
          date: new Date(entry.timestamp).toLocaleDateString("en-AU", {
            month: "short",
            year: "2-digit",
          }),
          Environmental: entry.environmental_score ?? 0,
          Social: entry.social_score ?? 0,
          Governance: entry.governance_score ?? 0,
        }))

        setChartData(transformed.reverse())
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.log(err);
        setError("Error fetching data. Please try again.")
        setChartData([])
      }
    }

    fetchData()
  }, [ticker])

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      setTicker(inputValue.trim().toUpperCase())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>ESG Score Trends</CardTitle>
            <CardDescription>Search ESG scores by ticker symbol</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. AAPL"
              className="w-full sm:w-32"
            />
            <Button onClick={handleSearch} variant="outline" size="sm">
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
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
        )}
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none">
              Stable ESG performance <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Historical data since 2020</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
