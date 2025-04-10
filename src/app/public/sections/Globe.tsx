'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const GlobeComponent = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = globeRef.current;
    if (!currentRef) return;

    // Dynamically import the Globe
    import('globe.gl').then(({ default: Globe }) => {
      // Initialize the globe
      const globe = new Globe(currentRef)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .atmosphereColor('#07100D')
        .atmosphereAltitude(0.2)
        .pointColor(() => '#ffcb21')
        .pointsData([{ lat: 0, lng: 0, size: 0.1 }])
        .pointAltitude(0)
        .pointRadius(0.5)
        .pointsMerge(true)
        .width(currentRef.clientWidth)
        .height(currentRef.clientHeight);

      // Add auto-rotation
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.5;

      // Initial camera position (zoomed in)
      globe.pointOfView({ altitude: 1 });
      
      // Animate to final position
      setTimeout(() => {
        globe.pointOfView({ altitude: 2.5 }, 1500);
      }, 100);

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
      className="absolute inset-0 w-full h-full"
      style={{ 
        position: 'absolute',
        zIndex: 0,
        opacity: 0.5,
        transform: 'scale(3)',
        animation: 'zoomOut 2s ease-out forwards',
      }}
    />
  );
};

export default dynamic(() => Promise.resolve(GlobeComponent), {
  ssr: false
}); 