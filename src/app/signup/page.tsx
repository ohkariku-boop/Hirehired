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
      if (data.session) window.location.href = "/dashboard/";
      else {
        setMessage("Check your email to confirm.");
        setLoading(false);
      }
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
          <h1 className="text-[20px] font-bold">Create account</h1>
          <form onSubmit={handleSignup} className="mt-5 space-y-3">
            {error && <p className="text-[13px] text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>}
            {message && <p className="text-[13px] text-green-700 bg-green-50 px-3 py-2 rounded">{message}</p>}
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full h-10 rounded border border-neutral-300 px-3 text-[14px] focus:outline-none focus:border-blue-600" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-10 rounded border border-neutral-300 px-3 text-[14px] focus:outline-none focus:border-blue-600" />
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-10 rounded border border-neutral-300 px-3 text-[14px] focus:outline-none focus:border-blue-600" />
            <button type="submit" disabled={loading} className="w-full h-10 rounded bg-blue-700 text-[13px] font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="mt-4 text-[13px] text-neutral-500">
            Have an account? <Link href="/login/" className="text-blue-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
