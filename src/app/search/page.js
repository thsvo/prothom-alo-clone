import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { getPosts } from "@/lib/api";
import SearchControls from "@/components/SearchControls";
import { BD_DISTRICTS } from "@/lib/bdLocations";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = params?.q || "";
  const location = params?.location || "";
  const lat = params?.lat || "";
  const lng = params?.lng || "";

  const posts = await getPosts({
    q: q || null,
    location: location || null,
    lat: lat || null,
    lng: lng || null,
    limit: 30,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <Navbar />
      <main className="grow">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-6 font-serif">খবর খুঁজুন</h1>
          <SearchControls defaultQ={q} defaultLocation={location} districts={BD_DISTRICTS} />

          <div className="mb-8">
            <p className="text-xs uppercase text-slate-400 tracking-wider mb-2">জেলা মানচিত্রভিত্তিক এক্সপ্লোর</p>
            <div className="flex flex-wrap gap-2">
              {BD_DISTRICTS.slice(0, 32).map((district) => (
                <Link
                  key={district}
                  href={`/search?location=${encodeURIComponent(district)}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-brand-red hover:text-brand-red"
                >
                  {district}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-slate-500">কোনো ফলাফল পাওয়া যায়নি।</p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="block border border-gray-100 rounded-xl p-4 hover:bg-slate-50"
                >
                  <p className="text-xs text-brand-red font-bold mb-1">
                    {post.location || "বাংলাদেশ"} · {post.category?.name || "খবর"}
                  </p>
                  <h3 className="text-xl font-bold font-serif text-slate-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
