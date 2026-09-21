import { createClient } from "@/lib/supabase/client";
import type { PublicCard } from "@/lib/profile";
import { loadCardLocally, saveCardLocally, removeCardLocally } from "@/lib/profile";
import { getSampleCard } from "@/lib/sample-card";

function hasRealSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("supabase.co") && !url.includes("placeholder");
}

/** Publish card to local registry and Supabase when available */
export async function publishCard(card: PublicCard): Promise<{ ok: boolean; error?: string }> {
  saveCardLocally(card);
  if (!hasRealSupabase()) {
    return { ok: true };
  }
  try {
    const sb = createClient();
    const { error } = await sb.from("public_cards").upsert(
      {
        slug: card.slug.toLowerCase(),
        payload: card,
        is_public: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );
    if (error) {
      // Table may not exist yet - local publish still works on this device
      return { ok: true, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    return { ok: true, error: e instanceof Error ? e.message : "Publish partial" };
  }
}

export async function unpublishCard(slug: string): Promise<void> {
  removeCardLocally(slug);
  if (!hasRealSupabase()) return;
  try {
    const sb = createClient();
    await sb.from("public_cards").delete().eq("slug", slug.toLowerCase());
  } catch {
    /* ignore */
  }
}

export async function fetchPublicCard(slug: string): Promise<PublicCard | null> {
  const sample = getSampleCard(slug);
  if (sample) return sample;
  const local = loadCardLocally(slug);
  if (hasRealSupabase()) {
    try {
      const sb = createClient();
      const { data, error } = await sb
        .from("public_cards")
        .select("payload, is_public")
        .eq("slug", slug.toLowerCase())
        .maybeSingle();
      if (!error && data?.is_public && data.payload) {
        return data.payload as PublicCard;
      }
    } catch {
      /* fall through to local */
    }
  }
  return local;
}

export function cardPublicUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/c/${encodeURIComponent(slug.toLowerCase())}/`;
  }
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://hirehired.vercel.app";
  return `${base.replace(/\/$/, "")}/c/${encodeURIComponent(slug.toLowerCase())}/`;
}

/** QR image URL (no extra npm dependency) */
export function qrImageUrl(data: string, size = 240): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(data)}`;
}
