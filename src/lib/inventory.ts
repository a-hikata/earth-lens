/**
 * Earth Lens — typed reader for data/scene-inventory.json.
 *
 * The inventory is the grounded source of truth for real Landsat scene IDs
 * (produced by scripts/test-landsat.mjs against Microsoft Planetary Computer).
 * We never invent IDs here — a year with no scenes yields null.
 */
import inventoryJson from "../../data/scene-inventory.json";

export interface InventoryScene {
  id: string;
  date: string;
  platform: string | null;
  cloud_cover: number | null;
  wrs_path: string | null;
  wrs_row: string | null;
}

interface InventoryYear {
  source: string | null;
  count: number;
  scenes: InventoryScene[];
}

interface InventoryLocation {
  name: string;
  lat: number;
  lon: number;
  bbox: number[];
  years: Record<string, InventoryYear>;
}

interface Inventory {
  generated_note: string;
  collection: string;
  locations: Record<string, InventoryLocation>;
}

const inventory = inventoryJson as Inventory;

/** Years Earth Lens curates a before/after for. */
export const CURATED_YEARS = ["1985", "2000", "2024"] as const;
export type CuratedYear = (typeof CURATED_YEARS)[number];

/**
 * Return the single best (lowest cloud cover) real scene for a location/year,
 * or null if the inventory has none. Never fabricates an ID.
 */
export function getBestScene(
  slug: string,
  year: string,
): InventoryScene | null {
  const loc = inventory.locations[slug];
  if (!loc) return null;
  const y = loc.years[year];
  if (!y || !y.scenes || y.scenes.length === 0) return null;
  const sorted = [...y.scenes].sort(
    (a, b) => (a.cloud_cover ?? 999) - (b.cloud_cover ?? 999),
  );
  return sorted[0] ?? null;
}

/**
 * Years actually present in a location's inventory, sorted ascending.
 * Falls back to CURATED_YEARS for any location missing from the inventory
 * (keeps callers backward compatible for the original curated locations).
 */
export function getInventoryYears(slug: string): string[] {
  const loc = inventory.locations[slug];
  if (!loc || !loc.years) return [...CURATED_YEARS];
  const years = Object.keys(loc.years);
  if (years.length === 0) return [...CURATED_YEARS];
  return years.sort((a, b) => Number(a) - Number(b));
}

/**
 * Each year present in this location's own inventory (ascending) -> best
 * scene (or null). Locations use varied year sets (e.g. 1972/2010/2015), so
 * we read the location's own years rather than a fixed global list. A year
 * recorded with zero scenes yields a null scene (never fabricated).
 */
export function getScenesByYear(
  slug: string,
): Array<{ year: string; scene: InventoryScene | null }> {
  return getInventoryYears(slug).map((year) => ({
    year,
    scene: getBestScene(slug, year),
  }));
}

export function hasInventoryFor(slug: string): boolean {
  return Boolean(inventory.locations[slug]);
}
