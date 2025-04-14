'use client';

import React from 'react';
const InformationSection = () => {
  return (
    <div className="w-full bg-[#042B0B] pt-40 pb-20">
      <div className="mx-auto max-w-[95%] px-2">
        <div className="text-center text-4xl font-bold text-[#F7EFE6] mb-8 ml-[-1540px]">
          Pillars of ESG.
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-white p-8 shadow-lg h-[300px]">
            <h3 className="mb-6 text-2xl font-semibold text-[#042B0B]">Environmental</h3>
            <p className="text-lg text-gray-700">Focuses on a company's impact on the environment, including carbon emissions, resource usage, waste management, and pollution.</p>
          </div>
          <div className="bg-white p-8 shadow-lg h-[300px]">
            <h3 className="mb-6 text-2xl font-semibold text-[#042B0B]">Social</h3>
            <p className="text-lg text-gray-700">Examines a company's relationships with employees, customers, communities, and other stakeholders, including labor practices, diversity and inclusion, and human rights.</p>
          </div>
          <div className="bg-white p-8 shadow-lg h-[300px]">
            <h3 className="mb-6 text-2xl font-semibold text-[#042B0B]">Governance</h3>
            <p className="text-lg text-gray-700">Assesses a company's leadership, board structure, executive compensation, shareholder rights, and ethical conduct.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationSection; 