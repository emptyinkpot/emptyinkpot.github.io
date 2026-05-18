export const runtimeExperienceTokens = {
  motion: {
    fast: '120ms',
    base: '180ms',
    slow: '260ms',
    continuity: '420ms',
    standardEase: 'cubic-bezier(.2, 0, .2, 1)',
    springEase: 'cubic-bezier(.16, 1, .3, 1)'
  },
  depth: {
    canvas: 0,
    surface: 10,
    raised: 30,
    floating: 80,
    overlay: 120,
    command: 160,
    immersive: 200
  },
  elevation: {
    surface: '0 1px 0 rgba(0, 0, 0, 0.04)',
    raised: '0 10px 28px rgba(30, 27, 24, 0.08)',
    floating: '0 18px 44px rgba(30, 27, 24, 0.12)',
    overlay: '0 28px 80px rgba(30, 27, 24, 0.18)',
    active: '0 0 0 3px rgba(47, 93, 80, 0.1)'
  },
  focus: {
    ring: 'rgba(47, 93, 80, 0.42)',
    width: '2px',
    offset: '3px'
  },
  surface: {
    backdrop: 'rgba(30, 27, 24, 0.34)',
    panel: 'rgba(255, 255, 255, 0.86)',
    border: 'rgba(92, 77, 61, 0.18)',
    blur: '24px'
  }
} as const;

export type RuntimeExperienceTokens = typeof runtimeExperienceTokens;
