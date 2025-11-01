# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Network Schedule System** management frontend built on top of [SoybeanAdmin](https://github.com/soybeanjs/soybean-admin) template. It's a graduate research project for network scheduling and device management.

**Tech Stack:**
- Vue 3.5 + TypeScript 5.8
- Vite 6.2 (dev server runs on port 9527)
- Naive UI 2.41 (primary UI library)
- Pinia 3.0 (state management)
- Vue Router 4.5 (with Elegant Router for file-based routing)
- UnoCSS 66.0 (utility-first CSS)
- ECharts 5.6 + AntV G6 5.0 (data visualization)
- @sa/axios (custom axios wrapper in monorepo)
- pnpm monorepo architecture

## Common Commands

### Development
```bash
pnpm dev              # Start dev server (test mode, port 9527)
pnpm dev:prod         # Start dev server with prod environment
pnpm typecheck        # Run TypeScript type checking
```

### Building
```bash
pnpm build            # Build for production
pnpm build:test       # Build for test environment
pnpm preview          # Preview production build (port 9725)
```

### Code Quality
```bash
pnpm lint             # Run ESLint with auto-fix
pnpm typecheck        # Type check without emitting files
```

### Route Generation
```bash
pnpm gen-route        # Regenerate routes via Elegant Router plugin
```

### Git & Release
```bash
pnpm commit           # Interactive commit with Conventional Commits
pnpm commit:zh        # Interactive commit in Chinese
pnpm cleanup          # Cleanup command via sa scripts
pnpm release          # Release new version via sa scripts
```

## Architecture

### Monorepo Structure
This is a **pnpm workspace monorepo**. Internal packages are located in `packages/`:
- `@sa/axios` - Custom axios request wrapper with retry logic
- `@sa/hooks` - Reusable Vue composition hooks
- `@sa/utils` - Common utility functions
- `@sa/color` - Color manipulation utilities
- `@sa/materials` - Shared UI components/materials
- `@sa/scripts` - CLI tools for development
- `@sa/uno-preset` - UnoCSS preset configuration

### File-based Routing (Elegant Router)

Routes are **auto-generated** from `src/views/` directory structure:

```
src/views/
  device/          → /device
    home/          → /device/home
    task/          → /device/task
    task-detail/   → /device/task-detail
  network/
    home/          → /network/home
  ...
```

**Key files:**
- `src/router/elegant/routes.ts` - Auto-generated route definitions
- `src/router/elegant/imports.ts` - Auto-generated component imports
- `src/router/elegant/transform.ts` - Route transformation utilities
- `build/plugins/router.ts` - Elegant Router plugin configuration

**Layouts:**
- `base-layout` - Main layout with sidebar/header
- `blank-layout` - Minimal layout without chrome

After adding/removing view directories, run `pnpm gen-route` to regenerate routes.

### Auth & Route Modes

Configured via `.env` files:

- **Static mode** (`VITE_AUTH_ROUTE_MODE=static`): Routes defined in code, filtered by user roles
- **Dynamic mode** (`VITE_AUTH_ROUTE_MODE=dynamic`): Routes fetched from backend API

Current setup uses **static mode** with home route at `/home`.

### State Management (Pinia)

Core stores in `src/store/modules/`:

- `auth/` - Authentication, user info, tokens
- `route/` - Route initialization, menus, breadcrumbs, cache
- `tab/` - Tab navigation state
- `theme/` - Theme configuration
- `app/` - Global app state
- `graph/` - Graph visualization data (AntV G6)
- `alarm/` - Alarm/alert management

**Store initialization order:**
1. Constant routes initialized on app mount
2. Auth routes initialized after login
3. Route store manages Vue Router dynamically

### API Layer

**Service structure:**
- `src/service/request/index.ts` - Configured axios instance with interceptors
- `src/service/api/` - API endpoint definitions by domain
  - `auth.ts` - Authentication APIs
  - `device.ts` - Device management
  - `network.ts` - Network management
  - `node.ts`, `link.ts` - Network topology
  - `algorithm.ts` - Scheduling algorithms

**Request/Response transformation:**
- Request data: camelCase → snake_case
- Response data: snake_case → camelCase
- See `utils/transform.ts` and `utils/common.ts`

**Base URLs:**
- Dev mode with proxy enabled: requests proxy to `http://localhost:8080/api/v1`
- Prod mode: `https://mock.apifox.cn/m1/3109515-0-default`
- Additional services configurable via `VITE_OTHER_SERVICE_BASE_URL`

### Path Aliases

```typescript
'@/*'  → './src/*'
'~/*'  → './*' (project root)
```

### Type Definitions

Global types in `src/typings/`:
- `api.d.ts` - API request/response types
- `app.d.ts` - App-level types
- `components.d.ts` - Auto-generated component types (by unplugin-vue-components)
- `elegant-router.d.ts` - Auto-generated router types
- `global.d.ts` - Global type declarations
- `storage.d.ts` - Storage key types

### I18n

- Locales: `src/locales/langs/`
  - `zh-cn.ts` - Chinese (default display language)
  - `en-us.ts` - English
- i18n-ally VSCode extension configured (see `.vscode/settings.json`)
- Nested key style with route-based translation keys: `route.{routeName}`

### Environment Variables

Three environments:
- `.env` - Base config (port, auth mode, feature flags)
- `.env.test` - Test environment (localhost:8080)
- `.env.prod` - Production environment (ApiFox mock)

**Critical env vars:**
- `VITE_AUTH_ROUTE_MODE` - static | dynamic
- `VITE_ROUTE_HOME` - Home route key
- `VITE_HTTP_PROXY` - Enable dev proxy (Y/N)
- `VITE_SERVICE_BASE_URL` - Backend API base URL

## Key Patterns

### Adding a New Page

1. Create view directory: `src/views/{module}/{page}/index.vue`
2. Add i18n key: Update `src/locales/langs/*.ts` with `route.{module}_{page}`
3. Regenerate routes: `pnpm gen-route`
4. (Static mode) Grant access in user role config if needed

### Adding a New API Endpoint

1. Define TypeScript types in `src/typings/api.d.ts`
2. Create API function in `src/service/api/{domain}.ts`
3. Use `request.get/post/put/delete` from `@/service/request`
4. Export from `src/service/api/index.ts` if needed globally

### Using the Graph Store

The app uses **AntV G6** for network topology visualization:
- `src/store/modules/graph/` - Graph state (nodes, edges, combos)
- `src/store/modules/graph/data.ts` - Data transformation utilities

### Custom Hooks

Reusable composition APIs in `src/hooks/`:
- `hooks/business/auth.ts` - Auth-related hooks
- `hooks/common/table.ts` - Table utilities (pagination, selection)
- `hooks/common/form.ts` - Form state management
- `hooks/common/echarts.ts` - ECharts integration
- `hooks/common/router.ts` - Router utilities

## Notes

- **No Prettier**: Project uses ESLint only for formatting (see `eslint.config.js`)
- **UnoCSS**: Use utility classes; custom theme vars in `src/theme/`
- **Git commits**: Use `pnpm commit` for conventional commits
- **Component auto-import**: Naive UI and custom components auto-imported via `unplugin-vue-components`
- **Icon system**: Uses Iconify with `@iconify/vue` and local SVG icons
- **TypeScript strict mode**: Enabled with strict null checks
