'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlobeComponent from './Globe';

const Hero = () => {
  // Split the sub-headline into words for staggered animation
  const subHeadlineWords = "All in one platform to choose analyze and compare companies.".split(" ");

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center bg-[#F7EFE6] text-[#042B0B]">
        {/* Content - Left aligned from the start */}
        {/* 
          This motion.div creates a sliding animation for the hero content:
          - Starts at x: 0
          - Slides -400px to the left after 1.5s delay
          - Uses a easing curve for smoother animation
        */}
        <motion.div 
          className="relative z-10 flex flex-col items-start text-left px-4 py-20 max-w-6xl mx-auto"
          style={{ width: '100%', paddingLeft: '10%' }}
          initial={{ x: 0 }}
          animate={{ x: '-400px' }}
          transition={{ 
            duration: 1.2,
            ease: [0.76, 0, 0.24, 1],
            delay: 1.75
          }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Investing for the planet.
          </motion.h1>
          
          <div className="mb-12 text-xl md:text-2xl max-w-2xl">
            {subHeadlineWords.map((word, index) => (
              <motion.span 
                key={index}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 2.5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.2 + (index * 0.05)
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          
          <motion.button 
            className="rounded-lg bg-[#042B0B] px-8 py-3 text-lg font-semibold text-[#F7EFE6] hover:bg-[#1D4023]"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6,
              ease: "easeOut",
              delay: 0.6
            }}
          >
            Explore Sierra
          </motion.button>
        </motion.div>

        {/* Globe */}
        <motion.div 
          className="absolute top-0 right-0 bottom-0 w-3/5"
          style={{ right: '-5%' }}
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 1.4,
            ease: [0.76, 0, 0.24, 1],
            delay: 1.4
          }}
        >
          <GlobeComponent />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 