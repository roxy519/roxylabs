"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CITIES, type City } from "./cities";

const ROUNDS_PER_GAME = 5;
const POINTS_PER_CORRECT = 100;
const LOCAL_LB_KEY = "worldEditionLeaderboard";

type Mode = "browse" | "play";

type GameState = {
  order: number[];
  roundIndex: number;
  score: number;
  answered: boolean;
  guess: string;
};

type LeaderboardEntry = { name: string; score: number; ts: number };

function cityLabel(c: City): string {
  return `${c.city}, ${c.country}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomIndex(len: number, exclude?: number): number {
  if (len <= 1) return 0;
  let i: number;
  do {
    i = Math.floor(Math.random() * len);
  } while (i === exclude);
  return i;
}

function getLocalBoard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_LB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalBoard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LOCAL_LB_KEY, JSON.stringify(entries));
  } catch {
    // Storage unavailable (private mode, etc.) — the game still works,
    // scores just won't persist.
  }
}

const inputClass =
  "w-full rounded-lg border border-[var(--border-solid)] bg-[var(--surface)] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[var(--brand-1)]";

const btnClass =
  "rounded-xl border border-[var(--border-solid)] px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[var(--surface-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-1)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-40";

function FrontPage({ city, mystery = false }: { city: City; mystery?: boolean }) {
  return (
    <div
      key={mystery ? `mystery-${city.city}` : `browse-${city.city}`}
      className="paper-rise glow-frame rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5 sm:p-8"
    >
      {!mystery && (
        <div className="flex justify-between border-b border-[var(--border-solid)] pb-2 text-xs text-muted">
          <span>World Edition</span>
          <span>Sample front page</span>
        </div>
      )}

      <div className="py-4 text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {mystery ? "❓ Mystery Edition ❓" : city.paper}
        </h2>
        <div className="rule-gradient mx-auto mt-2 w-16" />
        {mystery ? (
          <p className="mt-2 text-xs italic text-muted">
            Read the clues — which city published this?
          </p>
        ) : (
          city.tagline && (
            <p className="mt-2 text-xs italic text-muted">{city.tagline}</p>
          )
        )}
      </div>

      {!mystery && (
        <div className="flex items-center justify-between border-y border-[var(--border-solid)] py-2 text-xs text-muted">
          <span className="font-semibold text-foreground">
            {city.city.toUpperCase()}, {city.country.toUpperCase()}
          </span>
          <span>Sample headlines — not live content</span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-[1.6fr_1fr] sm:gap-8">
        <div className="sm:border-r sm:border-[var(--border-solid)] sm:pr-8">
          {city.lead.kicker && (
            <div className="mb-1.5 text-xs font-bold tracking-wide text-[var(--color-magenta)]">
              {city.lead.kicker}
            </div>
          )}
          <h3 className="text-xl font-bold leading-tight sm:text-2xl">
            {city.lead.headline}
          </h3>
          {city.lead.dek && (
            <p className="mt-2 text-sm italic text-muted">{city.lead.dek}</p>
          )}
          {city.lead.byline && (
            <p className="mt-2 text-xs text-muted">{city.lead.byline}</p>
          )}
          <div className="drop-cap mt-3 space-y-3 text-sm leading-relaxed text-foreground">
            {city.lead.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {city.side.map((s, i) => (
            <div
              key={i}
              className={i > 0 ? "border-t border-[var(--border-solid)] pt-5" : ""}
            >
              <h4 className="text-base font-bold leading-snug">{s.headline}</h4>
              <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-muted">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!mystery && (
        <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-[var(--border-solid)] pt-3 text-xs text-muted">
          <span className="font-semibold text-foreground">
            Weather: {city.weather}
          </span>
          <span>{city.edition}</span>
        </div>
      )}
    </div>
  );
}

export default function WorldEdition() {
  const [mode, setMode] = useState<Mode>("browse");

  // Random-on-load city for Browse — starts deterministic (index 0) so
  // server and client render the same markup, then randomizes client-side
  // right after mount (avoids a hydration mismatch from Math.random()).
  const [browseIndex, setBrowseIndex] = useState(0);
  useEffect(() => {
    // Random() must run client-only to match SSR's deterministic first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowseIndex(randomIndex(CITIES.length));
  }, []);

  const sortedCities = useMemo(
    () =>
      CITIES.map((c, i) => ({ i, label: cityLabel(c) })).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    []
  );

  const [game, setGame] = useState<GameState | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Leaderboard is loaded client-side only (localStorage isn't available
  // during SSR) — starts null so we don't render a false "no scores yet"
  // before the real list loads.
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  useEffect(() => {
    // localStorage isn't available during SSR, so this has to load client-only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLeaderboard(getLocalBoard());
  }, []);

  function startGame() {
    const count = Math.min(ROUNDS_PER_GAME, CITIES.length);
    const order = shuffle(CITIES.map((_, i) => i)).slice(0, count);
    setGame({ order, roundIndex: 0, score: 0, answered: false, guess: "" });
    setGameOver(false);
    setSubmitted(false);
    setPlayerName("");
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    if (next === "play" && !game) startGame();
  }

  function submitGuess() {
    if (!game || game.answered || game.guess === "") return;
    const guessIdx = parseInt(game.guess, 10);
    const correct = guessIdx === game.order[game.roundIndex];
    setGame({
      ...game,
      answered: true,
      score: game.score + (correct ? POINTS_PER_CORRECT : 0),
    });
  }

  function advanceRound() {
    if (!game) return;
    if (game.roundIndex < game.order.length - 1) {
      setGame({ ...game, roundIndex: game.roundIndex + 1, answered: false, guess: "" });
    } else {
      setGameOver(true);
    }
  }

  function submitScore() {
    if (!game) return;
    const name = (playerName || "Anonymous").trim().slice(0, 24) || "Anonymous";
    const entry: LeaderboardEntry = { name, score: game.score, ts: Date.now() };
    const updated = [...(leaderboard ?? []), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    saveLocalBoard(updated);
    setLeaderboard(updated);
    setSubmitted(true);
  }

  const roundCity = game ? CITIES[game.order[game.roundIndex]] : null;
  const isLastRound = game ? game.roundIndex === game.order.length - 1 : false;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← roxylabs
      </Link>

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">World Edition</h1>
        <span className="text-xs text-muted">experiment · game</span>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Front pages from newspapers around the world — browse them, or play
        Guess the City across 5 rounds.
      </p>

      {/* Mode toggle */}
      <div className="mt-6 inline-flex gap-1 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-1">
        <button
          type="button"
          onClick={() => handleModeChange("browse")}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            mode === "browse"
              ? "bg-[var(--surface-hover)] text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          📰 Browse
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("play")}
          className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
            mode === "play"
              ? "bg-[var(--surface-hover)] text-foreground"
              : "text-muted hover:text-foreground"
          }`}
        >
          🎮 Guess the City
        </button>
      </div>

      {mode === "browse" && (
        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-muted">
              Edition
            </span>
            <select
              value={browseIndex}
              onChange={(e) => setBrowseIndex(parseInt(e.target.value, 10))}
              className={`${inputClass} max-w-xs`}
              aria-label="Choose a city"
            >
              {sortedCities.map(({ i, label }) => (
                <option key={i} value={i}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setBrowseIndex((cur) => randomIndex(CITIES.length, cur))}
              className={btnClass}
            >
              🎲 Random city
            </button>
            <span className="ml-auto text-xs text-muted">
              {CITIES.length} of 100 cities in this demo
            </span>
          </div>

          <FrontPage city={CITIES[browseIndex]} />
        </div>
      )}

      {mode === "play" && game && (
        <div className="mt-6">
          <FrontPage city={roundCity!} mystery />

          <div className="mt-4 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5">
            <div className="flex justify-between text-sm font-semibold">
              <span>
                Round {game.roundIndex + 1} of {game.order.length}
              </span>
              <span>Score: {game.score}</span>
            </div>

            {!gameOver && !game.answered && (
              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  value={game.guess}
                  onChange={(e) => setGame({ ...game, guess: e.target.value })}
                  className={`${inputClass} flex-1`}
                  aria-label="Guess the city"
                >
                  <option value="" disabled>
                    Choose a city…
                  </option>
                  {sortedCities.map(({ i, label }) => (
                    <option key={i} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={submitGuess}
                  disabled={game.guess === ""}
                  className={btnClass}
                >
                  Guess
                </button>
              </div>
            )}

            {game.answered && !gameOver && (
              <>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{
                    color:
                      parseInt(game.guess, 10) === game.order[game.roundIndex]
                        ? "#34d399"
                        : "var(--color-magenta)",
                  }}
                >
                  {parseInt(game.guess, 10) === game.order[game.roundIndex]
                    ? "✅ Correct! "
                    : "❌ Not quite — "}
                  This was {CITIES[game.order[game.roundIndex]].paper} —{" "}
                  {cityLabel(CITIES[game.order[game.roundIndex]])}.
                </p>
                <button
                  type="button"
                  onClick={advanceRound}
                  className={`${btnClass} mt-4`}
                >
                  {isLastRound ? "See final score →" : "Next round →"}
                </button>
              </>
            )}

            {gameOver && (
              <div className="mt-4">
                <h2 className="text-lg font-bold">
                  Final score: {game.score} / {game.order.length * POINTS_PER_CORRECT}
                </h2>
                {!submitted ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={24}
                      placeholder="Your name for the leaderboard"
                      className={`${inputClass} flex-1`}
                    />
                    <button type="button" onClick={submitScore} className={btnClass}>
                      Submit score
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted">Saved ✓</p>
                )}
                <button
                  type="button"
                  onClick={startGame}
                  className={`${btnClass} mt-3`}
                >
                  Play again
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-bold">🏆 Leaderboard</h2>
            <p className="mt-1 text-xs text-muted">
              Local leaderboard — saved only on this device/browser.
            </p>
            <ol className="mt-3 space-y-1.5">
              {leaderboard === null ? null : leaderboard.length === 0 ? (
                <li className="text-sm text-muted">No scores yet — be the first!</li>
              ) : (
                leaderboard.map((entry, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-[var(--border-solid)] pb-1.5 text-sm last:border-b-0 last:pb-0"
                  >
                    <span>
                      {i + 1}. {entry.name}
                    </span>
                    <span className="font-semibold text-foreground">{entry.score}</span>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-muted">
        <p className="mb-2 font-semibold text-foreground">
          How this front page is populated (and why it&rsquo;s not live yet)
        </p>
        <ul className="list-disc space-y-1.5 pl-4">
          <li>
            <strong className="text-foreground">Masthead — already real.</strong>{" "}
            Each city uses its actual most-read outlet (e.g. <em>The Guardian</em>{" "}
            for London, <em>The Yomiuri Shimbun</em> for Tokyo).
          </li>
          <li>
            <strong className="text-foreground">Headlines and story text — placeholder.</strong>{" "}
            The stories shown are sample text for layout only, not scraped or
            translated from anything real. This is flagged on every front page.
          </li>
          <li>
            <strong className="text-foreground">The plan:</strong> a small backend
            would scrape each city&rsquo;s top headlines on a schedule, translate
            non-English headlines/deks to English, and serve the result as JSON —
            pulling headline, a short dek, byline, and a link back to the
            original only, never full article text, to stay within fair-use
            norms for headline aggregation.
          </li>
          <li>
            <strong className="text-foreground">Outlet mapping needs upkeep.</strong>{" "}
            &ldquo;Most-read local paper&rdquo; shifts over time and is
            sometimes genuinely ambiguous — treat this as a starting point, not
            a fixed source of truth.
          </li>
        </ul>
      </div>
    </main>
  );
}
