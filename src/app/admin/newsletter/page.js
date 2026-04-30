"use client";

import { useEffect, useState } from "react";

export default function NewsletterAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/newsletter")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Newsletter Subscribers</h2>
        <p className="text-slate-500 mt-1">Track subscriber growth and active email list.</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-slate-400 text-center">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-slate-400 text-center">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-slate-800">{item.email}</td>
                  <td className="px-6 py-4 text-slate-600">{item.isActive ? "Active" : "Inactive"}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(item.subscribedAt).toLocaleString("bn-BD")}
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
