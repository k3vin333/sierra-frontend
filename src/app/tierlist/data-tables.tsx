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
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="p-4 bg-gray-50">
                          <h3 className="text-lg font-semibold mb-4">
                            ESG History for {ticker.toUpperCase()}
                          </h3>
                          {loadingTickers[ticker] ? (
                            <div className="flex justify-center items-center h-64">
                              <p>Loading data...</p>
                            </div>
                          ) : (
                            <ESGChart 
                              ticker={ticker} 
                              historicalData={historicalData[ticker] || []} 
                            />
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