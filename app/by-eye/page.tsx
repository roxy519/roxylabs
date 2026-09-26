import type { Metadata } from "next";
import ByEye from "./by-eye";

const DESCRIPTION = "Five rounds of visual instinct.";

export const metadata: Metadata = {
  title: "By Eye",
  description: DESCRIPTION,
  openGraph: {
    title: "By Eye | RoxyLabs",
    description: DESCRIPTION,
    url: "/by-eye",
    type: "website",
    images: [
      {
        url: "/roxylabs_byeye_og.png",
        width: 1733,
        height: 907,
        alt: "By Eye — a daily visual instinct puzzle game by RoxyLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "By Eye | RoxyLabs",
    description: DESCRIPTION,
    images: [
      {
        url: "/roxylabs_byeye_og.png",
        alt: "By Eye — a daily visual instinct puzzle game by RoxyLabs",
      },
    ],
  },
};

export default function Page() {
  return <ByEye />;
}
