// Server-only. Fetches each city's real, current headlines and machine-
// translates them to English. NOT imported by any "use client" file.
//
// Data source: Google News' public RSS search, restricted to each outlet's
// domain (e.g. `site:theguardian.com`). This avoids needing a bespoke
// scraper/selector per outlet, but Google News' own feed license limits the
// XML to "personal, non-commercial" feed-reader use — displaying it here is
// a gray area, not a clean license fit for a public site. Translation uses
// Google Translate's public web endpoint (the same one translate.google.com
// itself calls), which has no official support, no key, and no SLA. Both are
// free-tier stopgaps, not what a production version of this should run on —
// see the in-page notes panel and CLAUDE-facing summary for the honest
// caveat and the real path (a paid news/translation API) once one exists.
//
// Every city always has a complete fallback (its `lead`/`side` placeholder
// stories in cities.ts) — if a live fetch fails for any reason, that city
// silently shows its labeled "sample" content instead of breaking the page.

import { CITIES, type City, type Story } from "./cities";

const FETCH_TIMEOUT_MS = 6000;
const STORIES_PER_CITY = 5; // 1 lead + 4 side, matching the layout's grid
const REVALIDATE_SECONDS = 3600; // refresh at most once an hour (ISR)
const CONCURRENCY = 4;

export type DisplayCity = City & {
  /** True when lead/side below are real, freshly translated headlines. */
  live: boolean;
  fetchedAt: number | null;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)));
}

function stripCdata(s: string): string {
  const m = s.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return m ? m[1] : s;
}

function parseRssItems(xml: string): { title: string; link: string }[] {
  const items: { title: string; link: string }[] = [];
  const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  for (const block of itemBlocks) {
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = block.match(/<link>([\s\S]*?)<\/link>/);
    if (!titleMatch || !linkMatch) continue;
    const title = decodeEntities(stripCdata(titleMatch[1]).trim());
    const link = decodeEntities(stripCdata(linkMatch[1]).trim());
    if (title && link) items.push({ title, link });
  }
  return items;
}

/**
 * Google News titles often trail off into breadcrumbs/attribution after
 * " - " (source name, section, taxonomy — e.g. "Headline - Foreign Affairs -
 * Egypt - Ahram"). The real headline is reliably the first segment.
 *
 * Some results are also just section/nav pages picked up by the `site:`
 * search rather than actual articles (e.g. "Ahraminfo - All the latest news
 * - Ahraminfo"). A short word count after cleaning is a decent signal for
 * "this isn't really a headline" — real headlines are sentences, nav labels
 * aren't — so those are filtered out rather than shown as a "top story."
 */
// Best-effort guard against explicit/tabloid content ending up on a
// professional portfolio page. Some real outlets (tabloids especially) run
// this kind of headline on their actual front page — this can't catch
// everything, but it catches the obvious cases. Deliberately narrow: it
// targets explicit-content signal words, not ordinary hard-news topics like
// crime or war, which are normal front-page news and shouldn't be filtered.
const SENSITIVE_PATTERN =
  /\b(sex|sexual|nude|naked|porn|erotic|orgy|fetish|escort|prostitut|penis|vagina|genital|orgasm|masturbat|ejaculat|viagra|erectile|libido|kink|bdsm|strip(?:per|club)|onlyfans)\w*\b/i;

function cleanHeadline(rawTitle: string): string | null {
  const first = rawTitle.split(" - ")[0].trim();
  const wordCount = first.split(/\s+/).filter(Boolean).length;
  if (wordCount < 5) return null;
  return first;
}

async function translateText(text: string, signal: AbortSignal): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", "en");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const res = await fetch(url, { signal, next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const data = (await res.json()) as unknown;

  // Response shape: [[[translatedChunk, originalChunk, ...], ...], ...]
  const segments = Array.isArray(data) ? data[0] : null;
  if (!Array.isArray(segments)) return text;
  return segments
    .map((seg) => (Array.isArray(seg) ? String(seg[0] ?? "") : ""))
    .join("")
    .trim() || text;
}

async function fetchCityLiveStory(
  city: City
): Promise<{ lead: Story; side: Story[]; fetchedAt: number } | null> {
  try {
    const feedUrl = new URL("https://news.google.com/rss/search");
    feedUrl.searchParams.set("q", `site:${city.domain}`);
    feedUrl.searchParams.set("hl", "en-US");
    feedUrl.searchParams.set("gl", "US");
    feedUrl.searchParams.set("ceid", "US:en");

    const rssRes = await fetch(feedUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; roxylabs-world-edition/1.0)" },
    });
    if (!rssRes.ok) return null;

    const xml = await rssRes.text();
    // Over-fetch raw items — cleanHeadline rejects nav/section junk, and the
    // sensitive-content filter below rejects some more after translation, so
    // we need headroom to still land on STORIES_PER_CITY real, safe ones.
    const rawItems = parseRssItems(xml).slice(0, STORIES_PER_CITY * 3);
    const candidates = rawItems
      .map((item) => ({ title: cleanHeadline(item.title), link: item.link }))
      .filter((item): item is { title: string; link: string } => item.title !== null)
      .slice(0, STORIES_PER_CITY * 2);
    if (candidates.length === 0) return null;

    const translated = await Promise.all(
      candidates.map(async (item) => {
        const headline = await translateText(
          item.title,
          AbortSignal.timeout(FETCH_TIMEOUT_MS)
        );
        return { headline, link: item.link };
      })
    );

    // Filtered on the translated (English) text so this catches explicit
    // content regardless of the source language.
    const safe = translated.filter((t) => !SENSITIVE_PATTERN.test(t.headline));
    if (safe.length === 0) return null;

    const [lead, ...side] = safe.slice(0, STORIES_PER_CITY);
    return { lead, side, fetchedAt: Date.now() };
  } catch {
    return null;
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function getWorldEditionCities(): Promise<DisplayCity[]> {
  const live = await mapWithConcurrency(CITIES, CONCURRENCY, fetchCityLiveStory);

  return CITIES.map((city, i) => {
    const result = live[i];
    if (!result) {
      return { ...city, live: false, fetchedAt: null };
    }
    return {
      ...city,
      lead: result.lead,
      side: result.side,
      live: true,
      fetchedAt: result.fetchedAt,
    };
  });
}
