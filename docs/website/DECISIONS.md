# Decisions log

Every ambiguous call made while executing `docs/website/MASTER_PROMPT.md`, with one line of reasoning, so later phases (and Sam) can see why. Newest at the bottom.

## Phase 0

1. **Motion AI Kit installed via the manual fallback, not the interactive installer.** `npx motion-ai` expects an interactive TTY (pick "Project", select "Claude Code", confirm). This session can't drive that prompt, so used the documented fallback: `npm pack`, extract, copy `content/skills/motion` into `.claude/skills/motion`. Did not run `claude mcp add --transport http motion https://mcp.motion.dev` because a plugin/MCP server added mid-session isn't callable until restart anyway (per C1's own note) — the self-contained `.claude/skills/motion/best-practices/` docs are the thing actually used during Phases 3-5.
2. **Installed `@playwright/test` and `@axe-core/playwright` during Phase 0, not Phase 1.** D1 asks for them, but C1's toolchain check also needs a working Playwright/Chromium for later phases, and installing once up front avoids a second `npm i` later. No behavior change, just sequencing.
