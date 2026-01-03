# AGENTS.md - AlignUI Next.js Starter

## Build, Lint, Test Commands
- **Dev**: `bun run dev` (or `npm run dev`) - Start dev server on port 3000
- **Build**: `bun run build` - Production build
- **Lint**: `bun run lint` - Run ESLint (Next.js config + TypeScript)
- **Format**: `bun run format` - Prettier format TS/TSX/MDX
- **Content**: `bun run content` - Process content from scripts
- No test runner currently configured (Jest/Vitest not installed)

## Architecture & Structure
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v3 + TailwindCSS Animate
- **UI Components**: Radix UI primitives + AlignUI components in `components/ui/`
- **Key Dirs**: 
  - `app/` - Next.js App Router (layout, pages, styles)
  - `components/` - React components (layout, cards, theme)
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `libs/` - Internal libraries
  - `.content/` - Markdown content (indexed via tsconfig paths)
  - `posts/` - Blog post data
- **Paths**: `@/*` → root, `@/content` → `.content/index.ts`

## Code Style & Conventions
- **TypeScript**: Strict mode, ES2023 target, no-any rule disabled for flexibility
- **Imports**: Use path aliases (`@/`), ES modules only
- **Formatting**: Prettier (80 char line width, single quotes, 2-space indent)
- **Tailwind**: Merge utility classes with `clsx`/`tailwind-merge`, use `tv()` variants
- **Components**: Functional components, React 18, ESLint Next.js config
- **Naming**: kebab-case files, PascalCase exports, camelCase functions/vars
- **Error Handling**: No strict error types enforced, handle gracefully
