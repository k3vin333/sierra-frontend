import React from 'react';
import Image from 'next/image';
import GlobeComponent from './Globe';

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background SVG with blur */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 filter blur-[2px]">
            <Image
              src="/materials/sierra-hero-bg.svg"
              alt="Sierra Investments Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Globe */}
        <GlobeComponent />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Sierra Investments
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-white/90 md:text-2xl">
          All in one platform to choose
          analyze and compare companies
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700">
              EXPLORE SIERRA
            </button>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="w-full bg-[#07100D] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-6 text-white">
              <h3 className="mb-4 text-xl font-semibold">Environment</h3>
              <p className="text-white/80">add stuff here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 