"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BD_DISTRICTS } from "@/lib/bdLocations";
import { Save, X, Image as ImageIcon, Loader2 } from "lucide-react";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    location: "",
    category: "",
    status: "draft",
    section: "standard",
    order: 99,
    isBreaking: false,
    tagIds: [],
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, featuredImage: data.url }));
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    async function boot() {
      try {
        const [postRes, catRes, tagRes] = await Promise.all([
          fetch(`/api/posts/${postId}`),
          fetch("/api/categories"),
          fetch("/api/tags"),
        ]);
        const [post, catData, tagData] = await Promise.all([postRes.json(), catRes.json(), tagRes.json()]);

        setCategories(catData);
        setTags(tagData);
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          featuredImage: post.featuredImage || "",
          location: post.location || "",
          category: post.categoryId || "",
          status: String(post.status || "DRAFT").toLowerCase(),
          section: String(post.section || "STANDARD").toLowerCase(),
          order: post.order ?? 99,
          isBreaking: Boolean(post.isBreaking),
          tagIds: Array.isArray(post.tags) ? post.tags.map((t) => t.tagId) : [],
        });
      } finally {
        setLoading(false);
      }
    }
    if (postId) boot();
  }, [postId]);

  const selectedTagSet = useMemo(() => new Set(formData.tagIds), [formData.tagIds]);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update post.");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-slate-500">Loading post...</div>;

  return (
    <form onSubmit={onSave} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Edit Story</h2>
          <p className="text-slate-500 mt-1">Update content, workflow status, and tags.</p>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-lg font-bold" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Headline"
            required
          />
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2"
            value={formData.slug}
            onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
            placeholder="Slug"
            required
          />
          <textarea
            className="w-full border border-gray-200 rounded-xl px-3 py-2"
            rows={4}
            value={formData.excerpt}
            onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
            placeholder="Excerpt"
          />
          <textarea
            className="w-full border border-gray-200 rounded-xl px-3 py-2"
            rows={16}
            value={formData.content}
            onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
            placeholder="Content"
            required
          />
          <input
            className="w-full border border-gray-200 rounded-xl px-3 py-2"
            value={formData.location}
            onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
            placeholder="Location (e.g. ঢাকা, চট্টগ্রাম)"
            list="bd-districts-edit"
          />
          <datalist id="bd-districts-edit">
            {BD_DISTRICTS.map((district) => (
              <option key={district} value={district} />
            ))}
          </datalist>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Featured Image</label>
            <div className="relative aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group">
              {formData.featuredImage ? (
                <>
                  <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">Change Image</label>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 text-slate-400">
                    {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  </div>
                  <label className="mt-2 block cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                    Upload Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
              <input type="file" className="hidden" id="edit-image-input" accept="image/*" onChange={handleImageUpload} />
              {formData.featuredImage && (
                <label htmlFor="edit-image-input" className="absolute inset-0 cursor-pointer"></label>
              )}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-red transition-all"
              value={formData.category}
              onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Workflow Status</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-red transition-all"
              value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">News Section</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-red transition-all"
              value={formData.section}
              onChange={(e) => setFormData((p) => ({ ...p, section: e.target.value }))}
            >
              <option value="standard">Standard</option>
              <option value="top">Top Story</option>
              <option value="sorbosesh">Sorbosesh</option>
              <option value="live">Live</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sort Order</label>
            <input
              type="number"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-red transition-all"
              value={formData.order}
              onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) }))}
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 pt-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
              checked={formData.isBreaking}
              onChange={(e) => setFormData((p) => ({ ...p, isBreaking: e.target.checked }))}
            />
            <span className="group-hover:text-brand-red transition-colors">Breaking News</span>
          </label>

          <div className="space-y-3 pt-4 border-t border-gray-50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Story Tags</p>
            <div className="max-h-44 overflow-auto border border-gray-100 rounded-xl p-3 space-y-2 bg-slate-50/50">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer hover:text-brand-red transition-colors">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                    checked={selectedTagSet.has(tag.id)}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        tagIds: e.target.checked
                          ? [...prev.tagIds, tag.id]
                          : prev.tagIds.filter((id) => id !== tag.id),
                      }));
                    }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
