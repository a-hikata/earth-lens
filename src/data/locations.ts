/**
 * Earth Lens — curated locations.
 *
 * Slugs are aligned with `data/scene-inventory.json` (the grounded source of
 * truth for real Landsat scene IDs). The Aral Sea entry's before/after scene
 * IDs come from that inventory, never hardcoded here.
 *
 * NOTE on `changeScore`: this is a *qualitative editorial estimate* (1-10) of
 * the rough magnitude of 1985→2024 change at each location — NOT a measured
 * or computed metric. It is assigned by hand from the documented change
 * (面積変化・色変化・構造変化) to give readers a relative sense of scale, and
 * should be read as an order-of-magnitude impression, not precise data.
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
  /** 変化の原因（気候変動・都市化・農業・自然災害などの要因、約80-120字） */
  changeCause: string;
  /** データの意義（なぜこの変化が重要か、約120字） */
  significance: string;
  /**
   * 1985→2024 のおおよその変化の大きさの目安（1-10 の整数）。
   * 計測値ではなく定性的な編集上の推定。ファイル冒頭の NOTE 参照。
   */
  changeScore: number;
  /** 根拠: 面積変化・色変化・構造変化のどれが効いたか（約80字） */
  changeScoreBasis: string;
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
    changeCause:
      "主因は灌漑農業。旧ソ連がアムダリヤ川・シルダリヤ川の水を綿花栽培の灌漑に大量転用し、湖への流入が激減した。乾燥した気候も蒸発を進め、人為的な取水が湖の消失を決定づけた。",
    significance:
      "持続不可能な水資源利用がもたらす環境破壊の象徴。干上がった湖底からの塩・農薬を含む砂塵は健康被害を招き、漁業崩壊など社会経済への打撃も大きく、水管理の教訓として世界的に重要。",
    changeScore: 10,
    changeScoreBasis:
      "広大な水域がほぼ消失し青→塩砂漠の茶白へ。面積変化が支配的で色変化も極端、最大級の改変。",
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
    changeCause:
      "主因は都市化に伴う埋め立て。港湾・物流・住宅・レジャー需要の高まりから、干潟や浅瀬を埋め立てて人工地盤を造成した。経済成長を背景とした計画的な土地造成が海岸線を直線的に改変した。",
    significance:
      "都市化が自然海岸を改変する過程の記録。干潟の消失は水質浄化機能や渡り鳥の生息地の喪失につながり、沿岸生態系と防災・都市計画のバランスを考えるうえで重要な事例となる。",
    changeScore: 6,
    changeScoreBasis:
      "海岸線が直線的な人工地形へ変わる構造変化が主。湾全体では局所的で面積変化は中程度。",
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
    changeCause:
      "主因は都市化と人工島開発。石油依存からの脱却と観光・不動産立国を目指し、政府主導で大規模な埋め立てと人工島建設を推進した。豊富な資本を背景とした計画的開発が砂漠の海岸を一変させた。",
    significance:
      "わずか数十年で都市開発が海岸地形を造り変えた極端な事例。人工島は沿岸の海流や堆積、海洋生態系に影響を与え、急速な都市化と環境への負荷の関係を示す貴重な記録となる。",
    changeScore: 8,
    changeScoreBasis:
      "砂漠の自然海岸に巨大な人工島が出現する構造変化が支配的。海域への張り出しで面積変化も大。",
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
    changeCause:
      "気候変動による長期的なサヘルの干ばつと降水減少が基底にあり、これに流域での灌漑用取水と人口増加に伴う水需要の増大が重なった。気候要因と農業利用が複合して湖を縮小させた。",
    significance:
      "気候変動と人間活動が複合して水資源を脅かす典型例。漁業・農業・牧畜に依存する2,000万人超の生活基盤に直結し、サヘル地域の食料安全保障と地域紛争を理解するうえで重要。",
    changeScore: 8,
    changeScoreBasis:
      "水面が大きく後退し青→植生・乾地の緑茶へ。面積変化と色変化がともに大きい。",
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
    changeCause:
      "主因は気候変動による温暖化。南極半島の急激な昇温で夏季に棚氷表面に融解水の池が多数生じ、亀裂に流れ込んで氷を割る「水くさび」作用が働いた。温暖化が棚氷の崩壊を一気に引き起こした。",
    significance:
      "温暖化が氷床の安定性を急変させうることを示す象徴的事例。棚氷の消失は背後の氷河流出を加速させ海面上昇に寄与するため、極域の気候フィードバックを理解するうえで決定的に重要。",
    changeScore: 10,
    changeScoreBasis:
      "約3,250km²の棚氷が数週間で崩壊し白い氷→開水面へ。面積・色・構造の全てが激変。",
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
    changeCause:
      "主因は気候変動による氷河融解。海水温と気温の上昇で氷河末端の融解とカービングが進み、流動が加速して前線が内陸へ後退した。温暖化がグリーンランド氷床の質量損失を促した。",
    significance:
      "グリーンランド氷床融解の最前線を示す指標。氷床からの氷の流出加速は世界の海面上昇に直接寄与するため、将来の沿岸リスクを予測するうえで欠かせない観測対象である。",
    changeScore: 7,
    changeScoreBasis:
      "カービング前線が数十km後退し氷→開水面へ。面積・色変化は大きいが範囲はフィヨルド内に局在。",
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
    changeCause:
      "主因は森林伐採と農業・牧畜の拡大。道路整備に伴う入植で、放牧地や大豆畑を得るために伐採と火入れが進んだ。経済開発を目的とした人為的な土地転換が森林を分断・消失させている。",
    significance:
      "世界最大の熱帯雨林の減少を可視化する事例。森林破壊は生物多様性の喪失と大量の二酸化炭素放出を招き、地球規模の炭素循環と気候に影響するため、森林保全政策の重要な根拠となる。",
    changeScore: 8,
    changeScoreBasis:
      "深緑の森→格子状の農地へ。広範な面積変化と色変化、フィッシュボーンの構造変化が顕著。",
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
    changeCause:
      "主因は都市化に伴う人工島建設。観光・不動産開発のため、浚渫した砂を海中に積み上げてヤシ形の島を造成した。資本集約的な計画開発が、わずか数年で自然の海岸を巨大な人工地形に変えた。",
    significance:
      "人工島造成という究極の都市化が海岸地形を改変した記録。大規模埋め立ては海流・堆積パターンや沿岸生態系を変えるため、開発と環境影響の関係を検証する重要な観測対象である。",
    changeScore: 9,
    changeScoreBasis:
      "海上に無からヤシ形の島を造成する構造変化が支配的。海→陸の面積変化も極端でほぼ人工。",
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
    changeCause:
      "主因は深刻な干ばつと内戦（紛争）の複合。気候変動も指摘される干ばつが農業を直撃し、2011年以降の内戦で農村の人口流出と灌漑インフラの損傷が重なって、農地の作付けが大きく荒廃した。",
    significance:
      "気候ストレスと紛争が連鎖して土地と社会を荒廃させる過程の記録。干ばつによる農村疲弊が社会不安や難民の背景になりうることを示し、気候安全保障を考えるうえで重要な事例である。",
    changeScore: 6,
    changeScoreBasis:
      "整然とした緑の耕作地→荒れ地への色変化が主。作付け分断の構造変化もあるが地形は保たれる。",
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
    changeCause:
      "主因は気候変動を背景とした記録的な干ばつ。降水・積雪の減少で河川流量と貯水池水位が低下し、農業用水の不足から休耕と地下水の過剰汲み上げが進み、緑の農地が乾いた休耕地へ変動した。",
    significance:
      "全米有数の農業地帯が気候変動下の干ばつに対して脆弱であることを示す事例。水資源の逼迫は食料供給と地盤沈下に直結するため、乾燥化リスクと水管理を考えるうえで重要である。",
    changeScore: 5,
    changeScoreBasis:
      "緑の農地↔茶の休耕地という色変化が中心。年により変動し可逆的、地形・面積の改変は小さい。",
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
    changeCause:
      "主因は自然災害・自然現象としての洪水と河川変動。モンスーン豪雨による季節的な大洪水と、上流から運ばれる大量の土砂の堆積・侵食が、河道や中州の位置を絶えず移動させている。",
    significance:
      "大河デルタの動的な性質と洪水リスクを記録する事例。河道移動と氾濫は数千万人の居住地と農地を左右し、気候変動下で激化が懸念されるため、防災と適応策を考えるうえで重要である。",
    changeScore: 5,
    changeScoreBasis:
      "河道・中州の位置が移る構造変化が主。自然の蛇行で大きく見えるが正味の面積変化は中程度。",
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
    changeCause:
      "主因は砂漠化で、気候変動による乾燥化に過放牧などの土地利用圧が加わって進む。一方、中国側では植林・緑化による土地被覆の回復も見られ、自然要因と人為的対策の双方が地表を変えている。",
    significance:
      "乾燥地の砂漠化と緑化対策の攻防を映す事例。砂漠化は砂塵嵐や農地の劣化を通じて広域に影響し、緑化の成否は土地劣化への適応策の有効性を検証するうえで重要な指標となる。",
    changeScore: 5,
    changeScoreBasis:
      "植生・砂礫の分布や季節的な水たまりという色変化が中心。漸進的で構造・面積の改変は穏やか。",
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
    changeCause:
      "主因は都市化。人口集中と経済成長を背景に、郊外の農地や緑地が住宅地・市街地へと開発され続けた。鉄道網の延伸と宅地需要に支えられた人為的な土地利用転換がスプロールを生んでいる。",
    significance:
      "成熟都市圏でも続く市街地拡大を可視化する事例。緑地・農地の減少はヒートアイランドや保水力低下を招くため、持続可能な都市計画とグリーンインフラを考えるうえで重要な記録である。",
    changeScore: 6,
    changeScoreBasis:
      "郊外の緑→灰色の市街地への色変化が広範。漸進的だが面積は着実に拡大、地形改変は小さい。",
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
    changeCause:
      "主因はダム建設という人為改変。発電・治水・水運を目的に長江を堰き止め、湛水によって全長600kmの巨大貯水池を出現させた。国家事業としての大規模インフラ建設が河川地形を一変させた。",
    significance:
      "巨大インフラが河川環境を改変した代表例。湛水は土砂の堆積・下流への供給や住民移転、生態系・地震活動への影響を伴うため、開発と環境のトレードオフを検証する重要な観測対象である。",
    changeScore: 8,
    changeScoreBasis:
      "細い川筋→全長600kmの貯水池へ。水域の面積変化が大きく河川の構造変化も顕著。",
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
    changeCause:
      "主因は地下水利用による農業開発。食料自給を目指し、深層の化石地下水を汲み上げてセンターピボット灌漑を導入し、砂漠に円形農地を拡大させた。乾燥気候下での人為的な水資源開発が地表を変えた。",
    significance:
      "枯渇性の化石地下水に依存した農業の持続性を問う事例。再生されない地下水の大量利用は将来の枯渇リスクを伴うため、乾燥地の食料生産と水資源管理を考えるうえで重要な教訓となる。",
    changeScore: 7,
    changeScoreBasis:
      "砂漠に円形の緑地が無数に出現する色変化と構造変化が顕著。面積拡大も大きいが分散的。",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find(
    (loc) => loc.slug === slug || loc.aliases?.includes(slug),
  );
}
