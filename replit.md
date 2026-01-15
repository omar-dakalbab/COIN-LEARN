# FinLit - Financial Literacy Learning Platform

## Overview

FinLit is a gamified financial literacy learning platform built with React and Express. Users can browse courses, complete lessons with Markdown content, take quizzes, track their progress, and earn achievements. The platform uses Replit Auth for authentication and PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state caching and synchronization
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared/ for shared)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple
- **API Pattern**: RESTful endpoints defined in shared/routes.ts with Zod validation

### Data Model
The application uses a hierarchical course structure:
- **Courses** → contain multiple **Modules** → contain multiple **Lessons**
- **Lessons** can have associated **Quizzes** (JSONB for options)
- **UserProgress** tracks completion status and quiz scores per user/lesson

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/schema.ts` are used by both frontend and backend
- **API Contract**: Route definitions with Zod schemas in `shared/routes.ts` ensure type-safe API calls
- **Protected Routes**: Frontend uses a `ProtectedRoute` wrapper component that redirects unauthenticated users
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations

### Build Process
- Development: Vite dev server with HMR proxied through Express
- Production: Vite builds to `dist/public`, esbuild bundles server to `dist/index.cjs`
- Database migrations: `drizzle-kit push` for schema synchronization

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe SQL query builder with relational queries

### Authentication
- **Replit Auth**: OpenID Connect provider (configured via `ISSUER_URL`)
- Required environment variables: `DATABASE_URL`, `SESSION_SECRET`, `REPL_ID`

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible components based on Radix UI primitives
- **react-markdown**: Renders lesson content from Markdown
- **react-confetti**: Celebration effects on lesson completion
- **recharts**: Progress visualization charts

### Development Tools
- **Vite**: Fast development server with HMR
- **Replit plugins**: Dev banner, cartographer, and runtime error overlay for Replit environment