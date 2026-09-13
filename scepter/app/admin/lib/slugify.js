/**
 * Converts a human-readable name into a URL-safe slug.
 * e.g. "Modern Lounge Chair" -> "modern-lounge-chair"
 */
export function slugify(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
