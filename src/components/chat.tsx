'use client'

import { useState } from 'react'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'

// 簡易Markdownレンダリング関数
function renderMarkdown(text: string) {
  let html = text

  // コードブロック（```）
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2"><code>$1</code></pre>')

  // インラインコード（`）
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')

  // 太字（**）
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')

  // 斜体（*）
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')

  // リンク
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

  // リスト（-）
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')

  // 改行
  html = html.replace(/\n/g, '<br />')

  return html
}

export function Chat() {
  const [input, setInput] = useState('')

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
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium">旅行について何でも聞いてください</p>
              <p className="text-sm mt-2">観光スポット、交通手段、フリーパスなど</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              message.role === 'assistant'
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                : 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
            }`}>
              {message.role === 'assistant' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col max-w-[70%] ${
              message.role === 'user' ? 'items-end' : 'items-start'
            }`}>
              <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                message.role === 'assistant'
                  ? 'bg-white text-gray-800 rounded-tl-sm'
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}>
                {message.parts.map((part, idx) => {
                  if (part.type === 'thinking') {
                    return (
                      <div key={idx} className="text-sm italic opacity-70 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>{part.content}</span>
                      </div>
                    )
                  }
                  if (part.type === 'text') {
                    return (
                      <div
                        key={idx}
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(part.content) }}
                      />
                    )
                  }
                  return null
                })}
              </div>
              <div className={`text-xs text-gray-400 mt-1 px-2 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === 'user') && (
          <div className="flex gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6 bg-white border-t border-gray-200 shrink-0 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center gap-2 bg-gray-50 rounded-2xl p-2 border-2 border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all duration-200">
            <div className="flex-1 relative">
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
                rows={1}
                className="w-full px-4 py-3 bg-transparent focus:outline-none resize-none max-h-32 overflow-y-auto placeholder-gray-400"
                disabled={isLoading}
                style={{
                  minHeight: '48px',
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              {input.trim() && !isLoading && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="クリア"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:from-blue-700 enabled:hover:to-blue-800 enabled:hover:scale-105 transition-all duration-200 shadow-lg shadow-blue-500/30"
                title="送信 (Enter)"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Enterで送信、Shift+Enterで改行
          </p>
        </div>
      </form>
    </div>
  )
}
