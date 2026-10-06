// The working method as a scannable sequence. Step colors walk the brand
// palette (magenta → purple → blue → cyan) so the progression reads at a glance
// without turning it into a corporate process diagram.

const STEPS: { title: string; detail: string; color: string }[] = [
  { title: "Find the friction", detail: "Where work is repetitive, slow, or fragmented.", color: "--color-magenta" },
  { title: "Investigate", detail: "What's actually happening, and why.", color: "--color-magenta" },
  { title: "Structure the information", detail: "Turn scattered inputs into something comparable.", color: "--color-purple" },
  { title: "Find the patterns", detail: "Gaps, overlaps, and pressure points.", color: "--color-purple" },
  { title: "Identify the right technology", detail: "AI, automation, data — or something simpler.", color: "--color-blue" },
  { title: "Prototype", detail: "Make a working version people can react to.", color: "--color-blue" },
  { title: "Test & learn", detail: "See what holds up against real use.", color: "--color-cyan" },
  { title: "Operationalize what works", detail: "Turn what's proven into a plan and a process.", color: "--color-cyan" },
];

export function MethodSteps() {
  return (
    <ol className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-flow-col sm:grid-rows-4">
      {STEPS.map((step, i) => (
        <li
          key={step.title}
          className="flex gap-3 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-3"
        >
          <span
            aria-hidden
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold"
            style={{ borderColor: `var(${step.color})`, color: `var(${step.color})` }}
          >
            {i + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{step.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
