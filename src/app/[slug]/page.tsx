import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  locations,
  getLocationBySlug,
  DATA_SOURCE,
  changeCategoryFor,
  CHANGE_TAG_LABEL,
  type Location,
} from "@/data/locations";
import { getScenesByYear } from "@/lib/inventory";
import { previewUrlForScene } from "@/lib/landsat";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

// Pre-render one static page per canonical location slug.
export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) return { title: "Not found — Earth Lens" };
  return {
    title: `${loc.name} (${loc.englishName}) — Earth Lens`,
    description: loc.changeDescription.slice(0, 120),
  };
}

/**
 * 関連地点を3件選ぶ。まず同じ変化種別タグの地点を優先し、足りなければ
 * changeScore が近い地点で補う（自分自身は除外）。
 */
function relatedLocations(current: Location): Location[] {
  const others = locations.filter((l) => l.slug !== current.slug);
  const sameTag = others.filter(
    (l) => changeCategoryFor(l) === changeCategoryFor(current),
  );
  const byScore = [...others].sort(
    (a, b) =>
      Math.abs(a.changeScore - current.changeScore) -
      Math.abs(b.changeScore - current.changeScore),
  );
  const picked: Location[] = [];
  for (const l of [...sameTag, ...byScore]) {
    if (picked.length >= 3) break;
    if (!picked.some((p) => p.slug === l.slug)) picked.push(l);
  }
  return picked;
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocationBySlug(slug);
  if (!loc) notFound();

  const byYear = getScenesByYear(loc.slug);
  // before = 在庫がある最も古い年 / after = 最も新しい年。
  // 1985 の在庫が無い地点（例: ラーセンB は 2000）でもスライダーが成立する。
  const availableYears = byYear.filter((y) => y.scene);
  const beforeEntry = availableYears[0];
  const afterEntry = availableYears[availableYears.length - 1];
  const before = beforeEntry?.scene ?? null;
  const after = afterEntry?.scene ?? null;
  const beforeYear = beforeEntry?.year ?? "1985";
  const afterYear = afterEntry?.year ?? "2024";
  const beforeUrl = previewUrlForScene(before?.id);
  const afterUrl = previewUrlForScene(after?.id);

  // 関連地点（同じ変化種別を優先、不足分は changeScore が近い順）。
  const related = relatedLocations(loc).map((r) => {
    const avail = getScenesByYear(r.slug).filter((y) => y.scene);
    const latest = avail[avail.length - 1];
    return {
      loc: r,
      previewUrl: previewUrlForScene(latest?.scene?.id),
      tagLabel: CHANGE_TAG_LABEL[changeCategoryFor(r)],
    };
  });

  // 在庫にある年のみを temporalCoverage / Dataset に含める（捏造しない）。
  const coveredYears = byYear
    .filter((y) => y.scene)
    .map((y) => y.year);
  const temporalCoverage =
    coveredYears.length > 0
      ? `${coveredYears[0]}/${coveredYears[coveredYears.length - 1]}`
      : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${loc.name}（${loc.englishName}）Landsat ビフォーアフター`,
    description: `${loc.changeDescription}\n\n【変化の原因】${loc.changeCause}\n\n【データの意義】${loc.significance}`,
    keywords: [loc.name, loc.englishName, "Landsat", "リモートセンシング", loc.changeCause],
    temporalCoverage,
    spatialCoverage: {
      "@type": "Place",
      geo: {
        "@type": "GeoCoordinates",
        latitude: loc.lat,
        longitude: loc.lon,
      },
    },
    measurementTechnique: "Landsat 衛星による光学リモートセンシング（マルチスペクトル観測）",
    creator: { "@type": "Organization", name: DATA_SOURCE.provider },
    distribution: { "@type": "DataDownload", contentUrl: afterUrl ?? undefined },
    license: DATA_SOURCE.licenseUrl,
    isBasedOn: DATA_SOURCE.platform,
    variableMeasured: byYear
      .filter((y) => y.scene)
      .map((y) => ({
        "@type": "PropertyValue",
        name: `${y.year} Landsat scene`,
        value: y.scene?.id,
      })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p>
        <Link href="/" className="back">
          ← すべての地点
        </Link>
      </p>
      <h1 className="site-title">{loc.name}</h1>
      <div className="card-en">{loc.englishName}</div>
      <div className="card-en">
        緯度 {loc.lat} / 経度 {loc.lon}
      </div>

      <p className="section-label">{beforeYear} ↔ {afterYear} ビフォーアフター</p>
      <BeforeAfterSlider
        beforeUrl={beforeUrl}
        afterUrl={afterUrl}
        beforeLabel={`${beforeYear}${before?.platform ? ` · ${before.platform}` : ""}`}
        afterLabel={`${afterYear}${after?.platform ? ` · ${after.platform}` : ""}`}
        alt={`${loc.name} Landsat`}
      />
      <div className="ba-meta">
        {before && <span>{beforeYear}: {before.id}</span>}
        {after && <span>{afterYear}: {after.id}</span>}
      </div>

      <p className="section-label">変化速度スコア</p>
      <div className="change-score">
        <span className="change-score-value">{loc.changeScore}/10</span>
        <span className="change-score-note">
          1985→2024 のおおよその変化の大きさの目安（定性的な編集上の推定であり、計測値ではありません）
        </span>
      </div>
      <p className="change-desc">根拠: {loc.changeScoreBasis}</p>

      <p className="section-label">変化の説明</p>
      <p className="change-desc">{loc.changeDescription}</p>

      <p className="section-label">変化の原因</p>
      <p className="change-desc">{loc.changeCause}</p>

      <p className="section-label">データの意義</p>
      <p className="change-desc">{loc.significance}</p>

      <p className="section-label">年代別シーン</p>
      <div className="ba-grid">
        {byYear.map(({ year, scene }) => {
          const url = previewUrlForScene(scene?.id);
          return (
            <div key={year} className="frame">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`${loc.name} ${year} Landsat`} loading="lazy" />
              ) : (
                <div className="placeholder">
                  {year}: この年の Landsat シーンは在庫にありません
                </div>
              )}
              <div className="frame-meta">
                <div className="year">{year}</div>
                {scene ? (
                  <>
                    <div className="scene-id">{scene.id}</div>
                    <div className="card-en">
                      {scene.date}
                      {scene.platform ? ` · ${scene.platform}` : ""}
                      {scene.cloud_cover != null
                        ? ` · 雲量 ${scene.cloud_cover}%`
                        : ""}
                    </div>
                  </>
                ) : (
                  <div className="scene-id">scene: null</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="section-label">関連地点</p>
      <div className="related-grid">
        {related.map(({ loc: r, previewUrl, tagLabel }) => (
          <Link key={r.slug} href={`/${r.slug}`} className="related-card">
            <div className="media-169">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt={`${r.name}`} loading="lazy" />
              ) : (
                <div className="placeholder">画像なし</div>
              )}
            </div>
            <div className="related-body">
              <p className="related-name">{r.name}</p>
              <div className="tag-badges">
                <span className="change-tag">{tagLabel}</span>
                <span className="card-score" style={{ margin: 0 }}>
                  {r.changeScore}/10
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="section-label">関連プロジェクト</p>
      <p className="change-desc" style={{ marginBottom: "0.5rem" }}>
        地球から宇宙へ。姉妹プロジェクト OrbSeekr では、太陽フレアや地磁気嵐
        などの宇宙天気を追っています。
      </p>
      <a
        href="https://space-mvp.vercel.app/spaceweather"
        target="_blank"
        rel="noopener noreferrer"
        className="orbseekr-link"
      >
        🌌 OrbSeekr 宇宙天気を見る →
      </a>

      <dl className="source-box">
        <p style={{ margin: 0, color: "var(--fg)", fontWeight: 600 }}>
          データソース・ライセンス
        </p>
        <dt>提供元</dt>
        <dd style={{ margin: 0 }}>{DATA_SOURCE.provider}</dd>
        <dt>配信</dt>
        <dd style={{ margin: 0 }}>
          {DATA_SOURCE.platform}（collection: {DATA_SOURCE.collection}）
        </dd>
        <dt>ライセンス</dt>
        <dd style={{ margin: 0 }}>
          {DATA_SOURCE.license} —{" "}
          <a
            href={DATA_SOURCE.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            出典・引用について
          </a>
        </dd>
      </dl>
    </main>
  );
}
