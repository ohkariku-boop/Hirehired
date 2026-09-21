"use client";

import { useEffect, useState } from "react";
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
} from "@/lib/profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<HirehiredProfile>(EMPTY_PROFILE);
  const [skillsInput, setSkillsInput] = useState("");
  const [saved, setSaved] = useState(false);
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

  function persist(next: HirehiredProfile) {
    setProfile(next);
    saveProfile(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function onSave() {
    const skills = skillsInput
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    persist({ ...profile, skills });
  }

  function onExport() {
    const skills = skillsInput
      .split(/[,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const json = exportProfileJson({ ...profile, skills });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hirehired-profile-${(profile.full_name || "candidate").replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  const field =
    "w-full h-11 rounded border border-neutral-300 px-3 text-base focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <p className="text-sm font-medium text-blue-700 uppercase tracking-wide mb-2">
            Your profile
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your profile</h1>
          <p className="mt-3 text-lg text-neutral-600 leading-relaxed">
            Keep a profile you can export and take with you. Proofs are labeled honestly  - 
            self-reported or linked evidence  -  not fake platform verification. Discovery stays
            the core of Hirehired; identity travels with you over time.
          </p>

          <div className="mt-8 space-y-6">
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
                  placeholder="Senior Compliance Manager · APAC"
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
                  placeholder="Short professional summary…"
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
                External profiles you control. Linking is not the same as Hirehired verifying you.
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
              <h2 className="text-lg font-semibold">Claims & evidence</h2>
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
                    placeholder="https://…"
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

            <div className="flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={onSave}
                className="h-11 px-5 rounded bg-blue-700 text-white text-base font-semibold hover:bg-blue-800"
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
              Saved in this browser for now. Export downloads a JSON file you can keep offline.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
