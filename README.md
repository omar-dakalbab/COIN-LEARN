# COIN-LEARN

An interactive financial literacy learning platform with courses on budgeting, investing, and personal finance. Users can work through structured lessons and quizzes, track their progress, and build financial knowledge.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), Wouter (routing), TanStack React Query, Framer Motion
- **Backend**: Express.js, TypeScript, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Replit Auth (OpenID Connect)
- **Other**: Zod (validation), react-markdown (lesson content), WebSockets

## Features

- Structured courses with modules, lessons, and quizzes
- Markdown-based lesson content
- Interactive quizzes with scoring
- User progress tracking per lesson
- Protected routes requiring authentication
- Dashboard and profile pages
- Responsive design with dark mode support

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables (see `.env` for required values):
   - `DATABASE_URL` - PostgreSQL connection string

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
client/          # React frontend (Vite)
  src/
    components/  # UI components (CourseCard, Quiz, Navigation, etc.)
    pages/       # Route pages (Dashboard, CourseDetail, LessonView, etc.)
    hooks/       # Custom hooks (auth, courses, lessons, progress)
server/          # Express backend
  routes.ts      # API endpoints
  storage.ts     # Data access layer
  db.ts          # Database connection
shared/          # Shared types and schemas
  schema.ts      # Drizzle ORM table definitions
```
