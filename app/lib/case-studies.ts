// Sanitized portfolio case studies — real problems, recreated details.
// Add an entry here and it appears in the "selected work" section on the
// homepage and on /work. Each entry also needs a matching page at
// app/work/<slug>/page.tsx.

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  tags: string[];
  summary: string;
  year: number;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "communications-intelligence",
    title: "Communications Intelligence",
    subtitle: "Turning fragmented customer communications into a connected view",
    tags: ["Applied AI", "Customer Experience", "Digital Transformation"],
    summary:
      "Led a cross-functional communications mapping initiative, then used AI-assisted development to turn the data into an interactive tool for exploring the customer journey and identifying gaps and overlaps.",
    year: 2026,
  },
  {
    slug: "sms-optimization",
    title: "SMS Optimization",
    subtitle: "Building an AI-enabled SMS optimization tool",
    tags: ["Applied AI", "Marketing Operations", "Decision Support"],
    summary:
      "Designed and built an AI-enabled workspace for SMS cost estimation, campaign planning, copy optimization, and decision support.",
    year: 2026,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
