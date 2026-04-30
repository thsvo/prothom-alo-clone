import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function createSlug(input = "") {
  return input
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  async function createTag(formData) {
    "use server";
    const name = String(formData.get("name") || "").trim();
    if (!name) return;

    await prisma.tag.create({
      data: {
        name,
        slug: createSlug(name),
      },
    });
    revalidatePath("/admin/tags");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Tags</h2>
        <p className="text-slate-500 mt-1">Manage topic tags for better discovery and related stories.</p>
      </div>

      <form action={createTag} className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-3">
        <input
          name="name"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
          placeholder="e.g. Election 2026"
        />
        <button className="bg-slate-900 text-white px-4 rounded-xl font-bold">
          Add Tag
        </button>
      </form>

      <div className="bg-white border border-gray-100 rounded-2xl divide-y divide-gray-50">
        {tags.length === 0 ? (
          <p className="p-5 text-slate-400">No tags found.</p>
        ) : (
          tags.map((tag) => (
            <div key={tag.id} className="p-4 flex items-center justify-between">
              <span className="font-semibold text-slate-800">{tag.name}</span>
              <span className="text-xs text-slate-500 font-mono">{tag.slug}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
