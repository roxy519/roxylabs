import type { Metadata } from "next";
import {
  CaseStudyShell,
  Section,
  List,
  SubHeading,
  AtAGlance,
  DefList,
  ViewHeading,
  Pills,
  Callout,
} from "../_components/case-study";
import { CaseStudyImage } from "../_components/case-study-image";

const OG_TITLE = "Communications Intelligence | RoxyLabs";
const OG_DESCRIPTION =
  "A fragmented customer-communications landscape, researched and structured into an interactive tool for analysis, scenario modeling, and implementation planning.";

export const metadata: Metadata = {
  title: "Communications Intelligence",
  description:
    "How a fragmented customer-communications landscape was researched, structured, and turned into an analysis, scenario-modeling, and roadmap tool — a sanitized applied AI case study.",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/work/communications-intelligence",
    type: "article",
    images: [
      {
        url: "/roxylabs_communications_intelligence_og.png",
        width: 1734,
        height: 907,
        alt: "Communications Intelligence — RoxyLabs case study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: "/roxylabs_communications_intelligence_og.png",
        alt: "Communications Intelligence — RoxyLabs case study",
      },
    ],
  },
};

export default function Page() {
  return (
    <CaseStudyShell
      eyebrow="Applied AI · Customer Experience · Omnichannel Strategy · Digital Transformation"
      title="Turning Fragmented Customer Communications Into a Connected View"
      tags={["Applied AI", "Customer Experience", "Digital Transformation"]}
      nextLink={{ href: "/work/sms-optimization", label: "Next: SMS Optimization →" }}
    >
      <AtAGlance
        stats={[
          { value: "31", label: "Source documents synthesized" },
          { value: "219+", label: "Recurring Marketing + triggered emails incorporated" },
          { value: "6", label: "Sales stakeholders consulted in discovery" },
          { value: "15+", label: "Communication channels and surfaces considered" },
          { value: "5", label: "Views, from landscape to implementation roadmap" },
        ]}
        note="Scope of the inputs and analysis — not outcomes. 219+ is the known Marketing and triggered email inventory (52 ongoing + 167 recurring triggered), not a count of every communication across all channels."
      />

      <Section heading="The challenge">
        <p>
          The organization communicates with customers across many teams,
          systems, channels, and stages of the journey. Those communications
          were hard to see as one connected experience, because the
          information lived across departments, platforms, documents, and
          individuals.
        </p>
        <p>
          Questions like <em>What is a customer receiving? From whom?
          Through which channel? At what point in their journey?</em> meant
          piecing together answers from many sources.
        </p>
        <p>
          The project began as an effort to understand the full
          communications landscape. It evolved into a system for analyzing
          it, identifying opportunities, modeling changes, and planning
          implementation.
        </p>
      </Section>

      <Section heading="Research & inputs">
        <p>
          I gathered inputs from existing documentation and from
          stakeholders across functions, then inventoried the communications
          and structured them into a single model.
        </p>
        <DefList
          items={[
            { term: "Documents", detail: "31 source and reference documents synthesized" },
            {
              term: "Email",
              detail:
                "52 ongoing Marketing emails and 167 recurring triggered emails (219+ in all), plus Customer Support email",
            },
            { term: "Messaging", detail: "Marketing SMS, Sales text messaging, and live chat" },
            {
              term: "Owned digital",
              detail: "Website, landing pages, forms, the logged-in portal, and the app",
            },
            { term: "Paid", detail: "Paid media and paid search" },
            { term: "Phone & mail", detail: "Customer phone hotline, Sales phone, and direct mail" },
            {
              term: "People",
              detail: "Discovery with 6 Sales stakeholders to understand their communications",
            },
          ]}
        />
        <p className="text-muted">
          Other communications were investigated and removed once they were
          determined not to be relevant. The 219+ figure covers the known
          Marketing and triggered email inventory only — it isn&rsquo;t a count of
          every communication across the ecosystem.
        </p>
      </Section>

      <Section heading="What I did">
        <p>
          I independently conceived, researched, analyzed, designed, and
          built the system. I gathered inputs from existing documentation
          and stakeholders across functions, developed the communications
          taxonomy and journey model, performed the analysis, created the
          recommendations and future-state scenarios, defined the
          measurement approach and implementation roadmap, and built the
          interactive tool using AI-assisted development.
        </p>
        <p>
          Colleagues across functions supplied information, took part in
          discovery, reviewed the work, and are involved in the decisions
          that follow. The analysis, framework, recommendations, and tool
          are the part I did myself.
        </p>
        <p>
          AI-assisted development is how I turned the model into a working,
          interactive tool rather than a static deck. The work sits at the
          intersection of customer experience, digital operations, data
          organization, AI, and cross-functional transformation.
        </p>
      </Section>

      <Section heading="How the tool works: five views">
        <p>
          Each view builds on the one before it — from understanding what
          exists, to deciding what to change, to planning how to do it.
        </p>

        <div className="space-y-1.5 pt-2">
          <ViewHeading n={1}>Landscape</ViewHeading>
          <p>
            The comprehensive current-state inventory. Communications are
            organized by channel, category, customer journey, timing,
            product, and other dimensions. The goal is to understand what
            exists before attempting to optimize anything.
          </p>
        </div>

        <div className="space-y-1.5 pt-2">
          <ViewHeading n={2}>Timeline</ViewHeading>
          <p>
            Maps communications onto a single journey view based on days
            prior to departure, filterable by channel, journey stage, and
            product. It makes communication density, peaks, valleys,
            sequencing, and competing touchpoints visible, and includes a
            calendar view of inbound communication traffic where
            applicable.
          </p>
        </div>

        <CaseStudyImage
          src="/Comms-timeline-preview.png"
          alt="Sanitized screenshot of the communications intelligence workspace, showing the timeline view with channel, category, and product filters"
          width={1652}
          height={952}
          caption="Sanitized Timeline view. Communications are mapped onto one journey by days before departure and can be filtered by channel, category, and product."
          subcaption="Recreated with representative data. Proprietary company information and performance data have been removed."
        />

        <div className="space-y-1.5 pt-2">
          <ViewHeading n={3}>Best Practices</ViewHeading>
          <p>
            Moves from inventory to channel strategy: how each channel is
            used today next to how it ideally should be, what each channel
            is for — and what it should <em>not</em> be used for. The point
            is a more deliberate channel architecture.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <ViewHeading n={4}>Recommendations &amp; Analysis</ViewHeading>
          <p>
            This is the part of the tool that turns analysis into
            decisions. It examines where customers receive the highest
            communication pressure, where they receive too little, and
            how varied, well-covered, and well-balanced the experience is:
          </p>
          <List
            items={[
              "communication pressure — too much, and too little",
              "communication variety",
              "channel utilization",
              "journey coverage against defined goals",
              "strengths, weaknesses, and opportunities for optimization",
            ]}
          />
          <p>
            It can be analyzed by time window, sub-category, channel, and
            product where applicable, and it separates three states:
          </p>
          <Pills items={["Current", "Easy moves", "Larger changes"]} />
          <p>Recommended actions include:</p>
          <Pills items={["re-time", "combine", "cut", "add", "move channel", "other optimizations"]} />
          <p>
            It evaluates whether the defined journey goals are being met and
            where coverage falls short, proposes sequencing, rollout, and
            priority, and includes a measurement framework — based on
            available reporting and relevant benchmarks — for judging
            whether a change worked. It also surfaces the key decisions
            that have to be made in cross-functional planning.
          </p>
          <Callout title="Modeled, not measured">
            <p>
              The figures shown for Easy moves and Larger changes are
              proposed scenarios — modeled future states used to compare
              options. They are not results the business has achieved.
            </p>
          </Callout>
        </div>

        <div className="space-y-1.5 pt-2">
          <ViewHeading n={5}>Roadmap</ViewHeading>
          <p>
            Turns the recommendations into an implementation plan: the
            proposed change, priority, timing, channel, category, and
            whether it&rsquo;s a smaller, easier move or a larger one. The
            project doesn&rsquo;t stop at analysis — it translates insight
            into a plan that can be executed.
          </p>
        </div>
      </Section>

      <Section heading="What it enabled">
        <p>
          For the first time, teams can examine the Group Leader
          communications experience as one connected journey rather than as
          separate channel or departmental programs.
        </p>
        <p>
          The system makes communication density, gaps, channel usage,
          automation, journey coverage, and competing touchpoints visible in
          one place — and allows proposed changes to be modeled before
          implementation.
        </p>
        <p>
          It is now serving as a decision framework for cross-functional
          discussions about the future communications experience: which
          communications to re-time, combine, remove, add, or move between
          channels, and how those changes should be prioritized and
          measured.
        </p>
        <Callout title="Where this stands">
          <p>
            Implementation hasn&rsquo;t begun, so there are no measured
            business results to report yet. What exists today is shared
            visibility, modeled scenarios, prioritized recommendations,
            defined measurement criteria, and an implementation roadmap.
            Results will be added here once changes are in market and can
            be measured.
          </p>
        </Callout>
      </Section>

      <Section heading="Cross-functional review">
        <p>
          The work is now informing a senior cross-functional
          transformation process spanning Transformation &amp; Strategy,
          Marketing, and Product/UX. An upcoming onsite adds input from
          Sales Enablement/Operations and Customer Success.
        </p>
      </Section>

      <Section heading="What&rsquo;s next">
        <p>
          The next phase adds another phone channel and incorporates
          qualitative research from Marketing and UX interviews with
          teachers about what they want to receive, when, and through which
          channels. Those findings will be integrated with the existing
          quantitative and operational analysis before implementation
          decisions are finalized.
        </p>
      </Section>

      <Section heading="Why it matters">
        <SubHeading>
          The goal wasn&rsquo;t to use AI for the sake of using AI.
        </SubHeading>
        <p>
          It was to make an otherwise difficult organizational problem
          easier to understand and act on — and to give a cross-functional
          group something concrete to reason about together, with a path
          from analysis to implementation.
        </p>
      </Section>
    </CaseStudyShell>
  );
}
