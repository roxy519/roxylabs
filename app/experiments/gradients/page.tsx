import type { Metadata } from "next";
import GradientStudio from "./gradient-studio";

const DESCRIPTION =
  "Build a CSS gradient — tweak the colors, spin the angle, copy the code.";

export const metadata: Metadata = {
  title: "Gradient Studio",
  description: DESCRIPTION,
  openGraph: {
    title: "Gradient Studio | RoxyLabs",
    description: DESCRIPTION,
    url: "/experiments/gradients",
    type: "website",
    images: [
      {
        url: "/roxylabs_gradientstudio_og.png",
        width: 1733,
        height: 907,
        alt: "Gradient Studio — a CSS gradient design tool by RoxyLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gradient Studio | RoxyLabs",
    description: DESCRIPTION,
    images: [
      {
        url: "/roxylabs_gradientstudio_og.png",
        alt: "Gradient Studio — a CSS gradient design tool by RoxyLabs",
      },
    ],
  },
};

export default function Page() {
  return <GradientStudio />;
}
