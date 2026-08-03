import type { Metadata } from "next";
import UtmBuilder from "./utm-builder";

export const metadata: Metadata = {
  title: "Campaign Link Builder",
  description:
    "Add UTM parameters to any link for clean campaign tracking. Fill the fields, copy a properly encoded tracking link.",
};

export default function Page() {
  return <UtmBuilder />;
}
