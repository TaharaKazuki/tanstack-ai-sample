import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'

// Web検索ツール定義
export const searchWebDef = toolDefinition({
  name: 'searchWeb',
  description:
    'インターネット上の情報を検索します。最新のニュース、観光情報、一般的な知識など、あらゆる情報を検索できます。',
  inputSchema: z.object({
    query: z.string().describe('検索キーワード'),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string().describe('検索結果のタイトル'),
        snippet: z.string().describe('検索結果の要約'),
        url: z.string().url().describe('検索結果のURL'),
      })
    ).describe('検索結果のリスト'),
    summary: z.string().describe('検索結果の要約'),
  }),
})

// サーバー側実装
export const searchWebTool = searchWebDef.server(async ({ query }) => {
  try {
    // DuckDuckGo HTML版を使用（JavaScript不要）
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()

    // DuckDuckGoの検索結果を抽出
    const results: Array<{ title: string; snippet: string; url: string }> = []

    // 検索結果のパターンを抽出（DuckDuckGo HTMLの構造に基づく）
    const resultRegex = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/g

    let match
    let count = 0
    while ((match = resultRegex.exec(html)) !== null && count < 5) {
      const url = match[1].replace(/^\/\/duckduckgo\.com\/l\/\?uddg=/, '').split('&')[0]
      const title = match[2].replace(/<[^>]+>/g, '').trim()
      const snippet = match[3].replace(/<[^>]+>/g, '').trim()

      if (url && title && snippet) {
        try {
          const decodedUrl = decodeURIComponent(url)
          results.push({
            title: title.substring(0, 200),
            snippet: snippet.substring(0, 300),
            url: decodedUrl,
          })
          count++
        } catch (e) {
          // URLデコードエラーは無視
          continue
        }
      }
    }

    // 検索結果が取得できなかった場合の簡易的なフォールバック
    if (results.length === 0) {
      results.push({
        title: `「${query}」の検索結果`,
        snippet: '検索結果の解析に失敗しました。別のキーワードで試してください。',
        url: searchUrl,
      })
    }

    // サマリーを生成
    const summary = results.length > 0
      ? `「${query}」について${results.length}件の検索結果を見つけました。`
      : `「${query}」に関する情報が見つかりませんでした。`

    return {
      results,
      summary,
    }
  } catch (error) {
    console.error('Web search error:', error)
    // エラー時はフォールバック情報を返す
    return {
      results: [
        {
          title: '検索エラー',
          snippet: `「${query}」の検索中にエラーが発生しました。インターネット接続を確認してください。`,
          url: 'https://duckduckgo.com',
        },
      ],
      summary: '検索エラーが発生しました。',
    }
  }
})
