import React from 'react';
import { getCategories, getPosts } from '@/lib/api';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  
  // Find the category info
  const categories = await getCategories();
  const decodedSlug = decodeURIComponent(slug);
  const category = categories.find(c => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  // Fetch posts for this category
  const posts = await getPosts({ categoryId: category.id, limit: 10 });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Navbar />
      <main className="grow">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl pt-8 pb-12">
          <div className="flex items-center gap-2 mb-8 border-b-2 border-black pb-2 w-max">
             <div className="w-3 h-3 rounded-full bg-brand-red"></div>
             <h1 className="text-[1.8rem] font-bold font-serif text-black leading-none">{category.name}</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <Link href={`/post/${post.slug}`} key={post.id} className="flex flex-col gap-3 group cursor-pointer border border-brand-gray bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                <div className="w-full aspect-video bg-[#f5f5f5] flex items-center justify-center border-b border-gray-200">
                   <span className="text-gray-400 font-bold tracking-widest uppercase text-xs">ছবি</span>
                </div>
                
                <div className="p-4 grow flex flex-col pt-2">
                  <h3 className="text-[1.2rem] font-bold font-serif leading-snug group-hover:text-brand-red transition-colors text-black mb-2">
                    {post.title}
                  </h3>

                  <p className="text-[#555555] text-[0.95rem] line-clamp-3 leading-relaxed mt-1 grow font-sans">
                    {post.excerpt}
                  </p>
                   
                   <span className="text-sm text-[#777777] mt-3 font-sans block">২ ঘণ্টা আগে</span>
                </div>
              </Link>
            ))}
            {!posts.length && (
              <p className="text-[#555555] col-span-full">এই বিভাগে কোন খবর পাওয়া যায়নি।</p>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer Placeholder */}
      <footer className="w-full border-t border-brand-gray py-10 mt-10 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-[#555555]">
           <p>© {new Date().getFullYear()} সময়ের ঘটনা. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
