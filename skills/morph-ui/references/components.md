# Components

Each component is one file whose only import is `react`, plus `morph.css`. Copy the component unchanged and adapt its example. Read the component file for its props: they're typed at the top of its exported function.

## Post List

A post expands into the full article and folds back into the list.

- Component: `assets/components/post-list.tsx`
- Example: `assets/examples/post-list.tsx`
- Exports: `Post`, `PostList`
- Classes: `vt-move`, `vt-expand`, `vt-cover`, `vt-text`, `vt-blur`, `vt-quick`
- Theme variables: `--foreground`, `--card`, `--card-foreground`, `--secondary`, `--secondary-foreground`, `--muted-foreground`, `--ring`, `--radius`
- Docs: `/post-list` on the Morph UI site

## Dynamic Island

One shape, many states. The pill expands and reveals its content.

- Component: `assets/components/dynamic-island.tsx`
- Example: `assets/examples/dynamic-island.tsx`
- Exports: `DynamicIsland`
- Classes: `vt-move`, `vt-slow`, `vt-spring`, `vt-shell`, `vt-inverse`, `vt-clip`, `vt-reveal`, `vt-top`
- Theme variables: `--background`, `--foreground`, `--card`, `--radius`
- Docs: `/dynamic-island` on the Morph UI site

## Morphing Popover

A button grows into a panel and folds back into the button.

- Component: `assets/components/morphing-popover.tsx`
- Example: `assets/examples/morphing-popover.tsx`
- Exports: `MorphingPopover`
- Classes: `vt-move`, `vt-expand`, `vt-text`, `vt-quick`
- Theme variables: `--background`, `--foreground`, `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--radius`
- Docs: `/morphing-popover` on the Morph UI site

## Morph Dialog

A card grows into a modal dialog and folds back when it closes.

- Component: `assets/components/morph-dialog.tsx`
- Example: `assets/examples/morph-dialog.tsx`
- Exports: `MorphDialog`
- Classes: `vt-move`, `vt-expand`, `vt-quick`
- Theme variables: `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--ring`, `--radius`
- Docs: `/morph-dialog` on the Morph UI site

## Number Flip

Changed digits roll a full line, with blur and optional stagger.

- Component: `assets/components/number-flip.tsx`
- Example: `assets/examples/number-flip.tsx`
- Exports: `NumberFlip`
- Classes: `vt-roll`, `vt-forward`, `vt-back`, `vt-delay-1`, `vt-delay-2`
- Theme variables: 
- Docs: `/number-flip` on the Morph UI site

## Animated List

Add, remove, shuffle and sort with zero layout math.

- Component: `assets/components/animated-list.tsx`
- Example: `assets/examples/animated-list.tsx`
- Exports: `Task`, `AnimatedList`
- Classes: `vt-move`, `vt-presence`, `vt-scroll`, `vt-edge-bottom`
- Theme variables: `--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--border`, `--ring`
- Docs: `/animated-list` on the Morph UI site

## Photo Grid

Photos pop in, shrink away and bounce into their new spots.

- Component: `assets/components/photo-grid.tsx`
- Example: `assets/examples/photo-grid.tsx`
- Exports: `Photo`, `PhotoGrid`
- Classes: `vt-pop`
- Theme variables: `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--ring`
- Docs: `/photo-grid` on the Morph UI site

## List Switcher

Cards fold into a list; names and stats glide into place.

- Component: `assets/components/list-switcher.tsx`
- Example: `assets/examples/list-switcher.tsx`
- Exports: `Repo`, `ListSwitcher`
- Classes: `vt-clip`, `vt-edge-bottom`, `vt-move`, `vt-shell`, `vt-text`, `vt-fade`, `vt-delay-3`
- Theme variables: `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--radius`
- Docs: `/list-switcher` on the Morph UI site

## Tabs

The underline glides to your tab; the panel slides the same way.

- Component: `assets/components/tabs.tsx`
- Example: `assets/examples/tabs.tsx`
- Exports: `Tab`, `Tabs`
- Classes: `vt-move`, `vt-quick`, `vt-slide`, `vt-clip`, `vt-forward`, `vt-back`
- Theme variables: `--foreground`, `--muted-foreground`, `--border`, `--ring`, `--radius`
- Docs: `/tabs` on the Morph UI site

## Carousel

Cards slide by like a track, with arrows or dots.

- Component: `assets/components/carousel.tsx`
- Example: `assets/examples/carousel.tsx`
- Exports: `Slide`, `Carousel`
- Classes: `vt-swipe`, `vt-forward`, `vt-back`
- Theme variables: `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--radius`
- Docs: `/carousel` on the Morph UI site

## Step Wizard

Steps slide the way you move, forward or back.

- Component: `assets/components/step-wizard.tsx`
- Example: `assets/examples/step-wizard.tsx`
- Exports: `Step`, `StepWizard`
- Classes: `vt-slide`, `vt-clip`, `vt-forward`, `vt-back`
- Theme variables: `--background`, `--foreground`, `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--radius`
- Docs: `/step-wizard` on the Morph UI site

## Stack Navigator

Chats push in from the right and pop back out, like a native app.

- Component: `assets/components/stack-navigator.tsx`
- Example: `assets/examples/stack-navigator.tsx`
- Exports: `Chat`, `StackNavigator`
- Classes: `vt-push`, `vt-clip`, `vt-forward`, `vt-back`
- Theme variables: `--card`, `--card-foreground`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--border`, `--ring`, `--radius`
- Docs: `/stack-navigator` on the Morph UI site

## Page Transition

Swap views with a crossfade, a blurred one, or sections one by one.

- Component: `assets/components/page-transition.tsx`
- Example: `assets/examples/page-transition.tsx`
- Exports: `PageEffect`, `PageTransition`
- Classes: `vt-blur`, `vt-rise`, `vt-delay-1`, `vt-delay-2`, `vt-delay-3`
- Theme variables: 
- Docs: `/page-transition` on the Morph UI site
