# AGENTS.md

## Project

This project is a Dual Sync Interactive Demo Presentation System.

The system has three main views:

- `index.html?view=controller`
- `index.html?view=demo`
- `index.html?view=explain`

It uses `BroadcastChannel` for same-device synchronization.

## Development Rules

- Work through the markdown files in `docs/codex-plan/` sequentially.
- Implement only the current task file unless the task explicitly requires changes across multiple files.
- Do not skip phases.
- Keep the app runnable after every phase.
- Prefer Vanilla JavaScript unless the task explicitly asks for a framework.
- Keep the project usable as local static HTML.
- Do not introduce a backend server.
- Do not add production dependencies without a clear reason.
- After every task, update `progress/codex-progress.md`.

## Testing Rules

After each task:

1. Run available tests or static checks.
2. If no automated tests exist, add or update a manual test checklist.
3. Confirm that these routes still work:
   - `index.html?view=controller`
   - `index.html?view=demo`
   - `index.html?view=explain`

## Git Rules

- Keep changes focused.
- Make a commit after each completed phase when possible.
- Commit message format:
  - `phase-01: refactor project structure`
  - `phase-02: extend scene data model`
  - `phase-03: implement video timeline engine`

## Presentation Quality Rules

- This is for executive demo/presentation use, so stability is more important than over-engineering.
- Manual control must remain available even when automatic time events exist.
- Hotspot coordinates must be percentage-based relative to the video container.
- Keep Demo View visually clean; debug overlays must be optional.
