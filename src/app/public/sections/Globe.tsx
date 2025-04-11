'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const GlobeComponent = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = globeRef.current;
    if (!currentRef) return;

    // Import globe.gl component
    import('globe.gl').then(({ default: Globe }) => {
      // Initialize the globe
      const globe = new Globe(currentRef)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('#042B0B')
        .atmosphereAltitude(0.3)
        .showGlobe(true)
        .showAtmosphere(true)
        .backgroundColor('rgba(0,0,0,0)')
        .width(currentRef.clientWidth)
        .height(currentRef.clientHeight);

      // Auto-rotation settings (0 = slowest, 1 = fastest)
      // Also allows users to manuall interact
      const controls = globe.controls();
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      
      // Damping makes globe rotate smoothly
      // dampingFactor controls how quickly the rotation slows down (0.05 = smooth, gradual stop)
      // example: user releases mouse button, globe continues to rotate for a bit
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Set camera position
      globe.pointOfView({ altitude: 2.5 });
      // Handle window resize
      const handleResize = () => {
        if (currentRef) {
          globe.width(currentRef.clientWidth)
            .height(currentRef.clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        globe._destructor();
      };
    });
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-0"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        duration: 1.2,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div 
        ref={globeRef} 
        className="w-full h-full"
        style={{
          filter: 'brightness(1.4)'
        }}
      />
    </motion.div>
  );
};

export default dynamic(() => Promise.resolve(GlobeComponent), {
  ssr: false
}); 