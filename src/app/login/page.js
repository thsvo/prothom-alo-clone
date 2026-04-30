"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

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
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Animated Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-60 scale-110 animate-slow-zoom"
        style={{ 
          backgroundImage: 'url("/api/proxy-image?path=C:\\Users\\PC\\.gemini\\antigravity\\brain\\75961354-9d5a-42f4-90b9-e6a9eb6e7203\\login_background_water_1777552805218.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl shadow-black/50">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="text-4xl lg:text-5xl font-serif font-black tracking-tighter text-white mb-2">
              <span>সময়ের</span>
              <span className="text-brand-red ml-2">ঘটনা</span>
            </div>
            <div className="h-1 w-12 bg-brand-red rounded-full"></div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-slate-300 text-sm text-center mb-8">Sign in to manage your news portal</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-red transition-colors" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@prothomalo.com"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-red transition-colors" size={18} />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 transition-all placeholder:text-slate-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center animate-shake">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-brand-red hover:bg-red-600 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-900/20 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  SIGN IN
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Forgot access? Contact your system administrator.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s linear infinite alternate;
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </main>
  );
}

