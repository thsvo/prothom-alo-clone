import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function ReviewQueuePage() {
  async function moveStatus(formData) {
    "use server";
    const postId = String(formData.get("postId") || "");
    const status = String(formData.get("status") || "");

    if (!postId || !status) return;

    const statusMap = {
      draft: "DRAFT",
      review: "REVIEW",
      published: "PUBLISHED",
      archived: "ARCHIVED",
    };

    const dbStatus = statusMap[status];
    if (!dbStatus) return;

    await prisma.post.update({
      where: { id: postId },
      data: {
        status: dbStatus,
        publishedAt: dbStatus === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/review");
    revalidatePath("/admin/posts");
  }

  const items = await prisma.post.findMany({
    where: {
      OR: [{ status: "REVIEW" }, { status: "DRAFT" }],
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Review Queue</h2>
        <p className="text-slate-500 mt-1">Draft and under-review stories for editors.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Title</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-slate-400">
                  Queue is empty.
                </td>
              </tr>
            ) : (
              items.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/post/${post.slug}`} className="font-semibold text-slate-800 hover:text-brand-red">
                      {post.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-1">By {post.author?.name || "Unknown"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{post.category?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{post.status}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(post.updatedAt).toLocaleString("bn-BD")}
                    <div className="mt-2 flex gap-2">
                      <form action={moveStatus}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="status" value="review" />
                        <button className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200">Review</button>
                      </form>
                      <form action={moveStatus}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="status" value="published" />
                        <button className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200">Publish</button>
                      </form>
                    </div>
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
