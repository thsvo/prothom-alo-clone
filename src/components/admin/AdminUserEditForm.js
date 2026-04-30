"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES = ["ADMIN", "EDITOR", "REPORTER", "READER"];

export default function AdminUserEditForm({ user }) {
  const isEdit = !!user;
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "READER");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const body = { name, email, role, isActive };
      if (password.trim()) body.password = password.trim();

      const url = isEdit ? `/api/admin/users/${user.id}` : "/api/admin/users";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isEdit ? "Update failed" : "Creation failed"));
        return;
      }
      setMessage(isEdit ? "User updated." : "User created.");
      if (!isEdit) {
        // Redirect to list or the new user's edit page
        setTimeout(() => router.push("/admin/users"), 1000);
      } else {
        setPassword("");
        router.refresh();
      }
    } catch {
      setError("Request failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
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
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
        <select
          className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active account
      </label>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase">
          {isEdit ? "New password (optional)" : "Password"}
        </label>
        <input
          type="password"
          className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isEdit ? "Leave blank to keep current password" : "Enter password"}
          autoComplete="new-password"
          required={!isEdit}
          minLength={8}
        />
        <p className="text-[10px] text-slate-400 mt-1">Minimum 8 characters.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/users")}
          className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-slate-600"
        >
          Back to list
        </button>
        <button
          type="submit"
          disabled={saving}
          className="grow bg-slate-900 text-white rounded-xl py-2 font-bold disabled:opacity-60"
        >
          {saving ? (isEdit ? "Saving..." : "Creating...") : (isEdit ? "Save user" : "Create user")}
        </button>
      </div>
    </form>
  );
}
