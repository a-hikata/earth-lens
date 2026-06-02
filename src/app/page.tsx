import Link from "next/link";
import { locations, getLocationBySlug } from "@/data/locations";
import { getScenesByYear } from "@/lib/inventory";
import { previewUrlForScene } from "@/lib/landsat";

// 最も劇的な変化トップ3。湖の消失・熱帯雨林の破壊・棚氷の崩壊という、
// 規模・速度ともに際立つ3地点を選定。各 reason は一行の理由。
const TOP_THREE: { slug: string; reason: string }[] = [
  {
    slug: "aral-sea",
    reason: "灌漑取水で世界第4位の湖がほぼ消失。人為的環境破壊の最大級の一つ。",
  },
  {
    slug: "amazon-rondonia",
    reason: "「フィッシュボーン」状の森林伐採で熱帯雨林が農地・牧草地へ。",
  },
  {
    slug: "larsen-b",
    reason: "約3,250km²の南極棚氷が数週間で崩壊。温暖化の象徴的事例。",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  // 変化速度スコア順でカードを並べ替える。既定は desc（変化が大きい順）。
  const sortDir: "desc" | "asc" = sort === "asc" ? "asc" : "desc";
  const sortedLocations = [...locations].sort((a, b) =>
    sortDir === "asc"
      ? a.changeScore - b.changeScore
      : b.changeScore - a.changeScore,
  );

  return (
    <main>
      <h1 className="site-title">🛰️ Earth Lens</h1>
      <p className="tagline">
        Landsat の50年アーカイブで、同一地点の「過去 vs 現在」を並べる。
      </p>

      <section className="top-three" aria-label="最も劇的な変化 トップ3">
        <p className="section-label">最も劇的な変化 トップ3</p>
        <div className="top-three-grid">
          {TOP_THREE.map(({ slug, reason }, i) => {
            const loc = getLocationBySlug(slug);
            if (!loc) return null;
            return (
              <Link key={slug} href={`/${loc.slug}`} className="top-three-card">
                <div className="top-three-rank">#{i + 1}</div>
                <div>
                  <h2 className="card-title">{loc.name}</h2>
                  <div className="card-en">{loc.englishName}</div>
                  <p className="card-desc">{reason}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="sort-control" role="group" aria-label="変化速度スコアで並べ替え">
        <span className="section-label" style={{ margin: 0 }}>
          変化速度スコア順
        </span>
        <Link
          href="/?sort=desc"
          className={`sort-link${sortDir === "desc" ? " is-active" : ""}`}
          aria-current={sortDir === "desc" ? "true" : undefined}
        >
          大きい順
        </Link>
        <Link
          href="/?sort=asc"
          className={`sort-link${sortDir === "asc" ? " is-active" : ""}`}
          aria-current={sortDir === "asc" ? "true" : undefined}
        >
          小さい順
        </Link>
      </div>

      <div className="gallery">
        {sortedLocations.map((loc) => {
          // Grounded preview: each location uses its OWN year set, so derive
          // the "before" thumb from the earliest available year with a real
          // scene and the "after" thumb from the latest. Scene IDs come only
          // from the inventory (else null -> placeholder). Never fabricated.
          const available = getScenesByYear(loc.slug).filter((y) => y.scene);
          const beforeEntry = available[0];
          const afterEntry = available[available.length - 1];
          const beforeYear = beforeEntry?.year ?? "—";
          const afterYear = afterEntry?.year ?? "—";
          const beforeUrl = previewUrlForScene(beforeEntry?.scene?.id);
          const afterUrl = previewUrlForScene(afterEntry?.scene?.id);
          return (
            <Link key={loc.slug} href={`/${loc.slug}`} className="card">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <Thumb
                  url={beforeUrl}
                  label={beforeYear}
                  alt={`${loc.name} ${beforeYear}`}
                />
                <Thumb
                  url={afterUrl}
                  label={afterYear}
                  alt={`${loc.name} ${afterYear}`}
                />
              </div>
              <div className="card-body">
                <h2 className="card-title">{loc.name}</h2>
                <div className="card-en">{loc.englishName}</div>
                <div className="card-score" title="変化速度スコア（定性的な編集上の推定）">
                  変化速度スコア {loc.changeScore}/10
                </div>
                <p className="card-desc">{loc.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

function Thumb({
  url,
  label,
  alt,
}: {
  url: string | null;
  label: string;
  alt: string;
}) {
  if (!url) {
    return <div className="placeholder">{label}: 画像なし</div>;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt={alt} loading="lazy" />;
}
