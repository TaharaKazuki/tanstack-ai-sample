import { chat, toStreamResponse } from '@tanstack/ai'
import { gemini } from '@tanstack/ai-gemini'
import { createFileRoute } from '@tanstack/react-router'
import { TRAVEL_ASSISTANT_PROMPT } from '@/lib/prompts/system'

export const Route = createFileRoute('/api/chat')({
  server: { handlers: { POST } },
})

export async function POST({ request }: { request: Request }) {
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
    const stream = chat({
      adapter: gemini(),
      messages,
      model: 'gemini-2.5-flash',
      systemPrompts: [TRAVEL_ASSISTANT_PROMPT],
      conversationId,
    })

    return toStreamResponse(stream)
  } catch (error) {
    console.error(error)

    // エラーメッセージを取得
    const errorMessage = error instanceof Error ? error.message : String(error)

    // レート制限エラー（429）の検出
    const isRateLimitError =
      errorMessage.includes('429') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('Too Many Requests')

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
