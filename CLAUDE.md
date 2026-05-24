# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See [AGENTS.md](./AGENTS.md) for project context, commands, architecture, and conventions.

## Active Technologies
- TypeScript 5.x (strict mode), Node.js 20.x runtime + Next.js 16.2.5 (App Router, Server Components), React 19.2.4, Tailwind CSS 4.x, Zod 4.x, TanStack Query 5.x (provider already installed; only used if/when client-side fetching becomes necessary), Zustand 5.x (only used for ephemeral UI state if/when needed), `@next/mdx` (to be added) for code-of-conduct rendering (001-community-day-site)
- None. Content lives in version-controlled JSON/MDX under `content/editions/{year}/`. No database or external persistence in this repository (001-community-day-site)

## Recent Changes
- 001-community-day-site: Added TypeScript 5.x (strict mode), Node.js 20.x runtime + Next.js 16.2.5 (App Router, Server Components), React 19.2.4, Tailwind CSS 4.x, Zod 4.x, TanStack Query 5.x (provider already installed; only used if/when client-side fetching becomes necessary), Zustand 5.x (only used for ephemeral UI state if/when needed), `@next/mdx` (to be added) for code-of-conduct rendering
