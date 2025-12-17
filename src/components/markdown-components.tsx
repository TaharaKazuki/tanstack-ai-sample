import type { Components } from 'react-markdown'

// ReactMarkdownのカスタムコンポーネント
export const markdownComponents: Components = {
  // 太字
  strong: ({ node, children, ...props }: any) => (
    <strong className="font-bold" {...props}>
      {children}
    </strong>
  ),

  // 斜体
  em: ({ node, children, ...props }: any) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // コード（インライン/ブロック）
  code: ({ node, inline, className, children, ...props }: any) => {
    return inline ? (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm" {...props}>
        {children}
      </code>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },

  // コードブロック（pre）
  pre: ({ node, children, ...props }: any) => (
    <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2" {...props}>
      {children}
    </pre>
  ),

  // リンク
  a: ({ node, children, ...props }: any) => (
    <a
      className="text-blue-600 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),

  // 順序なしリスト
  ul: ({ node, children, ...props }: any) => (
    <ul className="list-disc ml-4 my-2" {...props}>
      {children}
    </ul>
  ),

  // 順序付きリスト
  ol: ({ node, children, ...props }: any) => (
    <ol className="list-decimal ml-4 my-2" {...props}>
      {children}
    </ol>
  ),

  // リストアイテム
  li: ({ node, children, ...props }: any) => (
    <li className="ml-2" {...props}>
      {children}
    </li>
  ),

  // 段落
  p: ({ node, children, ...props }: any) => (
    <p className="mb-2 last:mb-0" {...props}>
      {children}
    </p>
  ),

  // 見出し1
  h1: ({ node, children, ...props }: any) => (
    <h1 className="text-2xl font-bold mb-2 mt-4" {...props}>
      {children}
    </h1>
  ),

  // 見出し2
  h2: ({ node, children, ...props }: any) => (
    <h2 className="text-xl font-bold mb-2 mt-3" {...props}>
      {children}
    </h2>
  ),

  // 見出し3
  h3: ({ node, children, ...props }: any) => (
    <h3 className="text-lg font-bold mb-2 mt-2" {...props}>
      {children}
    </h3>
  ),

  // 引用
  blockquote: ({ node, children, ...props }: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props}>
      {children}
    </blockquote>
  ),

  // テーブル
  table: ({ node, children, ...props }: any) => (
    <table className="border-collapse border border-gray-300 my-2" {...props}>
      {children}
    </table>
  ),

  // テーブルヘッダー
  th: ({ node, children, ...props }: any) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold" {...props}>
      {children}
    </th>
  ),

  // テーブルセル
  td: ({ node, children, ...props }: any) => (
    <td className="border border-gray-300 px-4 py-2" {...props}>
      {children}
    </td>
  ),
}
