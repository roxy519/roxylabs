import Link from "next/link";
import type { ComponentType } from "react";
import type { CaseStudy } from "@/app/lib/case-studies";
import { CommsMotif, SmsMotif } from "@/app/components/motifs";

const MOTIFS: Record<string, ComponentType<{ gradientId: string }>> = {
  "communications-intelligence": CommsMotif,
  "sms-optimization": SmsMotif,
};

export function CaseStudyCard({
  study,
  variant = "grid",
}: {
  study: CaseStudy;
  variant?: "grid" | "list";
}) {
  const Motif = MOTIFS[study.slug];

  return (
    <Link
      href={`/work/${study.slug}`}
      className="lab-card group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5 transition-colors hover:bg-[var(--surface-hover)]"
    >
      {Motif && <Motif gradientId={`csc-${study.slug}`} />}

      <div className="relative flex flex-wrap gap-1.5">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--border-solid)] px-2 py-0.5 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3 className="relative mt-3 text-lg font-semibold text-foreground">
        {study.title}
        <span className="ml-1 inline-block text-muted transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </h3>

      {variant === "list" && (
        <p className="relative mt-1 text-sm text-muted">{study.subtitle}</p>
      )}

      <p className="relative mt-2 text-sm leading-relaxed text-muted">
        {study.summary}
      </p>
    </Link>
  );
}
