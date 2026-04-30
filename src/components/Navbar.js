import React from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/api';

export default async function Navbar() {
  const categories = await getCategories();

  return (
    <nav className="w-full glass sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex items-center justify-between h-[64px]">
        
        {/* Main Categories */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Hamburger Menu Icon */}
          <button className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 -ml-2 text-black cursor-pointer group active:scale-95">
            <div className="space-y-[4.5px]">
              <div className="w-5 h-[2px] bg-black group-hover:bg-brand-red transition-colors rounded-full"></div>
              <div className="w-4 h-[2px] bg-black group-hover:bg-brand-red transition-colors rounded-full"></div>
              <div className="w-5 h-[2px] bg-black group-hover:bg-brand-red transition-colors rounded-full"></div>
            </div>
          </button>
          
          <ul className="flex items-center space-x-7 text-black font-bold text-[15px] tracking-tight h-full">
            {categories.map((item) => (
              <li key={item.id} className="h-full flex items-center">
                <Link href={`/category/${item.slug}`} className="hover:text-brand-red transition-all duration-300 whitespace-nowrap py-[20px] border-b-[3px] border-transparent hover:border-brand-red relative top-px">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side Utilities */}
        <div className="items-center space-x-4 lg:space-x-6 text-[14px] font-bold ml-auto hidden lg:flex text-black">
          <Link href="/search" className="flex items-center gap-2 hover:text-brand-red transition-all duration-300 py-2 group">
            <span className="group-hover:text-brand-red">খুঁজুন</span>
            <div className="p-1.5 rounded-full group-hover:bg-brand-red/5 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-brand-red transition-colors">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </Link>

          <div className="w-[1.5px] h-4 bg-gray-200"></div>

          <Link href="#" className="hover:text-brand-red transition-all duration-300 py-2">
            ই-পেপার
          </Link>

          <div className="w-[1.5px] h-4 bg-gray-200"></div>

          <Link href="#" className="hover:text-brand-red transition-all duration-300 py-2 px-1 uppercase tracking-wider text-accent-blue font-extrabold">
            ENG
          </Link>

          <div className="hidden 2xl:block w-[1.5px] h-4 bg-gray-200"></div>

          <Link href="#" className="hidden 2xl:block bg-black text-white px-5 py-2 rounded-full hover:bg-brand-red transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-sm">
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}
