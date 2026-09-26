"use client";

import Link from "next/link";
import { Merriweather, PT_Serif } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import type { DisplayCity } from "./live";

// Loaded only for the front-page component below — the rest of the page
// stays in the site's regular monospace. This is what makes the "paper"
// itself read as an actual newspaper rather than a roxylabs surface.
// Merriweather over a more decorative display serif (e.g. Playfair) —
// newspaper-esque but designed for screen readability at body/headline sizes.
const headlineTypeface = Merriweather({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-headline",
});
const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-pt-serif",
});

const ROUNDS_PER_GAME = 5;
const POINTS_PER_CORRECT = 100;
const LOCAL_LB_KEY = "worldEditionLeaderboard";

type Mode = "play" | "browse" | "method";

type GameState = {
  order: number[];
  roundIndex: number;
  score: number;
  answered: boolean;
  guess: string;
};

type LeaderboardEntry = { name: string; score: number; ts: number };

function cityLabel(c: DisplayCity): string {
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

const INK = "#1c1a16";
const INK_SOFT = "#4a4640";
const PAPER_RED = "#9c2b23";

const headlineFont = { fontFamily: "var(--font-headline), Georgia, serif" };
const bodyFont = { fontFamily: "var(--font-pt-serif), Georgia, serif" };

// Real headlines sometimes name the country outright (and occasionally the
// city) — a dead giveaway in the guessing game. These are swapped for a
// placeholder in mystery mode only; browse mode always shows the real text.
const COUNTRY_ALIASES: Record<string, string[]> = {
  USA: ["United States", "USA", "U.S.", "US", "America", "American"],
  UK: ["United Kingdom", "Britain", "British", "UK"],
  Japan: ["Japan", "Japanese"],
  France: ["France", "French"],
  India: ["India", "Indian"],
  Brazil: ["Brazil", "Brazilian"],
  Nigeria: ["Nigeria", "Nigerian"],
  Egypt: ["Egypt", "Egyptian"],
  Russia: ["Russia", "Russian"],
  Australia: ["Australia", "Australian"],
  Mexico: ["Mexico", "Mexican"],
  "South Korea": ["South Korea", "Korea", "Korean"],
  Indonesia: ["Indonesia", "Indonesian"],
  Türkiye: ["Türkiye", "Turkey", "Turkish"],
  Germany: ["Germany", "German"],
  Canada: ["Canada", "Canadian"],
  Argentina: ["Argentina", "Argentine", "Argentinian"],
  Thailand: ["Thailand", "Thai"],
  Kenya: ["Kenya", "Kenyan"],
  Peru: ["Peru", "Peruvian"],
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Not `\b...\b` — a plain word boundary fails at the end of tokens like
// "U.S." (the trailing "." is already non-word, so there's no word/non-word
// transition left for \b to match). Lookaround for "no adjacent letter or
// digit" instead, which works regardless of what punctuation the alias itself
// starts or ends with.
function wholeTokenPattern(name: string): RegExp {
  return new RegExp(`(?<![A-Za-z0-9])${escapeRegExp(name)}(?![A-Za-z0-9])`, "gi");
}

function redactIdentity(text: string, city: DisplayCity): string {
  let out = text;
  const cityNames = Array.from(
    new Set([city.city, stripDiacritics(city.city)].filter(Boolean))
  );
  const countryNames = COUNTRY_ALIASES[city.country] ?? [city.country];
  for (const name of cityNames) {
    out = out.replace(wholeTokenPattern(name), "[City]");
  }
  for (const name of countryNames) {
    out = out.replace(wholeTokenPattern(name), "[Country]");
  }
  return out;
}

/**
 * The "paper" itself — deliberately NOT roxylabs-styled. Cream stock, black
 * ink, serif type, a classic broadsheet layout (masthead, then one full-width
 * lead story, then a row of secondary stories below it) so it reads as an
 * actual newspaper sitting inside the (still roxylabs-branded) page around it.
 */
function FrontPage({
  city,
  mystery = false,
  today,
  issueNo,
}: {
  city: DisplayCity;
  mystery?: boolean;
  today: string;
  issueNo: number;
}) {
  return (
    <div
      key={mystery ? `mystery-${city.city}` : `browse-${city.city}`}
      className={`${headlineTypeface.variable} ${ptSerif.variable} paper-rise rounded-sm border p-5 shadow-2xl sm:p-8`}
      style={{ background: "#f2ede1", color: INK, borderColor: "#d8cfb8", ...bodyFont }}
    >
      {/* top strip: date + volume/edition */}
      <div
        className="flex flex-wrap justify-between gap-2 border-b pb-1.5 text-[11px] tracking-wide"
        style={{ borderColor: INK, color: INK_SOFT }}
      >
        <span>{today || "…"}</span>
        <span>{mystery ? "Guess the City" : `Vol. CLI · No. ${issueNo}`}</span>
      </div>

      {/* masthead */}
      <div className="border-b-4 py-4 text-center" style={{ borderBottom: `4px double ${INK}` }}>
        <h2
          className="text-[2.1rem] font-black leading-tight sm:text-[3rem]"
          style={headlineFont}
        >
          {mystery ? "Mystery Edition" : city.paper}
        </h2>
        {mystery ? (
          <p className="mt-2 text-xs italic" style={{ color: INK_SOFT }}>
            Read the clues below — which city published this?
          </p>
        ) : (
          city.tagline && (
            <p className="mt-2 text-xs italic" style={{ color: INK_SOFT }}>
              {city.tagline}
            </p>
          )
        )}
      </div>

      {/* sub strip: city/country (hidden when mystery) + live/sample note */}
      <div
        className="flex flex-wrap items-center justify-between gap-1 border-b py-1.5 text-[11px]"
        style={{ borderColor: INK, color: INK_SOFT }}
      >
        <span className="font-bold" style={{ color: INK }}>
          {mystery ? "" : `${city.city.toUpperCase()}, ${city.country.toUpperCase()}`}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: city.live ? "#2f7a3d" : "#a89f8d" }}
          />
          {city.live
            ? "Live headlines — machine-translated"
            : "Sample headlines — live fetch unavailable right now"}
        </span>
      </div>

      {/* lead story — full width, on top */}
      <div className="pt-4">
        {city.lead.kicker && (
          <div
            className="mb-1.5 text-xs font-bold tracking-wide"
            style={{ color: PAPER_RED }}
          >
            {city.lead.kicker}
          </div>
        )}
        <h3
          className="text-[1.6rem] font-black leading-[1.08] sm:text-[2.3rem]"
          style={headlineFont}
        >
          {mystery ? redactIdentity(city.lead.headline, city) : city.lead.headline}
        </h3>
        {city.lead.dek && (
          <p className="mt-2 text-base italic" style={{ color: INK_SOFT }}>
            {mystery ? redactIdentity(city.lead.dek, city) : city.lead.dek}
          </p>
        )}
        {city.lead.byline && (
          <p className="mt-2 text-xs" style={{ color: INK_SOFT }}>
            {city.lead.byline}
          </p>
        )}
        {city.lead.body && (
          <div className="drop-cap mt-3 max-w-2xl space-y-3 text-[0.95rem] leading-relaxed">
            {city.lead.body.map((p, i) => (
              <p key={i}>{mystery ? redactIdentity(p, city) : p}</p>
            ))}
          </div>
        )}
        {!mystery && city.lead.link && (
          <a
            href={city.lead.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm underline"
            style={{ color: PAPER_RED }}
          >
            Read the full story at {city.paper} →
          </a>
        )}
      </div>

      {/* secondary stories — a row below the lead, columned like a broadsheet */}
      <div
        className="mt-5 grid grid-cols-1 gap-5 border-t pt-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6"
        style={{ borderColor: "#cdc4ab" }}
      >
        {city.side.map((s, i) => (
          <div
            key={i}
            className="sm:border-l sm:pl-6 [&:nth-child(2n+1)]:sm:border-l-0 [&:nth-child(2n+1)]:sm:pl-0"
            style={{ borderColor: "#cdc4ab" }}
          >
            <h4 className="text-base font-bold leading-snug" style={headlineFont}>
              {mystery ? redactIdentity(s.headline, city) : s.headline}
            </h4>
            {s.body && (
              <div className="mt-1.5 space-y-2 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                {s.body.map((p, j) => (
                  <p key={j}>{mystery ? redactIdentity(p, city) : p}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* bottom strip: weather + edition — shown even in mystery mode */}
      <div
        className="mt-5 flex flex-wrap justify-between gap-2 border-t pt-3 text-[11px]"
        style={{ borderColor: INK, color: INK_SOFT }}
      >
        <span className="font-bold" style={{ color: INK }}>
          Weather: {city.weather}
        </span>
        <span>{city.edition}</span>
      </div>
    </div>
  );
}

export default function WorldEdition({ cities }: { cities: DisplayCity[] }) {
  const [mode, setMode] = useState<Mode>("play");

  // Random-on-load city for Browse — starts deterministic (index 0) so
  // server and client render the same markup, then randomizes client-side
  // right after mount (avoids a hydration mismatch from Math.random()).
  const [browseIndex, setBrowseIndex] = useState(0);
  useEffect(() => {
    // Random() must run client-only to match SSR's deterministic first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowseIndex(randomIndex(cities.length));
  }, [cities.length]);

  // Today's date, for the front page's dateline — always the real "today,"
  // computed client-side only (server has no reliable local timezone/locale
  // to format against, so this must run after mount to avoid a mismatch).
  const [today, setToday] = useState("");
  useEffect(() => {
    const dateStr = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToday(dateStr);
  }, []);

  const sortedCities = useMemo(
    () =>
      cities.map((c, i) => ({ i, label: cityLabel(c) })).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    [cities]
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
    const count = Math.min(ROUNDS_PER_GAME, cities.length);
    const order = shuffle(cities.map((_, i) => i)).slice(0, count);
    setGame({ order, roundIndex: 0, score: 0, answered: false, guess: "" });
    setGameOver(false);
    setSubmitted(false);
    setPlayerName("");
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    if (next === "play" && !game) startGame();
  }

  // Guess the City is the default tab, so the first round needs to be
  // dealt on mount too, not just when switching into the tab later.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!game) startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const roundCity = game ? cities[game.order[game.roundIndex]] : null;
  const isLastRound = game ? game.roundIndex === game.order.length - 1 : false;
  const liveCount = cities.filter((c) => c.live).length;

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
        Real, translated front-page headlines from newspapers around the
        world — browse them, or play Guess the City across 5 rounds.
      </p>

      {/* Mode toggle */}
      <div className="mt-6 inline-flex gap-1 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-1">
        <button
          type="button"
          onClick={() => handleModeChange("play")}
          aria-pressed={mode === "play"}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            mode === "play"
              ? "bg-[var(--brand-1)] text-white"
              : "text-muted hover:bg-[var(--surface-hover)] hover:text-foreground"
          }`}
        >
          🏙️ Guess the City
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("browse")}
          aria-pressed={mode === "browse"}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            mode === "browse"
              ? "bg-[var(--brand-1)] text-white"
              : "text-muted hover:bg-[var(--surface-hover)] hover:text-foreground"
          }`}
        >
          📰 Browse
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("method")}
          aria-pressed={mode === "method"}
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
            mode === "method"
              ? "bg-[var(--brand-1)] text-white"
              : "text-muted hover:bg-[var(--surface-hover)] hover:text-foreground"
          }`}
        >
          📖 Method
        </button>
      </div>

      {/* Current-tab label — the pill above can be subtle at a glance, this
          spells it out so it's never ambiguous which view is active. */}
      <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--brand-1)" }} />
        {mode === "play" && "Guess the City — round-based game"}
        {mode === "browse" && "Browse — pick any edition"}
        {mode === "method" && "Method — how this is built"}
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
              onClick={() => setBrowseIndex((cur) => randomIndex(cities.length, cur))}
              className={btnClass}
            >
              🎲 Random city
            </button>
            <span className="ml-auto text-xs text-muted">
              {cities.length} of 100 cities · {liveCount} live right now
            </span>
          </div>

          <FrontPage city={cities[browseIndex]} today={today} issueNo={100 + browseIndex} />
        </div>
      )}

      {mode === "play" && game && (
        <div className="mt-6">
          <FrontPage
            city={roundCity!}
            mystery
            today={today}
            issueNo={100 + game.order[game.roundIndex]}
          />

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
                  This was {cities[game.order[game.roundIndex]].paper} —{" "}
                  {cityLabel(cities[game.order[game.roundIndex]])}.
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

      {mode === "method" && (
        <div className="mt-6 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 text-xs leading-relaxed text-muted">
          <p className="mb-2 font-semibold text-foreground">
            How this front page is populated
          </p>
          <ul className="list-disc space-y-1.5 pl-4">
            <li>
              <strong className="text-foreground">Masthead — real.</strong>{" "}
              Each city uses its actual most-read outlet (e.g.{" "}
              <em>The Guardian</em> for London, <em>The Yomiuri Shimbun</em>{" "}
              for Tokyo).
            </li>
            <li>
              <strong className="text-foreground">Headlines — real, when available.</strong>{" "}
              Each city&rsquo;s headlines are that outlet&rsquo;s actual
              current stories in <em>that city&rsquo;s own edition/language</em>{" "}
              (not a US/English lens on the outlet — that was pulling
              foreign-desk stories rather than local ones), machine-translated
              to English. Only the headline and a link back to the original
              are shown — never the article body — to stay within fair-use
              norms for headline aggregation. Refreshes at most once an hour.
            </li>
            <li>
              <strong className="text-foreground">
                A one-sentence dek appears on some lead stories,
              </strong>{" "}
              pulled from that outlet&rsquo;s own feed when it publishes a real
              article summary (not all of them do) — this only covers a
              handful of cities right now, the rest show headline and link
              only.
            </li>
            <li>
              <strong className="text-foreground">Translation is machine-translated,</strong>{" "}
              not human-reviewed — expect the occasional awkward or imprecise
              phrasing, especially for idioms.
            </li>
            <li>
              <strong className="text-foreground">A best-effort filter</strong>{" "}
              drops obviously explicit/tabloid results before they&rsquo;re
              shown. It does <strong>not</strong>{" "}
              filter ordinary hard-news topics — crime, war, political
              scandal — because that&rsquo;s what real front pages actually
              carry. Real news is sometimes heavy; this shows it as-is rather
              than sanitizing it.
            </li>
            <li>
              <strong className="text-foreground">
                In Guess the City, any mention of the city or country
              </strong>{" "}
              is swapped for <code>[City]</code>/<code>[Country]</code> — the
              headline is otherwise shown exactly as translated.
            </li>
            <li>
              <strong className="text-foreground">When a city shows &ldquo;Sample&rdquo;:</strong>{" "}
              if a live fetch fails for that outlet — the feed is down, has no
              recent items, or the request times out — that city falls back to
              labeled placeholder text instead of breaking the page. The
              live/sample status is shown on every front page.
            </li>
            <li>
              <strong className="text-foreground">Honest caveat on the data source:</strong>{" "}
              this uses Google News&rsquo; public RSS and Google Translate&rsquo;s
              public web endpoint — both free, neither an official or licensed
              API for this kind of use. They can rate-limit, change, or go down
              without notice. A production version of this would run on a
              licensed news/translation API instead.
            </li>
            <li>
              <strong className="text-foreground">Outlet mapping needs upkeep.</strong>{" "}
              &ldquo;Most-read local paper&rdquo; shifts over time and is
              sometimes genuinely ambiguous — treat this as a starting point, not
              a fixed source of truth.
            </li>
          </ul>
        </div>
      )}
    </main>
  );
}
