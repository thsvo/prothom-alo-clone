import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                  No posts yet.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <Link href={`/admin/posts/${post.id}`} className="font-semibold text-slate-800 hover:text-brand-red">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{post.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{post.status}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleString("bn-BD") : "-"}
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
