# Build progress

Living log for the BuzraReviews marketing site build (branch `site/v1`). Updated after every phase so work can resume after a context compaction. See `docs/website/MASTER_PROMPT.md` for the full spec.

## Phase 0: Toolchain and project hygiene — in progress

Started: 2026-09-30.

Toolchain verified/installed (C1):

- Plugins (local scope): `frontend-design`, `playwright`, `chrome-devtools-mcp`, `context7`, `modern-web-guidance` — all installed successfully via `claude plugin install ...@claude-plugins-official --scope local`.
- Skills installed into `.claude/skills/`: `web-design-guidelines`, `vercel-react-best-practices` (via `npx skills add vercel-labs/agent-skills`), `emil-design-eng`, `animate`, `review-animations`, `find-animation-opportunities`, `mobile-native` (via `npx skills add emilkowalski/skill`), `impeccable` (via `npx impeccable install --providers=claude --scope=project`).
- Motion AI Kit: the interactive installer (`npx motion-ai`) requires a TTY prompt, which isn't available in this automated flow, so used the documented fallback: `npm pack motion-ai@latest`, extracted the tarball, copied `content/skills/motion` into `.claude/skills/motion`. Did not register the hosted MCP server (`claude mcp add --transport http motion https://mcp.motion.dev`) since it wouldn't be callable until a session restart anyway; the self-contained `best-practices/` docs cover what's needed for Phases 3-5.
- `npx playwright install chromium` — done, confirmed executable path resolves.
- Node version: v24.19.0 (>= 20.9 required). `node_modules` already present.

Project hygiene (C3):

- `.gitignore`: appended the website build tooling block and Impeccable's ignore block (fetched verbatim from the impeccable README).
- `.claude/skills/buzra-brand/SKILL.md` created (committed; the only skill directory not gitignored).
- `CLAUDE.md`: appended `For any UI or copy work, follow DESIGN.md and the buzra-brand skill.` under the existing `@AGENTS.md` line.
- `docs/website/PROGRESS.md`, `docs/website/DECISIONS.md`, `docs/website/CRITIQUE_LOG.md` created (this phase).
- `PRODUCT.md` created at repo root.
- `.impeccable/config.json` created with `{ "buildPath": "code" }`.

Files changed this phase: `.gitignore`, `CLAUDE.md`, `PRODUCT.md`, `.impeccable/config.json`, `.claude/skills/buzra-brand/SKILL.md`, `docs/website/PROGRESS.md`, `docs/website/DECISIONS.md`, `docs/website/CRITIQUE_LOG.md`, `docs/website/MASTER_PROMPT.md` (saved before Phase 0 started), `package.json`/`package-lock.json` (added `@playwright/test`, `@axe-core/playwright` as devDependencies, needed early since Phase 1 also depends on them).

Open issues: none blocking.

Next step: commit Phase 0, then start Phase 1 (capture reference screenshots).

## Phase 1: Study real reference sites — not started

## Phase 2: Design system (DESIGN.md) — not started

## Phase 3: Foundation — not started

## Phase 4: Home page — not started

## Phase 5: Remaining pages and metadata — not started

## Phase 6: Funnel continuity (app pages) — not started

## Phase 7: QA and polish — not started

## Phase 8-9: Ship and report — not started
