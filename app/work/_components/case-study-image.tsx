"use client";

import { useState } from "react";
import Image from "next/image";

export function CaseStudyImage({
  src,
  alt,
  width,
  height,
  caption,
  subcaption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  subcaption: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="w-full">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="block w-full cursor-zoom-in overflow-hidden rounded-xl border border-[var(--border-solid)] bg-[var(--surface)] p-2 transition-colors hover:bg-[var(--surface-hover)] sm:p-3"
          aria-label={`Expand image: ${alt}`}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full rounded-lg"
            sizes="(min-width: 768px) 720px, 100vw"
          />
        </button>
        <p className="mt-3 text-sm leading-relaxed text-foreground">
          {caption}
        </p>
        <p className="mt-1 text-xs text-muted">{subcaption}</p>
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/85 p-4"
          onClick={() => setExpanded(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-none max-w-none rounded-lg sm:max-h-full sm:max-w-full sm:object-contain"
          />
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close"
            className="fixed right-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-sm text-white"
          >
            ✕ Close
          </button>
        </div>
      )}
    </>
  );
}
