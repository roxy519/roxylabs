import type { Metadata } from "next";
import ByEye from "./by-eye";

export const metadata: Metadata = {
  title: "By Eye",
  description: "Five rounds of visual instinct. No rulers. No readouts.",
};

export default function Page() {
  return <ByEye />;
}
