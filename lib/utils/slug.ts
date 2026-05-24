// Slug helpers used to build deterministic URL paths for entities sourced
// from external systems (e.g. Sessionize speakers).
//
// `slugify` is intentionally simple: NFD normalize, strip combining marks,
// lowercase, replace non-alphanumerics with hyphens, collapse, trim. It does
// NOT guarantee uniqueness; the caller must run `disambiguateSlugs` over the
// full list to resolve collisions deterministically by `id`.

export function slugify(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFD")
    // strip combining diacritical marks (U+0300..U+036F)
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type Sluggable = { id: string; slug: string };

/**
 * Resolve slug collisions deterministically. Items are processed in ascending
 * order of `id` (lexicographic). The first item to claim a given slug keeps
 * it; subsequent items get `-2`, `-3`, ... suffixes in `id` order. The
 * relative order of the input array is preserved in the output.
 */
export function disambiguateSlugs<T extends Sluggable>(items: T[]): T[] {
  // Index items by their position so we can rehydrate the original order.
  const indexed = items.map((item, index) => ({ item, index }));

  // Sort a copy by id for deterministic resolution.
  const ordered = [...indexed].sort((a, b) => {
    if (a.item.id < b.item.id) return -1;
    if (a.item.id > b.item.id) return 1;
    return 0;
  });

  const counts = new Map<string, number>();
  const resolved = new Map<number, T>();

  for (const { item, index } of ordered) {
    const base = item.slug || "item";
    const used = counts.get(base) ?? 0;
    counts.set(base, used + 1);
    const newSlug = used === 0 ? base : `${base}-${used + 1}`;
    resolved.set(index, { ...item, slug: newSlug });
  }

  return items.map((_, index) => {
    const r = resolved.get(index);
    // The resolved map is fully populated by the loop above; this fallback is
    // a defensive copy and should never be hit at runtime.
    return r ?? items[index];
  });
}
