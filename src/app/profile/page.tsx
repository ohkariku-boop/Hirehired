"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  type Claim,
  type HirehiredProfile,
  EMPTY_PROFILE,
  loadProfile,
  saveProfile,
  exportProfileJson,
  newClaimId,
  statusLabel,
  slugifyName,
  profileToPublicCard,
} from "@/lib/profile";
import { extractResumeText, parseResumeText } from "@/lib/resume-parse";
import {
  publishCard,
  unpublishCard,
  cardPublicUrl,
  qrImageUrl,
} from "@/lib/public-card";

export default function ProfilePage() {
  const [profile, setProfile] = useState<HirehiredProfile>(EMPTY_PROFILE);
  const [skillsInput, setSkillsInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [publishMsg, setPublishMsg] = useState("");
  const [resumeStatus, setResumeStatus] = useState("");
  const [resumeBusy, setResumeBusy] = useState(false);
  const [claimDraft, setClaimDraft] = useState({
    claim_type: "link" as Claim["claim_type"],
    title: "",
    evidence_url: "",
    status: "self_reported" as Claim["status"],
  });

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setSkillsInput(p.skills.join(", "));
  }, []);

  function withSkills(p: HirehiredProfile): HirehiredProfile {
    const skills = skillsInput
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return { ...p, skills };
  }

  function persist(next: HirehiredProfile) {
    const merged = withSkills(next);
    setProfile(merged);
    saveProfile(merged);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }


  async function onResumeFile(file: File | null) {
    if (!file) return;
    setResumeBusy(true);
    setResumeStatus("");
    try {
      const text = await extractResumeText(file);
      const parsed = parseResumeText(text);
      const next = {
        ...profile,
        full_name: parsed.full_name || profile.full_name,
        headline: parsed.headline || profile.headline,
        location: parsed.location || profile.location,
        summary: parsed.summary || profile.summary,
        skills: parsed.skills.length ? parsed.skills : profile.skills,
        github_url: parsed.github_url || profile.github_url,
        linkedin_url: parsed.linkedin_url || profile.linkedin_url,
        portfolio_url: parsed.portfolio_url || profile.portfolio_url,
      };
      setSkillsInput(next.skills.join(", "));
      persist(next);
      const filled = [
        parsed.full_name && "name",
        parsed.headline && "headline",
        parsed.location && "location",
        parsed.summary && "summary",
        parsed.skills.length && "skills",
        parsed.github_url && "GitHub",
        parsed.linkedin_url && "LinkedIn",
      ].filter(Boolean);
      setResumeStatus(
        filled.length
          ? `Resume read. Filled: ${filled.join(", ")}. Review and edit before publishing.`
          : "Resume text read, but little structure was detected. Paste or edit fields manually."
      );
    } catch (e) {
      setResumeStatus(e instanceof Error ? e.message : "Could not read resume.");
    } finally {
      setResumeBusy(false);
    }
  }

  function onSave() {
    persist(profile);
  }

  function onExport() {
    const json = exportProfileJson(withSkills(profile));
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hirehired-profile-${(profile.full_name || "candidate").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onPublish() {
    setPublishMsg("");
    let next = withSkills(profile);
    if (!next.full_name.trim()) {
      setPublishMsg("Add your name before publishing.");
      return;
    }
    if (!next.public_slug.trim()) {
      next = { ...next, public_slug: slugifyName(next.full_name) };
    }
    next = {
      ...next,
      share_enabled: true,
      public_slug: next.public_slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      published_at: new Date().toISOString(),
    };
    const card = profileToPublicCard(next);
    if (!card) {
      setPublishMsg("Could not build card.");
      return;
    }
    const res = await publishCard(card);
    setProfile(next);
    saveProfile(next);
    if (res.error) {
      setPublishMsg(
        `Published on this device. Cloud sync note: ${res.error}. Run supabase/public-cards.sql if needed.`
      );
    } else {
      setPublishMsg("Card published. Anyone with the link or QR can open it.");
    }
  }

  async function onUnpublish() {
    const slug = profile.public_slug;
    if (slug) await unpublishCard(slug);
    const next = { ...profile, share_enabled: false, published_at: undefined };
    persist(next);
    setPublishMsg("Card unpublished.");
  }

  function addClaim() {
    if (!claimDraft.title.trim()) return;
    const claim: Claim = {
      id: newClaimId(),
      claim_type: claimDraft.claim_type,
      title: claimDraft.title.trim(),
      evidence_url: claimDraft.evidence_url.trim() || undefined,
      status: claimDraft.evidence_url.trim() ? "linked" : claimDraft.status,
    };
    persist({ ...profile, claims: [...profile.claims, claim] });
    setClaimDraft({
      claim_type: "link",
      title: "",
      evidence_url: "",
      status: "self_reported",
    });
  }

  function removeClaim(id: string) {
    persist({ ...profile, claims: profile.claims.filter((c) => c.id !== id) });
  }

  const publicUrl = useMemo(() => {
    if (!profile.public_slug) return "";
    return cardPublicUrl(profile.public_slug);
  }, [profile.public_slug]);

  const field =
    "w-full h-11 rounded border border-neutral-300 px-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your profile</h1>
          <p className="mt-3 text-lg text-neutral-600 leading-relaxed">
            Upload a resume to fill fields and draft a summary, or edit by hand.
            Export as JSON or publish a short public card with a QR. Claims are
            self-reported or linked to a URL. Hirehired does not verify backgrounds.
          </p>

          <div className="mt-8 space-y-6">
            <section className="border border-neutral-200 rounded-lg p-4 sm:p-6 space-y-3">
              <h2 className="text-lg font-semibold">Upload resume</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                PDF, DOCX, or TXT. We read the file in your browser and fill name,
                headline, location, skills, links, and a short summary. Nothing is
                uploaded to Hirehired servers for this step. Always review the result.
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                disabled={resumeBusy}
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  void onResumeFile(f);
                  e.target.value = "";
                }}
                className="block w-full text-sm text-neutral-600 file:mr-3 file:h-10 file:rounded file:border-0 file:bg-neutral-900 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-800"
              />
              {resumeBusy ? (
                <p className="text-sm text-neutral-500">Reading resume...</p>
              ) : null}
              {resumeStatus ? (
                <p className="text-sm text-neutral-600">{resumeStatus}</p>
              ) : null}
            </section>

            <section className="border border-neutral-200 rounded-lg p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Basics</h2>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Full name</label>
                <input
                  className={field}
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Alex Tan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Headline</label>
                <input
                  className={field}
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="Senior Compliance Manager, APAC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Location</label>
                <input
                  className={field}
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Singapore"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Summary</label>
                <textarea
                  className="w-full min-h-[100px] rounded border border-neutral-300 px-3 py-2 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  value={profile.summary}
                  onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                  placeholder="Short professional summary..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  className={field}
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="KYC, AML, Product management, Python"
                />
              </div>
            </section>

            <section className="border border-neutral-200 rounded-lg p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Links</h2>
              <p className="text-sm text-neutral-500">
                External profiles you control. Linking is not verification by Hirehired.
              </p>
              {(
                [
                  ["github_url", "GitHub", "https://github.com/you"],
                  ["linkedin_url", "LinkedIn", "https://linkedin.com/in/you"],
                  ["portfolio_url", "Portfolio / site", "https://yoursite.com"],
                ] as const
              ).map(([key, label, ph]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">{label}</label>
                  <input
                    className={field}
                    value={profile[key]}
                    onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                    placeholder={ph}
                  />
                </div>
              ))}
            </section>

            <section className="border border-neutral-200 rounded-lg p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Claims and evidence</h2>
              <p className="text-sm text-neutral-500">
                Optional. Self-reported means you typed it. Linked means you added a URL.
              </p>

              {profile.claims.length === 0 ? (
                <p className="text-sm text-neutral-400">No claims yet.</p>
              ) : (
                <ul className="divide-y divide-neutral-100 border border-neutral-200 rounded">
                  {profile.claims.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 px-3 py-3"
                    >
                      <div className="flex-1 min-w-0">
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
                      </div>
                      <button
                        type="button"
                        onClick={() => removeClaim(c.id)}
                        className="text-sm text-neutral-500 hover:text-red-600 shrink-0"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Type</label>
                  <select
                    className={field}
                    value={claimDraft.claim_type}
                    onChange={(e) =>
                      setClaimDraft({
                        ...claimDraft,
                        claim_type: e.target.value as Claim["claim_type"],
                      })
                    }
                  >
                    <option value="skill">Skill</option>
                    <option value="employment">Employment</option>
                    <option value="education">Education</option>
                    <option value="cert">Certificate</option>
                    <option value="contribution">Contribution</option>
                    <option value="link">Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1">Title</label>
                  <input
                    className={field}
                    value={claimDraft.title}
                    onChange={(e) => setClaimDraft({ ...claimDraft, title: e.target.value })}
                    placeholder="CAMS certification"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-neutral-600 mb-1">
                    Evidence URL (optional)
                  </label>
                  <input
                    className={field}
                    value={claimDraft.evidence_url}
                    onChange={(e) => setClaimDraft({ ...claimDraft, evidence_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addClaim}
                className="h-10 px-4 rounded border border-neutral-300 text-sm font-semibold hover:border-neutral-500"
              >
                Add claim
              </button>
            </section>

            <section className="border border-neutral-200 rounded-lg p-4 sm:p-6 space-y-4">
              <h2 className="text-lg font-semibold">Public card and QR</h2>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Publish a short public page others can open from a link or QR code.
                Off by default. Unpublish anytime.
              </p>
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">
                  Card URL slug
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-neutral-400">/c/</span>
                  <input
                    className={`${field} max-w-xs`}
                    value={profile.public_slug}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        public_slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    placeholder={slugifyName(profile.full_name || "your-name")}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onPublish}
                  className="h-11 px-5 rounded bg-blue-700 text-white text-base font-semibold hover:bg-blue-800"
                >
                  Publish card
                </button>
                {profile.share_enabled ? (
                  <button
                    type="button"
                    onClick={onUnpublish}
                    className="h-11 px-5 rounded border border-neutral-300 text-base font-semibold hover:border-neutral-500"
                  >
                    Unpublish
                  </button>
                ) : null}
                {profile.share_enabled && publicUrl ? (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 px-5 inline-flex items-center rounded border border-neutral-200 text-base font-medium text-blue-700 hover:border-blue-400"
                  >
                    Open card
                  </a>
                ) : null}
              </div>
              {publishMsg ? (
                <p className="text-sm text-neutral-600">{publishMsg}</p>
              ) : null}
              {profile.share_enabled && publicUrl ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImageUrl(publicUrl, 200)}
                    alt="QR code linking to your public card"
                    width={200}
                    height={200}
                    className="border border-neutral-200 rounded bg-white"
                  />
                  <div className="text-sm text-neutral-600 space-y-2">
                    <p className="font-medium text-neutral-800">Your card QR</p>
                    <p className="break-all">{publicUrl}</p>
                    <a
                      href={qrImageUrl(publicUrl, 400)}
                      download={`hirehired-card-${profile.public_slug}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center rounded border border-neutral-300 px-3 text-sm font-semibold hover:border-neutral-500"
                    >
                      Open QR image
                    </a>
                    <p className="text-xs text-neutral-400">
                      Scan opens your public card. Same idea as handing someone a business card.
                    </p>
                  </div>
                </div>
              ) : null}
            </section>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={onSave}
                className="h-11 px-5 rounded bg-neutral-900 text-white text-base font-semibold hover:bg-neutral-800"
              >
                Save profile
              </button>
              <button
                type="button"
                onClick={onExport}
                className="h-11 px-5 rounded border border-neutral-300 text-base font-semibold hover:border-neutral-500"
              >
                Export JSON
              </button>
              <Link
                href="/jobs/"
                className="h-11 px-5 inline-flex items-center rounded border border-neutral-200 text-base font-medium text-neutral-700 hover:border-neutral-400"
              >
                Browse jobs
              </Link>
              {saved && <span className="text-sm text-green-700 font-medium">Saved</span>}
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Profile is saved in this browser. Export downloads a JSON file.
              Publish stores the public card locally and on Supabase when{" "}
              <code className="text-neutral-600">public_cards</code> is set up.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
