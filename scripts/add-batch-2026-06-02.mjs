#!/usr/bin/env node
/**
 * Earth Lens — 2026-06-02 バッチ：10新規地点を「追記マージ」する。
 *
 * 既存の data/scene-inventory.json の5地点には一切触れず、新規10地点のみを
 * Microsoft Planetary Computer STAC（collection landsat-c2-l2, キー不要）から
 * 取得してマージする。地点ごとに「指定された年」だけを問い合わせる
 * （1972/2010/2015 など可変年セット）。
 *
 * 実在シーンのみを保存する。取得できなければ count:0・scenes:[] とし、
 * 架空のシーンIDは絶対に作らない。Landsat は 1972 年以降のため、1972 の
 * 問い合わせは 0 件になりうる（それはそのまま count:0 で記録する）。
 *
 * 実行: node scripts/add-batch-2026-06-02.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "data", "scene-inventory.json");
const COLLECTION = "landsat-c2-l2";

// 地点ごとに「指定された年」だけを問い合わせる（可変年セット）。
const NEW_LOCATIONS = [
  { id: "greenland-jakobshavn", name: "グリーンランド・ヤコブスハブン氷河", lat: 69.1, lon: -49.9, years: [1985, 2000, 2024] },
  { id: "amazon-rondonia", name: "アマゾン熱帯雨林ロンドニア州", lat: -11.0, lon: -62.0, years: [1985, 2000, 2024] },
  { id: "dubai-palm", name: "ドバイ人工島", lat: 25.1, lon: 55.1, years: [2000, 2010, 2024] },
  { id: "syria-farmland", name: "シリア農地", lat: 35.5, lon: 38.5, years: [2000, 2010, 2024] },
  { id: "california-drought", name: "カリフォルニア干ばつ", lat: 37.0, lon: -120.0, years: [2010, 2015, 2024] },
  { id: "bangladesh-floodplain", name: "バングラデシュ洪水平原", lat: 23.5, lon: 90.5, years: [1985, 2000, 2024] },
  { id: "gobi-desert", name: "ゴビ砂漠", lat: 42.0, lon: 105.0, years: [1985, 2000, 2024] },
  { id: "tokyo-sprawl", name: "東京都市拡大", lat: 35.7, lon: 139.7, years: [1972, 1985, 2024] },
  { id: "three-gorges-dam", name: "三峡ダム", lat: 30.8, lon: 111.0, years: [1985, 2000, 2024] },
  { id: "saudi-pivot-agriculture", name: "サウジアラビア・センターピボット農業", lat: 27.0, lon: 41.0, years: [1985, 2000, 2024] },
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
  const existingKeys = new Set(Object.keys(inventory.locations));

  for (const loc of NEW_LOCATIONS) {
    if (existingKeys.has(loc.id)) {
      console.log(`SKIP existing: ${loc.id}`);
      continue;
    }
    const bbox = bboxFor(loc.lat, loc.lon);
    inventory.locations[loc.id] = { name: loc.name, lat: loc.lat, lon: loc.lon, bbox, years: {} };
    for (const year of loc.years) {
      const r = await searchWithFallback(bbox, year);
      inventory.locations[loc.id].years[year] = {
        source: r.endpoint,
        count: r.scenes.length,
        scenes: r.scenes,
      };
      console.log(`${loc.id} ${year}: ${r.scenes.length} scenes (${r.endpoint ?? "FAILED"})`);
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
