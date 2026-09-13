"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const supabase = createClient();

  async function handleSave() {
    setStatus("saving");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      return;
    }

    const { error } = await supabase.from("applications").upsert(
      {
        user_id: user.id,
        job_id: jobId,
        status: "saved",
      },
      { onConflict: "user_id,job_id" }
    );

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setStatus("saved");
  }

  return (
    <button
      onClick={handleSave}
      disabled={status === "saving" || status === "saved"}
      className="inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition"
    >
      {status === "saved"
        ? "Saved"
        : status === "saving"
          ? "Saving..."
          : status === "error"
            ? "Error"
            : "Save"}
    </button>
  );
}
