# @codewithsachin/ngx-motion

Angular directives for [motion.dev](https://motion.dev) — scroll-in reveals, hover
springs and press feedback, SSR-safe and reduced-motion aware.

**[Live demo & docs → https://sachinsingh.me/packages/motion](https://sachinsingh.me/packages/motion)**

motion.dev gives you a tiny WAAPI-backed animation runtime; this package gives it
Angular manners. Three attribute directives cover the micro-interaction layer, and
one injectable service wraps the raw API so it no-ops on the server instead of
reaching for `document`.

- SSR-safe by construction — all DOM work runs inside `afterNextRender`.
- `prefers-reduced-motion` respected everywhere, configurably.
- Listeners torn down through `DestroyRef`.
- Standalone directives, signal inputs, zoneless-friendly.

## Install

```bash
npm i @codewithsachin/ngx-motion motion
```

Peer dependencies: Angular 22+, `motion` 12+.

## Setup

`provideMotion()` is optional — only needed to override reduced-motion handling.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideMotion } from '@codewithsachin/ngx-motion';

export const appConfig: ApplicationConfig = {
  providers: [
    // 'user' (default) respects prefers-reduced-motion,
    // 'always' forces reduced, 'never' ignores the setting.
    provideMotion({ reducedMotion: 'user' }),
  ],
};
```

## Requirements

Peer ranges are wider than this; the **Tested** column is the exact combination the
[live demo](https://sachinsingh.me/packages/motion) runs, so you have a known-good set to fall back on.

| Package         | Peer range | Tested  | Notes                                                      |
| --------------- | ---------- | ------- | ---------------------------------------------------------- |
| `@angular/core` | `^22.0.0`  | 22.0.5  | Standalone APIs, signal inputs and `afterNextRender`.      |
| `typescript`    | `~6.0.0`   | 6.0.3   | Whatever your Angular version supports.                    |
| `node`          | `>=20`     | 24.15.0 | Build and SSR only.                                        |
| `motion`        | `^12.0.0`  | 12.42.2 | The animation runtime. Every directive proxies through it. |

## Providers

Optional — omit it and every directive still works, defaulting to `reducedMotion: 'user'`.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideMotion } from '@codewithsachin/ngx-motion';

export const appConfig: ApplicationConfig = {
  providers: [provideMotion()],
};

// main.ts
// bootstrapApplication(App, appConfig);
```

## Using NgModules

Everything here is standalone, but standalone components and directives are importable from
an `@NgModule` — put them in the module's `imports`, **not** `declarations`. No
`importProvidersFrom` is needed: `@NgModule.providers` is typed
`Array<Provider | EnvironmentProviders>`, so the `provide*()` functions drop straight in.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  InViewDirective,
  HoverSpringDirective,
  PressDirective,
  provideMotion,
} from '@codewithsachin/ngx-motion';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  // Standalone components and directives go in `imports`.
  imports: [BrowserModule, InViewDirective, HoverSpringDirective, PressDirective],
  providers: [provideMotion()],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## `ngxInView`

Plays an entrance when the host scrolls into view.

```html
<section ngxInView>Fades up when scrolled into view</section>
<img ngxInView preset="slide-left" [delay]="0.15" [distance]="40" />
<p ngxInView preset="fade" [once]="false">Replays every pass</p>
```

| Input      | Type                                                   | Default     | Notes                                                     |
| ---------- | ------------------------------------------------------ | ----------- | --------------------------------------------------------- |
| `preset`   | `'fade' \| 'fade-up' \| 'slide-left' \| 'slide-right'` | `'fade-up'` | `slide-right` enters from the left.                       |
| `once`     | `boolean`                                              | `true`      | `false` re-hides the host on exit, so the reveal replays. |
| `delay`    | `number`                                               | `0`         | Seconds before the animation starts.                      |
| `distance` | `number`                                               | `28`        | Travel in pixels for the sliding presets.                 |

Under reduced motion the host is simply set to `opacity: 1` — no animation, no hidden content.

## `ngxHoverSpring` and `ngxPress`

```html
<a ngxHoverSpring [scale]="1.05" [lift]="-4">Contact row</a>
<button ngxPress [depth]="0.94">Tap me</button>
```

| Directive        | Input   | Type     | Default | Notes                                          |
| ---------------- | ------- | -------- | ------- | ---------------------------------------------- |
| `ngxHoverSpring` | `scale` | `number` | `1.03`  | Scale at rest on hover.                        |
| `ngxHoverSpring` | `lift`  | `number` | `-2`    | Vertical offset in px; negative lifts.         |
| `ngxPress`       | `depth` | `number` | `0.97`  | Scale while held; released on up/cancel/leave. |

Both use a critically-damped bezier via WAAPI — no layout thrash, no rAF loop of your own.

## `MotionService`

An SSR-safe facade over motion.dev's `animate`, `inView` and `scroll`.

```ts
import { inject } from '@angular/core';
import { MotionService } from '@codewithsachin/ngx-motion';

export class Hero {
  private readonly motion = inject(MotionService);

  reveal(el: HTMLElement) {
    if (this.motion.reduced) return;
    this.motion.animate(el, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6 });
  }
}
```

| Member      | Type             | Notes                                                                         |
| ----------- | ---------------- | ----------------------------------------------------------------------------- |
| `isBrowser` | `boolean`        | `false` during SSR; every method below is a no-op then.                       |
| `reduced`   | `boolean`        | `true` on the server, when config forces it, or when the OS asks for reduced. |
| `animate`   | `typeof animate` | Returns a stub with `stop`/`cancel`/`finished` on the server.                 |
| `inView`    | `typeof inView`  | Returns a no-op stop function on the server.                                  |
| `scroll`    | `typeof scroll`  | SSR-safe proxy for scroll-linked animation.                                   |

## Licence

MIT © Sachin Singh
