import type { Metadata } from "next";
import WorldEdition from "./world-edition";
import { getWorldEditionCities } from "./live";

// Re-fetch + re-translate at most once an hour; every request in between is
// served from Next's cache instead of hitting Google News/Translate again.
export const revalidate = 3600;

const OG_TITLE = "World Edition (Beta) | RoxyLabs";
const OG_DESCRIPTION =
  "A newspaper guessing game powered by today's real, translated headlines from newspapers around the world.";

export const metadata: Metadata = {
  title: "World Edition (Beta)",
  description:
    "Real, translated front-page headlines from newspapers around the world, or play Guess the City across 5 rounds.",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/experiments/world-edition",
    type: "website",
    images: [
      {
        url: "/roxylabs_worldedition_og.png",
        width: 1734,
        height: 907,
        alt: "World Edition — RoxyLabs newspaper guessing game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: "/roxylabs_worldedition_og.png",
        alt: "World Edition — RoxyLabs newspaper guessing game",
      },
    ],
  },
};

export default async function Page() {
  const cities = await getWorldEditionCities();
  return <WorldEdition cities={cities} />;
}
