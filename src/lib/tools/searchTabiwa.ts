import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'
import { products, ProductSchema } from '../data/products'

// ツール定義
export const searchTabiwaDef = toolDefinition({
  name: 'searchTabiwa',
  description:
    'tabiwaの商品を検索します。エリア名、商品名、キーワードで検索できます。',
  inputSchema: z.object({
    query: z.string().describe('検索キーワード（エリア名、商品名など）'),
  }),
  outputSchema: z.object({
    results: z.array(ProductSchema),
    totalCount: z.number(),
  }),
})

// サーバー側実装
export const searchTabiwaTool = searchTabiwaDef.server(async ({ query }) => {
  const normalizedQuery = query.toLowerCase()

  const results = products.filter((product) => {
    // 名前、エリア、キーワードで検索
    const searchTargets = [
      product.name.toLowerCase(),
      product.area.toLowerCase(),
      product.description.toLowerCase(),
      ...product.keywords.map((k) => k.toLowerCase()),
    ]

    return searchTargets.some((target) => target.includes(normalizedQuery))
  })

  return {
    results,
    totalCount: results.length,
  }
})
