import React from 'react';
import Link from 'next/link';

const PublicNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-[#042B0B] bg-[#F7EFE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo/Logo Text (removed logo for now it doesnt fit well) */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold">SIERRA</span>
          </div>

          {/* Centered Navigation Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-12">
            <Link href="/price" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Price
            </Link>
            <Link href="/" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Main
            </Link>
            <Link href="/about" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-[#042B0B] hover:bg-[#1D4023] text-white px-4 py-2 rounded-md text-sm font-medium">
              Open Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;