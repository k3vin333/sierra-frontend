import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const PublicNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 text-white backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 pt-4">
            <Link href="/">
              <Image
                src="/materials/sierra-logo.png"
                alt="Sierra Investments Logo"
                width={150}
                height={40}
                objectFit="contain"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
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

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Open Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;