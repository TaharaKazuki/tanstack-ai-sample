import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'

// Web検索ツール定義
export const searchWebDef = toolDefinition({
  name: 'searchWeb',
  description:
    'tabiwaの公式サイトから最新の商品情報を検索します。商品名、エリア名、観光地名などで検索できます。',
  inputSchema: z.object({
    query: z.string().describe('検索キーワード（商品名、エリア名、観光地名など）'),
  }),
  outputSchema: z.object({
    content: z.string().describe('検索結果の内容'),
    url: z.string().url().describe('情報元のURL'),
  }),
})

// サーバー側実装
export const searchWebTool = searchWebDef.server(async ({ query }) => {
  try {
    // tabiwa公式サイトのURL（2025年版）
    const baseUrl = 'https://www.jr-odekake.net/navi/tabiwa/pass/'

    // サイトのメインページを取得
    const response = await fetch(baseUrl, {
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

    // HTMLからテキストコンテンツを抽出（シンプルな方法）
    // タグを削除してテキストのみを取得
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // スクリプトタグを削除
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // スタイルタグを削除
      .replace(/<[^>]+>/g, ' ') // HTMLタグを削除
      .replace(/\s+/g, ' ') // 連続する空白を1つに
      .trim()

    // 検索クエリに関連する部分を抽出（簡易的な実装）
    const queryLower = query.toLowerCase()
    const lines = textContent.split(/[。\n]/)
    const relevantLines = lines.filter(line =>
      line.toLowerCase().includes(queryLower) ||
      line.toLowerCase().includes('tabiwa') ||
      line.toLowerCase().includes('パス') ||
      line.toLowerCase().includes('フリー')
    ).slice(0, 10) // 最大10行

    const content = relevantLines.length > 0
      ? relevantLines.join('。')
      : 'tabiwaは西日本を中心とした観光チケット・フリーパスを販売するWebサービスです。詳細は公式サイトをご確認ください。'

    return {
      content: content.substring(0, 1000), // 最大1000文字
      url: baseUrl,
    }
  } catch (error) {
    console.error('Web search error:', error)
    // エラー時はフォールバック情報を返す
    return {
      content: `tabiwaに関する情報を取得中にエラーが発生しました。tabiwa by WESTERは、JR西日本が提供する観光ナビサービスで、北陸、瀬戸内、山陰エリアなどの周遊パスやお得なきっぷを販売しています。詳細は公式サイト（https://www.jr-odekake.net/navi/tabiwa/）をご確認ください。`,
      url: 'https://www.jr-odekake.net/navi/tabiwa/',
    }
  }
})
