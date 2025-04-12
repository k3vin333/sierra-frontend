'use client';

import React from 'react';
import Image from 'next/image';

const CompanyCards = () => {
  const companies = [
    {
      name: 'Amazon',
      domain: 'amazon.com',
      esgScore: 'endpoint',
      metrics: {
        environmental: '<Placeholder>',
        social: '<Placeholder>',
        governance: '<Placeholder>'
      }
    },
    {
      name: 'Apple',
      domain: 'apple.com',
      esgScore: 'endpoint',
      metrics: {
        environmental: '<Placeholder>',
        social: '<Placeholder>',
        governance: '<Placeholder>'
      }
    },
    {
      name: 'Google',
      domain: 'google.com',
      esgScore: 'endpoint',
      metrics: {
        environmental: '<Placeholder>',
        social: '<Placeholder>',
        governance: '<Placeholder>'
      }
    },
    {
      name: 'Microsoft',
      domain: 'microsoft.com',
      esgScore: 'endpoint',
      metrics: {
        environmental: '<Placeholder>',
        social: '<Placeholder>',
        governance: '<Placeholder>'
      }
    }
  ];

  // Function to get logo URL via our secure API route
  const getLogoUrl = (domain: string) => {
    return `/api/logo?domain=${encodeURIComponent(domain)}`;
  };

  return (
    <div className="w-full bg-[#F7EFE6] py-20 min-h-screen">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#042B0B] mb-12 text-center">
          Featured Companies
        </h2>
        <p className="text-center text-[#042B0B] mb-12">
          Using Sustainalytics ESG risk methodology for comprehensive sustainability assessment
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companies.map((company) => (
            <div
              key={company.name}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="relative h-10 w-24">
                  <Image 
                    src={getLogoUrl(company.domain)}
                    alt={`${company.name} logo`}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'left' }}
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                </div>
                <div className="text-2xl font-bold text-[#042B0B]">
                  {company.esgScore}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#042B0B] mb-4">
                {company.name}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Environmental</span>
                  <span className="font-semibold text-[#042B0B]">{company.metrics.environmental}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Social</span>
                  <span className="font-semibold text-[#042B0B]">{company.metrics.social}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Governance</span>
                  <span className="font-semibold text-[#042B0B]">{company.metrics.governance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyCards; 