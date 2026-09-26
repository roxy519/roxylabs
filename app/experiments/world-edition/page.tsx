import type { Metadata } from "next";
import WorldEdition from "./world-edition";
import { getWorldEditionCities } from "./live";

// Re-fetch + re-translate at most once an hour; every request in between is
// served from Next's cache instead of hitting Google News/Translate again.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "World Edition",
  description:
    "Real, translated front-page headlines from newspapers around the world, or play Guess the City across 5 rounds.",
};

export default async function Page() {
  const cities = await getWorldEditionCities();
  return <WorldEdition cities={cities} />;
}
