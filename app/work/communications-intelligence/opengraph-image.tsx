import { buildOgImage, OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE } from "@/app/lib/og-image";

export const alt = "Communications Intelligence — RoxyLabs case study";
export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default async function Image() {
  return buildOgImage({
    headline: "Communications Intelligence",
    subhead: "customer experience · applied AI · digital transformation",
  });
}
