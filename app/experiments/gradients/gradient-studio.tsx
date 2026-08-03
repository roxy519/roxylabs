"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Stop = { id: number; color: string; pos: number };

let nextId = 3;

const START: Stop[] = [
  { id: 1, color: "#7c5cff", pos: 0 },
  { id: 2, color: "#ff5c8a", pos: 100 },
];

function randomHex(): string {
  // 6 hex digits, always zero-padded to a valid #rrggbb.
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0");
}

export default function GradientStudio() {
  const [angle, setAngle] = useState(120);
  const [stops, setStops] = useState<Stop[]>(START);
  const [copied, setCopied] = useState(false);

  const css = useMemo(() => {
    const ordered = [...stops].sort((a, b) => a.pos - b.pos);
    const parts = ordered.map((s) => `${s.color} ${s.pos}%`).join(", ");
    return `linear-gradient(${angle}deg, ${parts})`;
  }, [stops, angle]);

  function updateStop(id: number, patch: Partial<Stop>) {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addStop() {
    setStops((prev) => [
      ...prev,
      { id: nextId++, color: randomHex(), pos: 50 },
    ]);
  }

  function removeStop(id: number) {
    setStops((prev) => (prev.length > 2 ? prev.filter((s) => s.id !== id) : prev));
  }

  function randomize() {
    setAngle(Math.floor(Math.random() * 361));
    const count = 2 + Math.floor(Math.random() * 3); // 2–4 stops
    const fresh: Stop[] = Array.from({ length: count }, (_, i) => ({
      id: nextId++,
      color: randomHex(),
      pos: Math.round((i / (count - 1)) * 100),
    }));
    setStops(fresh);
  }

  async function copyCss() {
    try {
      await navigator.clipboard.writeText(`background: ${css};`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (e.g. insecure context) — fail quietly.
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← roxylabs
      </Link>

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Gradient Studio</h1>
        <span className="text-xs text-muted">experiment · css tool</span>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Tweak the colors and angle, then copy the CSS. Everything runs in your
        browser — nothing is saved or sent anywhere.
      </p>

      {/* Preview */}
      <div
        className="mt-8 h-56 w-full rounded-2xl border border-[var(--border-solid)] sm:h-72"
        style={{ background: css }}
      />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Controls */}
        <section>
          <div className="mb-6">
            <label className="mb-2 flex items-center justify-between text-sm text-muted">
              <span>angle</span>
              <span className="tabular-nums text-foreground">{angle}°</span>
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-[var(--brand-1)]"
            />
          </div>

          <div className="space-y-3">
            {stops.map((stop) => (
              <div key={stop.id} className="flex items-center gap-3">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                  aria-label="stop color"
                  className="h-9 w-9 shrink-0 cursor-pointer rounded-md border border-[var(--border-solid)] bg-transparent"
                />
                <span className="w-20 shrink-0 font-mono text-sm uppercase text-muted">
                  {stop.color}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.pos}
                  onChange={(e) =>
                    updateStop(stop.id, { pos: Number(e.target.value) })
                  }
                  className="flex-1 accent-[var(--brand-1)]"
                  aria-label="stop position"
                />
                <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted">
                  {stop.pos}%
                </span>
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="shrink-0 text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="remove stop"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={addStop}
              className="rounded-lg border border-[var(--border-solid)] px-3 py-1.5 text-sm text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
            >
              + add color
            </button>
            <button
              onClick={randomize}
              className="rounded-lg border border-[var(--border-solid)] px-3 py-1.5 text-sm text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
            >
              ↻ randomize
            </button>
          </div>
        </section>

        {/* Output */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted">css</span>
            <button
              onClick={copyCss}
              className="rounded-lg border border-[var(--border-solid)] px-3 py-1 text-sm text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-foreground">
            <code>{`background: ${css};`}</code>
          </pre>
        </section>
      </div>
    </main>
  );
}
