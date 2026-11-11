import type { Metadata } from "next";
import Image from "next/image";
import {
  CaseStudyShell,
  Section,
  List,
  SubHeading,
  ViewHeading,
} from "../_components/case-study";
import { CaseStudyImage } from "../_components/case-study-image";

const SEO_TITLE = "Digital Operations AI Guide | roxylabs";
const OG_DESCRIPTION =
  "Making AI useful in everyday digital operations through task-based recommendations, responsible-use guidance, and a searchable library of AI tools, agents, and skills.";
const OG_IMAGE = "/roxylabs_digitalops_aiguide_og.png";
const OG_ALT =
  "Digital Operations AI Guide — roxylabs case study: task-based recommendations, tool and platform guidance, privacy and responsible use, agents, skills and experiments, and team adoption and learning";

export const metadata: Metadata = {
  title: { absolute: SEO_TITLE },
  description:
    "How I designed and built an interactive AI guide to help digital operations teams discover tools, find existing solutions, use AI responsibly, and support everyday adoption.",
  openGraph: {
    title: SEO_TITLE,
    description: OG_DESCRIPTION,
    url: "/work/digital-operations-ai-guide",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1734, height: 907, alt: OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: OG_DESCRIPTION,
    images: [{ url: OG_IMAGE, alt: OG_ALT }],
  },
};

const ANON_NOTE =
  "Illustrative version of the original interface; internal details have been anonymized.";

export default function Page() {
  return (
    <CaseStudyShell
      eyebrow="Applied AI · AI Adoption · Digital Operations · Enablement"
      title="Making AI Useful in Everyday Digital Operations"
      tags={["Applied AI", "AI Adoption", "Digital Operations", "Enablement"]}
      nextLink={{
        href: "/work/communications-intelligence",
        label: "Next: Communications Intelligence →",
      }}
    >
      <div>
        <p className="text-sm leading-relaxed text-muted">
          Turning a growing collection of AI platforms, agents, skills, and
          experiments into a practical, searchable resource that helps teams
          know what to use, when to use it, and how to use it safely.
        </p>
        <Image
          src={OG_IMAGE}
          alt={OG_ALT}
          width={1734}
          height={907}
          priority
          className="mt-6 w-full rounded-xl border border-[var(--border-solid)]"
          sizes="(min-width: 768px) 720px, 100vw"
        />
      </div>

      <Section heading="The challenge">
        <p>
          As AI tools became increasingly available, the challenge
          wasn&rsquo;t simply giving people access. It was helping them
          understand which tools were appropriate for different tasks, how to
          use those tools effectively, what solutions already existed, and
          how to handle sensitive information responsibly.
        </p>
        <p>
          Without clear guidance, team members could spend unnecessary time
          experimenting with the wrong tools, duplicating work, or avoiding
          AI entirely because they weren&rsquo;t sure where to start.
        </p>
      </Section>

      <Section heading="What I built">
        <p>
          I designed and built the Digital Operations AI Guide as a
          centralized, interactive resource for my team. It brings together
          three connected capabilities.
        </p>

        <div className="space-y-2.5 pt-2">
          <ViewHeading n={1}>Guide</ViewHeading>
          <List
            items={[
              "A searchable, filterable list of everyday digital operations tasks, with recommended AI tools and explanations of why each is appropriate.",
              "Filters for platforms and use cases across web, email, SMS, live chat, troubleshooting, writing, QA, planning, and other operational activities.",
              "Guidance for situations involving sensitive, personal, or customer information.",
              "Practical instructions for using available AI platforms, including their capabilities, limitations, and relevant features.",
              "Recommendations and safeguards intended to make AI use more effective and responsible.",
            ]}
          />
        </div>

        <CaseStudyImage
          src="/digiops_ai_guide_interface.png"
          alt="Anonymized screenshot of the Guide view: a searchable task table with tool and use-case filters, a sensitive-data toggle, recommended tools with notes on what to watch for, ground rules for every tool, and a how-to-use section for each AI platform"
          width={1158}
          height={1359}
          caption="The Guide view. Team members search or filter everyday tasks, see which tool fits and why, and get ground rules and platform how-tos alongside the recommendation."
          subcaption={ANON_NOTE}
        />

        <div className="space-y-2.5 pt-2">
          <ViewHeading n={2}>Library</ViewHeading>
          <List
            items={[
              "A searchable, filterable directory of existing AI skills, agents, applications, and internal tools.",
              "Descriptions of what each solution does, which channels or functions it supports, where it lives, and how to access it.",
              "A way for team members to discover existing solutions before creating something redundant.",
              "Visibility into useful AI work being developed across the team.",
            ]}
          />
        </div>

        <CaseStudyImage
          src="/digiops_ai_guide_library.png"
          alt="Anonymized screenshot of the Library view: searchable, filterable cards for AI skills, agents, and apps, each showing channel, tool type, where it is hosted, owner, and a button to open it"
          width={1307}
          height={1203}
          caption="The Library view. Existing skills, agents, and apps are searchable by channel and tool type, with where each lives, who owns it, and how to open it."
          subcaption={ANON_NOTE}
        />

        <div className="space-y-2.5 pt-2">
          <ViewHeading n={3}>In Progress</ViewHeading>
          <List
            items={[
              "A dedicated view for AI tools, skills, agents, and experiments still in development.",
              "Greater visibility into emerging capabilities and opportunities for collaboration.",
            ]}
          />
        </div>
      </Section>

      <Section heading="My role and approach">
        <p>
          I conceived, designed, and built the guide, organized the
          information architecture, translated real operational tasks into
          actionable tool recommendations, and created a resource designed
          to support my team&rsquo;s ongoing AI adoption.
        </p>
        <p>
          This is not simply a documentation project. It is a practical
          enablement and adoption initiative that connects available
          technology with actual day-to-day work.
        </p>
        <p>
          It reflects my broader approach to applied AI: start with the
          problems people need to solve, reduce friction, make useful
          capabilities discoverable, and build repeatable processes that
          help teams adopt new ways of working.
        </p>
      </Section>

      <Section heading="Why it matters">
        <SubHeading>
          The guide creates a clearer path from AI access to practical use.
        </SubHeading>
        <p>It is intended to help team members:</p>
        <List
          items={[
            "Find appropriate tools more quickly.",
            "Understand how to get started.",
            "Make better-informed decisions about sensitive information.",
            "Reuse existing skills, agents, and applications.",
            "Discover experiments and opportunities to collaborate.",
            "Build confidence using AI in their everyday workflows.",
          ]}
        />
        <p className="text-muted">
          These are the intended benefits and practical capabilities of the
          guide, not measured results. I haven&rsquo;t published usage or
          productivity figures.
        </p>
      </Section>

      <Section heading="Takeaway">
        <p>
          Successful AI adoption requires more than access to technology. It
          requires useful guidance, discoverability, clear safeguards, and an
          understanding of how the technology fits into the work people
          actually do.
        </p>
        <p>
          This project demonstrates how I approach that challenge: combining
          operational knowledge, product thinking, hands-on experimentation,
          and team enablement to make AI genuinely useful.
        </p>
      </Section>
    </CaseStudyShell>
  );
}
