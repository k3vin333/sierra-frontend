'use client';

// OCR code taken from
// https://javascript.plainenglish.io/implementing-ocr-with-tesseract-js-in-next-js-ac4143ff5218

import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from '../components/DashboardSidebar';

const API_KEY = 'cvt6ephr01qhup0ui9v0cvt6ephr01qhup0ui9vg';

const OcrReader = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>('');
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [extractedTickers, setExtractedTickers] = useState<string[]>([]);
  const [validatedTickers, setValidatedTickers] = useState<string[]>([]);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setOcrResult(''); // Reset OCR result
      setOcrStatus(''); // Reset status
      setExtractedTickers([]);
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
    const tickersAreValid: string[] = [];
    for (const ticker of tickers) {
      const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${API_KEY}`);
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

    setOcrStatus('Processing...');
    const worker = await createWorker('eng', 1, {
      logger: m => console.log(m), // Add logger here
    });

    try {
      const {
        data: { text },
      } = await worker.recognize(selectedImage);

      setOcrResult(text);
      
      // Extract tickers from the OCR result
      const tickers = extractTickers(text);
      setExtractedTickers(await tickers);
      
      setOcrStatus('Completed');
    } catch (error) {
      console.error(error);
      setOcrStatus('Error occurred during processing.');
    } finally {
      await worker.terminate();
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
        <button
          onClick={readImageText}
          style={{
            background: '#FFFFFF',
            borderRadius: 7,
            color: '#000000',
            padding: 5,
          }}
        >
          Submit
        </button>
      </div>

      <p style={{ marginTop: 20, fontWeight: 700 }}>Status:</p>
      <p>{ocrStatus}</p>
      <h3 style={{ marginTop: 10, fontWeight: 700 }}>Extracted Tickers:</h3>
      {validatedTickers.length > 0 && (
        <p>{validatedTickers.join(', ')}</p>
      )}
    </div>
  );
};

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-[#F7EFE6]">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col p-8">
          <h1 className="text-2xl font-bold text-[#042B0B] mb-6">Import your portfolio</h1>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl">
            <OcrReader />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
  