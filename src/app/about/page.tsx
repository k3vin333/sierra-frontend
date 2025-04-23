'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';
import LandingLayout from '../landing/layouts/LandingLayout';

export default function AboutPage() {
  return (
    <LandingLayout>
      <div className="w-full bg-[#F7EFE6] py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <Link href="/" className="inline-flex items-center text-[#004D1A] font-semibold mb-8 hover:underline group">
            <ArrowLeftIcon className="mr-2 h-5 w-5 transition transform group-hover:-translate-x-1" />
            Back to home
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#042B0B] mb-12 leading-tight">
            Our ESG <span className="text-[#004D1A]">Methodology</span>
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2>Understanding ESG Risk Exposure</h2>
                <p>
                  At Sierra, we provide ESG (Environmental, Social, Governance) risk ratings primarily based on 
                  <strong> Sustainalytics' ESG Risk Ratings</strong>, which measure a company's exposure to 
                  industry-specific material ESG risks and how well they manage those risks.
                </p>
                
                <h3>What is Sustainalytics' Approach?</h3>
                <p>
                  Sustainalytics' ESG Risk Ratings assess the degree to which a company's economic value is at risk 
                  driven by ESG factors. The rating consists of two dimensions:
                </p>
                <ul>
                  <li>
                    <strong>Exposure</strong>: A company's exposure to industry-specific ESG risks reflecting the company's 
                    vulnerability or susceptibility to ESG risks.
                  </li>
                  <li>
                    <strong>Management</strong>: A company's preparedness, disclosure, and performance on managing 
                    its ESG risk exposure.
                  </li>
                </ul>
                
                <p>
                  The ESG Risk Rating is an absolute measure, which means a company's score can be compared across 
                  industries, sectors, and regions. It uses a 0-100 scale, where a lower score is better:
                </p>
                <ul>
                  <li><strong>0-10</strong>: Negligible Risk</li>
                  <li><strong>10-20</strong>: Low Risk</li>
                  <li><strong>20-30</strong>: Medium Risk</li>
                  <li><strong>30-40</strong>: High Risk</li>
                  <li><strong>{'>'}40</strong>: Severe Risk</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-8">
              <h3 className="text-2xl font-bold text-[#042B0B] mb-4">Key Features of Sustainalytics Ratings</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#004D1A] text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</div>
                  <span>Focuses on financial materiality and risk exposure</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#004D1A] text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</div>
                  <span>Uses an absolute score (0-100 scale)</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#004D1A] text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</div>
                  <span>Combines both exposure and management dimensions</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#004D1A] text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">4</div>
                  <span>Lower scores indicate lower ESG risk</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#004D1A] text-white flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">5</div>
                  <span>Updates ratings at least annually</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#002D10] rounded-2xl shadow-xl p-12 mb-16 text-white">
            <h2 className="text-4xl font-bold mb-8">How Sustainalytics Differs From MSCI</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-semibold mb-6">Sustainalytics</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Focuses on <strong>risk exposure</strong> - how much ESG risk a company faces and how well they manage it</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Uses a <strong>0-100 scale</strong> where <strong>lower is better</strong></p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Provides <strong>absolute scores</strong> that can be compared across different industries</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Emphasizes <strong>financial materiality</strong> - focusing on ESG issues likely to impact financial performance</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-3xl font-semibold mb-6">MSCI</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Focuses on <strong>industry leadership</strong> - how a company performs relative to its industry peers</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Uses a <strong>letter rating system (AAA to CCC)</strong> where <strong>higher is better</strong></p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Provides <strong>relative scores</strong> that compare companies within the same industry</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-white mt-3 mr-3 flex-shrink-0"></div>
                    <p>Emphasizes both <strong>risks and opportunities</strong> - focusing on how ESG factors might create competitive advantages</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
} 