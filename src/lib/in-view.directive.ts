import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { MotionService } from './motion.service';

export type InViewPreset = 'fade' | 'fade-up' | 'slide-left' | 'slide-right';

/**
 * Entrance animation when the host scrolls into view (motion.dev inView + WAAPI).
 * `<div ngxInView preset="fade-up">` — micro-interactions layer, not scroll-scrub.
 */
@Directive({ selector: '[ngxInView]' })
export class InViewDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);

  readonly preset = input<InViewPreset>('fade-up');
  readonly once = input(true);
  readonly delay = input(0);
  readonly distance = input(28);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!this.motion.isBrowser) return;
      const host = this.el.nativeElement;

      if (this.motion.reduced) {
        host.style.opacity = '1';
        return;
      }

      const d = this.distance();
      const from: Record<InViewPreset, { opacity: number[]; x?: number[]; y?: number[] }> = {
        fade: { opacity: [0, 1] },
        'fade-up': { opacity: [0, 1], y: [d, 0] },
        'slide-left': { opacity: [0, 1], x: [d, 0] },
        'slide-right': { opacity: [0, 1], x: [-d, 0] },
      };

      host.style.opacity = '0';

      const stop = this.motion.inView(
        host,
        () => {
          this.motion.animate(host, from[this.preset()], {
            duration: 0.7,
            delay: this.delay(),
            ease: [0.22, 1, 0.36, 1],
          });
          if (this.once()) return;
          return () => {
            this.motion.animate(host, { opacity: 0 }, { duration: 0.3 });
          };
        },
        { margin: '0px 0px -12% 0px' },
      );

      destroyRef.onDestroy(() => stop());
    });
  }
}
