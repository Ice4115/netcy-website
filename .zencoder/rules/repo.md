---
description: Repository Information Overview
alwaysApply: true
---

# Netcy Network Cybersecurity Information

## Summary
Netcy is a Next.js-based web application focused on network cybersecurity. It's a modern React application with TypeScript support, utilizing Tailwind CSS for styling and Three.js for 3D graphics. The project uses shadcn/ui component library for building interactive UI components.

## Structure
```
netcy/
├── src/
│   ├── app/              # Next.js App Router directory
│   │   ├── page.tsx      # Main homepage
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles (Tailwind CSS)
│   ├── components/       # Reusable React components (including shadcn/ui)
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Helper utilities (cn utility for Tailwind)
│   └── hooks/            # Custom React hooks (alias configured)
├── public/               # Static assets (SVG files)
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Dependencies and scripts
└── eslint.config.mjs     # ESLint configuration
```

## Language & Runtime
**Language**: TypeScript  
**Node Version**: 18+ (inferred from dependencies)  
**React**: 19.2.1  
**Next.js**: 16.0.10  
**Target**: ES2017

## Dependencies
**Main Dependencies**:
- `next` (16.0.10) - React framework with App Router
- `react` (19.2.1) - UI library
- `react-dom` (19.2.1) - React DOM rendering
- `three` (0.167.1) - 3D graphics library
- `lucide-react` (0.561.0) - Icon library
- `class-variance-authority` (0.7.1) - Component variant management
- `clsx` (2.1.1) - Conditional className utilities
- `tailwind-merge` (3.4.0) - Merge Tailwind CSS classes

**Development Dependencies**:
- `typescript` (^5) - TypeScript compiler
- `tailwindcss` (^4) - Utility-first CSS framework
- `@tailwindcss/postcss` (^4) - PostCSS plugin
- `eslint` (^9) - Linting tool
- `eslint-config-next` (16.0.10) - Next.js ESLint configuration
- `@types/node` (^20) - Node.js type definitions
- `@types/react` (^19) - React type definitions
- `@types/react-dom` (^19) - React DOM type definitions
- `tw-animate-css` (^1.4.0) - Tailwind animation utilities

## Build & Installation

**Installation**:
```bash
npm install
```

**Development Server**:
```bash
npm run dev
# Starts Next.js dev server at http://localhost:3000
```

**Production Build**:
```bash
npm run build
# Optimizes and compiles the application
```

**Production Server**:
```bash
npm start
# Runs the built application
```

## Main Files & Resources

**Entry Points**:
- `src/app/page.tsx` - Main homepage component
- `src/app/layout.tsx` - Root layout wrapper

**Configuration Files**:
- `next.config.ts` - Next.js build and runtime configuration
- `tsconfig.json` - TypeScript compiler options with path aliases (@/*)
- `components.json` - shadcn/ui component library configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS
- `eslint.config.mjs` - ESLint rules and configurations

**Styling**:
- `src/app/globals.css` - Global Tailwind CSS styles (configured in components.json)
- Uses Tailwind CSS v4 with PostCSS
- shadcn/ui "new-york" style theme with "stone" base color

## Path Aliases
TypeScript paths configured in `tsconfig.json`:
- `@/*` → `./src/*` - Root source directory alias
- `@/components` - Components directory
- `@/lib` - Utilities directory
- `@/ui` - shadcn/ui components
- `@/hooks` - Custom hooks

## Code Quality

**Linting**:
```bash
npm run lint
# Runs ESLint with Next.js and TypeScript configurations
```

Uses ESLint with:
- Core Web Vitals rules (eslint-config-next/core-web-vitals)
- TypeScript support (eslint-config-next/typescript)

**Testing**: No test framework currently configured in the project.

## Package Manager
**Tool**: npm  
**Lock File**: package-lock.json

## Notes
- Project uses Next.js App Router (modern routing pattern)
- React Server Components (RSC) enabled in shadcn/ui config
- TypeScript strict mode enabled
- Module resolution uses "bundler" strategy for optimal Next.js support
- No Docker configuration present in the project
