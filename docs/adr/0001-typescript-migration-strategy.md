# Incremental TypeScript migration with interleaved library upgrades

We are converting the frontend from JavaScript to TypeScript incrementally (file-by-file with `allowJs: true`), interleaving library upgrades with the conversion rather than doing them sequentially. The webpack config already supports mixed JS/TS — adding a `tsconfig.json` activates it.

## Key decisions

**Strictness:** `strict: true` from day one, with explicit `any` and `@ts-expect-error` as escape hatches during conversion. `@typescript-eslint/no-explicit-any` set to `warn` to track and reduce them over time.

**Enforcement:** Tiered rule — new files MUST be `.ts`/`.tsx` (enforced in CI). Existing files SHOULD convert when substantially modified (advisory). One-line bug fixes are exempt.

**Conversion order:** Shared infrastructure layers converted bottom-up first (constants, utils, actions, reducers, API, actionCreators, providers — ~93 files). Then components converted by feature slice. This gives fully-typed foundations before component work begins.

**Type definitions:** Hybrid placement — domain entity types (Plan, Agreement, User, Pasture, etc.) live in `src/types/`. Module-specific types (component props, action payloads, reducer state) stay co-located. Domain types are derived independently based on what the frontend receives, not copied from the backend.

**ESLint:** Dual parser via overrides — keep `@babel/eslint-parser` for existing `.js`, add `@typescript-eslint/parser` + `plugin:@typescript-eslint/recommended` for `.ts`/`.tsx` files.

**Test files:** Convert lazily, same tiered rule — new test files must be TS, existing ones convert when substantially modified.

**Class components:** Size-based rule — small class components (<~100 lines) convert to function components during TS migration. Large complex ones get typed as classes with a TODO for later.

## Phase sequence

1. Node 16 → 24 (match backend)
2. TS infrastructure + `src/constants/` conversion (first PR)
3. Shared layers bottom-up (3-5 PRs)
4. React 18 install (legacy `ReactDOM.render` compat) + react-router-dom 5 → 6 (dedicated PR)
5. Component feature slices (interleaved: TS + React 18 patterns + MUI 5/Tailwind)
6. Cleanup: `createRoot`, remove deprecated deps, remove `allowJs`

## Library targets

- **UI:** MUI 5 + Tailwind 3. Phase out Semantic UI React, Material UI 4, styled-components.
- **Styling:** MUI `sx` prop + Tailwind utilities. No new styled-components.
- **Redux:** Type existing as-is, use Redux Toolkit for new code. Full removal deferred to a separate initiative (likely React Query + Context).
- **React:** 18, installed early with legacy render API, migrated per-slice, `createRoot` as final step.
- **Router:** react-router-dom 6, upgraded in a dedicated PR after shared layers are typed.

## Considered alternatives

- **Big-bang conversion** (all files at once via `ts-migrate`): Rejected — 307 files, active development, unreviewable diffs, merge conflict risk.
- **Loose TypeScript (`strict: false`)**: Rejected — delays real type safety indefinitely; "we'll turn on strict later" never happens.
- **Library upgrades first, then TS**: Rejected — library upgrades without type checking are riskier. Interleaving gives type safety during the dangerous migrations.
- **Redux removal in this effort**: Deferred — the codebase is already mid-migration toward Context providers, but completing that is a separate initiative with its own scope.
