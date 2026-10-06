import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/app/lib/case-studies";
import { CaseStudyCard } from "@/app/work/_components/case-study-card";
import { MethodSteps } from "@/app/work/_components/method-steps";

const PAGE_TITLE = "Applied AI & Innovation | Roxy Bischoff";
const PAGE_DESCRIPTION =
  "Selected work in applied AI, automation, experimentation, operational innovation, and transformation—from problem discovery and analysis through prototyping, decision support, and implementation planning.";

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "/work",
    type: "website",
    images: [
      {
        url: "/roxylabs_applied_ai_digital_transformation_og.png",
        width: 1733,
        height: 907,
        alt: "Applied AI & Digital Transformation — RoxyLabs selected work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: "/roxylabs_applied_ai_digital_transformation_og.png",
        alt: "Applied AI & Digital Transformation — RoxyLabs selected work",
      },
    ],
  },
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← roxylabs
      </Link>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-widest text-muted">
          Applied AI &amp; Innovation
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Selected Work</h1>
        <div className="rule-gradient mt-3 w-12" />
        <div className="mt-3 max-w-xl space-y-3 text-sm leading-relaxed text-muted">
          <p>
            Most organizations start with generative AI through isolated
            experiments — a piece of copy, a quick answer, a faster task.
            I&rsquo;m interested in a different question: how do AI,
            automation, data, and emerging technology become part of how an
            organization actually works?
          </p>
          <p>
            I start with the problem, not the technology: friction, repeated
            decisions, fragmented information, workflows that take too much
            manual effort. Then I investigate, work out where technology can
            genuinely help, prototype something practical, and learn from
            what holds up.
          </p>
        </div>
      </div>

      {/* Case studies */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm uppercase tracking-widest text-muted">
          case studies
        </h2>
        <div className="space-y-4">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} variant="list" />
        ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-widest text-muted">
          how I work
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground">
          I don&rsquo;t start by asking where AI can be inserted. I start by
          understanding the problem, then determine whether AI, automation,
          data, or a simpler solution is actually useful.
        </p>
        <MethodSteps />
      </section>

      {/* AI enablement */}
      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-widest text-muted">
          AI Enablement &amp; Adoption
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
          <p>
            I&rsquo;m Director, Digital Operations within Tours Digital
            Solutions (TDS), a primarily engineering organization. Separately,
            I serve as the AI Ambassador for EF&rsquo;s Marketing
            organization.
          </p>
          <p>
            The role puts me at the intersection of business needs and
            emerging technology: helping surface useful applications for AI,
            supporting experimentation and adoption, and helping teams
            understand where AI can meaningfully improve how they work.
          </p>
          <p className="text-muted">
            This work is ongoing, and I&rsquo;ll add examples and learnings as
            the program develops.
          </p>
        </div>
      </section>

      {/* Connecting the dots */}
      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-widest text-muted">
          the larger strategy
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
          <p>
            The individual tools above solve useful problems on their own —
            alongside a{" "}
            <Link
              href="/experiments/utm-builder"
              className="text-foreground underline decoration-[var(--border-solid)] underline-offset-2 hover:decoration-foreground"
            >
              UTM and link-building tool
            </Link>{" "}
            and AI-assisted email copy generation built with colleagues. The
            bigger opportunity is connecting them.
          </p>
          <p>
            A campaign workflow could eventually move from plan → generate →
            optimize → build → send → measure → learn, with information
            flowing between steps rather than disappearing into separate
            tools and processes — so each campaign helps inform the next
            one.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm uppercase tracking-widest text-muted">
          my approach
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
          <p>I don&rsquo;t start with the question, where can we put AI?</p>
          <p>
            I start with: where is there friction? Where are people
            repeatedly making the same decisions? Where is useful
            information difficult to access or interpret? From there, I look
            at how AI, automation, data, and existing platforms can work
            together to solve the problem.
          </p>
          <p>
            I&rsquo;m hands-on by nature. Across these initiatives, my role
            spans problem identification, analysis, solution design,
            AI-assisted prototyping and development, workflow design,
            stakeholder collaboration, and planning how individual
            capabilities evolve into more scalable systems.
          </p>
        </div>
      </section>

      {/* Bridge to experiments + CTA */}
      <section className="mt-12 border-t border-[var(--border-solid)] pt-8">
        <p className="text-sm text-foreground">
          I also make things just to see what happens.{" "}
          <Link
            href="/#experiments"
            className="text-muted underline decoration-[var(--border-solid)] underline-offset-2 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Explore experiments →
          </Link>
        </p>

        <div className="relative mt-6 overflow-hidden rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 pl-5">
          <div
            className="absolute inset-y-0 left-0 w-[3px]"
            style={{ background: "var(--brand-gradient)" }}
          />
          <p className="text-sm leading-relaxed text-foreground">
            I&rsquo;m interested in applied AI, AI enablement,
            experimentation, emerging technology, and hands-on transformation
            roles.
          </p>
          <a
            href="https://www.linkedin.com/in/rbischoff/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg border border-[var(--border-solid)] px-3 py-1.5 text-sm text-foreground transition-colors hover:border-[var(--brand-1)] hover:bg-[var(--surface-hover)]"
          >
            Connect with me on LinkedIn ↗
          </a>
        </div>
      </section>

      <div className="mt-12 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-muted">
        Examples shown in this portfolio are recreated using representative
        data. Proprietary company information, internal systems, and
        performance data have been removed.
      </div>
    </main>
  );
}
