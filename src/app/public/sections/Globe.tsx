'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GlobeComponent = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      
      setIsLoading(false);

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
    <div 
      ref={globeRef} 
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      style={{ 
        position: 'absolute',
        backgroundColor: 'transparent',
        pointerEvents: 'auto',
        // Its too dark without this
        filter: 'brightness(1.5)',
      }}
    />
  );
};

export default dynamic(() => Promise.resolve(GlobeComponent), {
  ssr: false
}); 