# AI Portal

A modern web application that serves as a hub for AI agents. Browse, interact with, and manage different AI agents through a clean, unified interface.

## Overview

AI Portal supports two types of agent interactions:

- **Chat Agents** -- Conversational agents you can message directly. Ask questions, brainstorm ideas, get code help, or refine your writing.
- **Task Agents** -- Workflow-based agents that execute multi-step processes. Trigger a workflow, watch each step progress in real time, and view the final output.

This is a front-end application with mock data. No backend is connected yet.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **State:** React hooks (`useState`, `useCallback`, `useRef`)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
  app/
    page.tsx                    # Dashboard (home page)
    layout.tsx                  # Root layout with sidebar shell
    agents/page.tsx             # Agent catalog with filters
    chat/page.tsx               # Chat agents listing
    chat/[agentId]/page.tsx     # Chat interface for a specific agent
    tasks/page.tsx              # Task agents listing
    tasks/[agentId]/page.tsx    # Workflow interface for a specific agent
  components/
    layout/                     # Sidebar, Header, AppShell
    agents/                     # AgentCard, AgentGrid
    chat/                       # ChatInput, MessageBubble, TypingIndicator
    tasks/                      # StepTracker, StepDetail, TaskTrigger, TaskOutput
    ui/                         # Button, Input, Card, Badge, Avatar
  lib/
    types.ts                    # TypeScript interfaces (Agent, Message, Attachment, etc.)
    mock-data.ts                # Mock agents, chat responses, and workflow definitions
    file-validation.ts          # File upload security (type/size validation, filename sanitization)
    utils.ts                    # Utility helpers (cn class merger)
  providers/
    ThemeProvider.tsx            # Theme provider (dark mode support, currently disabled)
```

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard with stats overview and featured agents |
| `/agents` | Filterable catalog of all agents (type, category, search) |
| `/chat` | Chat agents listing |
| `/chat/[agentId]` | Chat interface with simulated responses, image/file uploads |
| `/tasks` | Task agents listing |
| `/tasks/[agentId]` | Workflow runner with step-by-step progress tracking |

## Mock Agents

The app ships with 8 sample agents:

**Chat:** Writing Assistant, Code Buddy, Research Analyst, Brainstorm Genie

**Task:** Data Pipeline Agent, Report Generator, Test Runner Agent, Deployment Bot

All responses and workflow steps are simulated with mock data and timers.

## Chat File Uploads

Chat agents support rich media attachments with built-in security:

- **Images:** JPG, PNG, GIF, WebP (max 5 MB each)
- **Files:** PDF, TXT, CSV, JSON, MD, DOCX, XLSX (max 10 MB each)
- **Limit:** Up to 5 attachments per message
- **Drag and drop** supported on the input area
- **Security:** MIME type validation, file size limits, filename sanitization (path traversal prevention, control character stripping, length capping)
