# Decisions log

Every ambiguous call made while executing `docs/website/MASTER_PROMPT.md`, with one line of reasoning, so later phases (and Sam) can see why. Newest at the bottom.

## Phase 0

1. **Motion AI Kit installed via the manual fallback, not the interactive installer.** `npx motion-ai` expects an interactive TTY (pick "Project", select "Claude Code", confirm). This session can't drive that prompt, so used the documented fallback: `npm pack`, extract, copy `content/skills/motion` into `.claude/skills/motion`. Did not run `claude mcp add --transport http motion https://mcp.motion.dev` because a plugin/MCP server added mid-session isn't callable until restart anyway (per C1's own note) — the self-contained `.claude/skills/motion/best-practices/` docs are the thing actually used during Phases 3-5.
2. **Installed `@playwright/test` and `@axe-core/playwright` during Phase 0, not Phase 1.** D1 asks for them, but C1's toolchain check also needs a working Playwright/Chromium for later phases, and installing once up front avoids a second `npm i` later. No behavior change, just sequencing.

## Phase 1

3. **Trusted the live screenshots over the D2 text where they disagreed, per A3 rule 1 ("if a site has changed since this prompt was written, trust what you see").** Linear's hero is now fully rendered at 0ms (D2 said blank at 3s), Attio has moved to a centered hero with an announcement bar (D2 implied an asymmetric positive example), GlossGenius's below-fold product moment is now an AI chat composer, not a scheduling calendar. REFERENCE_NOTES.md documents each case inline. None of this changes PART E (the design is locked); it only affects which concrete details back up the "default AI SaaS page" contrast in DESIGN.md.
4. **Delegated screenshot viewing to a forked subagent rather than reading all 172 PNGs in the main thread.** Image tool results are expensive context with no reuse value once the notes are written; the fork wrote `docs/design/REFERENCE_NOTES.md` directly and reported back a short summary. The file itself was reviewed in the main thread before committing.
