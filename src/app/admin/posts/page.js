import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">News / Posts</h2>
          <p className="text-slate-500 mt-1">All stories in the newsroom.</p>
        </div>
        <Link href="/admin/posts/new" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold">
          New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Published</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                  No posts yet. Start by creating a new story!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/posts/${post.id}`} className="font-bold text-slate-900 hover:text-brand-red transition-colors">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {post.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      post.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("bn-BD") : "Draft"}
                  </td>
                  <td className="px-6 py-4">
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

