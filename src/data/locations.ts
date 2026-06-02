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
  {
    name: "チャド湖",
    englishName: "Lake Chad",
    // canonical slug matches the scene inventory key ("lake-chad")
    slug: "lake-chad",
    aliases: ["lake-chad", "チャド"],
    lat: 13.0,
    lon: 14.0,
    description:
      "サヘル地域の干ばつと取水で激減した湖。1985年→現在で水域の大幅な縮小が見える。",
    changeDescription:
      "アフリカ中央部、ニジェール・チャド・カメルーン・ナイジェリアの国境に広がる湖。1960年代にはアフリカ有数の大きさを誇ったが、サヘル地域の長期的な干ばつと、流域での灌漑用取水・人口増加による水需要の増大が重なり、半世紀で面積が大幅に縮小した。Landsat の画像では、1985年から現在にかけて水面が後退し、湖底が植生や乾いた土地に変わっていく様子が読み取れる。気候変動と人間活動が複合した環境変化の代表例。",
  },
  {
    name: "ラーセンB棚氷",
    englishName: "Larsen B Ice Shelf",
    // canonical slug matches the scene inventory key ("larsen-b")
    slug: "larsen-b",
    aliases: ["larsen-b", "ラーセンB"],
    lat: -65.0,
    lon: -60.0,
    description:
      "2002年に急速崩壊した南極の棚氷。崩壊前（2000年）と現在で氷の消失が見える。",
    changeDescription:
      "南極半島の東岸にあった広大な棚氷（海に張り出した氷の板）。2002年1〜3月にかけて、約3,250平方kmにおよぶ広い部分がわずか数週間で粉々に崩壊・消失し、温暖化による棚氷の急速な崩壊の象徴的事例となった。Landsat の画像では、崩壊前の2000年には一続きの氷だった海域が、2024年には開いた海や流氷に変わっている様子が確認できる。なお1985年は当該海域の Landsat シーン在庫がないため表示されない。",
  },
  {
    name: "グリーンランド・ヤコブスハブン氷河",
    englishName: "Jakobshavn Glacier (Sermeq Kujalleq), Greenland",
    slug: "greenland-jakobshavn",
    aliases: ["jakobshavn", "ヤコブスハブン氷河"],
    lat: 69.1,
    lon: -49.9,
    description:
      "グリーンランド最速級の流出氷河。氷の末端（カービング前線）が内陸へ後退。",
    changeDescription:
      "グリーンランド西岸、ディスコ湾に流れ込むグリーンランド最大級の排出氷河。氷床から海へ大量の氷を流し出し、氷山を生み出すことで知られる。温暖化に伴い1990年代後半以降に流動が加速し、氷の末端（カービング前線）が数十km単位で内陸へと後退した。Landsat の画像では、1985年に氷で埋まっていたフィヨルドが、2000年・2024年と進むにつれ開水面や流氷へと変わり、氷床縁の融解と後退が読み取れる。",
  },
  {
    name: "アマゾン熱帯雨林ロンドニア州",
    englishName: "Amazon Rainforest, Rondônia",
    slug: "amazon-rondonia",
    aliases: ["rondonia", "ロンドニア"],
    lat: -11.0,
    lon: -62.0,
    description:
      "「フィッシュボーン」状に広がる森林伐採。熱帯雨林が農地・牧草地へ。",
    changeDescription:
      "ブラジル北西部、アマゾン熱帯雨林の最前線にあたるロンドニア州。幹線道路から枝分かれする支線道路に沿って入植と開墾が進み、衛星画像では「フィッシュボーン（魚の骨）」と呼ばれる特徴的な伐採パターンが広がる。1985年には連続した深い森だった一帯が、2000年・2024年と進むにつれ格子状に切り開かれ、牧草地や農地へと変わっていく。熱帯林破壊と農地拡大の代表的な事例である。",
  },
  {
    name: "ドバイ人工島",
    englishName: "Dubai Palm Islands",
    slug: "dubai-palm",
    aliases: ["palm-jumeirah", "パーム・ジュメイラ"],
    lat: 25.1,
    lon: 55.1,
    description:
      "ヤシ形の人工島パーム・ジュメイラなどの埋立て。砂漠の海岸が沖へ拡張。",
    changeDescription:
      "アラブ首長国連邦・ドバイの沖合に造成された大規模な人工島群。観光・不動産開発を目的に、ヤシの木をかたどったパーム・ジュメイラなどの埋立て島が2000年代に建設された。Landsat の画像では、2000年にはほぼ自然のままだった海岸線が、2010年には人工島の輪郭が現れ、2024年には沖へ大きく張り出した巨大な人工地形として完成している様子が確認できる。短期間での劇的な海岸線改変の代表例。",
  },
  {
    name: "シリア農地",
    englishName: "Syrian Farmland",
    slug: "syria-farmland",
    aliases: ["syria"],
    lat: 35.5,
    lon: 38.5,
    description:
      "干ばつと内戦による農地の荒廃。灌漑農地の作付けが大きく変動。",
    changeDescription:
      "シリア北東部、ユーフラテス川流域に広がる灌漑農地地帯。2000年代後半の深刻な干ばつに続き、2011年以降の内戦で農村の人口流出やインフラ・灌漑網の損傷が重なり、作付けや緑の農地の分布が大きく変動した。Landsat の画像では、2000年・2010年に見られた整然とした緑の耕作地が、2024年には縮小・分断され、荒れ地が広がる様子が読み取れる。気候ストレスと紛争が複合した土地利用変化の事例。",
  },
  {
    name: "カリフォルニア干ばつ",
    englishName: "California Drought (Central Valley)",
    slug: "california-drought",
    aliases: ["central-valley"],
    lat: 37.0,
    lon: -120.0,
    description:
      "記録的干ばつで縮む貯水池・農地。緑の耕作地が乾いた休耕地へ。",
    changeDescription:
      "米カリフォルニア州セントラルバレーは全米有数の農業地帯。2011〜2017年と近年に記録的な干ばつが続き、貯水池の水位低下や地下水の過剰汲み上げ、農地の休耕が問題となった。Landsat の画像では、2010年に広がっていた緑の灌漑農地が、干ばつの厳しい2015年には乾いた茶色の休耕地へと大きく変わり、2024年にかけても水資源の逼迫を反映した作付けの変動が読み取れる。",
  },
  {
    name: "バングラデシュ洪水平原",
    englishName: "Bangladesh Floodplain",
    slug: "bangladesh-floodplain",
    aliases: ["bangladesh"],
    lat: 23.5,
    lon: 90.5,
    description:
      "ガンジス・ブラマプトラ合流域。河道の移動と中州・氾濫原の変化。",
    changeDescription:
      "ガンジス川とブラマプトラ川が合流する世界最大級のデルタ地帯。広大な氾濫原を蛇行する大河は、季節ごとのモンスーン洪水と土砂の堆積・侵食により、河道や中州（チャール）の位置を絶えず変える。Landsat の画像では、2000年と2024年で川筋の形や中州の分布が移り変わり、堆積・侵食と人々の土地利用が動的に変化する様子が読み取れる。なお1985年は当該域の Landsat シーン在庫がないため表示されない。",
  },
  {
    name: "ゴビ砂漠",
    englishName: "Gobi Desert",
    slug: "gobi-desert",
    aliases: ["gobi"],
    lat: 42.0,
    lon: 105.0,
    description:
      "中国・モンゴル国境の乾燥地。砂漠化と植生・土地被覆の変化。",
    changeDescription:
      "中国北部からモンゴルにかけて広がる大乾燥地帯ゴビ砂漠。過放牧や乾燥化の進行により周縁部で砂漠化が問題となる一方、中国側では植林など緑化の取り組みも行われてきた。Landsat の画像では、2000年と2024年で植生のまばらな乾燥地と砂礫の分布、季節的な水たまりや土地被覆の変化が読み取れる。なお1985年は当該域の Landsat シーン在庫がないため表示されない。乾燥地の脆弱な環境変化を映す。",
  },
  {
    name: "東京都市拡大",
    englishName: "Tokyo Urban Sprawl",
    slug: "tokyo-sprawl",
    aliases: ["tokyo-sprawl"],
    lat: 35.7,
    lon: 139.7,
    description:
      "高度成長後も続く首都圏の市街地拡大。緑地が市街地へと広がる。",
    changeDescription:
      "日本最大の都市圏・東京。戦後の高度経済成長を経て、郊外へと市街地が拡大し続けてきた。Landsat の画像では、1985年に郊外に残っていた農地や緑地が、2024年にかけて連続した市街地・住宅地へと変わり、都市のスプロール（拡散的拡大）が読み取れる。Landsat 1 の打ち上げは1972年7月で観測初期にあたり、当該域の1972年シーンは在庫がないため表示されない。",
  },
  {
    name: "三峡ダム",
    englishName: "Three Gorges Dam",
    slug: "three-gorges-dam",
    aliases: ["three-gorges"],
    lat: 30.8,
    lon: 111.0,
    description:
      "世界最大級の水力ダム。長江がダム湛水で巨大な貯水池に変化。",
    changeDescription:
      "中国・長江中流に建設された世界最大級の水力発電ダム。1994年着工、2003年から湛水を開始し、上流側に全長600kmにおよぶ巨大な貯水池が出現した。Landsat の画像では、1985年に細い川筋として谷を流れていた長江が、2000年の建設期を経て、2024年には水面が大きく広がった貯水池（reservoir）へと変わっている様子が確認できる。河川がダム湖へと姿を変えた代表的事例。",
  },
  {
    name: "サウジアラビア・センターピボット農業",
    englishName: "Saudi Arabia Center-Pivot Agriculture",
    slug: "saudi-pivot-agriculture",
    aliases: ["saudi-pivot"],
    lat: 27.0,
    lon: 41.0,
    description:
      "砂漠に出現する円形のセンターピボット農地群。地下水で緑の円が拡大。",
    changeDescription:
      "サウジアラビアの砂漠地帯に広がるセンターピボット（円形灌漑）農業。化石地下水を汲み上げ、回転するスプリンクラーで散水することで、砂漠の中に直径数百mの緑の円が無数に出現した。Landsat の画像では、1985年にほとんど何もなかった砂漠が、2000年・2024年と進むにつれ円形農地が増殖していく様子が読み取れる。持続性が懸念される地下水依存型農業の象徴的な景観である。",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(
    (loc) => loc.slug === slug || loc.aliases?.includes(slug),
  );
}
