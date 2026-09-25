import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_IMAGE_SIZE = { width: 1200, height: 627 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

const BACKGROUND = "#1c1d1f";
const FOREGROUND = "#ededed";
const MUTED = "#9a9a9d";
const BRAND_1 = "#7c5cff";
const BRAND_2 = "#ff5c8a";
const BRAND_3 = "#ffb25c";
const BRAND_GRADIENT = `linear-gradient(120deg, ${BRAND_1}, ${BRAND_2}, ${BRAND_3})`;

async function loadFonts() {
  const fontsDir = join(process.cwd(), "app/lib/fonts");
  const [regular, semibold, bold] = await Promise.all([
    readFile(join(fontsDir, "GeistMono-Regular.ttf")),
    readFile(join(fontsDir, "GeistMono-SemiBold.ttf")),
    readFile(join(fontsDir, "GeistMono-Bold.ttf")),
  ]);
  return [
    { name: "Geist Mono", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Geist Mono", data: semibold, style: "normal" as const, weight: 600 as const },
    { name: "Geist Mono", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}

export async function buildOgImage({
  headline,
  subhead,
}: {
  headline: string;
  subhead: string;
}) {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BACKGROUND,
          fontFamily: "Geist Mono",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            background: `linear-gradient(120deg, rgba(28,29,31,0) 0%, rgba(28,29,31,0) 34%, rgba(124,92,255,0.30) 58%, rgba(255,92,138,0.16) 78%, rgba(28,29,31,0) 100%)`,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 96px",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              color: BRAND_1,
              letterSpacing: 6,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            roxylabs
          </div>

          <div
            style={{
              display: "flex",
              width: 72,
              height: 5,
              borderRadius: 999,
              background: BRAND_GRADIENT,
              marginBottom: 44,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              color: FOREGROUND,
              lineHeight: 1.2,
              maxWidth: 940,
            }}
          >
            {headline}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 30,
              fontSize: 26,
              fontWeight: 400,
              color: MUTED,
              maxWidth: 860,
            }}
          >
            {subhead}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 52,
            left: 96,
            fontSize: 20,
            fontWeight: 400,
            color: "#5c5d60",
          }}
        >
          roxylabs.io
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts,
    }
  );
}
