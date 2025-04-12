'use client';

import React from 'react';

const InformationSection = () => {
  return (
    <div className="w-full bg-[#042B0B] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-6 text-white">
            <h3 className="mb-4 text-xl font-semibold">Environmental</h3>
            <p className="text-white/80">Focuses on a company's impact on the environment, including carbon emissions, resource usage, waste management, and pollution.</p>
          </div>
          <div className="rounded-lg bg-white/10 p-6 text-white">
            <h3 className="mb-4 text-xl font-semibold">Social</h3>
            <p className="text-white/80">Examines a company's relationships with employees, customers, communities, and other stakeholders, including labor practices, diversity and inclusion, and human rights.</p>
          </div>
          <div className="rounded-lg bg-white/10 p-6 text-white">
            <h3 className="mb-4 text-xl font-semibold">Governance</h3>
            <p className="text-white/80">Assesses a company's leadership, board structure, executive compensation, shareholder rights, and ethical conduct.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationSection; 