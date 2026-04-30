import Link from "next/link";
import { getPopularWeek } from "@/lib/api";

export default async function MostViewedWeekSection() {
  const posts = await getPopularWeek();

  if (posts.length === 0) return null;

  return (
    <section className="py-16 border-t border-brand-gray bg-gray-50/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-10 w-1.5 bg-brand-red rounded-full shadow-[0_0_10px_rgba(227,30,36,0.2)]" />
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-foreground font-serif tracking-tight leading-none">
              সপ্তাহের সর্বাধিক পঠিত
            </h2>
            <span className="text-[10px] text-text-muted font-black font-sans uppercase tracking-[0.2em] mt-1.5">
              POPULAR THIS WEEK
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {posts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="group flex flex-col gap-4 bg-white rounded-3xl border border-brand-gray p-6 shadow-sm hover:shadow-premium transition-all duration-300 hover:translate-y-[-4px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-brand-gray flex items-center justify-center font-black text-brand-red text-sm shadow-inner group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                  { (idx + 1).toLocaleString('bn-BD') }
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-text-muted uppercase tracking-tighter">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-red opacity-50"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  {post.viewsThisWeek.toLocaleString('bn-BD')} বার পঠিত
                </div>
              </div>
              <h3 className="text-[1.1rem] font-bold font-serif leading-[1.4] group-hover:text-brand-red transition-colors line-clamp-3 text-foreground text-balance">
                {post.title}
              </h3>
              <div className="mt-auto pt-4 border-t border-brand-gray/50">
                <span className="text-[10px] font-black text-brand-red/60 uppercase tracking-widest bg-brand-red/5 px-2 py-0.5 rounded">
                  {post.category?.name || "News"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
