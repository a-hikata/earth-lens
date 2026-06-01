import Link from "next/link";
import { locations } from "@/data/locations";
import { getBestScene } from "@/lib/inventory";
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
          // Grounded preview: earliest curated year (1985) "before" thumbnail,
          // derived only from a real scene ID in the inventory (else null).
          const before = getBestScene(loc.slug, "1985");
          const after = getBestScene(loc.slug, "2024");
          const beforeUrl = previewUrlForScene(before?.id);
          const afterUrl = previewUrlForScene(after?.id);
          return (
            <Link key={loc.slug} href={`/${loc.slug}`} className="card">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <Thumb url={beforeUrl} label="1985" alt={`${loc.name} 1985`} />
                <Thumb url={afterUrl} label="2024" alt={`${loc.name} 2024`} />
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
