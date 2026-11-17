import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { animate, inView, scroll } from 'motion';
import { NGX_MOTION_CONFIG } from './provide-motion';

type AnimateFn = typeof animate;
type InViewFn = typeof inView;
type ScrollFn = typeof scroll;

/**
 * SSR-safe facade over motion.dev (`motion` package).
 * On the server every method is a no-op, so directives can call freely.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly config = inject(NGX_MOTION_CONFIG, { optional: true }) ?? {
    reducedMotion: 'user' as const,
  };

  /** True when animations should be skipped/simplified. */
  get reduced(): boolean {
    if (!this.isBrowser) return true;
    if (this.config.reducedMotion === 'always') return true;
    if (this.config.reducedMotion === 'never') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  readonly animate: AnimateFn = ((...args: Parameters<AnimateFn>) => {
    if (!this.isBrowser) {
      return {
        stop() {},
        cancel() {},
        finished: Promise.resolve(),
      } as unknown as ReturnType<AnimateFn>;
    }
    return animate(...args);
  }) as AnimateFn;

  readonly inView: InViewFn = ((...args: Parameters<InViewFn>) => {
    if (!this.isBrowser) return () => {};
    return inView(...args);
  }) as InViewFn;

  readonly scroll: ScrollFn = ((...args: Parameters<ScrollFn>) => {
    if (!this.isBrowser) return () => {};
    return scroll(...args);
  }) as ScrollFn;
}
