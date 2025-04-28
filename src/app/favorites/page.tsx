'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import { useAuth } from '@/context/useAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface CompanyTicker {
  ticker: string;
  created_at: string;
}

export default function FavoritesPage() {
  const { getTickers, saveTicker } = useAuth();
  const [tickers, setTickers] = useState<CompanyTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicker, setNewTicker] = useState('');
  const [addingTicker, setAddingTicker] = useState(false);
  const [error, setError] = useState('');

  // Load tickers
  useEffect(() => {
    const loadTickers = async () => {
      setLoading(true);
      try {
        const data = await getTickers();
        if (Array.isArray(data)) {
          setTickers(data);
        }
      } catch (error) {
        console.error("Error loading tickers:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTickers();
  }, [getTickers]);

  // Function to handle adding a new ticker
  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }
    
    const tickerSymbol = newTicker.trim().toUpperCase();
    
    // Check if ticker already exists
    if (tickers.some(t => t.ticker.toUpperCase() === tickerSymbol)) {
      setError('This ticker is already in your favorites');
      return;
    }
    
    setAddingTicker(true);
    setError('');
    
    try {
      const result = await saveTicker(tickerSymbol);
      
      if (result.success) {
        // Add to local state
        const newTickerObj: CompanyTicker = {
          ticker: tickerSymbol,
          created_at: new Date().toISOString()
        };
        
        setTickers(prev => [...prev, newTickerObj]);
        setNewTicker('');
      } else {
        setError(result.message || 'Failed to add ticker');
      }
    } catch (error) {
      console.error("Error adding ticker:", error);
      setError('Failed to add ticker. Please try again.');
    } finally {
      setAddingTicker(false);
    }
  };

  // This would be implemented in a real application
  const handleDeleteTicker = (ticker: string) => {
    console.log(`Delete ticker ${ticker} (not implemented)`);
    // For now we'll just show the intention in the console
  };

  return (
    <ProtectedRoute delayRender={true}>
      <div className="min-h-screen flex bg-[#F7EFE6]">
        <div className="w-64">
          <DashboardSidebar />
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-[#042B0B] mb-6">Your Favorites</h1>
          
          {/* Add ticker form */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#042B0B] mb-4">Add New Company</h2>
            <form onSubmit={handleAddTicker} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="text"
                placeholder="Enter ticker symbol (e.g., AAPL)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={addingTicker}
                className="bg-[#042B0B] hover:bg-[#0a3c14]"
              >
                {addingTicker ? 'Adding...' : 'Add to Favorites'}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </Card>
          
          {/* Tickers table */}
          {loading ? (
            <div className="bg-white p-8 rounded-xl shadow-sm flex items-center justify-center h-64">
              <p className="text-[#042B0B] text-lg font-medium">
                Loading your favorites...
              </p>
            </div>
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-[#042B0B] mb-4">Favorite Companies</h2>
              
              {tickers.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <p className="mb-2">You haven't added any companies to your favorites yet.</p>
                  <p>Use the form above to add companies by their ticker symbol.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Added Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickers.map((ticker) => (
                        <TableRow key={ticker.ticker}>
                          <TableCell className="font-medium">
                            <a 
                              href={`/report/${ticker.ticker.toLowerCase()}`}
                              className="text-blue-600 hover:underline"
                            >
                              {ticker.ticker.toUpperCase()}
                            </a>
                          </TableCell>
                          <TableCell>
                            {new Date(ticker.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteTicker(ticker.ticker)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
} 