import Link from "next/link";
import type { ReactNode } from "react";

export function CaseStudyShell({
  eyebrow,
  title,
  tags,
  children,
  prevLink = { href: "/work", label: "← back to selected work" },
  nextLink,
}: {
  eyebrow: string;
  title: string;
  tags: string[];
  children: ReactNode;
  prevLink?: { href: string; label: string };
  nextLink?: { href: string; label: string };
}) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/work"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← selected work
      </Link>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-widest text-muted">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
        <div className="rule-gradient mt-3 w-12" />
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

      <div className="mt-10 space-y-10">{children}</div>

      <div className="relative mt-12 overflow-hidden rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 pl-5 text-xs leading-relaxed text-muted">
        <div
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ background: "var(--brand-gradient)" }}
        />
        Portfolio version uses representative data and recreated visuals.
        Proprietary company information has been removed.
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--border-solid)] pt-6">
        <Link
          href={prevLink.href}
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          {prevLink.label}
        </Link>
        {nextLink && (
          <Link
            href={nextLink.href}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            {nextLink.label}
          </Link>
        )}
      </div>
    </main>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-sm uppercase tracking-widest text-muted">
        {heading}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </section>
  );
}

export function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm leading-relaxed">
          <span className="text-muted">–</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-foreground">{children}</p>;
}

/** Restrained scope indicators — scale of inputs and analysis, not outcomes. */
export function AtAGlance({
  stats,
  note,
}: {
  stats: { value: string; label: string }[];
  note?: string;
}) {
  return (
    <section>
      <h2 className="text-sm uppercase tracking-widest text-muted">
        At a glance
      </h2>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 sm:grid-cols-5">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col-reverse justify-end gap-1 ${
              i === stats.length - 1 && stats.length % 2 === 1
                ? "col-span-2 sm:col-span-1"
                : ""
            }`}
          >
            <dt className="text-xs leading-snug text-muted">{stat.label}</dt>
            <dd className="text-2xl font-bold text-foreground">{stat.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-2 text-xs leading-relaxed text-muted">{note}</p>}
    </section>
  );
}

/** Term / detail rows — for scannable inventories. */
export function DefList({ items }: { items: { term: string; detail: string }[] }) {
  return (
    <dl className="divide-y divide-[var(--border-solid)] rounded-xl border border-[var(--border-solid)] bg-[var(--surface)]">
      {items.map((item) => (
        <div
          key={item.term}
          className="grid gap-1 px-4 py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4"
        >
          <dt className="text-xs uppercase tracking-widest text-muted">
            {item.term}
          </dt>
          <dd className="text-sm leading-relaxed text-foreground">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Numbered sub-heading (h3) for the views inside a section. */
export function ViewHeading({ n, children }: { n: number; children: ReactNode }) {
  return (
    <h3 className="flex items-baseline gap-2 font-semibold text-foreground">
      <span className="text-xs font-normal text-muted">
        {String(n).padStart(2, "0")}
      </span>
      {children}
    </h3>
  );
}

export function Pills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-[var(--border-solid)] px-2 py-0.5 text-xs text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Callout with the gradient left-edge accent used for the portfolio notice. */
export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 pl-5 text-sm leading-relaxed">
      <div
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: "var(--brand-gradient)" }}
      />
      {title && <p className="font-semibold text-foreground">{title}</p>}
      <div className={`space-y-2 text-muted ${title ? "mt-1" : ""}`}>{children}</div>
    </div>
  );
}
