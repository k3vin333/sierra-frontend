import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 filter blur-[3px]">
          <Image
            src="/materials/sierra-hero-bg.svg"
            alt="Sierra Investments Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center pt-16">
        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          Sierra Investments
        </h1>
        <p className="mb-8 max-w-2xl text-xl text-white/90 md:text-2xl">
          Your trusted partner in financial growth and investment opportunities
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-lg bg-green-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-700">
            EXPLORE SIERRA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero; 