/**
 * Earth Lens — curated locations.
 *
 * Slugs are aligned with `data/scene-inventory.json` (the grounded source of
 * truth for real Landsat scene IDs). The Aral Sea entry's before/after scene
 * IDs come from that inventory, never hardcoded here.
 */

export interface Location {
  /** 日本語の名称 */
  name: string;
  /** English name */
  englishName: string;
  /** lowercase-kebab-case slug; matches keys in scene-inventory.json */
  slug: string;
  /** alternate slugs / names this location is also known by */
  aliases?: string[];
  lat: number;
  lon: number;
  description: string;
}

export const locations: Location[] = [
  {
    name: "アラル海",
    englishName: "Aral Sea",
    slug: "aral-sea",
    lat: 45.0,
    lon: 60.0,
    description:
      "灌漑取水により世界第4位の湖がほぼ消失。1985年→現在で水域の劇的な縮小が見える。",
  },
  {
    name: "東京湾岸",
    englishName: "Tokyo Bay",
    slug: "tokyo-bay",
    lat: 35.6,
    lon: 139.8,
    description:
      "埋め立てと臨海開発による海岸線の人工改変。40年スパンで湾岸の変化を追う。",
  },
  {
    name: "ドバイ",
    englishName: "Dubai",
    // canonical slug matches the scene inventory key ("dubai-coast")
    slug: "dubai-coast",
    aliases: ["dubai", "ドバイ沿岸"],
    lat: 25.2,
    lon: 55.3,
    description:
      "パーム・ジュメイラ等の人工島建設による海岸線の人工改変。砂漠の海岸が劇的に変化。",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(
    (loc) => loc.slug === slug || loc.aliases?.includes(slug),
  );
}
