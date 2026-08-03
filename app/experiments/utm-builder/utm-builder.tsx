"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Field = {
  key: "utm_source" | "utm_medium" | "utm_campaign" | "utm_term" | "utm_content";
  label: string;
  hint: string;
  required?: boolean;
  /** One-tap common values. */
  presets?: string[];
};

const FIELDS: Field[] = [
  {
    key: "utm_source",
    label: "Campaign source",
    hint: "Where the traffic comes from — e.g. google, newsletter, instagram.",
    required: true,
    presets: ["google", "newsletter", "instagram", "linkedin", "facebook"],
  },
  {
    key: "utm_medium",
    label: "Campaign medium",
    hint: "The marketing channel — e.g. cpc, email, social, referral.",
    required: true,
    presets: ["cpc", "email", "social", "referral", "organic"],
  },
  {
    key: "utm_campaign",
    label: "Campaign name",
    hint: "The specific campaign — e.g. summer_sale, launch_2026.",
    required: true,
  },
  {
    key: "utm_term",
    label: "Campaign term",
    hint: "Optional. Paid keywords for this ad.",
  },
  {
    key: "utm_content",
    label: "Campaign content",
    hint: "Optional. Tells similar links apart — e.g. hero_button vs footer_link.",
  },
];

type Values = Record<Field["key"], string>;

const EMPTY: Values = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
};

function buildUrl(base: string, values: Values): { url: string; error: string } {
  const trimmed = base.trim();
  if (!trimmed) return { url: "", error: "" };

  // Allow users to omit the scheme (example.com/page → https://example.com/page).
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return { url: "", error: "That doesn't look like a valid URL yet." };
  }

  // Set only the params that have a value; URLSearchParams handles encoding.
  for (const { key } of FIELDS) {
    const value = values[key].trim();
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }

  return { url: url.toString(), error: "" };
}

export default function UtmBuilder() {
  const [base, setBase] = useState("");
  const [values, setValues] = useState<Values>(EMPTY);
  const [copied, setCopied] = useState(false);

  const { url, error } = useMemo(() => buildUrl(base, values), [base, values]);

  const missingRequired = FIELDS.filter(
    (f) => f.required && !values[f.key].trim(),
  ).map((f) => f.label.toLowerCase());

  function setField(key: Field["key"], value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setBase("");
    setValues(EMPTY);
  }

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (e.g. insecure context) — fail quietly.
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[var(--border-solid)] bg-[var(--surface)] px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[var(--brand-1)]";

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← roxylabs
      </Link>

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold sm:text-3xl">Campaign Link Builder</h1>
        <span className="text-xs text-muted">experiment · marketing tool</span>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Add UTM tags to a link so your analytics can tell where clicks came
        from. Everything runs in your browser — nothing is saved or sent.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <section className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-foreground">
              Website URL <span className="text-[var(--brand-2)]">*</span>
            </label>
            <input
              type="url"
              inputMode="url"
              placeholder="example.com/landing-page"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className={inputClass}
            />
            {error && (
              <p className="mt-1 text-xs text-[var(--brand-2)]">{error}</p>
            )}
          </div>

          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-sm text-foreground">
                {field.label}
                {field.required && (
                  <span className="text-[var(--brand-2)]"> *</span>
                )}
              </label>
              <input
                type="text"
                value={values[field.key]}
                onChange={(e) => setField(field.key, e.target.value)}
                className={inputClass}
              />
              {field.presets && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {field.presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setField(field.key, preset)}
                      className="rounded-full border border-[var(--border-solid)] px-2 py-0.5 text-xs text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-muted">{field.hint}</p>
            </div>
          ))}

          <button
            type="button"
            onClick={reset}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            clear all
          </button>
        </section>

        {/* Output */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted">your tracking link</span>
            <button
              type="button"
              onClick={copy}
              disabled={!url}
              className="rounded-lg border border-[var(--border-solid)] px-3 py-1 text-sm text-muted transition-colors hover:bg-[var(--surface-hover)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </div>

          <div className="min-h-24 rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-4 text-sm leading-relaxed">
            {url ? (
              <span className="break-all text-foreground">{url}</span>
            ) : (
              <span className="text-muted">
                Fill in a website URL to see your link.
              </span>
            )}
          </div>

          {url && missingRequired.length > 0 && (
            <p className="mt-3 text-xs text-muted">
              Tip: add {missingRequired.join(", ")} for a complete UTM link.
            </p>
          )}

          <div className="mt-6 rounded-xl border border-[var(--border-solid)] p-4 text-xs leading-relaxed text-muted">
            <p className="mb-1 text-foreground">What are UTMs?</p>
            Short tags appended to a URL (<code>?utm_source=…</code>) that tools
            like Google Analytics read to attribute a visit to a specific
            source, channel, and campaign — without changing where the link
            goes.
          </div>
        </section>
      </div>
    </main>
  );
}
