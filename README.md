# Morph UI

Animated React components you copy and paste, built on the View Transition API and React's `<ViewTransition>`. No animation library, just React 19.3+ and a little CSS.

## Use a component

1. Once: copy `morph.css` next to your `globals.css` and import it after Tailwind. Every component is built from its `vt-*` classes, and yours can use them too.

```css
@import "tailwindcss";
@import "./morph.css";
```

2. Copy the component's `.tsx` from its docs page into `components/`.

Needs React 19.3+ and Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev
```

## Structure

- `src/registry/` — the components, one `.tsx` file each, written with plain elements and Tailwind classes.
- `src/registry/morph.css` — the one CSS file: a small set of `vt-*` classes every component composes, with settings you can override on `:root`.
- `src/components/docs/examples/` — one runnable demo per component, shown under Usage.
- `src/app/` — Next.js routes. Every component page is pre-rendered at build time.
- `src/components/docs/` — the docs site, built with shadcn/ui.

See `AGENTS.md` for conventions.
