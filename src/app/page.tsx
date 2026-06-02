import Link from "next/link";
import {
  locations,
  changeCategoryFor,
  regionFor,
  CHANGE_TAG_LABEL,
} from "@/data/locations";
import { getScenesByYear } from "@/lib/inventory";
import { previewUrlForScene } from "@/lib/landsat";
import LocationExplorer, {
  type ExplorerCard,
} from "@/components/LocationExplorer";

/**
 * 各地点について、在庫にある最古年(before)と最新年(after)の実シーンから
 * プレビュー URL を導出する。シーン ID は inventory のみが情報源で、
 * 在庫が無い年は null（プレースホルダ）になる。捏造はしない。
 */
function previewsFor(slug: string) {
  const available = getScenesByYear(slug).filter((y) => y.scene);
  const beforeEntry = available[0];
  const afterEntry = available[available.length - 1];
  return {
    beforeUrl: previewUrlForScene(beforeEntry?.scene?.id),
    afterUrl: previewUrlForScene(afterEntry?.scene?.id),
    beforeYear: beforeEntry?.year ?? "—",
    afterYear: afterEntry?.year ?? "—",
  };
}

export default function HomePage() {
  // 変化速度スコア降順。上位3件を「最も劇的な変化」に。
  const sorted = [...locations].sort((a, b) => b.changeScore - a.changeScore);
  const topThree = sorted.slice(0, 3);

  const cards: ExplorerCard[] = locations.map((loc) => {
    const cat = changeCategoryFor(loc);
    const p = previewsFor(loc.slug);
    return {
      slug: loc.slug,
      name: loc.name,
      englishName: loc.englishName,
      description: loc.description,
      changeScore: loc.changeScore,
      category: cat,
      tagLabel: CHANGE_TAG_LABEL[cat],
      region: regionFor(loc),
      beforeUrl: p.beforeUrl,
      afterUrl: p.afterUrl,
      beforeYear: p.beforeYear,
      afterYear: p.afterYear,
    };
  });

  return (
    <main>
      {/* S1 Hero */}
      <section className="hero">
        <p className="hero-eyebrow">🛰️ Earth Lens</p>
        <h1 className="hero-title">
          地球は変わり続けている。衛星が、それを見ている。
        </h1>
        <p className="hero-sub">
          Landsatの50年アーカイブで、同一地点の変化を見る。
        </p>
        <a href="#locations" className="hero-cta">
          変化を見る
        </a>
      </section>

      {/* S2 トップ3 */}
      <section className="top3-section" aria-label="最も劇的な変化 トップ3">
        <p className="section-label">最も劇的な変化</p>
        <div className="top3-grid">
          {topThree.map((loc) => {
            const p = previewsFor(loc.slug);
            const cat = changeCategoryFor(loc);
            return (
              <Link
                key={loc.slug}
                href={`/${loc.slug}`}
                className="top3-card"
              >
                <div className="media-169 top3-media">
                  <div className="top3-score">
                    <span className="top3-score-num">{loc.changeScore}</span>
                    <span className="top3-score-den">/10</span>
                  </div>
                  <span className="top3-badge">最も劇的な変化</span>
                  {p.beforeUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.beforeUrl}
                      alt={`${loc.name} ${p.beforeYear}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="placeholder">画像なし</div>
                  )}
                  {p.afterUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="swap-after"
                      src={p.afterUrl}
                      alt={`${loc.name} ${p.afterYear}`}
                      loading="lazy"
                    />
                  )}
                  <span className="top3-yearhint">
                    {p.beforeYear} → {p.afterYear}（ホバーで切替）
                  </span>
                </div>
                <div className="top3-body">
                  <h2 className="card-title">{loc.name}</h2>
                  <div className="tag-badges">
                    <span className="change-tag">{CHANGE_TAG_LABEL[cat]}</span>
                  </div>
                  <p className="card-desc">{loc.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* S3 地点グリッド + S4 フィルタ */}
      <section id="locations" aria-label="地点一覧">
        <p className="section-label">すべての地点</p>
        <LocationExplorer cards={cards} />
      </section>

      {/* S5 About */}
      <section className="about-section" aria-label="About">
        <h2>なぜEarthLensを作ったか</h2>
        <p>
          地球の変化は、ひとつの写真では見えにくい。けれど数十年スケールで
          同じ場所を並べると、湖が消え、森が削られ、氷が崩れ、都市が広がる様子が
          はっきりと浮かび上がる。EarthLensは、誰でも自由に使えるLandsatの
          長期アーカイブを使い、「過去」と「現在」を並べることで、地球が
          いま起きている変化を一目で実感できる場所を目指して作りました。
        </p>
        <p>
          画像は Microsoft Planetary Computer 経由の Landsat（USGS / NASA）を
          中心に、Sentinel など公的な衛星観測データを参照しています。
        </p>
        <div className="about-sources">
          <span className="about-source-chip">
            Microsoft Planetary Computer
          </span>
          <span className="about-source-chip">Landsat (USGS / NASA)</span>
          <span className="about-source-chip">Sentinel (ESA Copernicus)</span>
          <span className="about-source-chip">CC BY 4.0</span>
        </div>
      </section>
    </main>
  );
}
