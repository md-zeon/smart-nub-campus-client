# Smart NUB Campus

A full-featured academic collaboration platform built for Northern University Bangladesh — connecting students, alumni, and faculty through resources, discussions, networking, and AI-powered study tools.

## What It Does

Smart NUB Campus is a production-grade web application that replaces fragmented university tools with a single unified platform. Students can share academic resources, form project teams, participate in discussions and Q&A, connect with peers and alumni, message in real-time, and get AI-powered study assistance — all in one place.

## Screenshots

### Authentication

<p align="center">
  <img src="public/images/Auth/Login.png" alt="Login page" width="800" />
</p>

<p align="center">
  <img src="public/images/Auth/Verify Your Identity.png" alt="Identity verification during onboarding" width="800" />
</p>

### Home Dashboard

<p align="center">
  <img src="public/images/Root/Home.png" alt="Home dashboard with quick access, trending resources, and upcoming events" width="800" />
</p>

### Resource Library

Students can upload, search, filter, and download academic resources — notes, past papers, slides, and more.

<p align="center">
  <img src="public/images/Root/Resources.png" alt="Resource library with search and filters" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Resource Details.png" alt="Resource detail page with voting, comments, and download" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Upload Resource.png" alt="Upload resource form" width="800" />
</p>

### Discussions & Q&A

Threaded discussions with voting, pinning, and solved markers. A separate Q&A forum for academic questions with accepted answers.

<p align="center">
  <img src="public/images/Root/Discussions.png" alt="Discussion forum with categories and trending" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Discussions Details.png" alt="Discussion detail with replies and voting" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Start Discussion.png" alt="Create new discussion form" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Q&A.png" alt="Q&A forum" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Q&A Details.png" alt="Question detail with answers" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Create page Q&A.png" alt="Ask a question form" width="800" />
</p>

### Team Formation

Students can create team requests for projects, specify required skills, and manage applications — a built-in LFG (Looking For Group) system.

<p align="center">
  <img src="public/images/Root/Mentorship.png" alt="Mentorship and team formation" width="800" />
</p>

### Networking & Messaging

Real-time direct and group messaging. People discovery with skill-based suggestions, connection requests, and an alumni directory.

<p align="center">
  <img src="public/images/Root/Messages.png" alt="Real-time messaging interface" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Alumni Directory.png" alt="Alumni directory for networking" width="800" />
</p>

### AI Study Assistant

An AI-powered chat assistant that helps with studying — summarize PDFs, generate quizzes, create flashcards, and explain code.

<p align="center">
  <img src="public/images/Root/AI Assistant.png" alt="AI study assistant with chat and tools" width="800" />
</p>

### Job Board

Alumni and recruiters can post job opportunities. Students can browse and apply directly through the platform.

<p align="center">
  <img src="public/images/Root/Job Board.png" alt="Job board with listings" width="800" />
</p>

### Gamification

Points, badges, and leaderboards to encourage active participation and quality contributions.

<p align="center">
  <img src="public/images/Root/Badges.png" alt="Badges and achievements" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Leaderboard.png" alt="Leaderboard rankings" width="800" />
</p>

### Profile & Settings

Rich user profiles with academic info, skills, and activity history. Full settings for privacy, notifications, security, and account management.

<p align="center">
  <img src="public/images/Root/Profile.png" alt="User profile page" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Profile Settings.png" alt="Profile settings" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Security Settings.png" alt="Security settings with session management" width="800" />
</p>

### Notifications

Real-time in-app notifications with read/unread states and mark-all-read.

<p align="center">
  <img src="public/images/Root/Notifications.png" alt="Notification list" width="800" />
</p>

<p align="center">
  <img src="public/images/Root/Notifications Selected.png" alt="Notification selection" width="800" />
</p>

### Campus Activity

A feed of campus events, activities, and community updates.

<p align="center">
  <img src="public/images/Root/Campus Activity.png" alt="Campus activity feed" width="800" />
</p>

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | shadcn-style primitives (Base UI + Radix) |
| Forms | react-hook-form + Zod validation |
| Animations | Framer Motion |
| Real-time | Socket.IO |
| Charts | Recharts |
| Testing | Vitest + Testing Library + Playwright |

## Architecture Highlights

- **Server Components + Client Hydration** — Most pages pre-fetch data on the server, then hydrate interactive client components
- **Dual API Client** — `serverApi` for server components/actions (with cache tags), `apiClient` for browser-side requests
- **Real-time Engine** — Socket.IO with heartbeat, auto-reconnect, typed events for messaging, presence, and notifications
- **14 Custom Hooks** — `useSocket`, `useInfiniteScroll`, `usePagination`, `useUpload`, and more
- **30+ UI Primitives** — Built with CVA variants, accessible, dark/light mode ready
- **1014+ Tests** — Unit, integration, and E2E coverage

## Demo Accounts

The platform includes pre-seeded demo accounts for instant exploration:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@nub.ac.bd` | `admin12345678` |
| Student | `demo-student@nub.ac.bd` | `student12345678` |
| Alumni | `demo-alumni@nub.ac.bd` | `alumni12345678` |

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Project Structure

```
src/
├── app/                  # Next.js App Router (auth, app, admin)
├── actions/              # 16 server action files
├── components/           # 150+ components across 15 modules
│   ├── ui/               # 30 primitives + 28 custom icons
│   ├── admin/            # Admin dashboard
│   ├── ai/               # AI chat assistant
│   ├── connections/      # Networking
│   ├── discussions/      # Forum
│   ├── messages/         # Real-time messaging
│   ├── resources/        # Resource library
│   ├── teams/            # Team formation
│   └── ...
├── hooks/                # 14 custom hooks
├── schemas/              # 14 Zod validation schemas
├── services/             # 21 API service files
└── types/                # 20 TypeScript type files
```
