# UIGen - High-Level Codebase Overview

**UIGen** is an **AI-powered React component generator** with live preview. It enables users to describe React components in natural language and generates production-ready code with instant preview capabilities.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API routes with Claude AI (via Anthropic SDK)
- **Database**: Prisma + SQLite (for persisting projects/messages)
- **UI**: Radix UI components + Tailwind CSS
- **Editor**: Monaco Editor for code editing
- **Code Generation**: Babel for JSX transformation

## Architecture

### Core Components

1. **Chat Interface** (`/src/components/chat/`)
   - Conversational UI for component generation requests
   - Markdown rendering for AI responses
   - Message input with chat history
   - Displays system messages and tool outputs

2. **Code Editor** (`/src/components/editor/`)
   - File tree navigation for generated projects
   - Monaco Editor for code syntax highlighting and editing
   - Real-time file management capabilities

3. **Live Preview** (`/src/components/preview/`)
   - Renders generated React components in real-time
   - Updates as code is modified
   - Isolated preview environment

4. **AI Backend** (`/src/app/api/chat/`)
   - Streams responses from Claude using Anthropic SDK
   - Provides specialized tools for code generation:
     - **str_replace_editor**: Modify existing code files
     - **file_manager**: Create, read, and delete files
   - Automatically persists project state to database after each interaction
   - Supports prompt caching for optimized API usage

5. **Authentication** (`/src/lib/auth.ts`, `/src/components/auth/`)
   - JWT-based session management
   - Secure signup and signin flows
   - Anonymous user support (no login required)
   - Session validation middleware

6. **Data Persistence**
   - **Projects**: Stores conversation history (messages) and generated code (file data)
   - **Database**: SQLite with Prisma ORM
   - **Multi-user**: Supports multiple users with isolated project spaces
   - **Auto-save**: Projects automatically saved after each AI interaction

## Workflow

1. **User Initialization**
   - Sign up with email/password or continue anonymously
   - Automatically created/redirected to a project

2. **Component Request**
   - User describes desired React component in chat
   - AI system receives user message with context

3. **Code Generation**
   - Claude processes request using specialized tools
   - Creates/modifies files in virtual file system
   - Generates component code and supporting files

4. **Real-time Preview**
   - Generated JSX automatically rendered
   - User sees component in action immediately
   - Errors and warnings displayed in preview

5. **Iteration & Refinement**
   - User can manually edit code in editor
   - Or continue chatting to iterate with AI
   - Changes persist across sessions

## Key Features

- ✨ **AI-Powered Generation**: Claude generates React components from natural language descriptions
- 🔄 **Real-time Preview**: See changes instantly as code is generated
- ✏️ **Manual Editing**: Edit generated code directly in Monaco Editor
- 💾 **Persistent Projects**: Save chat history and code for later sessions
- 👤 **Multi-user Support**: Separate project spaces for each user
- 🔐 **Authentication**: Optional signup or anonymous access
- 🛠️ **Virtual File System**: Organize generated code in projects
- ⚡ **Streaming Responses**: Real-time AI output with prompt caching

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # AI streaming backend
│   ├── page.tsx                # Home page with routing
│   ├── main-content.tsx        # Main UI layout
│   └── [projectId]/page.tsx    # Project detail view
├── components/
│   ├── chat/                   # Chat UI components
│   ├── editor/                 # Code editor components
│   ├── preview/                # Preview components
│   ├── auth/                   # Auth flow components
│   └── ui/                     # Reusable UI primitives
├── lib/
│   ├── auth.ts                 # Authentication logic
│   ├── file-system.ts          # Virtual file system
│   ├── prisma.ts               # DB client
│   ├── provider.ts             # AI model provider
│   ├── contexts/               # React contexts
│   ├── tools/                  # AI tools (file ops, str replace)
│   ├── prompts/                # System prompts
│   └── transform/              # JSX transformation
├── actions/                    # Server actions for DB operations
└── middleware.ts               # Auth middleware
```

## Database Schema

- **Project**: Stores project metadata, messages, and file data
  - `id`: Unique project identifier
  - `userId`: Owner (nullable for anonymous projects)
  - `name`: Project name
  - `messages`: Serialized chat history
  - `data`: Serialized file system state
  - `createdAt`, `updatedAt`: Timestamps

## Getting Started

```bash
# Install dependencies
npm install

# Setup database
npm run setup

# Run development server
npm run dev

# Open http://localhost:3000
```

## Development Commands

- `npm run dev` - Start dev server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests with Vitest
- `npm run db:reset` - Reset database

## Environment Setup

- Optional: Add `ANTHROPIC_API_KEY` to `.env` for AI component generation
- Without key: Application runs with mock/static code generation
