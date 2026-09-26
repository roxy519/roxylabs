import type { Metadata } from "next";
import WorldEdition from "./world-edition";

export const metadata: Metadata = {
  title: "World Edition",
  description:
    "Browse front pages from newspapers around the world, or play Guess the City across 5 rounds — real outlets, sample headlines.",
};

export default function Page() {
  return <WorldEdition />;
}
