# ngx-motion

Angular directives for motion.dev — scroll-in reveals, hover springs and press feedback, SSR-safe and reduced-motion aware. Published as
[`@code_with_sachin/ngx-motion`](https://www.npmjs.com/package/@code_with_sachin/ngx-motion).

**Usage docs:** [projects/ngx-motion/README.md](projects/ngx-motion/README.md) ·
**Live demo:** https://sachinsingh.me/packages/motion ·
**Changes:** [CHANGELOG](projects/ngx-motion/CHANGELOG.md)

```bash
npm i @code_with_sachin/ngx-motion
```

## Development

This is an Angular workspace with one library project.

```bash
npm ci
npm test          # Vitest + jsdom
npm run build     # ng-packagr → dist/ngx-motion
npm run pack      # build, then a tarball to try in another app
```

## Releasing

1. Bump `version` in `projects/ngx-motion/package.json` and add a CHANGELOG entry.
2. `npm run release` — builds, runs the tests, and publishes `dist/ngx-motion`.
   npm asks for a two-factor confirmation in the browser.
3. Tag the commit: `git tag v<version> && git push --tags`.

## Licence

MIT © [Sachin Singh](https://sachinsingh.me)
