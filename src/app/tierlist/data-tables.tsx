"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  ExpandedState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import React, { useState } from "react"
import { ESGChart } from "@/components/esg-chart"

interface DataTableProps<TData extends { ticker: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends { ticker: string }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [historicalData, setHistoricalData] = useState<Record<string, any>>({})
  const [loadingTickers, setLoadingTickers] = useState<Record<string, boolean>>({})

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: () => [],
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })


  const fetchHistoricalData = async (ticker: string) => {
    if (historicalData[ticker] || loadingTickers[ticker]) return
    
    setLoadingTickers(prev => ({ ...prev, [ticker]: true }))
    
    try {
      const response = await fetch(`/api/esg?ticker=${ticker.toLowerCase()}`)
      const data = await response.json()
      
      setHistoricalData(prev => ({
        ...prev,
        [ticker]: data.historical_ratings || []
      }))
    } catch (error) {
      console.error('Error fetching historical data:', error)
    } finally {
      setLoadingTickers(prev => ({ ...prev, [ticker]: false }))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
        {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isExpanded = row.getIsExpanded()
              const ticker = row.original.ticker

              if (isExpanded) {
                fetchHistoricalData(ticker)
              }

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => row.toggleExpanded()}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>
                        <div className="p-4">
                          {historicalData[ticker] ? (
                            <div className="h-64">
                              <h3 className="text-lg font-semibold mb-2">Historical ESG Data for {ticker.toUpperCase()}</h3>
                              <div className="w-full h-48">
                                {/* Place chart here.*/}
                                <HistoricalChart data={historicalData[ticker]} />
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">Loading historical data...</div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}


// Simple chart Idk how to make an actual chart so this is gonna do
function HistoricalChart({ data }: { data: any }) {
  const historicalPoints = Array.isArray(data) ? data : [];
  
  return (
    <div className="relative w-full h-full">
      <div className="flex items-end h-40 border-b border-l border-gray-300">
        {historicalPoints.map((point, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-4 bg-blue-500 rounded-t hover:bg-blue-600"
              style={{ height: `${(point.total_score / 20) * 100}%` }}
              title={`Score: ${point.total_score}`}
            />
            <div className="text-xs mt-1">
              {new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short' })}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-2 text-sm font-medium">
        Historical ESG Scores
      </div>
    </div>
  )
}