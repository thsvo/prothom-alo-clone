import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-3">Bookmarks</h1>
        <p className="text-slate-500 mb-5">You need to login to save and read bookmarked stories.</p>
        <Link href="/login" className="inline-block bg-slate-900 text-white px-5 py-2 rounded-lg font-bold">
          Login
        </Link>
      </main>
    );
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      post: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Bookmarks</h1>
        <p className="text-slate-500 mt-1">{bookmarks.length} saved stories</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50">
        {bookmarks.length === 0 ? (
          <p className="p-5 text-slate-400">No bookmarks yet.</p>
        ) : (
          bookmarks.map((entry) => (
            <Link key={entry.id} href={`/post/${entry.post.slug}`} className="block p-5 hover:bg-slate-50 transition-colors">
              <p className="text-xs text-brand-red font-bold uppercase mb-1">{entry.post.category?.name || "News"}</p>
              <h3 className="text-lg font-bold text-slate-800">{entry.post.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{entry.post.excerpt || "No summary available."}</p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
