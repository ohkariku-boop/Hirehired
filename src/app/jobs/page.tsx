import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JobsBoard } from "@/components/JobsBoard";
import jobs from "@/data/jobs.json";

export default function JobsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <Suspense fallback={<p className="text-neutral-500">Loading roles…</p>}>
            <JobsBoard jobs={jobs} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
