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

/** Which small watermark motif a card renders. New entries can omit this —
 * the card falls back to a generic dot-cluster motif. */
export type ExperimentVisual =
  | "eye"
  | "gradient"
  | "link"
  | "credits"
  | "news"
  | "generic";

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
  /** Small watermark motif for the card. Defaults to "generic". */
  visual?: ExperimentVisual;
};

export const experiments: Experiment[] = [
  {
    slug: "by-eye",
    title: "By Eye",
    description: "Five rounds of visual instinct.",
    status: "live",
    year: 2026,
    tags: ["game", "design"],
    href: "/by-eye",
    visual: "eye",
  },
  {
    slug: "gradients",
    title: "Gradient Studio",
    description:
      "Build a CSS gradient — drag the colors, spin the angle, copy the code. No sign-up, no dependencies.",
    status: "live",
    year: 2026,
    tags: ["tool", "css", "design"],
    href: "/experiments/gradients",
    visual: "gradient",
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
    visual: "link",
  },
  {
    slug: "world-edition",
    title: "World Edition",
    description:
      "Browse front pages from newspapers around the world, or play Guess the City across 5 rounds — real outlets, sample headlines.",
    status: "live",
    year: 2026,
    tags: ["game", "news", "geography"],
    href: "/experiments/world-edition",
    visual: "news",
  },
  {
    slug: "sms-credit-calculator",
    title: "SMS Credit Calculator — Public Version",
    description:
      "A standalone, public version of the credit-estimation capability behind a larger SMS optimization workspace.",
    status: "building",
    year: 2026,
    tags: ["tool", "marketing", "sms"],
    visual: "credits",
  },
];

export function getExperiment(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}
