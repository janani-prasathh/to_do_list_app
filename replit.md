# Overview

This is a modern task management web application built with a monorepo architecture. The application provides a clean, intuitive interface for users to create, organize, and track their tasks with features like categories, priorities, progress tracking, and focus mode. It follows a full-stack TypeScript approach with a React frontend and Express.js backend, using PostgreSQL for data persistence and Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Theme System**: Custom theme provider supporting light/dark modes with localStorage persistence

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Connect-pg-simple for PostgreSQL-backed sessions
- **API Design**: RESTful API with JSON responses and comprehensive error handling
- **Development**: Hot reload via Vite integration in development mode

## Database Schema
- **Categories**: User-defined task categories with color coding
- **Tasks**: Main task entities with title, description, priority, progress, due dates, and category relationships
- **User Stats**: Tracking completion streaks, totals, and weekly progress analytics
- **Relationships**: Foreign key relationships between tasks and categories, all scoped by userId

## Project Structure
- **Shared**: Common TypeScript schemas and types shared between client and server
- **Client**: React frontend with component-based architecture and custom hooks
- **Server**: Express.js backend with route handlers and storage abstraction
- **Migrations**: Database migration files managed by Drizzle Kit

## Key Features
- **Task Management**: CRUD operations for tasks with drag-and-drop reordering
- **Category System**: Color-coded categories for task organization
- **Progress Tracking**: Visual progress indicators and completion statistics
- **Focus Mode**: Distraction-free interface for productivity
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Optimistic updates with automatic cache invalidation

# External Dependencies

## Database
- **Neon Database**: Serverless PostgreSQL provider via `@neondatabase/serverless`
- **Connection**: Database URL-based connection string from environment variables

## UI Framework
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Shadcn/ui**: Pre-built component system with consistent design tokens
- **Tailwind CSS**: Utility-first CSS framework with custom design system

## Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Type safety across the entire application stack
- **Drizzle Kit**: Database schema management and migration tool
- **ESBuild**: Fast JavaScript bundler for production builds

## Runtime Libraries
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation via Zod resolvers
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Minimal client-side routing solution

## Replit Integration
- **Development Banner**: Replit development environment integration
- **Error Overlay**: Runtime error modal for development debugging
- **Cartographer**: Replit-specific development tooling (development only)