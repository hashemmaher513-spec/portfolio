import { BilingualText, Locale } from "@/models/types";

/**
 * Resolves a bilingual field according to the active locale with smart fallback to Arabic.
 * Pure utility function, safe for both Server and Client Components (No Mongoose).
 */
export function getBilingualText(
  text: BilingualText | undefined | null,
  locale: Locale = "ar"
): string {
  if (!text) return "";
  if (locale === "en") {
    return text.en && text.en.trim() !== "" ? text.en : text.ar || "";
  }
  return text.ar || text.en || "";
}
