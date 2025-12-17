import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Chat } from '@/components/chat'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            旅行アシスタント
          </h1>
          <p className="text-sm text-blue-100 mt-1">
            日本全国の旅行・観光チケット情報をサポートします
          </p>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full">
          <ClientOnly>
            <Chat />
          </ClientOnly>
        </div>
      </main>
    </div>
  )
}
