import type { Metadata } from "next";
import { CaseStudyShell, Section, List, SubHeading } from "../_components/case-study";
import { CaseStudyImage } from "../_components/case-study-image";

const OG_TITLE = "Communications Intelligence | RoxyLabs";
const OG_DESCRIPTION =
  "Turning fragmented customer communications into an interactive view of the customer journey.";

export const metadata: Metadata = {
  title: "Communications Intelligence",
  description:
    "Turning fragmented customer communications into a connected view — a sanitized case study in applied AI and digital transformation.",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/work/communications-intelligence",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
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
      <Section heading="The challenge">
        <p>
          Customer communications had evolved across multiple teams,
          products, channels, and stages of the customer journey. Individual
          teams understood their own communications, but there was no simple
          way to see the entire experience together.
        </p>
        <p>
          Understanding questions like <em>What is a customer receiving?
          From whom? Through which channel? At what point in their
          journey?</em> required piecing together information from different
          sources.
        </p>
        <p>
          I led an initiative to map those communications across the
          organization and create a foundation for a more coordinated
          customer experience.
        </p>
      </Section>

      <Section heading="My approach">
        <p>
          Rather than treating the output as a static communications
          inventory, I used AI to help transform the underlying information
          into an interactive analysis tool.
        </p>
        <p>
          The resulting experience allows users to move between different
          views of the communications ecosystem, including:
        </p>
        <List
          items={[
            "Channel — such as email, SMS, web, and other customer touchpoints",
            "Communication category — grouping messages according to their purpose and role in the customer experience",
            "Product — allowing teams to understand both product-specific experiences and patterns across the broader organization",
          ]}
        />
        <p>This turns a large, complex dataset into something stakeholders can actually explore.</p>
      </Section>

      <CaseStudyImage
        src="/Comms-timeline-preview.png"
        alt="Sanitized screenshot of the communications intelligence workspace, showing the timeline view with channel, category, and product filters"
        width={1652}
        height={952}
        caption="Sanitized view of the communications intelligence workspace. Stakeholders can filter mapped communications by channel, category, and product, and move between landscape, timeline, and best-practice views to explore the customer journey."
        subcaption="Recreated with representative data. Proprietary company information and performance data have been removed."
      />

      <Section heading="What it enables">
        <p>Instead of simply documenting what exists, the tool helps teams identify:</p>
        <List
          items={[
            "communication overlaps and potential duplication",
            "gaps in the customer journey",
            "inconsistent experiences across products or channels",
            "opportunities to consolidate or coordinate communications",
            "areas where ownership or purpose is unclear",
            "opportunities for future personalization and orchestration",
          ]}
        />
        <p>
          The work also creates a shared source of truth for conversations
          that previously depended heavily on individual teams&rsquo;
          knowledge.
        </p>
      </Section>

      <Section heading="My role">
        <p>
          I led the broader communications-mapping initiative, worked across
          organizational boundaries to understand the underlying customer
          experience, structured and categorized the information, and used
          AI-assisted development to turn it into an interactive analytical
          workspace with dynamic filtering and multiple views.
        </p>
        <p>
          The work sits at the intersection of customer experience, digital
          operations, data organization, AI, and cross-functional
          transformation.
        </p>
      </Section>

      <Section heading="Why it matters">
        <SubHeading>
          The goal wasn&rsquo;t to use AI for the sake of using AI.
        </SubHeading>
        <p>
          It was to make an otherwise difficult organizational problem
          easier to understand and act on. The result is a foundation that
          can support both immediate communications improvements and a
          longer-term shift toward a more coordinated, intentional customer
          journey.
        </p>
      </Section>
    </CaseStudyShell>
  );
}
