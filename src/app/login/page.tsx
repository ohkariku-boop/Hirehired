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
      setError("Auth not available in static preview.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-700 text-white text-[11px] font-bold">H</span>
            <span className="text-[14px] font-semibold">Hirehired</span>
          </Link>
          <h1 className="text-[20px] font-bold">Sign in</h1>
          <form onSubmit={handleLogin} className="mt-5 space-y-3">
            {error && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-10 rounded border border-neutral-300 px-3 text-[14px] focus:outline-none focus:border-blue-600" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-10 rounded border border-neutral-300 px-3 text-[14px] focus:outline-none focus:border-blue-600" />
            <button type="submit" disabled={loading} className="w-full h-10 rounded bg-blue-700 text-[13px] font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-[13px] text-neutral-500">
            No account? <Link href="/signup/" className="text-blue-700 font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
