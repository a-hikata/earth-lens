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
  /** カードや一覧用の短い変化の要約 */
  description: string;
  /** 詳細ページ用の変化の説明（約200字） */
  changeDescription: string;
}

/** データソース・ライセンスの単一情報源（全地点共通）。 */
export const DATA_SOURCE = {
  /** 元データの提供元 */
  provider: "USGS / NASA Landsat Collection 2 Level-2",
  /** 配信プラットフォーム */
  platform: "Microsoft Planetary Computer (STAC)",
  /** STAC コレクション ID */
  collection: "landsat-c2-l2",
  /** Landsat データのライセンス */
  license: "Public Domain (U.S. Geological Survey)",
  /** ライセンス参照 URL */
  licenseUrl: "https://www.usgs.gov/centers/eros/data-citation",
} as const;

export const locations: Location[] = [
  {
    name: "アラル海",
    englishName: "Aral Sea",
    slug: "aral-sea",
    lat: 45.0,
    lon: 60.0,
    description:
      "灌漑取水により世界第4位の湖がほぼ消失。1985年→現在で水域の劇的な縮小が見える。",
    changeDescription:
      "かつて世界第4位の面積を誇った塩湖。旧ソ連時代に流入河川の水を綿花栽培の灌漑に大量転用した結果、湖への水の供給が激減し、1960年代以降に急速に縮小した。1985年にはまだ広い水面が残るが、2000年・2024年と進むにつれ湖は東西に分断され、大部分が干上がって塩の砂漠（アラルクム）に変わった。人間活動が引き起こした最大級の環境破壊の一つとされる。",
  },
  {
    name: "東京湾岸",
    englishName: "Tokyo Bay",
    slug: "tokyo-bay",
    lat: 35.6,
    lon: 139.8,
    description:
      "埋め立てと臨海開発による海岸線の人工改変。40年スパンで湾岸の変化を追う。",
    changeDescription:
      "首都圏の経済成長を支えてきた東京湾の沿岸部。1985年から現在にかけて、港湾・物流・住宅・レジャー施設のための埋め立てが各所で進み、もともとの干潟や浅瀬が直線的な人工海岸線に置き換わってきた。お台場の臨海副都心や中央防波堤の拡張など、自然の海岸が計画的な都市空間へと変わっていく様子が、衛星画像の海岸線の形の違いとして読み取れる。",
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
    changeDescription:
      "アラブ首長国連邦・ドバイの沿岸。1985年時点ではほとんど手つかずの砂漠の海岸線だったが、2000年代に入って石油依存からの脱却と観光立国を目指す大規模開発が始まった。ヤシの木をかたどった人工島パーム・ジュメイラをはじめとする埋め立てが沖合へと拡張し、2024年の画像では海に突き出す巨大な人工地形がはっきり確認できる。短期間での劇的な海岸線の人工改変の代表例。",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(
    (loc) => loc.slug === slug || loc.aliases?.includes(slug),
  );
}
