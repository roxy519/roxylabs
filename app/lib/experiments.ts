// The single source of truth for everything in the lab.
// Add an entry here and it automatically appears on the homepage grid.
//
// To add a new experiment:
//   1. Add an object to the `experiments` array below.
//   2. If it has its own page, create `app/experiments/<slug>/page.tsx`
//      and set `href: "/experiments/<slug>"`.
//   3. For an outside link (a demo on another domain, a repo, etc.),
//      set `href` to the full URL and `external: true`.

export type ExperimentStatus = "live" | "building" | "idea";

export type Experiment = {
  /** URL-safe id, also used as the React key. */
  slug: string;
  title: string;
  /** One or two sentences shown on the card. */
  description: string;
  status: ExperimentStatus;
  /** Year it was started — shown on the card. */
  year: number;
  /** Short labels for scanning (e.g. "tool", "ai", "css"). */
  tags: string[];
  /** Where the card links to. Omit for a not-yet-clickable idea. */
  href?: string;
  /** True when `href` points somewhere off this site. */
  external?: boolean;
};

export const experiments: Experiment[] = [
  {
    slug: "gradients",
    title: "Gradient Studio",
    description:
      "Build a CSS gradient by ear — drag the colors, spin the angle, copy the code. No sign-up, no dependencies.",
    status: "live",
    year: 2026,
    tags: ["tool", "css", "design"],
    href: "/experiments/gradients",
  },
  {
    slug: "gradient-eye",
    title: "Gradient Eye",
    description:
      "A game for your eyeballs. No numbers — just guess when the split is dead level (180°) and perfectly even (50/50), then see how close you got.",
    status: "live",
    year: 2026,
    tags: ["game", "css", "fun"],
    href: "/gradient-eye",
  },
  {
    slug: "utm-builder",
    title: "Campaign Link Builder",
    description:
      "Tag any link with UTM parameters for clean campaign tracking. Fill the fields, copy the link — properly encoded every time.",
    status: "live",
    year: 2026,
    tags: ["tool", "marketing", "ops"],
    href: "/experiments/utm-builder",
  },
  {
    slug: "coming-soon",
    title: "Something else",
    description:
      "The next experiment lives here. Could be an AI toy, a tiny useful tool, or a weird idea that got out of hand.",
    status: "idea",
    year: 2026,
    tags: ["tbd"],
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}
