"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.user?.role === "ADMIN" || data.user?.role === "EDITOR") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setError("Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-800">Sign in</h1>
        <p className="text-sm text-slate-500">
          Use the email and password for your account. Run{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">npm run db:seed</code> once to create the default admin user.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
            <input
              type="email"
              required
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-brand-red"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-xl py-2.5 font-bold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
