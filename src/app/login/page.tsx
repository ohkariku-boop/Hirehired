"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      window.location.href = "/dashboard/";
    } catch {
      setError("Auth is not configured in this static preview.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5 hero-mesh">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white font-bold text-sm shadow-sm shadow-indigo-500/25">
              H
            </span>
            <span className="font-semibold text-[16px]">Hirehired</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-white p-8 shadow-lg shadow-slate-200/50">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in
          </h1>
          <p className="mt-1.5 text-[14px] text-muted">
            Welcome back. Enter your details below.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 text-red-600 text-[13px] px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-accent text-[14px] font-semibold text-white hover:bg-accent-hover disabled:opacity-50 transition-colors shadow-sm shadow-indigo-500/20"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-muted">
            No account?{" "}
            <Link href="/signup/" className="font-semibold text-accent hover:text-accent-hover">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
