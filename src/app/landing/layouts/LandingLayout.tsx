import React from 'react';
import PublicNavbar from '../components/PublicNavbar';

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default LandingLayout; 