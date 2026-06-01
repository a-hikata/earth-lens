# 🛰️ Earth Lens

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Landsat](https://img.shields.io/badge/Data-Landsat-blue)](https://www.usgs.gov/landsat-missions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

**Landsat 50年 ビフォーアフター** — 50年分の地球観測アーカイブを使い、
同一地点の「過去 vs 現在」を並べて、地球規模の変化を一目で見せるプロジェクト。

Earth Lens is a Landsat before/after viewer for visualizing environmental
change at a single location over time. It pulls imagery from the
**Microsoft Planetary Computer STAC** API (collection `landsat-c2-l2`),
which requires **no API key**, so anyone can fetch decades of Landsat scenes
and compare the past against the present.

## Locations

初期キュレーション対象の3地点（いずれも Planetary Computer STAC で 1985→2024 の
シーン取得を確認済み）:

- **アラル海** (Aral Sea) — 灌漑取水で世界4位の湖がほぼ消失
- **東京湾岸** (Tokyo Bay coast) — 埋立てによる海岸線の人工改変
- **ドバイ沿岸** (Dubai coast) — 人工島建設による海岸線の人工改変

---

## プロジェクト概要

Landsat は 1972 年の Landsat 1 打ち上げ以来、**50年以上**にわたり同一地点を
繰り返し撮影してきた、世界最長の地球観測アーカイブ。Earth Lens はこの資産を
使って、**1点の場所の「数十年前 → 現在」を対比**するシンプルな体験を提供する。

- コンセプト: 「衛星で見る、地球のビフォーアフター」
- 形態: 軽量な静的サイト（Phase 0 は需要検証が目的、[[project_space_mvp_phase0]] に準拠）
- 価値: 砂漠化・氷河後退・都市拡大・水域消失などの変化を、専門知識なしで体感できる
- スコープ: まずは下記「候補地トップ10」の Before/After を手動キュレーションで公開

### MVP の最小形
1. 候補地トップ10の Before/After 画像ペア（年・出典つき）
2. スライダー or 左右並置で比較
3. 1行の解説（何がどう変わったか）

---

## 候補地トップ10（ドラマチックな変化）

| # | 場所 | 国/地域 | 変化の内容 |
|---|------|---------|------------|
| 1 | アラル海 | カザフスタン/ウズベキスタン | 灌漑取水で世界4位の湖がほぼ消失 |
| 2 | チャド湖 | チャド/ニジェール/ナイジェリア | 1960年代比で水域が大幅縮小 |
| 3 | コロンビア氷河 | 米アラスカ | 氷河末端の劇的な後退 |
| 4 | ロンドニア州（アマゾン） | ブラジル | 「フィッシュボーン」状の森林伐採拡大 |
| 5 | ドバイ沿岸（パーム・ジュメイラ等） | UAE | 人工島建設による海岸線の人工改変 |
| 6 | ラスベガス都市圏 | 米ネバダ | 砂漠の中の急速な都市スプロール |
| 7 | 三峡ダム周辺 | 中国 | ダム湛水による river→reservoir 化 |
| 8 | サウジの円形灌漑農場 | サウジアラビア | 砂漠に出現するセンターピボット農地群 |
| 9 | ミード湖（フーバーダム貯水池） | 米アリゾナ/ネバダ | 「バスタブリング」＝水位低下の白い帯 |
| 10 | グリーンランド氷床縁 | グリーンランド | 融解・氷縁の後退 |

> 上記は初期候補。Before/After のコントラストの強さ・画像の入手性・解説の
> しやすさで最終10件を確定する。差し替え候補: 黄河デルタ、死海、ソルトン湖、
> 楼蘭/タリム盆地、ニューオーリンズ（カトリーナ前後）など。

---

## Landsat API アクセス方法メモ

複数の入手経路がある。Phase 0 は「少数地点の高品質ペアを手で選ぶ」ため、
ブラウザ/クラウドからの取得で十分。スケール時に API/クラウドへ移行する。

### 1. USGS EarthExplorer（手動・GUI）
- https://earthexplorer.usgs.gov/ — 地点・期間・雲量で検索しシーンをDL。
- 無料。USGS アカウント（ERS）が必要。Phase 0 のキュレーションに最適。

### 2. USGS M2M API（Machine-to-Machine、プログラム取得）
- https://m2m.cr.usgs.gov/ — JSON-RPC 形式。`login` → `scene-search` →
  `download-request` の流れ。ERS アカウント＋API アクセス申請が必要。

### 3. クラウド・オープンデータ（大規模・解析向き）
- **AWS Open Data**: `s3://usgs-landsat`（Collection 2、requester-pays）。
  COG 形式でバンド単位に取得可能。
- **Microsoft Planetary Computer**: STAC API + SAS トークンで Landsat C2 を取得。
  https://planetarycomputer.microsoft.com/
- **Google Earth Engine**: `LANDSAT/LC08/C02/...` 等のコレクション。合成・
  可視化に強い（要 GEE アカウント）。

### 可視化メモ
- ナチュラルカラー = バンド組み合わせ（Landsat 8/9 は B4/B3/B2）。
- センサ世代でバンド番号が異なる（MSS / TM / ETM+ / OLI）。Before 側は
  旧センサ（例: Landsat 5 TM）になる点に注意し、見た目を揃える。

---

## OrbSeekr との関係

- **独立プロジェクト・別URL**。Earth Lens（地球観測ビフォーアフター）と
  OrbSeekr（宇宙ビジネスの GEO・構造化グラウンドトゥルース層,
  [[project_orbseekr_geo_structured_layer]]）はコードベース・ドメイン・URL を
  分ける。共有インフラを前提にしない。
- 両者をプロダクトとして**ブリッジしない**（EC と宇宙を分けるのと同じ思想:
  [[feedback_separate_ec_space]] の独立軸ポリシーに準拠）。
- 学び（需要検証の知見・静的サイト運用ノウハウ）はナレッジベース経由で共有してよい。

---

## 実装開始トリガー

- **OrbSeekr Phase 0 完了後に着手**（[[project_space_mvp_phase0]]）。
  それまでは本リポジトリは「仕込み（README + 候補地 + 取得手段の調査）」に留める。
- 着手の前提: OrbSeekr Phase 0 で需要検証プロセスが回り、静的サイト運用の型が
  できていること。その型を Earth Lens に横展開する。

### 現在のステータス
- [x] リポジトリ作成・コンセプト定義
- [x] 候補地トップ10の初期リスト
- [x] Landsat 取得手段の調査メモ
- [x] Landsat 接続テスト（`scripts/test-landsat.mjs`）— Microsoft Planetary
  Computer STAC（キー不要）でアラル海の **1985(Landsat-5)〜2024** シーン取得を確認
- [ ] （トリガー待ち）Before/After ペアのキュレーション
- [ ] （トリガー待ち）静的サイト実装

## Landsat シーン在庫（取得結果 2026-05-31）

`scripts/test-landsat.mjs` を 3地点 × 3年代で実行し、`data/scene-inventory.json`
に保存。取得元は **Microsoft Planetary Computer STAC（APIキー不要）**、
collection `landsat-c2-l2`。**全9セルでシーン取得に成功**。

| 地点 | 1985 | 2000 | 2024 |
|------|------|------|------|
| アラル海 (45.0, 60.0) | ✅ Landsat-5 | ✅ Landsat-7 | ✅ Landsat-8 |
| 東京湾岸 (35.6, 139.8) | ✅ Landsat-5 | ✅ Landsat-7 | ✅ Landsat-8 |
| ドバイ沿岸 (25.2, 55.3) | ✅ Landsat-5 | ✅ Landsat-7 | ✅ Landsat-8 |

→ 3地点とも **Landsat-5(1985) → Landsat-7(2000) → Landsat-8(2024)** の
40年スパンの Before/After が API 経由で取得可能。シーンID・雲量・WRS path/row は
`data/scene-inventory.json` に記録。
