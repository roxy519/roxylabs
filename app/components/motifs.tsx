import { type CSSProperties } from "react";

/**
 * Decorative SVG/CSS motifs shared across the site. Kept abstract and
 * low-opacity by default — accents, not illustrations. Each motif takes a
 * `gradientId` so multiple instances on one page never collide (Server
 * Components can't use `useId`, so callers pass a unique id explicitly).
 */

function BrandDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--color-magenta)" />
        <stop offset="35%" stopColor="var(--color-purple)" />
        <stop offset="70%" stopColor="var(--color-blue)" />
        <stop offset="100%" stopColor="var(--color-cyan)" />
      </linearGradient>
    </defs>
  );
}

/**
 * The homepage hero backdrop: grid texture, a soft corner glow, one large
 * cropped gradient wave (the site's "brand device" — used ONLY here), and a
 * small connected-node cluster. Absolutely positioned; the caller provides
 * a `relative overflow-hidden` container.
 */
export function HeroBackdrop({ gradientId }: { gradientId: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="bg-grid fade-edges absolute inset-0 opacity-70" />

      <div
        className="absolute -right-24 -top-28 h-72 w-72 rounded-full sm:h-96 sm:w-96"
        style={
          {
            background:
              "radial-gradient(circle at 35% 35%, var(--color-purple), transparent 70%)",
            filter: "blur(46px)",
            opacity: 0.35,
          } as CSSProperties
        }
      />

      <svg
        className="absolute -bottom-16 -right-10 hidden h-[220px] w-[560px] sm:block md:h-[260px] md:w-[680px]"
        viewBox="0 0 680 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${gradientId}-wave-back`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-purple)" />
            <stop offset="100%" stopColor="var(--color-blue)" />
          </linearGradient>
          <linearGradient id={`${gradientId}-wave-front`} x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="var(--color-magenta)" />
            <stop offset="45%" stopColor="var(--color-purple)" />
            <stop offset="100%" stopColor="var(--color-cyan)" />
          </linearGradient>
        </defs>
        <path
          d="M0 220 C 90 160, 150 130, 230 150 C 310 170, 340 100, 420 90 C 490 82, 540 130, 620 110 C 650 102, 665 96, 680 90 L 680 260 L 0 260 Z"
          fill={`url(#${gradientId}-wave-back)`}
          opacity={0.22}
        />
        <path
          d="M40 250 C 120 190, 170 150, 250 160 C 330 170, 360 110, 440 96 C 510 84, 560 140, 630 118 C 655 109, 668 104, 680 98 L 680 260 L 20 260 Z"
          fill={`url(#${gradientId}-wave-front)`}
          opacity={0.42}
        />
      </svg>

      <svg
        className="absolute right-4 top-6 hidden h-[150px] w-[220px] opacity-90 sm:block md:right-10"
        viewBox="0 0 220 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <BrandDefs id={`${gradientId}-nodes`} />
        <path
          d="M8 18 C 40 18, 40 60, 78 60 C 110 60, 108 92, 150 92"
          stroke={`url(#${gradientId}-nodes)`}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M150 92 C 172 92, 178 40, 208 40"
          stroke={`url(#${gradientId}-nodes)`}
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
        <line
          x1="78"
          y1="60"
          x2="78"
          y2="128"
          stroke="var(--color-cyan)"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />
        <circle cx="8" cy="18" r="4" fill="var(--color-magenta)" />
        <circle cx="78" cy="60" r="4.5" fill="var(--color-purple)" />
        <circle cx="150" cy="92" r="4" fill="var(--color-blue)" />
        <circle cx="208" cy="40" r="3.5" fill="var(--color-cyan)" />
        <circle cx="78" cy="128" r="3" fill="var(--color-cyan)" fillOpacity="0.7" />
      </svg>
    </div>
  );
}

/** Card watermark for Communications Intelligence: channels converging. */
export function CommsMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-3 -right-3 h-28 w-36 opacity-[0.16] transition-opacity duration-300 group-hover:opacity-30"
      viewBox="0 0 160 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <path d="M10 20 C 50 20, 55 55, 95 55" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 55 L 95 55" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
      <path d="M10 90 C 50 90, 55 55, 95 55" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M95 55 C 120 55, 122 35, 148 35" stroke="var(--color-cyan)" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7" />
      <circle cx="10" cy="20" r="4" fill="var(--color-magenta)" />
      <circle cx="10" cy="55" r="4" fill="var(--color-purple)" />
      <circle cx="10" cy="90" r="4" fill="var(--color-blue)" />
      <circle cx="95" cy="55" r="5" fill="var(--color-purple)" />
      <circle cx="148" cy="35" r="3.5" fill="var(--color-cyan)" />
    </svg>
  );
}

/** Card watermark for SMS Optimization: modular message/decision blocks. */
export function SmsMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-3 -right-3 h-28 w-36 opacity-[0.16] transition-opacity duration-300 group-hover:opacity-30"
      viewBox="0 0 160 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <rect x="14" y="14" width="68" height="24" rx="6" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <rect x="30" y="46" width="68" height="24" rx="6" stroke="var(--color-blue)" strokeOpacity="0.7" strokeWidth="1.5" />
      <rect x="14" y="78" width="44" height="18" rx="6" stroke="var(--color-cyan)" strokeOpacity="0.7" strokeWidth="1.5" />
      <line x1="24" y1="26" x2="60" y2="26" stroke="var(--color-magenta)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="40" y1="58" x2="76" y2="58" stroke="var(--color-purple)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
    </svg>
  );
}

/** By Eye: overlapping frames with a simple shape each — visual comparison. */
export function EyeMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-2 -right-2 h-20 w-24 opacity-[0.18] transition-opacity duration-300 group-hover:opacity-32"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <rect x="8" y="18" width="52" height="52" rx="10" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
      <rect x="52" y="30" width="52" height="52" rx="10" stroke="var(--color-cyan)" strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx="34" cy="44" r="9" fill="var(--color-magenta)" fillOpacity="0.8" />
      <path d="M70 56 L84 70 L98 56" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Gradient Studio: a gradient strip with stop orbs. */
export function GradientMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-2 -right-2 h-20 w-24 opacity-[0.2] transition-opacity duration-300 group-hover:opacity-34"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <rect x="10" y="40" width="100" height="12" rx="6" fill={`url(#${gradientId})`} />
      <circle cx="18" cy="46" r="7" fill="var(--surface)" stroke="var(--color-magenta)" strokeWidth="2" />
      <circle cx="60" cy="46" r="7" fill="var(--surface)" stroke="var(--color-purple)" strokeWidth="2" />
      <circle cx="102" cy="46" r="7" fill="var(--surface)" stroke="var(--color-cyan)" strokeWidth="2" />
    </svg>
  );
}

/** Campaign Link Builder: two connected nodes with a resolved link. */
export function LinkMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-2 -right-2 h-20 w-24 opacity-[0.2] transition-opacity duration-300 group-hover:opacity-34"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <rect x="8" y="34" width="34" height="20" rx="6" stroke="var(--color-magenta)" strokeWidth="1.5" />
      <rect x="78" y="34" width="34" height="20" rx="6" stroke="var(--color-cyan)" strokeWidth="1.5" />
      <path d="M42 44 C 58 44, 62 44, 78 44" stroke={`url(#${gradientId})`} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx="60" cy="44" r="3.5" fill="var(--color-purple)" />
    </svg>
  );
}

/** SMS Credit Calculator: a small credits/segments bar readout. */
export function CreditsMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-2 -right-2 h-20 w-24 opacity-[0.18] transition-opacity duration-300 group-hover:opacity-32"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <rect x="14" y="20" width="10" height="52" rx="3" fill="var(--color-magenta)" fillOpacity="0.7" />
      <rect x="32" y="34" width="10" height="38" rx="3" fill="var(--color-purple)" fillOpacity="0.7" />
      <rect x="50" y="12" width="10" height="60" rx="3" fill="var(--color-blue)" fillOpacity="0.7" />
      <rect x="68" y="42" width="10" height="30" rx="3" fill="var(--color-cyan)" fillOpacity="0.7" />
      <path d="M14 78 H 96" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
}

/** Fallback for idea-stage experiments: a loose, unconnected dot cluster. */
export function GenericMotif({ gradientId }: { gradientId: string }) {
  return (
    <svg
      aria-hidden
      className="absolute -bottom-2 -right-2 h-20 w-24 opacity-[0.16] transition-opacity duration-300 group-hover:opacity-28"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BrandDefs id={gradientId} />
      <circle cx="20" cy="30" r="4" fill="var(--color-magenta)" />
      <circle cx="52" cy="18" r="3" fill="var(--color-purple)" />
      <circle cx="40" cy="56" r="5" fill="var(--color-blue)" />
      <circle cx="78" cy="44" r="3.5" fill="var(--color-cyan)" />
      <circle cx="92" cy="72" r="3" fill="var(--color-purple)" fillOpacity="0.7" />
    </svg>
  );
}
