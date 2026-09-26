import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/app/lib/case-studies";

const OG_TITLE = "Applied AI & Digital Transformation | RoxyLabs";
const OG_DESCRIPTION =
  "Selected work exploring how AI, automation, and digital tools can solve real customer experience and marketing operations problems.";

export const metadata: Metadata = {
  title: "Applied AI & Digital Transformation",
  description:
    "Digital transformation & applied AI — sanitized case studies from building AI-enabled tools for real business problems.",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
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
    title: OG_TITLE,
    description: OG_DESCRIPTION,
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
          Digital Transformation &amp; Applied AI
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Selected Work</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Most organizations start with generative AI through isolated
          experiments — a piece of copy, a quick answer, a faster task. I&rsquo;ve
          been focused on a different question: how does AI become part of
          the actual operating system of a marketing organization?
        </p>
      </div>

      {/* Case studies */}
      <section className="mt-10 space-y-4">
        {caseStudies.map((study) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="group block rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5 transition-colors hover:bg-[var(--surface-hover)]"
          >
            <div className="flex flex-wrap gap-1.5">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border-solid)] px-2 py-0.5 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="mt-3 text-lg font-semibold text-foreground">
              {study.title}
              <span className="ml-1 inline-block text-muted transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </h2>
            <p className="mt-1 text-sm text-muted">{study.subtitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {study.summary}
            </p>
          </Link>
        ))}
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
            Across these initiatives, my role spans problem identification,
            solution design, hands-on AI-assisted prototyping and
            development, workflow design, stakeholder collaboration, and
            planning how individual capabilities evolve into more scalable
            systems.
          </p>
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
