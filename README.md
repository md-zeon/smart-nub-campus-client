# Smart NUB Campus Client

Frontend for Smart NUB Campus — an academic collaboration network for Northern University Bangladesh.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** Custom shadcn-style primitives built on Base UI
- **Forms:** react-hook-form v7 + Zod v4 validation
- **Animations:** Framer Motion
- **Icons:** Custom animated SVG icons

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth pages (login, signup, onboarding)
│   ├── (root)/                    # Root layout pages
│   ├── globals.css                # Global styles
│   └── layout.tsx                 # Root layout
├── actions/                       # Server actions (API call proxies)
├── components/
│   ├── forms/                     # Reusable form components
│   ├── home/                      # Home page components
│   ├── theme/                     # Theme provider
│   └── ui/                        # UI primitives (Base UI + CVA)
├── constants/                     # App constants
├── hooks/                         # Custom React hooks
├── lib/
│   ├── api-client.ts              # Client-side API (browser)
│   └── server-api.ts              # Server-side API (Next.js server)
├── providers/                     # Context providers
├── schemas/                       # Zod validation schemas
├── services/                      # API service functions
└── types/                         # TypeScript type definitions
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL (e.g., `http://localhost:5000/api/v1`) |
| `API_URL` | No | Server-side API URL (overrides NEXT_PUBLIC_API_URL for server components) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Architecture

### API Communication

The app uses two API clients:

1. **`serverApi`** (`src/lib/server-api.ts`) — For server components and server actions. Handles cookie forwarding and Next.js cache invalidation.
2. **`apiClient`** (`src/lib/api-client.ts`) — For client components. Runs in the browser without Next.js server dependencies.

### Component Library

UI components are built as shadcn-style primitives:
- Built on [Base UI](https://baseui.com) (not Radix)
- Styled with [CVA](https://cva.style) for variant management
- Tailwind CSS v4 for styling
- 24+ custom animated SVG icons using Framer Motion
