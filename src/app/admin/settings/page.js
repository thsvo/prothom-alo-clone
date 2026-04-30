"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [me, setMe] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setMe(data.user);
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const body = { name, email };
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      } else if (email !== me?.email) {
        body.currentPassword = currentPassword;
      }

      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      setMessage("Profile updated.");
      setMe(data.user);
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Request failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  if (!me) {
    return <p className="text-slate-500">Not signed in.</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Account settings</h2>
        <p className="text-slate-500 mt-1">
          Change your name, email, or password. Email and password changes require your current password.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
          <input
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
          <input
            type="email"
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {email !== me.email && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Current password</label>
            <input
              type="password"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase">New password (optional)</label>
          <input
            type="password"
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Leave blank to keep current"
          />
        </div>
        {newPassword && (
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Current password</label>
            <input
              type="password"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required={Boolean(newPassword)}
            />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-slate-900 text-white rounded-xl py-2.5 font-bold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
