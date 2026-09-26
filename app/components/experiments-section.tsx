"use client";

import Link from "next/link";
import { useState, type ComponentType } from "react";
import { type Experiment, type ExperimentVisual } from "@/app/lib/experiments";
import {
  EyeMotif,
  GradientMotif,
  LinkMotif,
  CreditsMotif,
  NewsMotif,
  GenericMotif,
} from "@/app/components/motifs";

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
  news: NewsMotif,
  generic: GenericMotif,
};

function TagPill({
  tag,
  active,
  onSelect,
}: {
  tag: string;
  active: boolean;
  onSelect: (tag: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(tag);
      }}
      aria-pressed={active}
      className={`rounded-full border px-2 py-0.5 text-xs transition-colors ${
        active
          ? "border-[var(--brand-1)] bg-[var(--brand-1)] text-white"
          : "border-[var(--border-solid)] text-muted hover:border-[var(--brand-1)] hover:text-foreground"
      }`}
    >
      {tag}
    </button>
  );
}

function ExperimentCard({
  experiment,
  activeTag,
  onTagSelect,
}: {
  experiment: Experiment;
  activeTag: string | null;
  onTagSelect: (tag: string) => void;
}) {
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
          <TagPill key={tag} tag={tag} active={tag === activeTag} onSelect={onTagSelect} />
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

export function ExperimentsSection({ experiments }: { experiments: Experiment[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  function handleTagSelect(tag: string) {
    setActiveTag((cur) => (cur === tag ? null : tag));
  }

  const visible = activeTag
    ? experiments.filter((e) => e.tags.includes(activeTag))
    : experiments;

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-sm uppercase tracking-widest text-muted">
          experiments
        </h2>
        <span className="text-xs text-muted">
          {activeTag ? (
            <>
              {visible.length} tagged{" "}
              <span className="font-semibold text-foreground">{activeTag}</span>
              {" · "}
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="underline decoration-[var(--border-solid)] underline-offset-2 hover:text-foreground hover:decoration-foreground"
              >
                show all
              </button>
            </>
          ) : (
            `${experiments.length} in the lab`
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((experiment) => (
          <ExperimentCard
            key={experiment.slug}
            experiment={experiment}
            activeTag={activeTag}
            onTagSelect={handleTagSelect}
          />
        ))}
      </div>
    </section>
  );
}
