'use client';

import React from 'react';
import { ChevronRightIcon, ArrowRightIcon } from 'lucide-react';

const InformationSection = () => {
  return (
    <div className="w-full bg-[#F7EFE6] py-24">
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Large headline with impact statement */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#042B0B] mb-6 leading-tight">
            A healthier society <br />
            starts with better <br />
            <span className="text-[#004D1A]">information.</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl">
            We believe that understanding the environmental, social, and governance factors 
            of companies is essential for building a more sustainable future.
          </p>
          <a href="/about" className="inline-flex items-center text-[#004D1A] font-semibold text-lg hover:underline group">
            Learn about our methodology
            <ArrowRightIcon className="ml-2 h-5 w-5 transition transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-8">
          <div className="bg-[#002D10] rounded-2xl shadow-xl p-10 px-12 md:px-16 relative overflow-hidden">
            <h3 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-8">
              Environmental
            </h3>
            <p className="text-[#F2F2F2] text-lg leading-relaxed mb-6">
              Focuses on a company's impact on the environment, including carbon
              emissions, resource usage, waste management, and pollution.
            </p>
            <ul className="text-[#F2F2F2] space-y-2">
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Climate change initiatives</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Resource conservation</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Pollution prevention</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#002D10] rounded-2xl shadow-xl p-10 px-12 md:px-16 relative overflow-hidden">
            <h3 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-8">
              Social
            </h3>
            <p className="text-[#F2F2F2] text-lg leading-relaxed mb-6">
              Examines a company's relationships with employees, customers,
              communities, and other stakeholders, including labor practices.
            </p>
            <ul className="text-[#F2F2F2] space-y-2">
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Diversity and inclusion</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Human rights</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Community relations</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#002D10] rounded-2xl shadow-xl p-10 px-12 md:px-16 relative overflow-hidden">
            <h3 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-8">
              Governance
            </h3>
            <p className="text-[#F2F2F2] text-lg leading-relaxed mb-6">
              Assesses a company's leadership, board structure, executive
              compensation, shareholder rights, and ethical conduct.
            </p>
            <ul className="text-[#F2F2F2] space-y-2 mt-12">
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Board diversity</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Executive compensation</span>
              </li>
              <li className="flex items-start">
                <ChevronRightIcon className="h-5 w-5 text-green-300 mr-2 mt-1 flex-shrink-0" />
                <span>Business ethics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationSection; 