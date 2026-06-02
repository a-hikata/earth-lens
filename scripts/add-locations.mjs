#!/usr/bin/env node
/**
 * Earth Lens — 既存の scene-inventory.json に新規地点を「追記マージ」する。
 *
 * test-landsat.mjs は全在庫を再生成して上書きするため、既にキュレーション済みの
 * 3地点を保つ目的で、ここでは新規地点のみを STAC から取得し、既存 JSON に
 * マージして書き戻す。実在シーンのみ。取得できなければ count:0・scenes:[] とし、
 * 架空のシーンIDは絶対に作らない。
 *
 * 注: Landsat は 1972 年以降。1963 年など Landsat 以前の年代は取得不能なので
 * 含めない（捏造しない）。年代は既存の curated years（1985/2000/2024）に揃える。
 *
 * 実行: node scripts/add-locations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "data", "scene-inventory.json");
const COLLECTION = "landsat-c2-l2";

// 既存の curated years に揃える（UI の CURATED_YEARS と一致させる）。
const YEARS = [1985, 2000, 2024];

const NEW_LOCATIONS = [
  { id: "lake-chad", name: "チャド湖", lat: 13.0, lon: 14.0 },
  { id: "larsen-b", name: "ラーセンB棚氷", lat: -65.0, lon: -60.0 },
];

const ENDPOINTS = [
  { name: "planetary-computer", url: "https://planetarycomputer.microsoft.com/api/stac/v1/search" },
  { name: "earth-search", url: "https://earth-search.aws.element84.com/v1/search" },
];

function bboxFor(lat, lon, pad = 0.4) {
  return [lon - pad, lat - pad, lon + pad, lat + pad];
}

async function search(endpoint, bbox, year) {
  const body = { collections: [COLLECTION], bbox, datetime: `${year}-01-01/${year}-12-31`, limit: 5 };
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
    } catch {
      if (endpoint === ENDPOINTS[ENDPOINTS.length - 1]) return { endpoint: null, scenes: [] };
    }
  }
  return { endpoint: null, scenes: [] };
}

async function run() {
  const inventory = JSON.parse(readFileSync(OUT_PATH, "utf8"));

  for (const loc of NEW_LOCATIONS) {
    const bbox = bboxFor(loc.lat, loc.lon);
    inventory.locations[loc.id] = { name: loc.name, lat: loc.lat, lon: loc.lon, bbox, years: {} };
    for (const year of YEARS) {
      const r = await searchWithFallback(bbox, year);
      inventory.locations[loc.id].years[year] = {
        source: r.endpoint,
        count: r.scenes.length,
        scenes: r.scenes,
      };
      console.log(`${loc.name} ${year}: ${r.scenes.length} scenes (${r.endpoint ?? "FAILED"})`);
    }
  }

  writeFileSync(OUT_PATH, JSON.stringify(inventory, null, 2));
  console.log(`\nMerged ${NEW_LOCATIONS.length} locations -> ${OUT_PATH}`);
  console.log(`Total locations now: ${Object.keys(inventory.locations).length}`);
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
