'use client';

// OCR code taken from
// https://javascript.plainenglish.io/implementing-ocr-with-tesseract-js-in-next-js-ac4143ff5218

import { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '../components/DashboardSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/useAuth';

// Use environment variable if available, otherwise use a placeholder
// In production, this should be properly configured in your deployment environment
const getFinnhubApiKey = () => {
  // For client-side code, use NEXT_PUBLIC_ prefix for environment variables
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_FINNHUB_API_KEY) {
    return process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  }
  
  // Fallback for development or if env variable is not set
  // In production, ensure the environment variable is properly set
  return 'placeholder_api_key_for_development';
};

// Define a type for portfolio items
type PortfolioItem = {
  id: string;
  ticker: string;
  name: string;
  addedAt: Date;
};

// Basic data table component
const DataTable = ({ portfolioItems }: { portfolioItems: PortfolioItem[] }) => {
  if (portfolioItems.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center text-gray-500">
        No tickers added to your portfolio yet. Click on the extracted tickers to add them.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolioItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.ticker}</TableCell>
              <TableCell>{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Move OcrReader outside the ReportsPage component
const OcrReader = ({ onAddTicker }: { onAddTicker: (ticker: string) => void }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [validatedTickers, setValidatedTickers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setOcrStatus('');
      setValidatedTickers([]);
    }
  };

  // Function to extract tickers from OCR text
  const extractTickers = async (text: string): Promise<string[]> => {
    // Split the text by lines
    const lines = text.split('\n');
    const tickers: string[] = [];
    
    // Regular expression for typical ticker symbols (2-5 uppercase letters)
    // Some tickers may have dots to indicate a region or market
    // example for australia ASX: ASX:XXX, ASX:CBA for commonwealth bank
    const tickerRegex = /^[A-Z]{2,5}(?:\.\.\.|\.)?$/;
    
    // Process each line
    for (const line of lines) {
      // Scan the entire line for potential tickers
      const words = line.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 0) {
        // Remove trailing single dot or triple dots from the first word to clean up potential ticker symbols
        // Check if it matches ticker format
        if (tickerRegex.test(words[0])) {
          tickers.push(words[0]);
        }
      }
    }

    // Now for final check, we use FINNHUB api to see if a ticker returns
    // a valid body which isnt an error, and push to tickersAreValid
    const apiKey = getFinnhubApiKey();
    const tickersAreValid: string[] = [];
    for (const ticker of tickers) {
      const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`);
      const data = await res.json();
      // Check if response is not an error and has valid data
      if (data && !data.error && Object.keys(data).length > 0) {
        tickersAreValid.push(ticker);
      }
    }
    setValidatedTickers(tickersAreValid);
    
    return tickers;
  };

  const readImageText = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setOcrStatus('Processing...');
    const worker = await createWorker('eng', 1, {
      logger: m => console.log(m), // Add logger here
    });

    try {
      const {
        data: { text },
      } = await worker.recognize(selectedImage);
      
      // Extract tickers from the OCR result
      // Note: extractTickers returns all potential tickers and also updates validatedTickers state
      // with those that pass the Finnhub API validation
      const extractedTickers = await extractTickers(text);
      console.log('All extracted tickers:', extractedTickers);
      // The UI will automatically update with validated tickers via state
      
      setOcrStatus('Completed');
    } catch (error) {
      console.error(error);
      setOcrStatus('Error occurred during processing.');
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <input type='file' accept='image/*' onChange={handleImageChange} />

      {selectedImage && (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt='Uploaded content'
          width={350}
          style={{ marginTop: 15 }}
        />
      )}

      <div style={{ marginTop: 15 }}>
        <Button 
          onClick={readImageText}
          disabled={isProcessing || !selectedImage}
          variant="outline"
        >
          {isProcessing ? 'Processing...' : 'Submit'}
        </Button>
      </div>

      <p style={{ marginTop: 14, fontWeight: 700 }}>Status:</p>
      <p>{ocrStatus}</p>
      {validatedTickers.length > 0 && (
        <div className="mt-2">
          <h3 className="font-bold">Extracted Tickers:</h3>
          <div className="flex flex-wrap gap-2">
            {validatedTickers.map((ticker) => (
              <Button 
                key={ticker} 
                variant="outline" 
                onClick={() => onAddTicker(ticker)}
                className="flex items-center gap-1"
              >
                {ticker}
                <span className="text-xs">+</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
export default function ReportsPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const { getTickers, saveTicker } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Function to load all tickers
  const loadTickers = async () => {
    setIsLoading(true);
    try {
      // Get tickers from the API
      const tickerData = await getTickers();
      
      // Map the tickers to portfolio items with company names
      const portfolioPromises = tickerData.map(async (tickerItem) => {
        const details = await fetchStockDetails(tickerItem.ticker);
        if (details) {
          return {
            ...details,
            // Convert the timestamp string to a Date
            addedAt: new Date(tickerItem.created_at)
          };
        }
        return null;
      });
      
      const resolvedPortfolioItems = await Promise.all(portfolioPromises);
      // Filter out null items and set to state
      setPortfolioItems(resolvedPortfolioItems.filter(item => item !== null) as PortfolioItem[]);
    } catch (error) {
      console.error("Failed to load tickers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stock details from API
  const fetchStockDetails = async (ticker: string): Promise<PortfolioItem | null> => {
    try {
      const apiKey = getFinnhubApiKey();
      const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`);
      const companyData = await res.json();
      
      if (!companyData.name) {
        return null;
      }
      
      return {
        id: crypto.randomUUID(),
        ticker: ticker,
        name: companyData.name,
        addedAt: new Date()
      };
    } catch (error) {
      console.error("Error fetching stock details:", error);
      return null;
    }
  };

  // Load tickers from API on component mount or when refreshTrigger changes
  useEffect(() => {
    loadTickers();
  }, [getTickers, refreshTrigger]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddTicker = async (ticker: string) => {
    // Check if ticker already exists in portfolio
    if (portfolioItems.some(item => item.ticker === ticker)) {
      setNotification({
        message: `${ticker} is already in your portfolio`,
        type: 'error'
      });
      return;
    }

    const stockDetails = await fetchStockDetails(ticker);
    
    if (stockDetails) {
      try {
        // Save ticker to the API
        const result = await saveTicker(ticker);
        
        if (result.success) {
          // Show success notification
          setNotification({
            message: `Added ${ticker} to your portfolio`,
            type: 'success'
          });
          
          // Refresh the entire portfolio list
          setRefreshTrigger(prev => prev + 1);
        } else {
          // Only show error notification if it's actually an error
          setNotification({
            message: `Failed to add ${ticker}: ${result.message}`,
            type: 'error'
          });
        }
      } catch (error) {
        setNotification({
          message: `Error adding ${ticker}`,
          type: 'error'
        });
        
        // Use type assertion to access properties of the error object
        const err = error as any;
        console.error("Error saving ticker:", err?.message || "Unknown error");
      }
    } else {
      setNotification({
        message: `Could not find data for ${ticker}`,
        type: 'error'
      });
    }
  };

  return (
    <ProtectedRoute delayRender={true}>
      <div className="min-h-screen flex bg-[#F7EFE6]">
        <DashboardSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-[#042B0B] mb-6">Import your portfolio</h1>
          
          {/* Notification toast */}
          {notification && (
            <div className={`mb-4 p-3 rounded-md ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {notification.message}
            </div>
          )}
          
          <div className="flex w-full h-full">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/2 h-1/2 mr-3">
              <OcrReader onAddTicker={handleAddTicker} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md w-1/2 h-1/2 ml-3">
              <h2 className="text-xl font-bold text-[#042B0B] mb-4">Your Portfolio</h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  Loading your portfolio...
                </div>
              ) : (
                <DataTable portfolioItems={portfolioItems} />
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}