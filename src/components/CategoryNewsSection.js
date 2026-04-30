import Link from 'next/link';
import { getPosts } from '@/lib/api';

export default async function CategoryNewsSection({ category, title }) {
  const posts = await getPosts({ categoryId: category.id, limit: 4 });

  if (posts.length === 0) return null;

  return (
    <section className="py-16 border-t border-brand-gray bg-white/50">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 bg-brand-red rounded-full shadow-[0_0_10px_rgba(227,30,36,0.3)]"></div>
            <h2 className="text-3xl font-black text-foreground font-serif tracking-tight">{title || category.name}</h2>
          </div>
          <Link href={`/category/${category.slug}`} className="text-brand-red font-black text-sm hover:translate-x-1 transition-transform flex items-center gap-2 group">
            আরও খবর 
            <span className="p-1 rounded-full bg-brand-red/5 group-hover:bg-brand-red/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {posts.map((post) => (
            <Link href={`/post/${post.slug}`} key={post.id} className="group flex flex-col gap-5 hover:translate-y-[-4px] transition-all duration-300">
              <div className="aspect-16/10 bg-gray-50 rounded-2xl overflow-hidden border border-brand-gray shadow-sm group-hover:shadow-lg transition-all duration-500 relative">
                {post.featuredImage ? (
                  <>
                    <img 
                      src={post.featuredImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 bg-white">
                    <span className="text-3xl mb-1">🖼️</span>
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-50">চিত্র নেই</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-[1.2rem] font-bold font-serif leading-[1.4] group-hover:text-brand-red transition-colors text-foreground line-clamp-2 text-balance">
                  {post.title}
                </h3>
                <p className="text-[14px] text-text-dim line-clamp-2 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-6 h-[2px] bg-brand-gray group-hover:w-10 group-hover:bg-brand-red transition-all duration-500"></div>
                   <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">বিস্তারিত পড়ুন</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
