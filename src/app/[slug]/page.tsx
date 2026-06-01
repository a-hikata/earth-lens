import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locations, getLocationBySlug } from "@/data/locations";
import { getScenesByYear } from "@/lib/inventory";
import { previewUrlForScene } from "@/lib/landsat";

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
    description: loc.description,
  };
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

  return (
    <main>
      <p>
        <Link href="/" className="back">
          ← すべての地点
        </Link>
      </p>
      <h1 className="site-title">{loc.name}</h1>
      <div className="card-en">{loc.englishName}</div>
      <p className="tagline" style={{ marginTop: "0.5rem" }}>
        {loc.description}
      </p>
      <div className="card-en">
        緯度 {loc.lat} / 経度 {loc.lon}
      </div>

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
    </main>
  );
}
