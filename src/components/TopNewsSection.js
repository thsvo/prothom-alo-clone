import React from 'react';
import Link from 'next/link';
import { getPosts, getCategories } from '@/lib/api';

export default async function TopNewsSection() {
  // Fetch posts with priority logic
  // 1. Get Top Story with Order 1 (Center news)
  const topStories = await getPosts({ section: 'top', limit: 10 });
  const centerNews =
    topStories.find((p) => p.order === 1) ||
    (topStories.length > 0 ? topStories[0] : null);
  
  // 2. Get Sorbosesh (Latest)
  const sorboseshPosts = await getPosts({ section: 'sorbosesh', limit: 5 });
  
  // 3. Get normal posts for left column
  const leftColumnPosts = await getPosts({ section: 'standard', limit: 3 });

  // 4. Get Live news
  const liveNews = await getPosts({ section: 'live', limit: 1 });

  const centerNewsWithFallback = centerNews || (leftColumnPosts.length > 0 ? leftColumnPosts[0] : null);

  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-7xl pt-10 pb-16">
      {/* Live News Ticker */}
      {liveNews.length > 0 && (
        <div className="mb-10 bg-white border border-brand-gray p-1.5 flex items-center gap-4 rounded-full shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] overflow-hidden pr-6 group">
          <div className="bg-brand-red text-white text-[11px] font-black px-4 py-1.5 rounded-full animate-pulse tracking-widest flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </div>
          <Link href={`/post/${liveNews[0].slug}`} className="font-bold text-foreground hover:text-brand-red transition-all duration-300 text-[16px] truncate group-hover:translate-x-1">
            {liveNews[0].title}
          </Link>
          <div className="ml-auto flex items-center gap-1 text-brand-red font-bold text-xs shrink-0">
            সব দেখুন
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        
        {/* Left Column - Secondary News */}
        <div className="lg:col-span-3 flex flex-col gap-8 w-full">
          {leftColumnPosts.map((post, idx) => (
            <Link href={`/post/${post.slug}`} key={post.id || idx} className="flex flex-col gap-4 group cursor-pointer border-b border-brand-gray pb-8 last:border-0 hover:translate-y-[-2px] transition-all duration-300">
              <h3 className="text-[1.4rem] font-bold font-serif leading-[1.35] group-hover:text-brand-red transition-colors text-foreground text-balance">
                {post.title}
              </h3>
              {idx === 0 && post.featuredImage ? (
                <div className="w-full aspect-video bg-gray-50 overflow-hidden border border-brand-gray rounded-2xl shadow-sm">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                </div>
              ) : null}
              {idx === 0 && (
                 <p className="text-text-dim text-[15px] line-clamp-3 leading-relaxed mt-1 font-medium">
                   {post.excerpt}
                 </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gray"></span>
                <span className="text-[12px] text-text-muted font-bold tracking-tight uppercase">
                  {post.createdAt ? new Date(post.createdAt).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: 'numeric' }) : '১ ঘণ্টা'} আগে
                </span>
              </div>
            </Link>
          ))}
          {leftColumnPosts.length === 0 && (
            <div className="p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
               <p className="text-text-muted text-sm italic font-medium">সাধারণ সংবাদ নেই</p>
            </div>
          )}
        </div>

        {/* Center Column - Main Headline (Order 1) */}
        <div className="lg:col-span-6 flex flex-col w-full relative">
          {centerNewsWithFallback ? (
            <Link href={`/post/${centerNewsWithFallback.slug}`} className="group cursor-pointer">
              <h1 className="text-[2.8rem] font-black font-serif leading-[1.15] mb-6 group-hover:text-brand-red transition-colors text-foreground text-balance tracking-tight">
                {centerNewsWithFallback.title}
              </h1>
              <div className="w-full aspect-16/10 bg-gray-50 mb-7 relative overflow-hidden flex items-center justify-center border border-brand-gray rounded-3xl shadow-premium group-hover:shadow-2xl transition-all duration-500">
                 {centerNewsWithFallback.featuredImage ? (
                   <>
                    <img src={centerNewsWithFallback.featuredImage} alt={centerNewsWithFallback.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center gap-3 text-gray-300">
                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                       <span className="text-3xl">🖼️</span>
                     </div>
                     <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">চিত্র নেই</span>
                   </div>
                 )}
              </div>
              <p className="text-[19px] text-text-dim leading-[1.6] font-medium">
                {centerNewsWithFallback.excerpt}
              </p>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-brand-gray">
                <span className="text-xs text-text-muted font-bold tracking-wider uppercase font-sans">
                  {centerNewsWithFallback.createdAt ? new Date(centerNewsWithFallback.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </span>
                <div className="flex items-center gap-2 text-brand-red font-black text-sm uppercase tracking-tighter group-hover:gap-3 transition-all">
                  পুরোটা পড়ুন
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center gap-6">
               <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center text-gray-200 text-4xl">📰</div>
               <div className="space-y-2">
                 <p className="text-text-dim font-bold text-lg">প্রধান সংবাদ সেট করা হয়নি</p>
                 <p className="text-text-muted text-sm">ড্যাশবোর্ড থেকে একটি সংবাদকে Order 1 হিসেবে সেট করুন</p>
               </div>
               <Link href="/admin/posts/new" className="bg-brand-red text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-brand-red/20 hover:scale-105 active:scale-95 transition-all">নতুন খবর যোগ করুন</Link>
            </div>
          )}
        </div>

        {/* Right Column - Sorbosesh (Latest) */}
        <div className="lg:col-span-3 flex flex-col gap-6 w-full relative">
          <div className="bg-white rounded-[2rem] border border-brand-gray shadow-premium overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-brand-gray bg-gray-50/50">
                 <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse"></div>
                    <h2 className="text-[1.1rem] font-black text-foreground leading-none uppercase tracking-tight">সর্বশেষ সংবাদ</h2>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white border border-brand-gray flex items-center justify-center shadow-sm">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-red"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                 </div>
              </div>
              
              <div className="flex flex-col">
                 {sorboseshPosts.map((post, idx) => (
                    <Link href={`/post/${post.slug}`} key={post.id || idx} className="p-6 hover:bg-gray-50/80 transition-all duration-300 group border-b border-brand-gray last:border-0">
                        <div className="flex items-start gap-4">
                          <span className="text-2xl font-black text-gray-100 font-serif leading-none group-hover:text-brand-red/10 transition-colors">
                            {(idx + 1).toLocaleString('bn-BD')}
                          </span>
                          <div className="flex flex-col gap-2">
                            <h3 className="text-[1.1rem] font-bold font-serif leading-[1.4] group-hover:text-brand-red transition-colors text-foreground line-clamp-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-brand-red font-black uppercase tracking-widest bg-brand-red/5 px-2 py-0.5 rounded">
                                {post.category?.name || 'জাতীয়'}
                              </span>
                              <span className="text-[10px] text-text-muted font-bold font-sans uppercase">
                                {idx + 1} মিনিট আগে
                              </span>
                            </div>
                          </div>
                        </div>
                    </Link>
                 ))}
                 {sorboseshPosts.length === 0 && (
                   <div className="p-12 text-center text-text-muted text-sm italic font-medium">বর্তমানে কোনো সংবাদ নেই</div>
                 )}
              </div>
          </div>

          <div className="w-full aspect-3/2 bg-white flex flex-col items-center justify-center border border-brand-gray mt-4 rounded-[2rem] shadow-sm relative overflow-hidden group/ad">
            <div className="absolute top-4 left-6 text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase">ADVERTISEMENT</div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-200 text-xl border border-gray-100 group-hover/ad:scale-110 transition-transform">📢</div>
              <span className="text-xs text-gray-400 font-medium tracking-tight">বিজ্ঞাপনের জন্য যোগাযোগ করুন</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
