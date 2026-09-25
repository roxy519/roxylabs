import { buildOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "@/app/lib/og-image";

export const alt = "Applied AI & Digital Transformation — RoxyLabs selected work";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image() {
  return buildOgImage({
    headline: "Applied AI + Digital Transformation",
    subhead: "selected work · roxylabs",
  });
}
