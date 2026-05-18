import { useEffect, useState } from 'react';

type HomeNumberTickerProps = {
  value: number;
  suffix?: string;
};

export default function HomeNumberTicker({ value, suffix = '' }: HomeNumberTickerProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(value)) {
      setDisplay(0);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const totalFrames = 32;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 720, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      frame += 1;

      if (progress < 1 && frame < totalFrames + 8) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <span className="home-number-ticker">
      {display.toLocaleString('zh-CN')}
      {suffix}
    </span>
  );
}
