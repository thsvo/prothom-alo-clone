/**
 * Normalize slug from URL or query string for DB lookup (Unicode URLs, encoding quirks).
 */
export function normalizeSlug(input) {
  if (input == null || input === "") return "";
  let s = String(input).trim();

  try {
    s = decodeURIComponent(s.replace(/\+/g, " "));
  } catch {
    // already decoded or invalid % sequences — keep s
  }

  try {
    return s.normalize("NFC");
  } catch {
    return s;
  }
}
