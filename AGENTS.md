# AGENTS.md — rules for AI collaborators on Stacks · Stackbase Template

This file binds any AI assistant (Claude, Codex, Gemini, etc.) working in this repo. Read it before any tool call.

## Universal rules (always apply)

- **Terse, autonomous, no preamble, no options menus.** Lead with action.
- **Bash always allowed** — never ask permission for shell commands unless destructive (`rm -rf`, force push to main, drop database).
- **Auto-install safe beneficial tools** — don't ask, install.
- **Admin-first architecture** — features land in admin first, propagate via roles.
- **Always update [`handoff.md`](./handoff.md)** on context loss, session end, or significant decision change.
- **Dark UI + brand defaults** unless overridden.

## Stacks-specific rules

- **Vite dotenv `#` bug:** hex values in `.env` MUST be quoted (`PUBLIC_BRAND_ACCENT="#00897B"`) or Vite strips them as comments → empty string → CSS breaks.
- **Vercel committer check:** all commits must use `smc92589@gmail.com` or Vercel rejects deploys.
- **Astro `_` prefix** files won't render — pages starting with `_` are hidden.
- **NEVER mention commission rates** in published articles or partner-facing UI. Strip from quick-stats and pros sections.
- **brand.css** must be imported in `Base.astro` — without it, per-site branding falls back to defaults.
- **Model ID:** `claude-sonnet-4-20250514` (NOT `claude-opus-4-5` or `claude-sonnet-4-5-20250514` — both invalid).
- **`/recommends/*` redirects** generated at prebuild from `affiliates.json`. Never hardcode affiliate URLs in articles.

## Project-specific conventions

- **Tech stack:** astro
- **Deploy:** Vercel
- **Database:** _(specify)_
- **Auth:** _(specify)_

## Branch + commit conventions

- Branch from `main`. Keep branches short-lived.
- Commit format: `type: subject` (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`)
- Sign commits with `smc92589@gmail.com` (Vercel rejects unrecognized committers)

## Linear integration

- All work must reference a Linear issue: include `SKY-NNN` in commit message or PR title
- Project URL: https://linear.app/skyyield/project/stacks-stackbase-template-c400c2004762

## What NOT to do

- Do NOT mention commission rates in published article content.
- Do NOT commit `.env` files with real keys (one slipped through in STRStack — never again).
- Do NOT hardcode affiliate URLs in articles — use the registry + `/recommends/<slug>`.
- Do NOT merge the `rebase-stackbase` branches on existing 4 sites — they'd destroy content.
- Do NOT skip the dotenv hex-quoting rule.

## Handoff protocol

When context is about to be lost (compact, clear, restart, EOD):

1. Update `handoff.md` with: current task, what's done, what's next, blockers, files touched
2. Commit `handoff.md` if changed
3. If session ended mid-feature, leave a `WIP:` commit on a feature branch — never to `main`

## Peer review checkpoints

- **Plan review** before writing code on multi-step features → `/ask codex` with `[PLAN REVIEW REQUEST]`
- **Code review** before reporting done → `/ask codex` with `[CODE REVIEW REQUEST]`
- Pass criteria: overall ≥ 7.0 AND no dimension ≤ 3
