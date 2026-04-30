'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Layers, Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const slug = newCat.slug || newCat.name.toLowerCase().replace(/ /g, '-');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCat, slug })
      });
      if (res.ok) {
        setNewCat({ name: '', slug: '', description: '' });
        fetchCategories();
      }
    } catch (e) {
      alert('Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }
      fetchCategories();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Categories</h2>
        <p className="text-slate-500 mt-1">Organize your news into sections like Sports, Politics, and more.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Category Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus size={20} className="text-brand-red" />
              Add New Category
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-red transition-all"
                  value={newCat.name}
                  onChange={e => setNewCat({...newCat, name: e.target.value})}
                  placeholder="e.g. Sports"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Slug (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-red transition-all"
                  value={newCat.slug}
                  onChange={e => setNewCat({...newCat, slug: e.target.value})}
                  placeholder="e.g. sports"
                />
              </div>
              <button 
                disabled={adding}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {adding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                Create Category
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Slug</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Posts</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400">No categories found.</td>
                  </tr>
                ) : categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                          <Layers size={16} />
                        </div>
                        <span className="font-bold text-slate-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-mono">{cat.slug}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">-</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

