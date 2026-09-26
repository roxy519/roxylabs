import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { experiments, type Experiment, type ExperimentVisual } from "@/app/lib/experiments";
import { caseStudies } from "@/app/lib/case-studies";
import { CaseStudyCard } from "@/app/work/_components/case-study-card";
import {
  HeroBackdrop,
  EyeMotif,
  GradientMotif,
  LinkMotif,
  CreditsMotif,
  GenericMotif,
} from "@/app/components/motifs";
import type { ComponentType } from "react";

const SITE_DESCRIPTION =
  "Experiments and selected work in automation, marketing, operations, AI, and creative technology.";

export const metadata: Metadata = {
  openGraph: {
    title: "roxylabs",
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "roxylabs",
    type: "website",
    images: [
      {
        url: "/roxylabs_applied_ai_realworld_og.png",
        width: 1733,
        height: 907,
        alt: "Applied AI for Real-World Impact — RoxyLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "roxylabs",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/roxylabs_applied_ai_realworld_og.png",
        alt: "Applied AI for Real-World Impact — RoxyLabs",
      },
    ],
  },
};

const statusLabel: Record<Experiment["status"], string> = {
  live: "live",
  building: "building",
  idea: "idea",
};

function StatusBadge({ status }: { status: Experiment["status"] }) {
  const dot =
    status === "live"
      ? "bg-emerald-400"
      : status === "building"
        ? "bg-amber-400"
        : "bg-neutral-500";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {statusLabel[status]}
    </span>
  );
}

const EXPERIMENT_MOTIFS: Record<ExperimentVisual, ComponentType<{ gradientId: string }>> = {
  eye: EyeMotif,
  gradient: GradientMotif,
  link: LinkMotif,
  credits: CreditsMotif,
  generic: GenericMotif,
};

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const { slug, title, description, status, year, tags, href, external, visual } = experiment;
  const Motif = EXPERIMENT_MOTIFS[visual ?? "generic"];

  const inner = (
    <div className="lab-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5 transition-colors hover:bg-[var(--surface-hover)]">
      <Motif gradientId={`exp-${slug}`} />

      <div className="relative mb-3 flex items-center justify-between">
        <StatusBadge status={status} />
        <span className="text-xs text-muted">{year}</span>
      </div>

      <h3 className="relative text-lg font-semibold text-foreground">
        {title}
        {href && (
          <span className="ml-1 inline-block text-muted transition-transform group-hover:translate-x-0.5">
            {external ? "↗" : "→"}
          </span>
        )}
      </h3>

      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--border-solid)] px-2 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  if (!href) return inner;

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={href}>{inner}</Link>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16 sm:py-24">
      {/* Hero */}
      <section className="relative isolate overflow-hidden py-6 sm:py-10">
        <HeroBackdrop gradientId="hero" />

        <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
          <Image
            src="/roxylabs-mark-gradient.png"
            alt="roxylabs"
            width={104}
            height={104}
            priority
            className="shrink-0"
          />
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl">
              <span className="brand-text">roxylabs</span>
            </h1>
            <div className="rule-gradient mt-3 mx-auto w-16 sm:mx-0" />
            <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
              experiments and selected work in automation, marketing,
              operations, AI, and creative technology.
            </p>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="mt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-widest text-muted">
            selected work
          </h2>
          <Link
            href="/work"
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            how I approach applied AI →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} study={study} variant="grid" />
          ))}
        </div>
      </section>

      {/* Experiments */}
      <section className="mt-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-widest text-muted">
            experiments
          </h2>
          <span className="text-xs text-muted">
            {experiments.length} in the lab
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((experiment) => (
            <ExperimentCard key={experiment.slug} experiment={experiment} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-[var(--border-solid)] pt-6 text-xs text-muted">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} roxylabs</span>
          <span>built in public · always experimenting | <a href="https://roxycreates.com" target="_blank" style={{ color: '#ebebeb' }} rel="noopener noreferrer" className="text-primary hover:underline">
            old site/creative work &#8594;
          </a> | <a href="https://www.linkedin.com/in/rbischoff/" target="_blank" style={{ color: '#ebebeb' }} rel="noopener noreferrer" className="text-primary hover:underline">
            LinkedIn ↗
          </a></span>
        </div>
      </footer>
    </main>
  );
}
