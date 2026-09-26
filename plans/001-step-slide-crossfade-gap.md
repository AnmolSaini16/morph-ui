# 001 — Close the blank gap in the step slide (`vt-slide`)

- **Status**: DONE (2026-09-26, with the Mini Player work; the old fade uses vt-dissolve-out, which the quoted rules predate)
- **Commit**: none (not a git repository); written 2026-09-24 against the files quoted below
- **Severity**: HIGH
- **Category**: Easing & duration
- **Estimated scope**: 1 file (`src/registry/morph.css`), ~20 lines

## Problem

When Step Wizard moves to the next step, its step area goes almost completely blank for a moment. Measured frame by frame, the step content loses 90% of its visible ink at 80ms into the transition. The old step fades out over 150ms on a strong ease-out, so it's nearly gone by 80ms, but the new step doesn't start fading in until 90ms (`--vt-enter-delay`). That gap reads as a blink on every step change.

Tabs uses the same class with `vt-quick` added, which zeroes the delay, and measures 0% dip. That's the proof the delay is the cause.

`src/registry/morph.css:445–455`, current:

```css
::view-transition-old(.vt-slide) {
  animation:
    var(--vt-exit, 150ms) var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-fade-out,
    300ms var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1)) both vt-slide-out;
}
::view-transition-new(.vt-slide) {
  animation:
    var(--vt-enter, 210ms) var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1))
      var(--vt-enter-delay, 90ms) both vt-fade,
    300ms var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1)) both vt-slide;
}
```

`vt-slide` is applied with `update`, so the old and new step are the two images of **one** image pair. That means they can use a true crossfade: the same duration and curve, one out and one in, blended with `plus-lighter`. The library already does exactly this for `vt-blur` and `vt-expand` (see "Repo conventions").

## Target

A true crossfade for the fade part; the slide part is unchanged.

```css
/* target: src/registry/morph.css, replacing the two rules above */
::view-transition-old(.vt-slide) {
  animation:
    var(--vt-enter, 210ms) var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-fade-out,
    300ms var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1)) both vt-slide-out;
}
::view-transition-new(.vt-slide) {
  animation:
    var(--vt-enter, 210ms) var(--vt-ease-out, cubic-bezier(0.33, 1, 0.68, 1)) both vt-fade,
    300ms var(--vt-ease, cubic-bezier(0.32, 0.72, 0, 1)) both vt-slide;
}
```

And add `.vt-slide` to the existing `plus-lighter` rules, including their `:only-child` reset.

## Repo conventions to follow

- Every setting is written where it's used, with its default: `var(--vt-enter, 210ms)`. Never declare anything on `:root`. A test enforces that each setting has one consistent default everywhere.
- Exemplar, `src/registry/morph.css:186–205` (current). This is the true-crossfade pattern to extend:

```css
/* plus-lighter only when both views are there: alone (:only-child), it would
   add to the page. Only :only-child may follow these pseudo-elements, not :not() */
::view-transition-image-pair(.vt-blur),
::view-transition-image-pair(.vt-expand) {
  isolation: isolate;
}
::view-transition-old(.vt-blur),
::view-transition-new(.vt-blur),
::view-transition-old(.vt-expand),
::view-transition-new(.vt-expand) {
  mix-blend-mode: plus-lighter;
}
::view-transition-old(.vt-blur):only-child,
::view-transition-new(.vt-blur):only-child,
::view-transition-old(.vt-expand):only-child,
::view-transition-new(.vt-expand):only-child {
  mix-blend-mode: normal;
}
```

- Do **not** write `:not(:only-child)` after these pseudo-elements. It's invalid there, and the browser silently drops the whole rule.

## Steps

1. In `src/registry/morph.css`, replace the `::view-transition-old(.vt-slide)` and `::view-transition-new(.vt-slide)` rules with the two target rules above. That's two changes: the old fade uses `var(--vt-enter, 210ms)` instead of `var(--vt-exit, 150ms)`, and the new fade loses `var(--vt-enter-delay, 90ms)`. Nothing else in those rules changes.
2. In the same file, extend the three exemplar rules at lines 186–205 by adding the `vt-slide` equivalents to each selector list:
   - `::view-transition-image-pair(.vt-slide)` to the `isolation: isolate` rule
   - `::view-transition-old(.vt-slide)` and `::view-transition-new(.vt-slide)` to the `plus-lighter` rule
   - `::view-transition-old(.vt-slide):only-child` and `::view-transition-new(.vt-slide):only-child` to the `normal` rule
3. Update the comment above `vt-slide` (it starts `/* vt-slide: a short slide with a fade and a blur, for steps.`). Add one sentence: "The old and new step crossfade over the same time, blended with plus-lighter, so the step never goes blank."
4. Update the comment above the exemplar rules, which currently only talks about vt-blur and vt-expand, so it reads as covering every class in its selector lists.
5. Run `npm run skill` (it regenerates `skills/morph-ui/` from `morph.css`; a test fails if you skip it).

## Boundaries

- Do NOT touch `vt-fade`, `vt-presence`, `vt-rise` or any other class. Only `vt-slide` and the three shared blend rules.
- Do NOT change the slide distance (`--vt-offset: ±48px`), the 300ms slide, or its curve.
- Do NOT touch `vt-quick`. Tabs uses `vt-slide vt-quick` and must keep working. `vt-quick` already sets fade duration and delay, and still wins because it comes later in the file.
- Do NOT edit any `.tsx` file.
- If the quoted rules don't match the file (drift), STOP and report instead of improvising.

## Verification

- **Mechanical**: `npm test` passes, including the Lightning CSS parse test and the "every setting has one default" test. `npm run lint` shows 0 warnings or errors, `npm run build` succeeds, and `npx prettier --check .` passes (run `npm run format` if needed).
- **Measured**: the step area must not dip. Run the dip script below against `npm run start` (after `npm run build`) on port 3000:

  ```bash
  mkdir -p /tmp/vt-check && cd /tmp/vt-check && npm init -y >/dev/null && npm i puppeteer-core >/dev/null
  ```

  Save as `/tmp/vt-check/dip.mjs`. Set `CHROME` to your Chrome binary, for example `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` on macOS.

  ```js
  import puppeteer from "puppeteer-core"
  const [url, area, trigger] = process.argv.slice(2)
  const b = await puppeteer.launch({
    executablePath: process.env.CHROME,
    headless: "new",
    defaultViewport: { width: 1280, height: 900 },
  })
  const p = await b.newPage()
  const wait = (ms) => new Promise((r) => setTimeout(r, ms))
  // Mean distance of every pixel from the corner pixel: how much content is visible
  const ink = async (clip) => {
    const src = await p.screenshot({ clip, encoding: "base64", captureBeyondViewport: false })
    return p.evaluate(async (src) => {
      const img = new Image()
      img.src = "data:image/png;base64," + src
      await img.decode()
      const c = document.createElement("canvas")
      c.width = img.width
      c.height = img.height
      const g = c.getContext("2d")
      g.drawImage(img, 0, 0)
      const d = g.getImageData(0, 0, c.width, c.height).data
      let s = 0
      for (let i = 0; i < d.length; i += 4)
        s += Math.abs(d[i] - d[0]) + Math.abs(d[i + 1] - d[1]) + Math.abs(d[i + 2] - d[2])
      return s / (d.length / 4)
    }, src)
  }
  await p.goto(url, { waitUntil: "networkidle0" })
  await wait(500)
  const clip = await p.$eval(area, (e) => {
    const r = e.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  })
  const start = await ink(clip)
  await p.evaluate(trigger)
  await p.waitForFunction(
    () => document.getAnimations().some((a) => a.effect?.pseudoElement?.match(/-(old|new)\(/)),
    { polling: "raf" },
  )
  await p.evaluate(() =>
    document
      .getAnimations()
      .forEach((a) => a.effect?.pseudoElement?.startsWith("::view-transition") && a.pause()),
  )
  let lowest = Infinity
  for (let t = 0; t <= 320; t += 20) {
    await p.evaluate(
      (t) =>
        document.getAnimations().forEach((a) => {
          if (a.effect?.pseudoElement?.startsWith("::view-transition")) a.currentTime = t
        }),
      t,
    )
    lowest = Math.min(lowest, await ink(clip))
  }
  await p.evaluate(() =>
    document
      .getAnimations()
      .forEach((a) => a.effect?.pseudoElement?.startsWith("::view-transition") && a.finish()),
  )
  await wait(400)
  const end = await ink(clip)
  const floor = Math.min(start, end)
  console.log(
    `dip ${Math.max(0, ((floor - lowest) / floor) * 100).toFixed(0)}% (start ${start.toFixed(1)}, end ${end.toFixed(1)}, lowest ${lowest.toFixed(1)})`,
  )
  await b.close()
  ```

  ```bash
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node /tmp/vt-check/dip.mjs http://localhost:3000/step-wizard "article [data-slot=card] .h-32" '[...document.querySelectorAll("article [data-slot=card] button")].find((b) => b.textContent.includes("Continue")).click()'
  ```

  Before the fix this prints `dip 90%`. After, it must print `dip` of **5% or less**. Also run it for Tabs, which must stay at 5% or less:

  ```bash
  CHROME="…" node /tmp/vt-check/dip.mjs http://localhost:3000/tabs "article [role=tabpanel]" 'document.querySelectorAll("article [role=tab]")[2].click()'
  ```

- **Feel check**: open `/step-wizard` and click Continue, then Back, several times.
  - The step text never blinks out; the old step dissolves into the new one as they slide.
  - In DevTools, open the Animations panel, set playback to 10%, and step through a change. Mid-way, both steps are visible and soft, blurred by the existing `vt-fade` keyframes, with no frame where the area is empty.
  - Click Continue rapidly. Each click finishes the running animation and starts the next, with no stutter.
  - In the Rendering panel, emulate `prefers-reduced-motion: reduce`. Steps still crossfade (150ms) and don't slide.
- **Done when**: Step Wizard's dip is 5% or less, Tabs' dip is 5% or less, and all mechanical checks pass.
