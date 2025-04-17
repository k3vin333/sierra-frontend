'use client';

import Form from 'next/form';
import Link from 'next/link';
import React from 'react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#EFDDC9] flex">
      {/* Left half - empty (will put some images here later) */}
      <div className="w-1/2"></div>
      
      {/* Right half - registration form */}
      <div className="w-1/2 flex items-center justify-center bg-[#F7EFE6]">
        <div className="max-w-md w-full p-10">
          <h1 className="text-3xl font-bold text-[#042B0B] mb-6">Create Account</h1>
          <p className="text-gray-600 mb-8">
            Already a member of SIERRA? <Link href="/login" className="font-bold">Login</Link>.
          </p>
          <Form action="/dashboard">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#042B0B] mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#042B0B] text-[#042B0B]" 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#042B0B] mb-1">Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#042B0B text-[#042B0B]" 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#042B0B] mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#042B0B] text-[#042B0B]" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[#042B0B] text-white py-2 px-4 rounded hover:bg-[#1D4023] transition-colors"
              >
                Register
              </button>
            </Form>
        </div>
      </div>
    </div>
  );
} 