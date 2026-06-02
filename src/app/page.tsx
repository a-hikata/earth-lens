import Link from "next/link";
import { locations } from "@/data/locations";
import { getScenesByYear } from "@/lib/inventory";
import { previewUrlForScene } from "@/lib/landsat";

export default function HomePage() {
  return (
    <main>
      <h1 className="site-title">🛰️ Earth Lens</h1>
      <p className="tagline">
        Landsat の50年アーカイブで、同一地点の「過去 vs 現在」を並べる。
      </p>

      <div className="gallery">
        {locations.map((loc) => {
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
