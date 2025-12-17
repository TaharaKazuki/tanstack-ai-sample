# TanStack AI Chat Application

A modern AI chat application built with TanStack AI, React, and Vite. This application demonstrates how to build a production-ready AI chat interface with web search capabilities.

## Features

- 🤖 **AI Chat Interface** - Interactive chat powered by TanStack AI
- 🔍 **Web Search** - Real-time web search using DuckDuckGo
- 📝 **Markdown Support** - Rich text formatting with syntax highlighting
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS v4
- ⚡ **Fast & Responsive** - Built with Vite for optimal performance
- 🔒 **Type-Safe** - Full TypeScript support

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **AI**: [TanStack AI](https://tanstack.com/ai)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Router**: [TanStack Router](https://tanstack.com/router)
- **Markdown**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Syntax Highlighting**: [rehype-highlight](https://github.com/rehypejs/rehype-highlight)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key or Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tanstack-ai-example
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# Choose one or both:
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Run both linter and formatter

## Project Structure

```
src/
├── components/
│   └── chat.tsx          # Main chat component
├── lib/
│   ├── prompts/
│   │   └── system.ts     # System prompts
│   ├── tools/
│   │   └── searchWeb.ts  # Web search tool
│   └── utils.ts          # Utility functions
├── routes/
│   └── __root.tsx        # Root layout
└── router.tsx            # Router configuration
```

## Key Features Explained

### Chat Interface

The chat interface (`src/components/chat.tsx`) provides:
- Message history display
- Real-time streaming responses
- Markdown rendering with syntax highlighting
- Clean and intuitive UI

### Web Search Tool

The web search tool (`src/lib/tools/searchWeb.ts`) enables:
- Real-time web searches using DuckDuckGo
- Multiple search results with titles, snippets, and URLs
- Integration with AI responses

### Markdown Rendering

Messages are rendered with full Markdown support including:
- **Bold** and *italic* text
- Code blocks with syntax highlighting
- Lists (ordered and unordered)
- Tables
- Headings
- Blockquotes
- Links

## Configuration

### AI Provider

The application supports both OpenAI and Google Gemini. Configure your preferred provider in the environment variables.

### Customization

You can customize the chat interface by modifying:
- System prompts in `src/lib/prompts/system.ts`
- UI components in `src/components/chat.tsx`
- Styling with Tailwind classes

## Testing

This project uses [Vitest](https://vitest.dev/) for testing:

```bash
npm run test
```

## Linting & Formatting

The project uses ESLint and Prettier for code quality:

```bash
npm run lint    # Check for linting errors
npm run format  # Format code
npm run check   # Run both
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Learn More

- [TanStack AI Documentation](https://tanstack.com/ai)
- [TanStack Router Documentation](https://tanstack.com/router)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
