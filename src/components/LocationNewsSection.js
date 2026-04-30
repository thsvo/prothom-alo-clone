"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BD_DISTRICTS } from "@/lib/bdLocations";

export default function LocationNewsSection() {
  const [location, setLocation] = useState("");
  const [q, setQ] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const quickDistricts = useMemo(() => BD_DISTRICTS.slice(0, 16), []);

  async function runSearch(nextLocation = location, nextQ = q) {
    if (!nextLocation && !nextQ) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "24");
      if (nextLocation) params.set("location", nextLocation);
      if (nextQ) params.set("q", nextQ);
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 border-t border-brand-gray bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-10 w-1.5 bg-brand-red rounded-full shadow-[0_0_10px_rgba(227,30,36,0.2)]" />
          <h2 className="text-3xl font-black text-foreground font-serif tracking-tight">লোকেশন ভিত্তিক সংবাদ</h2>
        </div>

        <div className="bg-gray-50/50 border border-brand-gray rounded-[2.5rem] p-8 md:p-10 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="relative group">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="কীওয়ার্ড লিখুন..."
                className="w-full bg-white border border-brand-gray rounded-2xl px-5 py-3 text-[15px] outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all font-medium"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-red transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-brand-gray rounded-2xl px-5 py-3 text-[15px] outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 transition-all font-medium appearance-none cursor-pointer"
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {BD_DISTRICTS.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <button
              onClick={() => runSearch()}
              className="bg-foreground text-white rounded-2xl px-6 py-3 text-[15px] font-black hover:bg-brand-red transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-brand-red/20 transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  লোড হচ্ছে...
                </div>
              ) : "সংবাদ দেখুন"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-8 relative z-10">
            <span className="text-[11px] font-black text-text-muted uppercase tracking-widest mr-2 py-1.5">দ্রুত খুঁজুন:</span>
            {quickDistricts.map((district) => (
              <button
                key={district}
                onClick={() => {
                  setLocation(district);
                  runSearch(district, q);
                }}
                className={`text-[12px] px-4 py-1.5 rounded-full border transition-all duration-300 font-bold ${location === district ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-white border-brand-gray text-text-dim hover:border-brand-red hover:text-brand-red hover:shadow-md'}`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>

        {!searched ? (
          <div className="flex items-center gap-2 text-[14px] text-text-muted font-medium bg-gray-50 px-6 py-3 rounded-full w-fit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            জেলা নির্বাচন করে সংশ্লিষ্ট সব ক্যাটাগরির সংবাদ দেখুন।
          </div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-brand-gray">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200 text-2xl shadow-sm">🔍</div>
             <p className="text-text-dim font-bold text-lg">এই ফিল্টারে কোনো সংবাদ পাওয়া যায়নি।</p>
             <button onClick={() => {setQ(""); setLocation(""); setSearched(false)}} className="mt-4 text-brand-red font-black text-sm hover:underline">রিসেট করুন</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="group block bg-white border border-brand-gray rounded-[2rem] p-8 hover:shadow-premium transition-all duration-300 hover:translate-y-[-4px]"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] text-brand-red font-black uppercase tracking-widest bg-brand-red/5 px-2.5 py-1 rounded-full">
                    {post.location || "বাংলাদেশ"}
                  </span>
                  <span className="text-gray-200">/</span>
                  <span className="text-[11px] text-text-muted font-black uppercase tracking-widest">
                    {post.category?.name || "খবর"}
                  </span>
                </div>
                <h3 className="text-[1.25rem] font-bold font-serif text-foreground mb-3 line-clamp-2 leading-[1.4] group-hover:text-brand-red transition-colors text-balance">{post.title}</h3>
                <p className="text-[15px] text-text-dim line-clamp-3 leading-relaxed font-medium">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-6 text-brand-red font-black text-xs uppercase tracking-tighter opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  পুরো খবর দেখুন
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
