import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="w-full bg-white border-b border-brand-gray py-6">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex flex-col items-center mx-auto lg:mx-0">
          <Link href="/" className="shrink-0 flex items-center gap-2 mb-1 group">
            <div className="flex items-center text-[2.8rem] lg:text-[3.2rem] font-serif font-black tracking-tighter transition-transform duration-500 group-hover:scale-[1.02]">
              <span className="text-foreground">সময়ের</span>
              <span className="text-brand-red ml-2 relative">
                ঘটনা
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-brand-red group-hover:w-full transition-all duration-500 rounded-full"></span>
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-text-muted font-bold font-sans uppercase tracking-[0.25em] mt-1 bg-gray-50 px-4 py-1 rounded-full border border-brand-gray">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {new Date().toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {user?.role === "ADMIN" || user?.role === "EDITOR" ? (
              <Link href="/admin" className="text-[10px] font-black text-text-muted hover:text-brand-red border border-brand-gray px-4 py-2 rounded-full transition-all hover:bg-gray-50 shadow-sm active:scale-95 uppercase tracking-widest">
                ADMIN PANEL
              </Link>
            ) : null}
            <div className="w-[1.5px] h-6 bg-gray-100"></div>
            <Link href="/search" className="text-text-dim hover:text-brand-red transition-all duration-300 p-2 hover:bg-brand-red/5 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </Link>
          </div>
          <Link href={user ? "/bookmarks" : "/login"} className="bg-foreground text-white px-7 py-2.5 rounded-full text-sm font-black hover:bg-brand-red transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-brand-red/20 transform hover:scale-[1.02] active:scale-95">
            {user ? "ACCOUNT" : "লগইন"}
          </Link>
        </div>
      </div>
    </header>
  );
}
