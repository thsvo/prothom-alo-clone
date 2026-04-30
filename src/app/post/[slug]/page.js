import React from 'react';
import { getPost } from '@/lib/api';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import RecordPostView from '@/components/RecordPostView';
import { normalizeSlug } from '@/lib/slug';
import { notFound } from 'next/navigation';

export default async function PostPage({ params }) {
  const { slug: slugParam } = await params;
  const slug = normalizeSlug(slugParam);
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <RecordPostView slug={slug} />
      <Header />
      <Navbar />
      <main className="grow">
        <article className="container mx-auto px-4 lg:px-8 max-w-3xl py-16">
          {/* Category */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-brand-red font-black uppercase tracking-widest text-[11px] bg-brand-red/5 px-3 py-1 rounded-full">
              {post.category?.name || 'খবর'}
            </span>
            <div className="h-px grow bg-brand-gray"></div>
          </div>

          {/* Post Title */}
          <h1 className="text-[2.8rem] lg:text-[4rem] font-black font-serif leading-[1.1] text-foreground mb-10 tracking-tight text-balance">
            {post.title}
          </h1>
          
          {/* Post Meta */}
          <div className="flex items-center gap-5 text-text-dim text-[15px] mb-12 border-y border-brand-gray py-6 font-sans">
             <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-brand-gray flex items-center justify-center font-black text-gray-300 text-xl shadow-sm">
               {post.author?.[0] || 'A'}
             </div>
             <div className="flex flex-col gap-1">
               <p className="font-black text-foreground text-lg leading-none">{post.author || 'নিজস্ব প্রতিবেদক'}</p>
               <div className="flex items-center gap-2">
                 <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                   প্রকাশ: {new Date(post.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </p>
                 <span className="w-1 h-1 rounded-full bg-brand-gray"></span>
                 <p className="text-[11px] font-bold uppercase tracking-wider text-brand-red animate-pulse">আপডেট: ২ মিনিট আগে</p>
               </div>
             </div>
             
             <div className="ml-auto flex items-center gap-2">
                <button className="w-10 h-10 rounded-full border border-brand-gray flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </button>
             </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="w-full aspect-16/10 bg-gray-50 mb-14 relative overflow-hidden rounded-[2.5rem] shadow-premium border border-brand-gray">
               <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post Content */}
          <div 
            className="prose prose-slate prose-xl max-w-none font-serif leading-[1.8] text-foreground space-y-8"
            style={{ fontSize: '1.4rem' }}
          >
            {post.content.split('\n').map((para, i) => (
              <p key={i} className="first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-brand-red first-letter:mt-1 last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </article>
      </main>
      
      <footer className="w-full border-t border-gray-100 py-20 mt-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
           <p className="text-slate-400 text-sm">© {new Date().getFullYear()} সময়ের ঘটনা. Custom built with PostgreSQL.</p>
        </div>
      </footer>
    </div>
  );
}
