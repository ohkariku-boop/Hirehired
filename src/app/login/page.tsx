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
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-background font-bold text-sm">
              H
            </span>
            <span className="font-semibold text-[15px]">Hirehired</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 text-red-400 text-[13px] px-3 py-2.5">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[12px] font-medium text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-full bg-accent text-[13px] font-semibold text-background hover:bg-accent-dim disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-muted">
            No account?{" "}
            <Link href="/signup/" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
