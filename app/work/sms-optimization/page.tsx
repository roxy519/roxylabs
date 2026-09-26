import type { Metadata } from "next";
import { CaseStudyShell, Section, SubHeading } from "../_components/case-study";
import { CaseStudyImage } from "../_components/case-study-image";

const OG_TITLE = "SMS Optimization | RoxyLabs";
const OG_DESCRIPTION =
  "An AI-enabled workspace for SMS planning, credit estimation, technical analysis, and copy optimization.";

export const metadata: Metadata = {
  title: "SMS Optimization",
  description:
    "Building an AI-enabled SMS optimization tool — a sanitized case study in applied AI and marketing operations.",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/work/sms-optimization",
    type: "article",
    images: [
      {
        url: "/roxylabs_sms_optimization_og.png",
        width: 1734,
        height: 907,
        alt: "SMS Optimization — RoxyLabs case study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: "/roxylabs_sms_optimization_og.png",
        alt: "SMS Optimization — RoxyLabs case study",
      },
    ],
  },
};

export default function Page() {
  return (
    <CaseStudyShell
      eyebrow="Applied AI · Marketing Operations · SMS · Decision Support · Cost Optimization"
      title="Building an AI-Enabled SMS Optimization Tool"
      tags={["Applied AI", "Marketing Operations", "Decision Support"]}
      prevLink={{ href: "/work/communications-intelligence", label: "← Communications Intelligence" }}
      nextLink={{ href: "/work", label: "Selected Work ↑" }}
    >
      <Section heading="The challenge">
        <p>
          SMS creates an unusual optimization problem: marketers need to
          balance the quality of the message with character limits, message
          segmentation, cost, timing, and campaign planning.
        </p>
        <p>Those decisions are interconnected.</p>
        <p>
          A small copy change can affect the number of SMS segments
          required. That can change campaign cost. Meanwhile, the least
          expensive message isn&rsquo;t necessarily the most effective one.
        </p>
        <p>I saw an opportunity to bring those decisions together into one workflow.</p>
      </Section>

      <Section heading="The solution">
        <p>
          I designed and built an AI-enabled SMS optimization workspace that
          brings planning, cost estimation, technical SMS analysis, campaign
          management, and copy optimization into one experience.
        </p>

        <CaseStudyImage
          src="/SMS-optimizer-preview.png"
          alt="Sanitized screenshot of the SMS optimization workspace, showing the message calculator and credit estimate"
          width={790}
          height={925}
          caption="Sanitized view of the SMS optimization workspace, combining message planning, credit estimation, SMS encoding and segmentation analysis, campaign management, and copy guidance."
          subcaption="Recreated with representative data. Proprietary company information, internal cost structures, and campaign data have been removed."
        />

        <div>
          <SubHeading>Credit and cost estimation</SubHeading>
          <p>
            Estimates the messaging credits required for a proposed send so
            marketers can understand cost implications earlier in the
            planning process.
          </p>
        </div>
        <div>
          <SubHeading>Cost optimization recommendations</SubHeading>
          <p>
            Identifies opportunities to reduce unnecessary message length or
            segmentation while preserving the intent of the communication.
          </p>
        </div>
        <div>
          <SubHeading>Copy optimization</SubHeading>
          <p>
            Analyzes proposed SMS copy and recommends improvements for
            clarity, concision, and effectiveness.
          </p>
        </div>
        <div>
          <SubHeading>Campaign calendar</SubHeading>
          <p>
            Provides a consolidated view of planned SMS activity, helping
            teams understand messaging volume and timing across campaigns.
          </p>
        </div>
        <p>
          Rather than requiring marketers to separately calculate cost, edit
          copy, and evaluate timing, the tool makes those considerations
          part of the same decision-making process.
        </p>
      </Section>

      <Section heading="Building toward a smarter system">
        <p>
          The initial tool solves immediate operational problems, but I
          designed it with a broader optimization model in mind. The next
          stage incorporates:
        </p>
        <ul className="space-y-3">
          {[
            "Historical campaign performance — using previous sends to inform recommendations around copy, timing, and other campaign decisions.",
            "Generative SMS copy — creating draft copy based on campaign objectives and requirements, building on prior work developing AI-powered email copy generation.",
            "Integrated UTM creation — connecting the tool with a separate UTM/link builder so campaign setup becomes more streamlined and consistent.",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed">
              <span className="text-muted">–</span>
              <span>
                <span className="mr-1.5 inline-block rounded-full border border-[var(--border-solid)] px-2 py-0.5 align-middle text-[10px] uppercase tracking-wide text-muted">
                  planned
                </span>
                {item}
              </span>
            </li>
          ))}
        </ul>
        <p>
          Over time, the goal is to move from a collection of utilities
          toward a connected system that can help marketers plan, create,
          evaluate, optimize, and learn from SMS campaigns.
        </p>
      </Section>

      <Section heading="My role">
        <p>
          I identified the operational opportunity, designed the product and
          workflow, and used AI-assisted development to build the working
          application and its optimization capabilities. I am also defining
          its evolution from a practical operational utility into a more
          data-informed decision-support system.
        </p>
      </Section>

      <Section heading="Why it matters">
        <p>
          This project represents the kind of applied AI work I&rsquo;m most
          interested in: starting with a real business problem and using AI
          to create something people can actually use.
        </p>
        <p>
          The technology is valuable because it can reduce manual work,
          surface decisions earlier, control costs, improve consistency, and
          eventually turn historical marketing performance into actionable
          recommendations at the moment marketers need them.
        </p>
      </Section>
    </CaseStudyShell>
  );
}
