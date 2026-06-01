/**
 * Earth Lens — Landsat STAC client for Microsoft Planetary Computer.
 *
 * - STAC root: https://planetarycomputer.microsoft.com/api/stac/v1
 * - Collection: landsat-c2-l2
 * - No API key required for search.
 *
 * Planetary Computer items expose a "rendered_preview" asset whose href is a
 * `/api/data/v1/item/preview.png` URL. That preview endpoint is verified to
 * return a 200 image/png for real item IDs, so we can derive a working preview
 * URL deterministically from a real scene ID. We NEVER invent scene IDs — the
 * caller must pass an ID that came from a real STAC response / the inventory.
 */

export const STAC_ROOT =
  "https://planetarycomputer.microsoft.com/api/stac/v1";
export const STAC_SEARCH = `${STAC_ROOT}/search`;
export const COLLECTION = "landsat-c2-l2";
const DATA_ROOT = "https://planetarycomputer.microsoft.com/api/data/v1";

/** A geographic point as [lon, lat] (GeoJSON order). */
export type Point = [number, number];
/** A bbox as [west, south, east, north]. */
export type BBox = [number, number, number, number];

export interface StacSearchRequest {
  collections: string[];
  intersects?: { type: "Point"; coordinates: Point };
  bbox?: BBox;
  datetime?: string;
  limit?: number;
}

export interface StacItemSummary {
  id: string;
  date: string | null;
  platform: string | null;
  cloudCover: number | null;
}

/**
 * Build a STAC search request body for landsat-c2-l2.
 * Accepts either a point or a bbox plus an optional [start, end] year range.
 */
export function buildSearchRequest(opts: {
  point?: Point;
  bbox?: BBox;
  startYear?: number;
  endYear?: number;
  limit?: number;
}): StacSearchRequest {
  const req: StacSearchRequest = {
    collections: [COLLECTION],
    limit: opts.limit ?? 5,
  };
  if (opts.point) {
    req.intersects = { type: "Point", coordinates: opts.point };
  } else if (opts.bbox) {
    req.bbox = opts.bbox;
  }
  if (opts.startYear != null && opts.endYear != null) {
    req.datetime = `${opts.startYear}-01-01/${opts.endYear}-12-31`;
  } else if (opts.startYear != null) {
    req.datetime = `${opts.startYear}-01-01/${opts.startYear}-12-31`;
  }
  return req;
}

/** Build the request body for a single calendar year. */
export function buildYearSearchRequest(
  point: Point,
  year: number,
  limit = 1,
): StacSearchRequest {
  return buildSearchRequest({ point, startYear: year, endYear: year, limit });
}

/**
 * Run a STAC search against Planetary Computer.
 * Returns a typed summary of the matched items (may be empty).
 */
export async function searchScenes(
  req: StacSearchRequest,
): Promise<StacItemSummary[]> {
  const res = await fetch(STAC_SEARCH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`STAC search failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    features?: Array<{
      id: string;
      properties?: Record<string, unknown>;
    }>;
  };
  return (data.features ?? []).map((f) => ({
    id: f.id,
    date:
      typeof f.properties?.datetime === "string"
        ? (f.properties.datetime as string).slice(0, 10)
        : null,
    platform:
      typeof f.properties?.platform === "string"
        ? (f.properties.platform as string)
        : null,
    cloudCover:
      typeof f.properties?.["eo:cloud_cover"] === "number"
        ? (f.properties["eo:cloud_cover"] as number)
        : null,
  }));
}

/**
 * Derive a natural-color rendered preview URL for a real Landsat C2 L2 scene.
 *
 * This mirrors the href shape of the item's "rendered_preview" asset on
 * Planetary Computer (assets=red,green,blue with a standard color formula),
 * which returns a 200 image/png. Returns null for a falsy/invalid id so callers
 * render a placeholder rather than a broken/fabricated image.
 */
export function previewUrlForScene(sceneId: string | null | undefined): string | null {
  if (!sceneId) return null;
  const params = new URLSearchParams();
  params.set("collection", COLLECTION);
  params.set("item", sceneId);
  // red/green/blue natural color (Landsat C2 L2 common band names)
  params.append("assets", "red");
  params.append("assets", "green");
  params.append("assets", "blue");
  params.set(
    "color_formula",
    "gamma RGB 2.7, saturation 1.5, sigmoidal RGB 15 0.55",
  );
  params.set("format", "png");
  return `${DATA_ROOT}/item/preview.png?${params.toString()}`;
}

/** Convenience: the example curl-style point search the project uses. */
export function aralSeaYearRequest(year: number): StacSearchRequest {
  return buildYearSearchRequest([60.0, 45.0], year, 1);
}
