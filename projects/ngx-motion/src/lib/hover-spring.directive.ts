import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from './motion.service';

/**
 * Springy hover lift for contact rows, menu links, and buttons.
 * (Critically-damped bezier via WAAPI — snappy without layout thrash.)
 */
@Directive({ selector: '[ngxHoverSpring]' })
export class HoverSpringDirective {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly motion = inject(MotionService);

  readonly scale = input(1.03);
  readonly lift = input(-2);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!this.motion.isBrowser || this.motion.reduced) return;
      const host = this.el.nativeElement;
      host.style.willChange = 'transform';

      const enter = () =>
        this.motion.animate(
          host,
          { scale: this.scale(), y: this.lift() },
          { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        );
      const leave = () =>
        this.motion.animate(host, { scale: 1, y: 0 }, { duration: 0.45, ease: [0.22, 1, 0.36, 1] });

      host.addEventListener('pointerenter', enter);
      host.addEventListener('pointerleave', leave);

      destroyRef.onDestroy(() => {
        host.removeEventListener('pointerenter', enter);
        host.removeEventListener('pointerleave', leave);
      });
    });
  }
}
