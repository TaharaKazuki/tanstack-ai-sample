import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  area: z.string(), // エリア（広島、岡山など）
  price: z.number(), // 価格（税込）
  validDays: z.number(), // 有効日数
  features: z.array(z.string()), // 特徴・含まれるもの
  url: z.string().url(), // 商品詳細URL
  keywords: z.array(z.string()), // 検索用キーワード
})

export type Product = z.infer<typeof ProductSchema>

// 商品データ（手動で追加 or スクレイピングで生成）
export const products: Product[] = [
  {
    id: 'hiroshima-wide-pass',
    name: '広島ワイドパス',
    description: '広島エリアのJR線・路面電車が乗り放題',
    area: '広島',
    price: 3000,
    validDays: 2,
    features: [
      'JR西日本（広島エリア）乗り放題',
      '広島電鉄（路面電車）乗り放題',
      '宮島フェリー乗船可',
    ],
    url: 'https://www.jr-odekake.net/railroad/ticket/tokutoku/tabiwa/hiroshima-wide/',
    keywords: ['広島', '宮島', '路面電車', 'フリーパス'],
  },
  {
    id: 'kansai-wide-pass',
    name: '関西ワイドパス',
    description: '関西エリアを広くカバーするフリーパス',
    area: '関西',
    price: 10000,
    validDays: 5,
    features: [
      'JR西日本（関西エリア）乗り放題',
      '新幹線（新大阪〜岡山間）利用可',
      '特急列車の自由席利用可',
    ],
    url: 'https://www.jr-odekake.net/railroad/ticket/tokutoku/tabiwa/kansai-wide/',
    keywords: ['関西', '大阪', '京都', '神戸', '姫路', '新幹線'],
  },
  {
    id: 'okayama-kurashiki-pass',
    name: '岡山・倉敷パス',
    description: '岡山と倉敷を満喫できる1日パス',
    area: '岡山',
    price: 2000,
    validDays: 1,
    features: [
      'JR西日本（岡山〜倉敷間）乗り放題',
      '倉敷美観地区へのアクセスに便利',
      '路線バス一部区間利用可',
    ],
    url: 'https://www.jr-odekake.net/railroad/ticket/tokutoku/tabiwa/okayama-kurashiki/',
    keywords: ['岡山', '倉敷', '美観地区'],
  },
  {
    id: 'san-in-pass',
    name: '山陰観光パス',
    description: '山陰地方を周遊できるお得なパス',
    area: '山陰',
    price: 5000,
    validDays: 3,
    features: [
      'JR西日本（山陰エリア）乗り放題',
      '鳥取砂丘、出雲大社へのアクセスに最適',
      '特急列車の自由席利用可',
    ],
    url: 'https://www.jr-odekake.net/railroad/ticket/tokutoku/tabiwa/sanin/',
    keywords: ['山陰', '鳥取', '島根', '出雲大社', '鳥取砂丘'],
  },
  {
    id: 'kyoto-osaka-pass',
    name: '京都・大阪観光パス',
    description: '京都と大阪を効率よく観光できるパス',
    area: '京都・大阪',
    price: 4500,
    validDays: 2,
    features: [
      'JR西日本（京都・大阪エリア）乗り放題',
      '主要観光地へのアクセス抜群',
      '市営地下鉄一部区間利用可',
    ],
    url: 'https://www.jr-odekake.net/railroad/ticket/tokutoku/tabiwa/kyoto-osaka/',
    keywords: ['京都', '大阪', '観光', '寺社'],
  },
]
