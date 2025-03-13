# CLAUDE.md - Guidelines for AI-Search-Web

## Build Commands
- `bun install` - Install dependencies
- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run ESLint

## Code Style
- TypeScript with strict typing
- React 19 with Server Components (Next.js App Router)
- Import order: React → Next → third-party → types → configs → lib → hooks → components
- Formatting: single quotes, no semi-colons, 2-space indentation, trailing commas: none
- Component naming: PascalCase for components, camelCase for utilities, kebab-case for files
- Use Tailwind for styling, shadcn/ui for components, Lucide for icons
- Error handling: prefer safe optional chaining, nullish coalescing
- File structures follow Next.js conventions with page.tsx and route.ts

## Authentication
- Clerk is used for authentication
- Protected routes are managed via middleware.ts
- User IDs from auth() or currentUser() should be used instead of 'anonymous'
- Use getUserId() from lib/utils/auth.ts to get the current user ID
- Public routes: '/', '/sign-in', '/sign-up', '/share/:id*', '/api/webhook/clerk'

## Commit Convention
- Follow conventional commits: feat, fix, docs, chore, refactor