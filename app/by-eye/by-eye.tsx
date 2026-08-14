"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const TOTAL_ROUNDS = 5;

// ---- Round 1 (gradient) tuning — preserved exactly from the original game ----
const BLUR = 20;
const ANGLE_WINDOW = 180;
const SPLIT_WINDOW = 70;
const PALETTE: [string, string][] = [
  ["#7c5cff", "#ff5c8a"],
  ["#22d3ee", "#f59e0b"],
  ["#34d399", "#6366f1"],
  ["#f472b6", "#facc15"],
  ["#60a5fa", "#f87171"],
];

// Off-target-distance at which a positional dimension scores 0 (in % of playfield).
const POS_ZERO = 42;
// Fill used for the optical-center shapes so visual mass tracks area, not colour.
const SHAPE_FILL = "rgba(237, 237, 237, 0.85)";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
function hsl([h, s, l]: [number, number, number]) {
  return `hsl(${h} ${s}% ${l}%)`;
}

// ---------------------------------------------------------------------------
// Verdicts — kept cheeky but generic so they read for gradients, text,
// colour, spacing, and composition alike.
// ---------------------------------------------------------------------------
function sassyRound(score: number): string {
  if (score === 100)
    return pick(["Chef's kiss. 👁️", "Flawless. Superhuman.", "Pixel-perfect. Show-off.", "Immaculate."]);
  if (score >= 95)
    return pick(["Ridiculous eye.", "Almost inhuman.", "That's just flexing.", "Freakishly good."]);
  if (score >= 90)
    return pick(["Razor sharp.", "Dead-on.", "You've clearly done this.", "Crisp."]);
  if (score >= 80)
    return pick(["Solid.", "Respectable.", "Not bad at all.", "You can see — congrats."]);
  if (score >= 70)
    return pick(["Eh, decent.", "Passable.", "We'll allow it.", "Your eye is... fine."]);
  if (score >= 55)
    return pick(["Rough.", "You tried.", "That's a guess, alright.", "Close-ish."]);
  if (score >= 40)
    return pick(["A bold interpretation.", "Were your eyes open?", "That's... a choice.", "Yikes, a little."]);
  if (score >= 25)
    return pick(["Oof.", "Did you use your elbows?", "Not quite, chief.", "My grandma does better."]);
  if (score >= 10)
    return pick(["Painful to watch.", "Are you okay?", "That's abstract now.", "Calamitous."]);
  return pick(["Absolute chaos.", "Did the controls fight back?", "A catastrophe. Iconic.", "We don't talk about that one."]);
}

function sassyFinal(avg: number): string {
  if (avg >= 95)
    return pick(["Are you a machine? 🤖", "Elite. Frame this run.", "Absolutely surgical.", "Perfection entered the chat."]);
  if (avg >= 85)
    return pick(["Genuinely impressive.", "You've got the eye.", "Instinct confirmed.", "Very, very good."]);
  if (avg >= 70)
    return pick(["Strong run.", "Nothing to be ashamed of.", "You can see! Mostly.", "Respectable showing."]);
  if (avg >= 55)
    return pick(["Middle of the pack.", "You had moments.", "Perfectly average. Congrats?", "A run that happened."]);
  if (avg >= 40)
    return pick(["Rough outing.", "The eye needs calibration.", "We don't talk about that run.", "Bless your attempt."]);
  return pick(["A disaster, start to finish.", "That was... a decision.", "Better luck next run.", "Historically bad. Iconic."]);
}

function tierEmoji(score: number): string {
  if (score === 100) return "🎯";
  if (score >= 97) return "🏆";
  if (score >= 93) return "🥇";
  if (score >= 90) return "🔥";
  if (score >= 85) return "✨";
  if (score >= 80) return "🟢";
  if (score >= 75) return "👍";
  if (score >= 70) return "🙂";
  if (score >= 60) return "🟡";
  if (score >= 50) return "😅";
  if (score >= 40) return "🟠";
  if (score >= 30) return "😬";
  if (score >= 20) return "🫤";
  if (score >= 10) return "🔴";
  return "💀";
}

// ---------------------------------------------------------------------------
// Round setups (discriminated union). All randomness lives in the make*
// helpers, which only run client-side (mount + next round) — no hydration risk.
// ---------------------------------------------------------------------------
type Gradient = {
  type: "gradient";
  angle: number;
  split: number;
  colors: [string, string];
  tiltMin: number;
  splitMin: number;
};
type Word = {
  type: "word";
  word: string;
  def: string;
  x: number;
  y: number;
  rot: number;
  xMin: number;
  yMin: number;
  rotMin: number;
};
type Color = {
  type: "color";
  ref: [number, number, number];
  cur: [number, number, number];
};
type Disc = { x: number; y: number; d: number }; // d = diameter, % of width
type Circles = { type: "circles"; left: Disc; right: Disc; target: Disc };
type OShape = {
  kind: "circle" | "triangle" | "rect";
  x: number;
  y: number;
  size: number;
  area: number;
};
type Optical = {
  type: "optical";
  shapes: OShape[];
  dot: { x: number; y: number };
  target: { x: number; y: number };
};
type Setup = Gradient | Word | Color | Circles | Optical;

const WORDS: { word: string; def: string }[] = [
  { word: "petrichor", def: "the earthy smell after rain" },
  { word: "susurrus", def: "a soft whispering or rustling sound" },
  { word: "sonder", def: "the realization that everyone has a life as vivid as your own" },
  { word: "apricity", def: "the warmth of sunlight in winter" },
  { word: "mellifluous", def: "pleasingly smooth and musical to hear" },
  { word: "limerence", def: "an intense infatuation or romantic fixation" },
];

const WORD_WIN = 80; // slider window width for the word round
const ROT_WIN = 120; // tilt slider window; target is 180° (upright / level)

// Place `target` at a random spot inside a `width`-wide window within [0,100],
// so the target never sits at a fixed (e.g. centered) point on the track.
function windowMin(target: number, width: number) {
  const f = rand(0.28, 0.72);
  return clamp(Math.round(target - f * width), 0, 100 - width);
}
// A start value inside the window, at least `off` away from `target`.
function offStart(min: number, width: number, target: number, off: number) {
  let v = target;
  for (let i = 0; i < 24 && Math.abs(v - target) < off; i++) {
    v = Math.round(rand(min, min + width));
  }
  return v;
}

function makeGradient(): Gradient {
  const tiltMin = Math.round(rand(40, 130));
  const splitMin = Math.round(rand(5, 30));
  const tiltMax = tiltMin + ANGLE_WINDOW;
  const splitMax = splitMin + SPLIT_WINDOW;
  const angle = Math.round(Math.random() < 0.5 ? rand(tiltMin, 155) : rand(205, tiltMax));
  const split = Math.round(Math.random() < 0.5 ? rand(splitMin, 38) : rand(62, splitMax));
  const colors = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return { type: "gradient", angle, split, colors, tiltMin, splitMin };
}

function makeWord(): Word {
  const { word, def } = pick(WORDS);
  const xMin = windowMin(50, WORD_WIN);
  const yMin = windowMin(50, WORD_WIN);
  // Tilt target is 180 (upright). Window it so 180 never sits at the track's
  // center, and start clearly — but readably — tilted (18–40°).
  const rotMin = Math.round(180 - rand(0.28, 0.72) * ROT_WIN);
  const rot = clamp(
    180 + (Math.random() < 0.5 ? -1 : 1) * Math.round(rand(18, 40)),
    rotMin,
    rotMin + ROT_WIN,
  );
  return {
    type: "word",
    word,
    def,
    xMin,
    yMin,
    rotMin,
    rot,
    x: offStart(xMin, WORD_WIN, 50, 16),
    y: offStart(yMin, WORD_WIN, 50, 16),
  };
}

function makeColor(): Color {
  const ref: [number, number, number] = [
    Math.round(rand(0, 360)),
    Math.round(rand(45, 85)),
    Math.round(rand(40, 65)),
  ];
  const sign = () => (Math.random() < 0.5 ? -1 : 1);
  const cur: [number, number, number] = [
    (ref[0] + sign() * Math.round(rand(20, 55)) + 360) % 360,
    clamp(ref[1] + sign() * Math.round(rand(15, 35)), 10, 95),
    clamp(ref[2] + sign() * Math.round(rand(12, 26)), 20, 85),
  ];
  return { type: "color", ref, cur };
}

function makeCircles(): Circles {
  // Everything horizontal is in % of width, so the three gaps stay equal on any
  // screen. Solved layout: two equal circles, vertically centered, with equal
  // left / middle / right gaps.
  const d = Math.round(rand(12, 18)); // diameter, % of width
  const gap = (100 - 2 * d) / 3; // equal gap either side of and between them
  const lx = Math.round(gap + d / 2);
  const left: Disc = { x: lx, y: 50, d };
  const target: Disc = { x: 100 - lx, y: 50, d };
  const sign = () => (Math.random() < 0.5 ? -1 : 1);
  const right: Disc = {
    x: clamp(target.x + sign() * Math.round(rand(8, 18)), 55, 90),
    y: clamp(50 + sign() * Math.round(rand(12, 26)), 18, 82),
    d: clamp(d + sign() * Math.round(rand(4, 8)), 8, 24),
  };
  return { type: "circles", left, right, target };
}

function makeOptical(): Optical {
  const raw = [
    { kind: "circle" as const, x: rand(20, 40), y: rand(24, 44), size: rand(15, 21) },
    { kind: "triangle" as const, x: rand(58, 78), y: rand(30, 54), size: rand(17, 24) },
    { kind: "rect" as const, x: rand(40, 62), y: rand(60, 78), size: rand(14, 21) },
  ];
  const shapes: OShape[] = raw.map((s) => {
    const area =
      s.kind === "circle"
        ? 0.785 * s.size * s.size
        : s.kind === "triangle"
          ? 0.5 * s.size * s.size
          : 1.5 * s.size * s.size;
    return { ...s, x: Math.round(s.x), y: Math.round(s.y), size: Math.round(s.size), area };
  });
  const totA = shapes.reduce((a, s) => a + s.area, 0);
  const target = {
    x: Math.round(shapes.reduce((a, s) => a + s.area * s.x, 0) / totA),
    y: Math.round(shapes.reduce((a, s) => a + s.area * s.y, 0) / totA),
  };
  return { type: "optical", shapes, dot: { x: 50, y: 50 }, target };
}

function makeRound(n: number): Setup {
  switch (n) {
    case 1:
      return makeGradient();
    case 2:
      return makeWord();
    case 3:
      return makeColor();
    case 4:
      return makeCircles();
    default:
      return makeOptical();
  }
}

// ---------------------------------------------------------------------------
// Scoring — every round resolves to a 0–100 score.
// ---------------------------------------------------------------------------
type Detail = { angle: number; split: number; angleErr: number; splitErr: number };

function posScore(err: number) {
  return Math.max(0, 1 - err / POS_ZERO);
}

function scoreSetup(s: Setup): { score: number; detail?: Detail } {
  switch (s.type) {
    case "gradient": {
      const angleErr = Math.abs(s.angle - 180);
      const splitErr = Math.abs(s.split - 50);
      const a = Math.max(0, 1 - angleErr / 50);
      const sp = Math.max(0, 1 - splitErr / 40);
      return {
        score: Math.round(((a + sp) / 2) * 100),
        detail: { angle: s.angle, split: s.split, angleErr, splitErr },
      };
    }
    case "word": {
      const h = posScore(Math.abs(s.x - 50));
      const v = posScore(Math.abs(s.y - 50));
      const r = Math.max(0, 1 - Math.abs(s.rot - 180) / 45);
      return { score: Math.round(((h + v + r) / 3) * 100) };
    }
    case "color": {
      let dh = Math.abs(s.ref[0] - s.cur[0]);
      dh = Math.min(dh, 360 - dh) / 180;
      const ds = Math.abs(s.ref[1] - s.cur[1]) / 100;
      const dl = Math.abs(s.ref[2] - s.cur[2]) / 100;
      const d = dh * 0.5 + ds * 0.25 + dl * 0.25;
      return { score: Math.round(Math.max(0, 1 - d / 0.5) * 100) };
    }
    case "circles": {
      const sx = posScore(Math.abs(s.right.x - s.target.x));
      const sy = posScore(Math.abs(s.right.y - s.target.y));
      const sd = Math.max(0, 1 - Math.abs(s.right.d - s.target.d) / 12);
      return { score: Math.round(((sx + sy + sd) / 3) * 100) };
    }
    case "optical": {
      const sx = posScore(Math.abs(s.dot.x - s.target.x));
      const sy = posScore(Math.abs(s.dot.y - s.target.y));
      return { score: Math.round(((sx + sy) / 2) * 100) };
    }
  }
}

const COPY: Record<Setup["type"], string> = {
  gradient:
    "Nudge the blend until it sits perfectly level (180° horizontal) and dead center (vertically), then lock it in.",
  word: "Nudge the word until it sits perfectly in the middle&mdash;horizontally and vertically aligned&mdash;and level it to 180° horizontal.",
  color: "Make the colors of the triangle on the right match the one on the left. But be quick&mdash;you've got 30 seconds.",
  circles: "Match the circles to give every gap the same amount of breathing room.",
  optical:
    "Move the dot to where the shapes feel balanced&mdash;the composition's visual center of gravity.",
};

type Result = { score: number; verdict: string; detail?: Detail };

const SLIDER_CLS =
  "w-full accent-[var(--brand-1)] disabled:opacity-50 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-1)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";
const BTN_CLS =
  "w-full rounded-xl border border-[var(--border-solid)] py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-1)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

const INITIAL: Gradient = {
  type: "gradient",
  angle: 135,
  split: 30,
  colors: PALETTE[0],
  tiltMin: 40,
  splitMin: 5,
};

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <span>{label}</span>
        <span className="text-xs">{disabled ? "locked" : "— guess —"}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={0.25}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={SLIDER_CLS}
      />
    </div>
  );
}

export default function ByEye() {
  const [setup, setSetup] = useState<Setup>(INITIAL);
  const [result, setResult] = useState<Result | null>(null);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState<number[]>([]);
  const [finalMsg, setFinalMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timedOut, setTimedOut] = useState(false);

  const locked = result !== null;
  const isFinal = locked && round >= TOTAL_ROUNDS;

  // Randomize round 1 on mount. This is intentional: the server renders fixed
  // defaults and the client swaps in random values after hydration, which is
  // exactly how we avoid a hydration mismatch. (Safe one-shot, empty deps.)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetup(makeRound(1));
  }, []);

  function lockIn() {
    if (locked) return;
    const { score, detail } = scoreSetup(setup);
    setResult({ score, verdict: sassyRound(score), detail });
    const next = [...scores, score];
    setScores(next);
    if (round >= TOTAL_ROUNDS) {
      setFinalMsg(sassyFinal(Math.round(next.reduce((a, b) => a + b, 0) / TOTAL_ROUNDS)));
    }
  }

  // Keep a live pointer to lockIn so the round-3 timer always fires the latest.
  const lockInRef = useRef(lockIn);
  useEffect(() => {
    lockInRef.current = lockIn;
  });

  // Round 3 countdown: runs while the colour round is active; cleared on
  // lock-in, expiry, leaving the round, restart, or unmount.
  useEffect(() => {
    if (setup.type !== "color" || locked) return;
    let remaining = 30;
    const id = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(id);
        setTimedOut(true);
        lockInRef.current();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [setup.type, locked]);

  function nextRound() {
    const n = round + 1;
    setRound(n);
    setSetup(makeRound(n));
    setResult(null);
    setTimedOut(false);
    if (n === 3) setTimeLeft(30);
  }

  function restart() {
    setScores([]);
    setRound(1);
    setFinalMsg("");
    setCopied(false);
    setResult(null);
    setTimedOut(false);
    setSetup(makeRound(1));
  }

  const finalTotal = scores.reduce((a, b) => a + b, 0);

  async function shareScore() {
    const strip = scores.map((s) => `${s}${tierEmoji(s)}`).join(" ");
    const url =
      typeof window !== "undefined"
        ? window.location.host.replace(/^www\./, "") + window.location.pathname
        : "roxylabs.io/by-eye";
    const text = `By Eye 👁️\n${strip}\nFinal: ${finalTotal} — ✨${finalMsg}✨\n${url}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (e.g. insecure context) — fail quietly.
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground focus:outline-none focus-visible:underline"
      >
        ← roxylabs
      </Link>

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">By Eye</h1>
        <span className="text-xs text-muted">
          round {Math.min(round, TOTAL_ROUNDS)} of {TOTAL_ROUNDS}
        </span>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">{COPY[setup.type]}</p>

      {/* Progress pips */}
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
          const done = i < scores.length;
          const current = i === scores.length && !isFinal;
          return (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                done ? "bg-[var(--brand-1)]" : current ? "bg-neutral-500" : "bg-[var(--border-solid)]"
              }`}
            />
          );
        })}
      </div>

      {/* Playfield */}
      <Playfield setup={setup} timeLeft={timeLeft} locked={locked} />

      {/* Controls */}
      <div className="mt-8 space-y-6">
        <Controls setup={setup} setSetup={setSetup} locked={locked} />
      </div>

      {/* Actions + result */}
      {!locked && (
        <button
          onClick={lockIn}
          className={`mt-8 bg-[var(--surface)] ${BTN_CLS}`}
        >
          lock it in
        </button>
      )}

      {locked && !isFinal && (
        <div className="mt-8 rounded-2xl border border-[var(--border-solid)] bg-[var(--surface)] p-6 text-center">
          <div className="text-5xl font-bold">
            <span className="brand-text">{result.score}</span>
            <span className="text-2xl text-muted">/100</span>
          </div>
          {timedOut && (
            <p className="mt-1 text-sm font-semibold text-amber-400">⏱ Time&apos;s up!</p>
          )}
          <p className="mt-1 text-sm text-foreground">{result.verdict}</p>

          {result.detail && (
            <div className="mt-5 grid grid-cols-2 gap-4 text-left text-sm">
              <div className="rounded-lg border border-[var(--border-solid)] p-3">
                <div className="text-xs text-muted">tilt</div>
                <div className="text-foreground">{result.detail.angle}°</div>
                <div className="text-xs text-muted">
                  {result.detail.angleErr === 0 ? "spot on" : `${result.detail.angleErr}° off level`}
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border-solid)] p-3">
                <div className="text-xs text-muted">split</div>
                <div className="text-foreground">
                  {result.detail.split}% / {100 - result.detail.split}%
                </div>
                <div className="text-xs text-muted">
                  {result.detail.splitErr === 0 ? "dead center" : `${result.detail.splitErr}% off center`}
                </div>
              </div>
            </div>
          )}

          <button onClick={nextRound} className={`mt-6 ${BTN_CLS}`}>
            next round →
          </button>
        </div>
      )}

      {isFinal && (
        <div className="mt-8 rounded-2xl border border-[var(--border-solid)] bg-[var(--surface)] p-6 text-center">
          {result && (
            <div className="mb-6 border-b border-[var(--border-solid)] pb-6">
              <div className="text-xs uppercase tracking-widest text-muted">round 5</div>
              {timedOut && (
                <p className="mt-1 text-sm font-semibold text-amber-400">⏱ Time&apos;s up!</p>
              )}
              <div className="mt-1 text-3xl font-bold">
                <span className="brand-text">{result.score}</span>
                <span className="text-lg text-muted">/100</span>
              </div>
              <p className="mt-1 text-sm text-foreground">{result.verdict}</p>
            </div>
          )}
          <div className="text-xs uppercase tracking-widest text-muted">final score</div>
          <div className="mt-1 text-6xl font-bold brand-text">{finalTotal}</div>
          <p className="mt-1 text-sm text-foreground">{finalMsg}</p>

          <div className="mt-5 flex justify-center gap-2">
            {scores.map((s, i) => (
              <div key={i} className="flex-1 rounded-lg border border-[var(--border-solid)] py-2">
                <div className="text-base leading-none">{tierEmoji(s)}</div>
                <div className="mt-1 text-sm text-foreground">{s}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={shareScore}
              className={`flex-1 bg-[var(--surface-hover)] hover:opacity-80 ${BTN_CLS}`}
            >
              {copied ? "copied ✓" : "share score"}
            </button>
            <button onClick={restart} className={`flex-1 ${BTN_CLS}`}>
              play again ↻
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Playfield — renders the current round's visual.
// ---------------------------------------------------------------------------
const FIELD_CLS =
  "mt-6 h-64 w-full overflow-hidden rounded-2xl border border-[var(--border-solid)] sm:h-80";

function Playfield({
  setup,
  timeLeft,
  locked,
}: {
  setup: Setup;
  timeLeft: number;
  locked: boolean;
}) {
  if (setup.type === "gradient") {
    const g = `linear-gradient(${setup.angle}deg, ${setup.colors[0]} ${setup.split - BLUR}%, ${setup.colors[1]} ${setup.split + BLUR}%)`;
    return <div className={FIELD_CLS} style={{ background: g }} />;
  }

  return (
    <div className={`relative bg-[var(--surface)] ${FIELD_CLS}`}>
      {setup.type === "word" && (
        <div
          className="absolute w-[80%] max-w-md px-2 text-center"
          style={{
            left: `${setup.x}%`,
            top: `${setup.y}%`,
            transform: `translate(-50%, -50%) rotate(${setup.rot - 180}deg)`,
          }}
        >
          <div className="text-xl font-semibold text-foreground sm:text-2xl">{setup.word}</div>
          <div className="mt-1 text-sm text-muted">{setup.def}</div>
        </div>
      )}

      {setup.type === "color" && (
        <>
          {!locked && (
            <div
              className="absolute right-3 top-3 text-sm font-semibold tabular-nums"
              style={{ color: timeLeft <= 10 ? "#ea2626" : "#38d8cb" }}
            >
              {timeLeft}s
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-8 sm:gap-12">
            <div
              className="h-20 w-24 sm:h-24 sm:w-28"
              style={{ background: hsl(setup.ref), clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
            />
            <div
              className="h-20 w-24 sm:h-24 sm:w-28"
              style={{ background: hsl(setup.cur), clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
            />
          </div>
        </>
      )}

      {setup.type === "circles" && (
        <>
          <div
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: `${setup.left.d}%`, left: `${setup.left.x}%`, top: `${setup.left.y}%`, background: "#8a8a8d" }}
          />
          <div
            className="absolute aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ width: `${setup.right.d}%`, left: `${setup.right.x}%`, top: `${setup.right.y}%`, background: "var(--brand-1)" }}
          />
        </>
      )}

      {setup.type === "optical" && (
        <>
          {setup.shapes.map((sh, i) => {
            const base = "absolute -translate-x-1/2 -translate-y-1/2";
            const common = { left: `${sh.x}%`, top: `${sh.y}%` } as const;
            if (sh.kind === "circle")
              return (
                <div key={i} className={`${base} aspect-square rounded-full`} style={{ ...common, height: `${sh.size}%`, background: SHAPE_FILL }} />
              );
            if (sh.kind === "triangle")
              return (
                <div
                  key={i}
                  className={`${base} aspect-square`}
                  style={{ ...common, height: `${sh.size}%`, background: SHAPE_FILL, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }}
                />
              );
            return (
              <div key={i} className={`${base} rounded-lg`} style={{ ...common, height: `${sh.size}%`, width: `${sh.size * 1.4}%`, background: SHAPE_FILL }} />
            );
          })}
          <div
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--brand-1)] shadow-[0_0_0_4px_rgba(124,92,255,0.15)]"
            style={{ left: `${setup.dot.x}%`, top: `${setup.dot.y}%`, background: "rgba(124,92,255,0.2)" }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand-1)]" />
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Controls — round-specific sliders. Round 1 keeps its exact original layout.
// ---------------------------------------------------------------------------
function Controls({
  setup,
  setSetup,
  locked,
}: {
  setup: Setup;
  setSetup: Dispatch<SetStateAction<Setup>>;
  locked: boolean;
}) {
  if (setup.type === "gradient") {
    const { angle, split, tiltMin } = setup;
    return (
      <>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted">
            <span>tilt</span>
            <span className="text-xs">{locked ? `${angle}°` : "— guess —"}</span>
          </div>
          <input
            type="range"
            min={tiltMin}
            max={tiltMin + ANGLE_WINDOW}
            value={angle}
            disabled={locked}
            onChange={(e) => setSetup((s) => (s.type === "gradient" ? { ...s, angle: Number(e.target.value) } : s))}
            aria-label="tilt the blend"
            className={SLIDER_CLS}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted">
            <span>split</span>
            <span className="text-xs">{locked ? `${split}% / ${100 - split}%` : "— guess —"}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            disabled={locked}
            onChange={(e) => setSetup((s) => (s.type === "gradient" ? { ...s, split: Number(e.target.value) } : s))}
            aria-label="move the blend"
            className={SLIDER_CLS}
          />
        </div>
      </>
    );
  }

  if (setup.type === "word") {
    return (
      <>
        <Slider label="horizontal" min={setup.xMin} max={setup.xMin + WORD_WIN} value={setup.x} disabled={locked} onChange={(v) => setSetup((s) => (s.type === "word" ? { ...s, x: v } : s))} />
        <Slider label="vertical" min={setup.yMin} max={setup.yMin + WORD_WIN} value={setup.y} disabled={locked} onChange={(v) => setSetup((s) => (s.type === "word" ? { ...s, y: v } : s))} />
        <Slider label="tilt" min={setup.rotMin} max={setup.rotMin + ROT_WIN} value={setup.rot} disabled={locked} onChange={(v) => setSetup((s) => (s.type === "word" ? { ...s, rot: v } : s))} />
      </>
    );
  }

  if (setup.type === "color") {
    const set = (i: number) => (v: number) =>
      setSetup((s) => {
        if (s.type !== "color") return s;
        const cur = [...s.cur] as [number, number, number];
        cur[i] = v;
        return { ...s, cur };
      });
    return (
      <>
        <Slider label="hue" min={0} max={360} value={setup.cur[0]} disabled={locked} onChange={set(0)} />
        <Slider label="saturation" min={0} max={100} value={setup.cur[1]} disabled={locked} onChange={set(1)} />
        <Slider label="lightness" min={0} max={100} value={setup.cur[2]} disabled={locked} onChange={set(2)} />
      </>
    );
  }

  if (setup.type === "circles") {
    const setR = (key: keyof Disc) => (v: number) =>
      setSetup((s) => (s.type === "circles" ? { ...s, right: { ...s.right, [key]: v } } : s));
    return (
      <>
        <Slider label="horizontal" min={0} max={100} value={setup.right.x} disabled={locked} onChange={setR("x")} />
        <Slider label="vertical" min={0} max={100} value={setup.right.y} disabled={locked} onChange={setR("y")} />
        <Slider label="size" min={6} max={26} value={setup.right.d} disabled={locked} onChange={setR("d")} />
      </>
    );
  }

  // optical
  return (
    <>
      <Slider label="horizontal" min={0} max={100} value={setup.dot.x} disabled={locked} onChange={(v) => setSetup((s) => (s.type === "optical" ? { ...s, dot: { ...s.dot, x: v } } : s))} />
      <Slider label="vertical" min={0} max={100} value={setup.dot.y} disabled={locked} onChange={(v) => setSetup((s) => (s.type === "optical" ? { ...s, dot: { ...s.dot, y: v } } : s))} />
    </>
  );
}
