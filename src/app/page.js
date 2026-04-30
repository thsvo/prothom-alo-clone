import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import TopNewsSection from "@/components/TopNewsSection";
import MostViewedWeekSection from "@/components/MostViewedWeekSection";
import CategoryNewsSection from "@/components/CategoryNewsSection";
import LocationNewsSection from "@/components/LocationNewsSection";
import { getCategories } from "@/lib/api";
import Link from "next/link";

export default async function Home() {
  const categories = await getCategories();
  
  // Specific categories for home page sections
  const sportsCat = categories.find(c => c.slug === 'sports');
  const politicsCat = categories.find(c => c.slug === 'politics');
  const entertainmentCat = categories.find(c => c.slug === 'entertainment');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Navbar />
      <main className="grow">
        <TopNewsSection />
        
        {/* Dynamic Category Sections */}
        {politicsCat && <CategoryNewsSection category={politicsCat} title="রাজনীতি" />}
        {sportsCat && <CategoryNewsSection category={sportsCat} title="খেলা" />}
        {entertainmentCat && <CategoryNewsSection category={entertainmentCat} title="বিনোদন" />}
        
        {/* If no specific categories found, show first 2 as demo */}
        {!politicsCat && !sportsCat && categories.slice(0, 2).map(cat => (
          <CategoryNewsSection key={cat.id} category={cat} />
        ))}

        <LocationNewsSection />
      </main>
      
      <footer className="w-full border-t border-gray-100 py-16 mt-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center text-2xl font-bold font-serif tracking-tight mb-6">
                <span className="text-black">সময়ের</span>
                <span className="text-brand-red ml-1.5">ঘটনা</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                The leading news portal in Bangladesh, providing the latest news, sports, entertainment, and lifestyle updates.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-6">Categories</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {categories.slice(0, 5).map(cat => (
                  <li key={cat.id}><Link href={`/category/${cat.slug}`} className="hover:text-brand-red">{cat.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-6">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/about" className="hover:text-brand-red">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-brand-red">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-brand-red">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-6">Subscribe</h4>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm w-full outline-none focus:border-brand-red" />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Join</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-xs text-slate-400">
             <p>© {new Date().getFullYear()} সময়ের ঘটনা. Custom built with PostgreSQL & Next.js.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

