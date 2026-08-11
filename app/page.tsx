import Image from "next/image";
import Link from "next/link";
import { experiments, type Experiment } from "@/app/lib/experiments";

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

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const { title, description, status, year, tags, href, external } = experiment;

  const inner = (
    <div className="group flex h-full flex-col rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5 transition-colors hover:bg-[var(--surface-hover)]">
      <div className="mb-3 flex items-center justify-between">
        <StatusBadge status={status} />
        <span className="text-xs text-muted">{year}</span>
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        {title}
        {href && (
          <span className="ml-1 inline-block text-muted transition-transform group-hover:translate-x-0.5">
            {external ? "↗" : "→"}
          </span>
        )}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
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
      <section className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left">
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
          <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">
            experiments in automation, marketing, operations, ai, and creative
            projects.
          </p>
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
            old site/creative work
          </a></span>
        </div>
      </footer>
    </main>
  );
}
