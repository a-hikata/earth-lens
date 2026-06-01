#!/usr/bin/env node
/**
 * Earth Lens — Landsat シーン在庫取得
 *
 * 3地点 × 3年代（1985 / 2000 / 2024）の Landsat シーンを、APIキー不要の
 * STAC エンドポイントから取得し data/scene-inventory.json に保存する。
 *
 * 主エンドポイント: Microsoft Planetary Computer STAC API（認証不要・検索のみ）
 *   https://planetarycomputer.microsoft.com/api/stac/v1/search
 *   collection: landsat-c2-l2
 * フォールバック: Element84 Earth Search（AWS Open Data, キー不要）
 *
 * 実行: node scripts/test-landsat.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "data", "scene-inventory.json");
const COLLECTION = "landsat-c2-l2";

const LOCATIONS = [
  { id: "aral-sea", name: "アラル海", lat: 45.0, lon: 60.0 },
  { id: "tokyo-bay", name: "東京湾岸", lat: 35.6, lon: 139.8 },
  { id: "dubai-coast", name: "ドバイ沿岸", lat: 25.2, lon: 55.3 },
];

const YEARS = [1985, 2000, 2024];

const ENDPOINTS = [
  {
    name: "planetary-computer",
    url: "https://planetarycomputer.microsoft.com/api/stac/v1/search",
  },
  {
    name: "earth-search",
    url: "https://earth-search.aws.element84.com/v1/search",
  },
];

function bboxFor(lat, lon, pad = 0.4) {
  return [lon - pad, lat - pad, lon + pad, lat + pad];
}

async function search(endpoint, bbox, year) {
  const body = {
    collections: [COLLECTION],
    bbox,
    datetime: `${year}-01-01/${year}-12-31`,
    limit: 5,
  };
  const res = await fetch(endpoint.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.features ?? []).map((f) => ({
    id: f.id,
    date: (f.properties?.datetime ?? "").slice(0, 10),
    platform: f.properties?.platform ?? null,
    cloud_cover: f.properties?.["eo:cloud_cover"] ?? null,
    wrs_path: f.properties?.["landsat:wrs_path"] ?? null,
    wrs_row: f.properties?.["landsat:wrs_row"] ?? null,
  }));
}

async function searchWithFallback(bbox, year) {
  for (const endpoint of ENDPOINTS) {
    try {
      const scenes = await search(endpoint, bbox, year);
      return { endpoint: endpoint.name, scenes };
    } catch (err) {
      // try next endpoint
      if (endpoint === ENDPOINTS[ENDPOINTS.length - 1]) {
        return { endpoint: null, error: String(err), scenes: [] };
      }
    }
  }
  return { endpoint: null, scenes: [] };
}

async function run() {
  const inventory = {
    generated_note: "keyless STAC (Microsoft Planetary Computer) / collection landsat-c2-l2",
    collection: COLLECTION,
    locations: {},
  };

  for (const loc of LOCATIONS) {
    const bbox = bboxFor(loc.lat, loc.lon);
    inventory.locations[loc.id] = {
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      bbox,
      years: {},
    };
    for (const year of YEARS) {
      const r = await searchWithFallback(bbox, year);
      inventory.locations[loc.id].years[year] = {
        source: r.endpoint,
        count: r.scenes.length,
        scenes: r.scenes,
      };
      console.log(
        `${loc.name} ${year}: ${r.scenes.length} scenes (${r.endpoint ?? "FAILED"})`,
      );
    }
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(inventory, null, 2));
  console.log(`\nSaved inventory -> ${OUT_PATH}`);

  // machine-readable sentinel for corruption-resistant verification
  const total = Object.values(inventory.locations).reduce(
    (a, loc) => a + Object.values(loc.years).reduce((b, y) => b + y.count, 0),
    0,
  );
  console.log(total > 0 ? "INVENTORY_OK" : "INVENTORY_EMPTY");
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
