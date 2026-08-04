import type { Metadata } from "next";
import GradientEye from "./gradient-eye";

export const metadata: Metadata = {
  title: "Gradient Eye",
  description:
    "A game for your eyeballs — no numbers. Guess when the gradient split is dead level (180°) and perfectly even (50/50), then see how close you got.",
};

export default function Page() {
  return <GradientEye />;
}
