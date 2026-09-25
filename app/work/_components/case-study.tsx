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
        <div className="mt-3 flex flex-wrap gap-1.5">
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

      <div className="mt-12 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-muted">
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
