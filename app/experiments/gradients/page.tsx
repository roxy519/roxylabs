import type { Metadata } from "next";
import GradientStudio from "./gradient-studio";

export const metadata: Metadata = {
  title: "Gradient Studio",
  description:
    "Build a CSS gradient by ear — tweak the colors, spin the angle, copy the code.",
};

export default function Page() {
  return <GradientStudio />;
}
