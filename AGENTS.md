# AGENTS.md

## Project

MyRangeBC (MYRA) — BC Government Range Use Plan management web app.
Single-package JavaScript repo (no TypeScript, no monorepo).

## Stack

- React 16.14 (class components + hooks), react-router-dom 5, Redux 4 + redux-thunk
- Webpack 5 (ejected CRA config in `config/webpack.config.js`)
- Semantic UI React 0.87 + custom Semantic UI theme (built via Gulp, output to `src/semantic/`)
- Material UI 4 / MUI 5, styled-components 6, Tailwind 3 (mixed — check component context)
- Formik 2 + Yup for forms, axios for HTTP
- Node 16.14 (pinned in Dockerfile)

## Commands

| Task              | Command                                                                   |
| ----------------- | ------------------------------------------------------------------------- |
| Dev server        | `npm start`                                                               |
| Build             | `npm run build`                                                           |
| Unit tests        | `npm test` (Jest 27 + Enzyme 3 + @testing-library/react)                  |
| Unit tests (CI)   | `npm run test:ci`                                                         |
| Lint              | `npm run eslint`                                                          |
| Format check      | `npm run pretest` (runs `prettier --list-different "**/*.js"`)            |
| Format fix        | `npm run prettier`                                                        |
| E2E (headless)    | `npm run test:e2e:run` (needs API via `npm run test:e2e:api:start` first) |
| E2E (interactive) | `npm run test:e2e:dev`                                                    |
| Storybook         | `npm run storybook` (port 6006)                                           |

## Pre-commit

Husky + lint-staged runs on every commit:

- `eslint --cache --fix` on `*.js`
- `prettier --write` on `*.{js,css,md}`

## Testing

- Jest config is inline in `package.json` (roots: `src`, env: `jsdom-sixteen`)
- Setup: `src/setupTests.js` (Enzyme adapter + jest-localstorage-mock + @testing-library/jest-dom)
- Both Enzyme and React Testing Library are used — check existing tests in the same directory before writing new ones
- Cypress 4 for E2E — config in `cypress.json`, base URL `http://localhost:3001`
- E2E requires a local API: run `npm run test:e2e:api:start` (docker-based) before `cy:run`/`cy:open`

## Architecture

```
src/
  index.js              — app entrypoint
  configureStore.js     — Redux store (thunk middleware)
  components/           — UI components (page-level + common)
    router/             — route setup, ProtectedRoute, PublicRoute
    rangeUsePlanPage/   — primary feature area
    common/             — shared components
  actionCreators/       — Redux action creators (thunks)
  actions/              — action type constants (deprecated, prefer constants/)
  reducers/             — Redux reducers (rootReducer combines all)
  constants/            — API endpoints, action types, variables, routes, permissions
  api/                  — axios HTTP layer
  hooks/                — custom React hooks
  providers/            — React context providers
  helper/               — utility helpers
  utils/                — more utilities
  semantic/             — GENERATED — Semantic UI CSS output (do not edit directly)
  styles/               — app-level CSS/Sass
```

## Key Conventions

- **No TypeScript** — all source is `.js` with `jsconfig.json` for editor support
- **Environment variables** use `REACT_APP_` prefix (CRA convention). See `.env.example`:
  - `REACT_APP_SSO_REALM_NAME`, `REACT_APP_SSO_CLIENT_ID`, `REACT_APP_API_URL`
- **Production env injection** uses Caddy template syntax `[[! env "VAR" !]]` in `src/constants/api.js` — these are replaced at runtime by the OpenShift Caddy server, not at build time
- **Semantic UI theme** source lives in `semantic/src/` — built output goes to `src/semantic/`. Config: `semantic.json`
- **BEM naming** for custom CSS classes
- **Redux state** keys match reducer file names (e.g., `agreementReducer`, `planReducer`, `authReducer`)
- API endpoints are all defined as functions/constants in `src/constants/api.js`

## Gotchas

- `src/semantic/` is generated — do not edit files there; modify `semantic/src/site/` instead
- Multiple UI libraries coexist (Semantic UI, Material UI 4, MUI 5, Tailwind) — match the existing pattern in the component you're editing
- The test command (`npm test`) runs `pretest` first which checks formatting — run `npm run prettier` if format check fails
- Webpack config is in `config/webpack.config.js` (ejected CRA), not at the root
- `.pipeline/` contains OpenShift CI/CD build scripts (BCGov pipeline tooling) — not standard GitHub Actions

## Related Repos

- **Backend API:** `range-api` (sibling repo) — has its own `AGENTS.md`. The frontend calls it via endpoints defined in `src/constants/api.js`.

## Deployment

Docker build → OpenShift with Caddy as static server. Caddy injects env vars into the built JS bundle at serve time using template syntax.
