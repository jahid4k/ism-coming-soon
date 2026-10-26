import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Keeps search engines away from the book folder and the API routes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/b/", "/api/"] },
    sitemap: undefined,
    host: site.url,
  };
}
