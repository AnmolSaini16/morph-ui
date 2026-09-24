# Animation plans

Written 2026-09-24 by an animation audit, measured against Emil Kowalski's animation standards. Each plan is self-contained: hand it to any agent, or to a person, as is. This project isn't a git repository, so plans are stamped with a date instead of a commit. Each quotes the exact code it expects, and says to STOP if the code has changed.

| #   | Plan                                                                                         | Severity | Status | Depends on                                 |
| --- | -------------------------------------------------------------------------------------------- | -------- | ------ | ------------------------------------------ |
| 001 | [Close the blank gap in the step slide](001-step-slide-crossfade-gap.md)                     | HIGH     | TODO   | —                                          |
| 002 | [Make every duration tunable through settings](002-duration-settings.md)                     | MEDIUM   | TODO   | 001                                        |
| 003 | [Add press feedback to buttons](003-press-feedback.md)                                       | MEDIUM   | TODO   | —                                          |
| 004 | [Stop List Switcher's descriptions leaving too early](004-list-switcher-description-exit.md) | LOW      | TODO   | — (reuses 001's measuring script)          |
| 005 | [Give list reorders a UI-length move](005-list-move-timing.md)                               | LOW      | TODO   | 002; asks a human before changing anything |

## Execution order

1. **001**, first. It's the only feel-breaking issue: Step Wizard's step area goes almost blank on every step.
2. **002**. It edits the same `vt-slide` rules 001 changes, so it must come after.
3. **003** and **004**. Both are independent, and can run in either order or in parallel.
4. **005**, last. It needs 002's `--vt-step` setting, and starts with a feel-check the human answers.

## Shared across plans

- Every plan ends with `npm test`, `npm run lint`, `npm run build` and `npx prettier --check .`. Any plan that touches a component, an example, `morph.css` or `src/lib/reference.ts` also runs `npm run skill`, because the agent skill in `skills/morph-ui/` is generated from them and a test fails when it's stale.
- The frame-by-frame dip measurement script lives in 001's Verification section; 004 reuses it.
- Rules from `AGENTS.md` that every executor must follow:
  - Settings are written `var(--vt-name, default)`, never declared on `:root`.
  - Only `:only-child` may follow `::view-transition-old/new`.
  - Controls pressed during a transition stay outside `<ViewTransition>` boundaries.
