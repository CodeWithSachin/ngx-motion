import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface NgxMotionConfig {
  /** 'user' respects prefers-reduced-motion; 'always' forces reduced; 'never' ignores it. */
  reducedMotion: 'user' | 'always' | 'never';
}

export const NGX_MOTION_CONFIG = new InjectionToken<NgxMotionConfig>('NGX_MOTION_CONFIG');

/** Add to `appConfig.providers` to configure motion.dev integration. */
export function provideMotion(config: Partial<NgxMotionConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NGX_MOTION_CONFIG, useValue: { reducedMotion: 'user', ...config } },
  ]);
}
