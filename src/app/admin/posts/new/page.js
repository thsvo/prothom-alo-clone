'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { BD_DISTRICTS } from '@/lib/bdLocations';

export default function NewPost() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    location: '',
    category: '',
    status: 'published',
    order: 99,
    section: 'standard'
    ,
    tagIds: []
  });


  useEffect(() => {
    Promise.all([fetch('/api/categories'), fetch('/api/tags')])
      .then(async ([catRes, tagRes]) => [await catRes.json(), await tagRes.json()])
      .then(([catData, tagData]) => {
        setCategories(catData);
        setTags(tagData);
        if (catData.length > 0) setFormData(prev => ({ ...prev, category: catData[0].id }));
      });
  }, []);

  useEffect(() => {
    // Fetch max order for selected section
    fetch(`/api/posts?section=${formData.section}&limit=1&sortField=order&sortOrder=desc`)
      .then(res => res.json())
      .then(posts => {
        const maxOrder = posts.length > 0 ? Number(posts[0].order) : 0;
        setFormData(prev => ({ ...prev, order: isNaN(maxOrder) ? 1 : maxOrder + 1 }));
      });
  }, [formData.section]);



  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, featuredImage: data.url }));
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      alert('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Create New Story</h2>
          <p className="text-slate-500">Fill in the details to publish a new news article.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-slate-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            form="post-form"
            disabled={loading}
            className="px-6 py-2 bg-brand-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Publish News
          </button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Headline (Bengali or English)</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all text-xl font-bold"
                placeholder="Enter news title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Excerpt (Summary)</label>
              <textarea
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600"
                placeholder="Brief summary for list views..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Main Content</label>
              <textarea
                rows="15"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-700 font-serif leading-relaxed text-lg"
                placeholder="Write your news story here..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Featured Image</label>
            <div className="relative aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center group">
              {formData.featuredImage ? (
                <>
                  <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold">Change Image</label>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 text-slate-400">
                    {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                  <label className="mt-4 block cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                    Upload Photo
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Category</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-red transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tags</label>
              <div className="max-h-36 overflow-auto border border-gray-200 rounded-xl p-2 space-y-1">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={formData.tagIds.includes(tag.id)}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          tagIds: e.target.checked
                            ? [...prev.tagIds, tag.id]
                            : prev.tagIds.filter(id => id !== tag.id)
                        }))
                      }
                    />
                    {tag.name}
                  </label>
                ))}
                {tags.length === 0 && <p className="text-xs text-slate-400">No tags yet.</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Location (Bangladesh)</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-red transition-all"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="যেমন: ঢাকা, চট্টগ্রাম, খুলনা"
                list="bd-districts"
              />
              <datalist id="bd-districts">
                {BD_DISTRICTS.map((district) => (
                  <option key={district} value={district} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Section</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-red transition-all"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              >
                <option value="standard">Standard News</option>
                <option value="top">Top Story (Center)</option>
                <option value="sorbosesh">Sorbosesh (Latest)</option>
                <option value="live">Live News</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Sort Order (1 = Top)</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-red transition-all"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              />
              <p className="text-[10px] text-slate-400 mt-1">Order 1 in &quot;Top Story&quot; will be the main center news.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
