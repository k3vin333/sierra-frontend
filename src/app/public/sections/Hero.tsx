import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background SVG with blur */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 filter">
            <Image
              src="/materials/sierra-hero-bg.svg"
              alt="Sierra Investments Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center pt-16">
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
            Sierra Investments
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-white/90 md:text-2xl">
            Your trusted partner in financial growth and investment opportunities
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700">
              Get Started
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="w-full bg-[#07100D] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/5 p-6 text-white">
              <h3 className="mb-4 text-xl font-semibold">Environmental</h3>
              <p className="text-white/80">add details here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 