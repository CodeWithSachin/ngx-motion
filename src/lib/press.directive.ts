import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from './motion.service';

/** Tactile press-down for the CTA pill and audio toggle. */
@Directive({ selector: '[ngxPress]' })
export class PressDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);

  readonly depth = input(0.97);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!this.motion.isBrowser || this.motion.reduced) return;
      const host = this.el.nativeElement;

      const down = () =>
        this.motion.animate(host, { scale: this.depth() }, { duration: 0.12, ease: 'easeOut' });
      const up = () =>
        this.motion.animate(host, { scale: 1 }, { duration: 0.25, ease: [0.22, 1, 0.36, 1] });

      host.addEventListener('pointerdown', down);
      host.addEventListener('pointerup', up);
      host.addEventListener('pointercancel', up);
      host.addEventListener('pointerleave', up);

      destroyRef.onDestroy(() => {
        host.removeEventListener('pointerdown', down);
        host.removeEventListener('pointerup', up);
        host.removeEventListener('pointercancel', up);
        host.removeEventListener('pointerleave', up);
      });
    });
  }
}
