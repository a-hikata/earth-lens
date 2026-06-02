"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/** Serializable card data passed from the server page. */
export interface ExplorerCard {
  slug: string;
  name: string;
  englishName: string;
  description: string;
  changeScore: number;
  /** 変化種別カテゴリ（フィルタ用の正規キー） */
  category: string;
  /** バッジ表示用ラベル */
  tagLabel: string;
  region: string;
  /** before（最古年）プレビュー URL（null は在庫なし） */
  beforeUrl: string | null;
  afterUrl: string | null;
  beforeYear: string;
  afterYear: string;
}

const CATEGORY_FILTERS: { label: string; value: string }[] = [
  { label: "全て", value: "all" },
  { label: "氷河・雪氷", value: "氷河・雪氷" },
  { label: "森林", value: "森林" },
  { label: "都市", value: "都市" },
  { label: "水域", value: "水域" },
  { label: "農地", value: "農地" },
  { label: "砂漠", value: "砂漠" },
];

const SPEED_FILTERS: { label: string; value: string }[] = [
  { label: "全て", value: "all" },
  { label: "高 8-10", value: "high" },
  { label: "中 5-7", value: "mid" },
  { label: "低 1-4", value: "low" },
];

const REGION_FILTERS: { label: string; value: string }[] = [
  { label: "全て", value: "all" },
  { label: "アジア", value: "アジア" },
  { label: "ヨーロッパ", value: "ヨーロッパ" },
  { label: "アメリカ", value: "アメリカ" },
  { label: "アフリカ", value: "アフリカ" },
  { label: "極地", value: "極地" },
];

function speedBucket(score: number): "high" | "mid" | "low" {
  if (score >= 8) return "high";
  if (score >= 5) return "mid";
  return "low";
}

export default function LocationExplorer({ cards }: { cards: ExplorerCard[] }) {
  const [category, setCategory] = useState("all");
  const [speed, setSpeed] = useState("all");
  const [region, setRegion] = useState("all");

  const visible = useMemo(
    () =>
      cards.filter((c) => {
        if (category !== "all" && c.category !== category) return false;
        if (speed !== "all" && speedBucket(c.changeScore) !== speed)
          return false;
        if (region !== "all" && c.region !== region) return false;
        return true;
      }),
    [cards, category, speed, region],
  );

  return (
    <>
      <div className="filter-bar" role="group" aria-label="地点フィルタ">
        <FilterRow
          label="変化種別"
          options={CATEGORY_FILTERS}
          value={category}
          onChange={setCategory}
        />
        <FilterRow
          label="変化速度"
          options={SPEED_FILTERS}
          value={speed}
          onChange={setSpeed}
        />
        <FilterRow
          label="地域"
          options={REGION_FILTERS}
          value={region}
          onChange={setRegion}
        />
      </div>

      <div className="gallery gallery--2col">
        {visible.map((c) => (
          <Link key={c.slug} href={`/${c.slug}`} className="card">
            <div className="media-169">
              {c.afterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.afterUrl}
                  alt={`${c.name} ${c.afterYear}`}
                  loading="lazy"
                />
              ) : (
                <div className="placeholder">画像なし</div>
              )}
            </div>
            <div className="card-body">
              <h3 className="card-title">{c.name}</h3>
              <div className="tag-badges">
                <span className="change-tag">{c.tagLabel}</span>
                <span className="card-score" style={{ margin: 0 }}>
                  変化速度 {c.changeScore}/10
                </span>
              </div>
              <p className="card-desc">{c.description}</p>
            </div>
          </Link>
        ))}
        {visible.length === 0 && (
          <p className="filter-empty">
            条件に一致する地点がありません。フィルタを変更してください。
          </p>
        )}
      </div>
    </>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="filter-row">
      <span className="filter-row-label">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={`filter-chip${value === o.value ? " is-active" : ""}`}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
