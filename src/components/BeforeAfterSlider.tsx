"use client";

import { useCallback, useRef, useState } from "react";

export interface BeforeAfterSliderProps {
  beforeUrl: string | null;
  afterUrl: string | null;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
}

/**
 * 左右ドラッグで「過去（before）」と「現在（after）」を切り替えるスライダー。
 *
 * after 画像を背景に敷き、before 画像を clip-path で左から divider 位置まで
 * 表示する。マウスのドラッグとタッチの両方に対応する。
 * URL が片方でも無い場合は、比較ではなく在庫なしのプレースホルダを出す
 * （存在しない画像を捏造しない）。
 */
export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
  alt,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = useState(50); // 0–100 (%)
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, ratio)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  if (!beforeUrl || !afterUrl) {
    return (
      <div className="placeholder">
        ビフォーアフターに必要な Landsat シーンが在庫にありません
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="ba-slider"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-label={`${beforeLabel} と ${afterLabel} の比較スライダー`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
        if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
      }}
    >
      {/* after (現在) を背景に */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterUrl} alt={`${alt}（${afterLabel}）`} draggable={false} />
      <span className="ba-tag ba-tag-right">{afterLabel}</span>

      {/* before (過去) を divider まで clip して上に重ねる */}
      <div
        className="ba-before"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt={`${alt}（${beforeLabel}）`}
          draggable={false}
        />
        <span className="ba-tag ba-tag-left">{beforeLabel}</span>
      </div>

      {/* divider ハンドル */}
      <div className="ba-divider" style={{ left: `${pos}%` }}>
        <div className="ba-handle" aria-hidden>
          ⟺
        </div>
      </div>
    </div>
  );
}
