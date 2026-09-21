"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { PublicCard } from "@/lib/profile";
import { statusLabel } from "@/lib/profile";
import { fetchPublicCard, qrImageUrl, cardPublicUrl } from "@/lib/public-card";

export default function PublicCardPage() {
  const params = useParams();
  const slug = String(params?.slug || "").toLowerCase();
  const [card, setCard] = useState<PublicCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const data = await fetchPublicCard(slug);
      if (!cancelled) {
        setCard(data);
        setUrl(cardPublicUrl(slug));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[560px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {loading ? (
            <p className="text-neutral-500">Loading card...</p>
          ) : !card ? (
            <div>
              <h1 className="text-2xl font-bold">Card not found</h1>
              <p className="mt-3 text-neutral-600 leading-relaxed">
                This card is missing, unpublished, or only saved on another
                device. The owner can open Profile, enable sharing, and press
                Publish card.
              </p>
              <Link
                href="/profile/"
                className="inline-flex mt-6 h-10 items-center rounded bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Your profile
              </Link>
            </div>
          ) : (
            <article className="border border-neutral-200 rounded-lg p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                Hirehired card
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight">{card.full_name}</h1>
              {card.headline ? (
                <p className="mt-2 text-lg text-neutral-600">{card.headline}</p>
              ) : null}
              {card.location ? (
                <p className="mt-1 text-sm text-neutral-500">{card.location}</p>
              ) : null}
              {card.summary ? (
                <p className="mt-5 text-base text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {card.summary}
                </p>
              ) : null}

              {card.skills.length > 0 ? (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                    Skills
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {card.skills.map((s) => (
                      <span
                        key={s}
                        className="text-sm border border-neutral-200 rounded px-2 py-0.5 text-neutral-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {(card.github_url || card.linkedin_url || card.portfolio_url) && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                    Links
                  </h2>
                  <ul className="mt-2 space-y-1 text-base">
                    {card.github_url ? (
                      <li>
                        <a
                          href={card.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          GitHub
                        </a>
                      </li>
                    ) : null}
                    {card.linkedin_url ? (
                      <li>
                        <a
                          href={card.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </li>
                    ) : null}
                    {card.portfolio_url ? (
                      <li>
                        <a
                          href={card.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          Portfolio
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )}

              {card.claims.length > 0 ? (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                    Claims
                  </h2>
                  <ul className="mt-2 divide-y divide-neutral-100 border border-neutral-200 rounded">
                    {card.claims.map((c) => (
                      <li key={c.id} className="px-3 py-2.5">
                        <p className="font-medium text-[15px]">{c.title}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {c.claim_type} · {statusLabel(c.status)}
                          {c.evidence_url ? (
                            <>
                              {" · "}
                              <a
                                href={c.evidence_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:underline"
                              >
                                evidence
                              </a>
                            </>
                          ) : null}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-neutral-400">
                    Self-reported means the owner typed it. Linked means they
                    added a URL. Hirehired does not verify backgrounds.
                  </p>
                </div>
              ) : null}

              {url ? (
                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row gap-4 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImageUrl(url, 160)}
                    alt="QR code for this card"
                    width={160}
                    height={160}
                    className="border border-neutral-200 rounded"
                  />
                  <div className="text-sm text-neutral-500">
                    <p className="font-medium text-neutral-700">Scan or share</p>
                    <p className="mt-1 break-all">{url}</p>
                  </div>
                </div>
              ) : null}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
