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
      "Mapped a company's customer communications across teams, products, and channels, then used AI to turn that map into an interactive tool for spotting gaps and overlaps.",
    year: 2026,
  },
  {
    slug: "sms-optimization",
    title: "SMS Optimization",
    subtitle: "Building an AI-enabled SMS optimization tool",
    tags: ["Applied AI", "Marketing Operations", "Decision Support"],
    summary:
      "Designed and built a tool that brings cost estimation, cost-saving recommendations, copy optimization, and campaign planning into one workflow.",
    year: 2026,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
