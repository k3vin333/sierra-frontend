"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// Follow the format of our backend data:
// company_name: "The Interpublic Group of Companies, Inc.",
// social_score: 5,
// ticker: "ipg",
// rating: "A",
// environmental_score: 0,
// timestamp: "2025-03-01",
// governance_score: 3,
// total_score: 8,
// last_processed_date: "2025-03-27"
export type ESGData = {
  company_name: string
  social_score: number
  ticker: string
  rating: string
  environmental_score: number
  timestamp: string
  governance_score: number
  total_score: number
  last_processed_date: string
}

export const columns: ColumnDef<ESGData>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return (
        <button
          {...{
            onClick: row.getToggleExpandedHandler(),
            style: { cursor: 'pointer' },
          }}
        >
          {row.getIsExpanded() ? '▼' : '▶'}
        </button>
      )
    },
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
  },
  {
    accessorKey: "ticker",
    header: "Ticker",
    cell: ({ row }) => {
      const ticker: string = row.getValue("ticker");
      return <div className="text-center font-medium">{ticker.toUpperCase()}</div>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("rating")}</div>;
    },
  },
  {
    accessorKey: "environmental_score",
    header: "Environmental",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("environmental_score")}</div>;
    },
  },
  {
    accessorKey: "social_score",
    header: "Social",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("social_score")}</div>;
    },
  },
  {
    accessorKey: "governance_score",
    header: "Governance",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("governance_score")}</div>;
    },
  },
  {
    accessorKey: "total_score",
    header: "Total Score",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("total_score")}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));
      return <div className="text-center">{date.toLocaleDateString()}</div>;
    },
  },
]
