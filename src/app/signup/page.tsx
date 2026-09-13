"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.session) {
        window.location.href = "/dashboard/";
      } else {
        setMessage("Check your email for a confirmation link.");
        setLoading(false);
      }
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
          <h1 className="text-xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Start finding quieter, higher-signal roles.
          </p>

          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 text-red-400 text-[13px] px-3 py-2.5">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg bg-emerald-500/10 text-emerald-400 text-[13px] px-3 py-2.5">
                {message}
              </div>
            )}
            <div>
              <label className="block text-[12px] font-medium text-muted mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Jane Doe"
              />
            </div>
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
                minLength={6}
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
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-[13px] text-muted">
            Already have an account?{" "}
            <Link href="/login/" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
