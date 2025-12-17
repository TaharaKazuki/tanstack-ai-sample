---
title: "TanStack AIでGemini APIを使った旅行アシスタントチャットボットを作る"
emoji: "✈️"
type: "tech"
topics: ["tanstackai", "gemini", "react", "typescript", "ai"]
published: false
---

# はじめに

この記事では、TanStack AIを使ってGemini APIと統合した旅行アシスタントチャットボットの実装方法を紹介します。TanStack AIは、React/TypeScriptアプリケーションにAI機能を簡単に統合できるフレームワークです。

## TanStack AIとは？

[TanStack AI](https://tanstack.com/ai/latest)は、TanStackファミリーの新しいライブラリで、以下の特徴があります：

- **複数のAI Provider対応**: OpenAI、Gemini、Anthropicなど様々なAI APIをサポート
- **ストリーミング対応**: リアルタイムでAIの応答を表示
- **React統合**: `useChat`フックで簡単にチャット機能を実装
- **型安全**: TypeScriptで完全に型付けされている
- **SSR対応**: TanStack Routerと組み合わせてサーバーサイドレンダリング可能

## プロジェクト構成

今回作成するプロジェクトの主要な技術スタック：

```json
{
  "dependencies": {
    "@tanstack/ai": "^0.0.3",
    "@tanstack/ai-gemini": "^0.0.3",
    "@tanstack/ai-react": "^0.0.3",
    "@tanstack/react-router": "^1.132.0",
    "@tanstack/react-start": "^1.132.0",
    "react": "^19.2.0",
    "tailwindcss": "^4.0.6"
  }
}
```

# 実装手順

## 1. プロジェクトのセットアップ

まず、必要なパッケージをインストールします：

```bash
npm install @tanstack/ai @tanstack/ai-gemini @tanstack/ai-react
```

Gemini APIキーを取得して、`.env.local`に設定します：

```bash
# .env.local
GEMINI_API_KEY=your_api_key_here
```

APIキーは[Google AI Studio](https://aistudio.google.com/app/apikey)から取得できます。

## 2. APIエンドポイントの作成

TanStack Routerを使用してAPIエンドポイントを作成します。`src/routes/api/chat.ts`を作成：

```typescript:src/routes/api/chat.ts
import { chat, toStreamResponse } from '@tanstack/ai'
import { gemini } from '@tanstack/ai-gemini'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/chat')({
  server: { handlers: { POST } },
})

export async function POST({ request }: { request: Request }) {
  // APIキーの確認
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'GEMINI_API_KEY not configured',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const { messages, conversationId } = await request.json()

  try {
    // TanStack AIのchat関数を使用
    const stream = chat({
      adapter: gemini(),  // Geminiアダプターを使用
      messages,
      model: 'gemini-2.5-flash',
      systemPrompts: [SYSTEM_PROMPT],
      conversationId,
    })

    // ストリーミングレスポンスに変換
    return toStreamResponse(stream)
  } catch (error) {
    console.error(error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    // レート制限エラーの検出
    const isRateLimitError =
      errorMessage.includes('429') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('RESOURCE_EXHAUSTED')

    if (isRateLimitError) {
      return new Response(
        JSON.stringify({
          error: 'APIのレート制限に達しました。しばらく時間をおいてから再度お試しください。',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({
        error: 'エラーが発生しました。しばらく時間をおいてから再度お試しください。',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
```

### ポイント解説

#### `chat()`関数

TanStack AIの中核となる関数です：

- **adapter**: 使用するAI Provider（今回はGemini）
- **messages**: ユーザーとアシスタントの会話履歴
- **model**: 使用するモデル名
- **systemPrompts**: システムプロンプト（AIの振る舞いを定義）
- **conversationId**: 会話を識別するID

#### `toStreamResponse()`関数

`chat()`関数が返すストリームをHTTPレスポンスに変換します。これにより、Server-Sent Events (SSE)形式でクライアントにリアルタイムで応答を送信できます。

#### エラーハンドリング

Gemini APIの無料枠には制限があるため、レート制限エラー（429）を適切に処理することが重要です。

## 3. システムプロンプトの定義

AIの振る舞いを定義するシステムプロンプトを作成します。`src/lib/prompts/system.ts`：

```typescript:src/lib/prompts/system.ts
export const TRAVEL_ASSISTANT_PROMPT = `
あなたは旅行・観光チケット検索のサポートアシスタントです。

## あなたの役割
日本国内の旅行や観光に関する情報提供、チケットやフリーパスの一般的な情報についてサポートします。

## 回答ルール
1. 旅行・観光・交通チケットに関する一般的な質問に回答してください
2. 具体的な商品の最新価格や在庫状況は、各事業者の公式サイトで確認するよう案内してください
3. 旅行に関係ない質問には「申し訳ございませんが、旅行・観光に関するご質問にお答えしています」と返してください
4. 不明な点は推測せず、正直に「詳細は各事業者の公式サイトをご確認ください」と案内してください

## 提供できる情報
- 日本各地の観光スポット
- 交通手段の一般的な情報（JR、私鉄、バスなど）
- フリーパス・周遊券の種類や特徴
- 旅行計画のアドバイス
- エリアごとのおすすめ情報

## トーン
- 丁寧でフレンドリー
- 旅行の楽しさを感じられるような温かい対応
- 簡潔に回答
- 必要に応じて箇条書きを使用
`;
```

## 4. フロントエンド（チャットUI）の実装

TanStack AIの`useChat`フックを使用してチャットUIを実装します。`src/components/chat.tsx`：

```typescript:src/components/chat.tsx
'use client'

import { useState } from 'react'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'

export function Chat() {
  const [input, setInput] = useState('')

  // useChat フックでチャット機能を実装
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* メッセージの内容を表示 */}
            <div className={`px-4 py-3 rounded-2xl ${
              message.role === 'assistant'
                ? 'bg-white text-gray-800'
                : 'bg-blue-600 text-white'
            }`}>
              {message.parts.map((part, idx) => {
                if (part.type === 'text') {
                  return <div key={idx}>{part.content}</div>
                }
                return null
              })}
            </div>
          </div>
        ))}

        {/* ローディングインジケーター */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="bg-white px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                     style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <form onSubmit={handleSubmit} className="p-6 bg-white border-t">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // IME変換中でない場合のみEnterで送信
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="旅行について質問してください..."
            className="flex-1 px-4 py-3 border rounded-xl"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-40"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  )
}
```

### `useChat`フックの詳細

`useChat`フックは以下の機能を提供します：

```typescript
const { messages, sendMessage, isLoading } = useChat({
  connection: fetchServerSentEvents('/api/chat'),
})
```

- **messages**: 会話履歴の配列。各メッセージには`id`、`role`（"user" or "assistant"）、`parts`が含まれる
- **sendMessage**: メッセージを送信する関数
- **isLoading**: APIリクエスト中かどうかを示すブール値

#### メッセージの構造

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  parts: Array<{
    type: 'text' | 'thinking'
    content: string
  }>
}
```

#### ストリーミングの仕組み

`fetchServerSentEvents`を使用することで、サーバーからのストリーミングレスポンスをリアルタイムで受信できます。これにより、AIの応答が生成されるたびに画面に表示されます。

## 5. Markdown対応の追加

AIの応答にMarkdownフォーマットを適用するため、シンプルなレンダリング関数を実装します：

```typescript
function renderMarkdown(text: string) {
  let html = text

  // コードブロック（```）
  html = html.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>'
  )

  // インラインコード（`）
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>'
  )

  // 太字（**）
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-bold">$1</strong>'
  )

  // リンク
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>'
  )

  // リスト（-）
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="ml-4">• $1</li>'
  )

  // 改行
  html = html.replace(/\n/g, '<br />')

  return html
}

// 使用例
{part.type === 'text' && (
  <div
    dangerouslySetInnerHTML={{ __html: renderMarkdown(part.content) }}
  />
)}
```

## 6. SSR対応とClientOnly

TanStack Routerを使用する場合、チャットコンポーネントはクライアントサイドのみで動作するため、`ClientOnly`でラップします：

```typescript:src/routes/index.tsx
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Chat } from '@/components/chat'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">旅行アシスタント</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <ClientOnly>
          <Chat />
        </ClientOnly>
      </main>
    </div>
  )
}
```

`ClientOnly`を使用することで、サーバーサイドレンダリング時のハイドレーションエラーを防ぎます。

# TanStack AIの利点

## 1. シンプルなAPI

複雑な設定なしで、わずか数行のコードでAI機能を実装できます：

```typescript
const stream = chat({
  adapter: gemini(),
  messages,
  model: 'gemini-2.5-flash',
})
```

## 2. 複数のProvider対応

アダプターを変更するだけで、別のAI Providerに切り替えられます：

```typescript
// Gemini
const stream = chat({ adapter: gemini(), ... })

// OpenAI
const stream = chat({ adapter: openai(), ... })

// Anthropic
const stream = chat({ adapter: anthropic(), ... })
```

## 3. ストリーミング対応

リアルタイムで応答を表示できるため、ユーザーエクスペリエンスが向上します。

## 4. 型安全

TypeScriptで完全に型付けされているため、開発時のミスを防げます。

## 5. React統合

`useChat`フックにより、Reactアプリケーションに簡単に統合できます。

# ハマりどころと対策

## 1. レート制限

Gemini APIの無料枠には制限があります：

- **gemini-2.5-flash**: 1日1,500リクエスト（一部のAPIキーは20リクエスト）
- 1分あたり15リクエスト

**対策**:
- エラーハンドリングで429エラーを検出
- ユーザーに分かりやすいエラーメッセージを表示
- 必要に応じて有料プランへのアップグレードを検討

## 2. ハイドレーションエラー

SSRを使用する場合、クライアントサイドのみで動作するコンポーネントは`ClientOnly`でラップする必要があります。

## 3. IME対応

日本語入力時のEnterキー送信を防ぐため、`isComposing`をチェックします：

```typescript
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
    e.preventDefault()
    handleSubmit(e)
  }
}}
```

## 4. ストリーミング中の状態管理

`isLoading`の条件を適切に設定して、ローディングインジケーターを表示します：

```typescript
{isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === 'user') && (
  <LoadingIndicator />
)}
```

# まとめ

TanStack AIを使用することで、以下のような利点があります：

1. **シンプルな実装**: 数行のコードでAI機能を追加
2. **柔軟性**: 複数のAI Providerに対応
3. **優れたDX**: TypeScriptによる型安全性とReact統合
4. **リアルタイム**: ストリーミング対応で優れたUX

TanStack AIはまだ新しいライブラリですが、TanStackファミリーの一貫したAPIデザインにより、学習コストが低く、すぐに使い始められます。

AI機能を持つアプリケーションを構築する際は、ぜひTanStack AIを検討してみてください！

# 参考リンク

- [TanStack AI 公式ドキュメント](https://tanstack.com/ai/latest)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API ドキュメント](https://ai.google.dev/gemini-api/docs)
- [TanStack Router](https://tanstack.com/router/latest)

# サンプルコード

完全なサンプルコードは以下のリポジトリで公開しています：
（リポジトリURLを追加してください）
