import type { Metadata } from "next";
import UtmBuilder from "./utm-builder";

const DESCRIPTION =
  "Add UTM parameters to any link for clean campaign tracking. Fill the fields, copy a properly encoded tracking link.";

export const metadata: Metadata = {
  title: "Campaign Link Builder",
  description: DESCRIPTION,
  openGraph: {
    title: "Campaign Link Builder | RoxyLabs",
    description: DESCRIPTION,
    url: "/experiments/utm-builder",
    type: "website",
    images: [
      {
        url: "/roxylabs_utmbuilder_og.png",
        width: 1733,
        height: 907,
        alt: "Campaign Link Builder — a UTM link-building tool by RoxyLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campaign Link Builder | RoxyLabs",
    description: DESCRIPTION,
    images: [
      {
        url: "/roxylabs_utmbuilder_og.png",
        alt: "Campaign Link Builder — a UTM link-building tool by RoxyLabs",
      },
    ],
  },
};

export default function Page() {
  return <UtmBuilder />;
}
