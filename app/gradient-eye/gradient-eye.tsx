"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// The blend is perfectly level when the angle is 180° (a horizontal band)
// and perfectly even when its center sits at 50%.
const TARGET_ANGLE = 180;
const TARGET_SPLIT = 50;

const TOTAL_ROUNDS = 5;

// A fixed, soft blend band (±BLUR around the split). Because it's smooth, the
// tilt can't be read off jagged pixels — you have to judge the slope by eye —
// and the fuzz makes the exact middle genuinely tricky.
const BLUR = 16;

// Each slider shows a *window* onto the real value, and the window is
// re-rolled every round. So the target never sits at a fixed spot on the
// track (e.g. the center), and the two thumbs never line up at the solution.
const ANGLE_WINDOW = 180; // 180 always lands somewhere inside, never at an edge
const SPLIT_WINDOW = 70;

// Pleasant, high-contrast pairs so the blend always reads clearly.
const PALETTE: [string, string][] = [
  ["#7c5cff", "#ff5c8a"],
  ["#22d3ee", "#f59e0b"],
  ["#34d399", "#6366f1"],
  ["#f472b6", "#facc15"],
  ["#60a5fa", "#f87171"],
];

type Round = {
  angle: number;
  split: number;
  colors: [string, string];
  tiltMin: number;
  splitMin: number;
};

type Result = {
  angle: number;
  split: number;
  angleErr: number;
  splitErr: number;
  score: number;
  verdict: string;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Sassy, randomized per-round line. Kind at the top, cheekier the lower it goes.
function sassyRound(score: number): string {
  if (score === 100)
    return pick([
      "Chef's kiss. 👁️",
      "Flawless. Are you a spirit level?",
      "Pixel-perfect. Show-off.",
      "Immaculate.",
    ]);
  if (score >= 95)
    return pick([
      "Ridiculous eye.",
      "Almost inhuman.",
      "That's just flexing.",
      "Freakishly good.",
    ]);
  if (score >= 90)
    return pick([
      "Razor sharp.",
      "Big designer energy.",
      "You've clearly done this.",
      "Crisp.",
    ]);
  if (score >= 80)
    return pick([
      "Solid.",
      "Respectable.",
      "Not bad at all.",
      "You can see — congrats.",
    ]);
  if (score >= 70)
    return pick([
      "Eh, decent.",
      "Passable.",
      "We'll allow it.",
      "Your eyes are... fine.",
    ]);
  if (score >= 55)
    return pick([
      "Rough around the edges.",
      "You tried.",
      "That's a guess, alright.",
      "Squint harder next time.",
    ]);
  if (score >= 40)
    return pick([
      "Bold take on 'centered'.",
      "Were your eyes open?",
      "That's... a choice.",
      "Yikes, a little.",
    ]);
  if (score >= 25)
    return pick([
      "Oof.",
      "Did you use your elbows?",
      "'Level' is more of a suggestion, huh.",
      "My grandma sees better.",
    ]);
  if (score >= 10)
    return pick([
      "Painful to watch.",
      "Are you okay?",
      "That's abstract art now.",
      "Calamitous.",
    ]);
  return pick([
    "Absolute chaos.",
    "Did the sliders fight back?",
    "The gradient is crying.",
    "A catastrophe. Iconic.",
  ]);
}

// Sassy, randomized end-of-run line, judged on the average score.
function sassyFinal(avg: number): string {
  if (avg >= 95)
    return pick([
      "Are you a machine? 🤖",
      "Elite. Frame this run.",
      "Absolutely surgical.",
      "Perfection entered the chat.",
    ]);
  if (avg >= 85)
    return pick([
      "Genuinely impressive.",
      "You've got the eye.",
      "Designer-brain confirmed.",
      "Very, very good.",
    ]);
  if (avg >= 70)
    return pick([
      "Strong run.",
      "Nothing to be ashamed of.",
      "You can see! Mostly.",
      "Respectable showing.",
    ]);
  if (avg >= 55)
    return pick([
      "Middle of the pack.",
      "You had moments.",
      "Perfectly average. Congrats?",
      "A run that happened.",
    ]);
  if (avg >= 40)
    return pick([
      "Rough outing.",
      "The eyes need calibration.",
      "We don't talk about that run.",
      "Bless your attempt.",
    ]);
  return pick([
    "A disaster, start to finish.",
    "That was... a decision.",
    "The gradients deserve better.",
    "Historically bad. Iconic.",
  ]);
}

function scoreRound(angle: number, split: number): Result {
  const angleErr = Math.abs(angle - TARGET_ANGLE);
  const splitErr = Math.abs(split - TARGET_SPLIT);

  // Generous falloff: a component only reaches 0 at 50° / 40% off, so a
  // sloppy-but-genuine guess still banks a few points — only a wildly-off
  // guess (far out on both axes) bottoms out near zero.
  const angleScore = Math.max(0, 1 - angleErr / 50);
  const splitScore = Math.max(0, 1 - splitErr / 40);
  const score = Math.round(((angleScore + splitScore) / 2) * 100);

  return { angle, split, angleErr, splitErr, score, verdict: sassyRound(score) };
}

// One emoji per round, finely tiered — densest at the high end since most
// guesses land up there.
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

// A scrambled but solvable start: tilted, off-center, with the target sitting
// at a random (never centered, never matching) spot on each slider.
function randomRound(): Round {
  const tiltMin = Math.round(rand(40, 130)); // 180 lands at 28%–78% of the track
  const splitMin = Math.round(rand(5, 30)); //  50 lands at 29%–64% of the track
  const tiltMax = tiltMin + ANGLE_WINDOW;
  const splitMax = splitMin + SPLIT_WINDOW;

  // Start clearly away from level / center, but inside each window.
  const angle = Math.round(
    Math.random() < 0.5 ? rand(tiltMin, 155) : rand(205, tiltMax),
  );
  const split = Math.round(
    Math.random() < 0.5 ? rand(splitMin, 38) : rand(62, splitMax),
  );
  const colors = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return { angle, split, colors, tiltMin, splitMin };
}

// Fixed defaults for the server-rendered HTML; a real round is rolled on mount
// so client and server markup match (no hydration mismatch).
const INITIAL: Round = {
  angle: 135,
  split: 30,
  colors: PALETTE[0],
  tiltMin: 40,
  splitMin: 5,
};

export default function GradientEye() {
  const [game, setGame] = useState<Round>(INITIAL);
  const [result, setResult] = useState<Result | null>(null);
  const [round, setRound] = useState(1); // 1-based, current round
  const [scores, setScores] = useState<number[]>([]);
  const [finalMsg, setFinalMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const rollGame = useCallback(() => {
    setGame(randomRound());
    setResult(null);
  }, []);

  // Fresh game for round 1 on mount (round counter stays at 1).
  useEffect(() => {
    rollGame();
  }, [rollGame]);

  const { angle, split, colors, tiltMin, splitMin } = game;
  const tiltMax = tiltMin + ANGLE_WINDOW;
  const splitMax = splitMin + SPLIT_WINDOW;
  const locked = result !== null;
  const isFinal = locked && round >= TOTAL_ROUNDS;

  function lockIn() {
    const r = scoreRound(angle, split);
    const nextScores = [...scores, r.score];
    setResult(r);
    setScores(nextScores);
    // Roll the end-of-run verdict once, now, so it doesn't reshuffle on re-render.
    if (round >= TOTAL_ROUNDS) {
      const total = nextScores.reduce((a, b) => a + b, 0);
      setFinalMsg(sassyFinal(Math.round(total / TOTAL_ROUNDS)));
    }
  }

  function nextRound() {
    setRound((r) => r + 1);
    rollGame();
  }

  function restart() {
    setScores([]);
    setRound(1);
    setFinalMsg("");
    setCopied(false);
    rollGame();
  }

  const finalTotal = scores.reduce((a, b) => a + b, 0);

  async function shareScore() {
    const strip = scores.map((s) => `${s}${tierEmoji(s)}`).join(" ");
    const url =
      typeof window !== "undefined"
        ? window.location.host.replace(/^www\./, "") + window.location.pathname
        : "roxylabs.io/gradient-eye";
    const text = `Gradient Eye 👁️\n${strip}\nFinal: ${finalTotal} — ✨${finalMsg}✨\n${url}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (e.g. insecure context) — fail quietly.
    }
  }

  const gradient = `linear-gradient(${angle}deg, ${colors[0]} ${split - BLUR}%, ${colors[1]} ${split + BLUR}%)`;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← roxylabs
      </Link>

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Gradient Eye</h1>
        <span className="text-xs text-muted">
          round {Math.min(round, TOTAL_ROUNDS)} of {TOTAL_ROUNDS}
        </span>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Trust your eyes, not a readout. Nudge the blend until it sits{" "}
        <span className="text-foreground">perfectly level</span> and{" "}
        <span className="text-foreground">dead center</span>, then lock it in.
      </p>

      {/* Progress pips */}
      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
          const done = i < scores.length;
          const current = i === scores.length && !isFinal;
          return (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                done
                  ? "bg-[var(--brand-1)]"
                  : current
                    ? "bg-neutral-500"
                    : "bg-[var(--border-solid)]"
              }`}
            />
          );
        })}
      </div>

      {/* Playfield */}
      <div
        className="mt-6 h-64 w-full rounded-2xl border border-[var(--border-solid)] sm:h-80"
        style={{ background: gradient }}
      />

      {/* Controls */}
      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted">
            <span>tilt</span>
            <span className="text-xs">{locked ? `${angle}°` : "— guess —"}</span>
          </div>
          <input
            type="range"
            min={tiltMin}
            max={tiltMax}
            value={angle}
            disabled={locked}
            onChange={(e) =>
              setGame((g) => ({ ...g, angle: Number(e.target.value) }))
            }
            aria-label="tilt the blend"
            className="w-full accent-[var(--brand-1)] disabled:opacity-50"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-muted">
            <span>split</span>
            <span className="text-xs">
              {locked ? `${split}% / ${100 - split}%` : "— guess —"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            disabled={locked}
            onChange={(e) =>
              setGame((g) => ({ ...g, split: Number(e.target.value) }))
            }
            aria-label="move the blend"
            className="w-full accent-[var(--brand-1)] disabled:opacity-50"
          />
        </div>
      </div>

      {/* Actions + result */}
      {!locked && (
        <button
          onClick={lockIn}
          className="mt-8 w-full rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)]"
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
          <p className="mt-1 text-sm text-foreground">{result.verdict}</p>

          <div className="mt-5 grid grid-cols-2 gap-4 text-left text-sm">
            <div className="rounded-lg border border-[var(--border-solid)] p-3">
              <div className="text-xs text-muted">tilt</div>
              <div className="text-foreground">{result.angle}°</div>
              <div className="text-xs text-muted">
                {result.angleErr === 0
                  ? "spot on"
                  : `${result.angleErr}° off level`}
              </div>
            </div>
            <div className="rounded-lg border border-[var(--border-solid)] p-3">
              <div className="text-xs text-muted">split</div>
              <div className="text-foreground">
                {result.split}% / {100 - result.split}%
              </div>
              <div className="text-xs text-muted">
                {result.splitErr === 0
                  ? "dead center"
                  : `${result.splitErr}% off center`}
              </div>
            </div>
          </div>

          <button
            onClick={nextRound}
            className="mt-6 w-full rounded-xl border border-[var(--border-solid)] py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)]"
          >
            next round →
          </button>
        </div>
      )}

      {isFinal && (
        <div className="mt-8 rounded-2xl border border-[var(--border-solid)] bg-[var(--surface)] p-6 text-center">
          <div className="text-xs uppercase tracking-widest text-muted">
            final score
          </div>
          <div className="mt-1 text-6xl font-bold brand-text">{finalTotal}</div>
          <p className="mt-1 text-sm text-foreground">{finalMsg}</p>

          {/* Per-round strip — mirrors the shareable text. */}
          <div className="mt-5 flex justify-center gap-2">
            {scores.map((s, i) => (
              <div
                key={i}
                className="flex-1 rounded-lg border border-[var(--border-solid)] py-2"
              >
                <div className="text-base leading-none">{tierEmoji(s)}</div>
                <div className="mt-1 text-sm text-foreground">{s}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={shareScore}
              className="flex-1 rounded-xl border border-[var(--border-solid)] bg-[var(--surface-hover)] py-3 text-sm font-semibold text-foreground transition-colors hover:opacity-80"
            >
              {copied ? "copied ✓" : "share score"}
            </button>
            <button
              onClick={restart}
              className="flex-1 rounded-xl border border-[var(--border-solid)] py-3 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)]"
            >
              play again ↻
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
