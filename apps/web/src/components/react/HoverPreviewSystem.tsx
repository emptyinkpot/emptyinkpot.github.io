import { FloatingPortal, flip, offset, shift, useFloating } from '@floating-ui/react';
import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LEGACY_RUNTIME_BRIDGES, RUNTIME_EVENT_NAMES } from '../../../../../packages/runtime-kernel/src/events';
import { RUNTIME_STORAGE_KEYS } from '../../../../../packages/runtime-kernel/src/storage';

type HoverPayload = {
  type: string;
  id: string;
  title: string;
  summary?: string;
  image?: string;
  kicker?: string;
  meta?: string;
  accent?: string;
  tags: string[];
};

type PointerPoint = {
  x: number;
  y: number;
};

const openDelayMs = 120;
const closeDelayMs = 180;
const visualSettingsStorageKey = RUNTIME_STORAGE_KEYS.visualSettings;

function readHoverPreviewEnabled() {
  if (typeof window === 'undefined') return false;

  try {
    const settings = JSON.parse(localStorage.getItem(visualSettingsStorageKey) || '{}');
    return settings.interactions?.hoverPreview === true;
  } catch {
    return false;
  }
}

function createVirtualReference(point: PointerPoint) {
  return {
    getBoundingClientRect() {
      return {
        width: 0,
        height: 0,
        x: point.x,
        y: point.y,
        top: point.y,
        left: point.x,
        right: point.x,
        bottom: point.y
      };
    }
  };
}

function parseTags(value?: string) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
  } catch {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function readPayload(target: Element): HoverPayload | null {
  if (!(target instanceof HTMLElement)) return null;

  const title = target.dataset.hoverTitle?.trim();
  if (!title) return null;

  return {
    type: target.dataset.hoverType || 'preview',
    id: target.dataset.hoverId || title,
    title,
    summary: target.dataset.hoverSummary,
    image: target.dataset.hoverImage,
    kicker: target.dataset.hoverKicker,
    meta: target.dataset.hoverMeta,
    accent: target.dataset.hoverAccent,
    tags: parseTags(target.dataset.hoverTags)
  };
}

function getTypeLabel(type: string) {
  return (
    {
      post: '文章',
      note: '札记',
      project: '项目',
      book: '书籍',
      music: '音乐',
      github: 'GitHub',
      visual: '视觉素材',
      bilibili: 'Bilibili',
      update: '更新',
      tag: '标签'
    }[type] ?? '预览'
  );
}

export default function HoverPreviewSystem() {
  const [enabled, setEnabled] = useState(false);
  const [payload, setPayload] = useState<HoverPayload | null>(null);
  const latestPayload = useRef<HoverPayload | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const activeTarget = useRef<HTMLElement | null>(null);
  const latestPoint = useRef<PointerPoint>({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const { refs, floatingStyles, update } = useFloating({
    placement: 'right-start',
    transform: false,
    middleware: [offset(16), flip(), shift({ padding: 14 })]
  });

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const updateReference = useCallback(
    (point: PointerPoint) => {
      latestPoint.current = point;
      refs.setPositionReference(createVirtualReference(point));

      if (rafId.current) return;

      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;
        update();
      });
    },
    [refs, update]
  );

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();

    closeTimer.current = window.setTimeout(() => {
      setPayload(null);
      latestPayload.current = null;
      activeTarget.current = null;
    }, closeDelayMs);
  }, [clearCloseTimer, clearOpenTimer]);

  const keepOpen = useCallback(() => {
    clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(() => {
    setEnabled(readHoverPreviewEnabled());

    const onSettingsApplied = (event: Event) => {
      const settings = event instanceof CustomEvent ? event.detail : null;
      setEnabled(settings?.interactions?.hoverPreview === true);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === visualSettingsStorageKey) setEnabled(readHoverPreviewEnabled());
    };

    window.addEventListener(RUNTIME_EVENT_NAMES.contentSettingsApplied, onSettingsApplied);
    window.addEventListener(LEGACY_RUNTIME_BRIDGES.contentSettingsApplied, onSettingsApplied);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(RUNTIME_EVENT_NAMES.contentSettingsApplied, onSettingsApplied);
      window.removeEventListener(LEGACY_RUNTIME_BRIDGES.contentSettingsApplied, onSettingsApplied);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setPayload(null);
      latestPayload.current = null;
      activeTarget.current = null;
      clearOpenTimer();
      clearCloseTimer();
      return;
    }

    const openFromTarget = (target: HTMLElement, event: PointerEvent) => {
      const nextPayload = readPayload(target);
      if (!nextPayload) return;

      latestPayload.current = nextPayload;
      activeTarget.current = target;
      clearOpenTimer();
      clearCloseTimer();
      updateReference({ x: event.clientX, y: event.clientY });

      openTimer.current = window.setTimeout(() => {
        setPayload(latestPayload.current);
        updateReference(latestPoint.current);
      }, openDelayMs);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-hover-preview]') : null;
      if (!target || target === activeTarget.current) return;
      openFromTarget(target, event);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!activeTarget.current && !payload) return;
      updateReference({ x: event.clientX, y: event.clientY });
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-hover-preview]') : null;
      if (!target || target !== activeTarget.current) return;
      const related = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (related && target.contains(related)) return;
      scheduleClose();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPayload(null);
        latestPayload.current = null;
        activeTarget.current = null;
      }
    };

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerout', onPointerOut);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('keydown', onKeyDown);
      clearOpenTimer();
      clearCloseTimer();
      if (rafId.current) window.cancelAnimationFrame(rafId.current);
    };
  }, [clearCloseTimer, clearOpenTimer, enabled, payload, scheduleClose, updateReference]);

  useEffect(() => {
    if (!enabled || !payload) return;

    updateReference(latestPoint.current);
  }, [enabled, payload, updateReference]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {payload ? (
          <motion.article
            ref={refs.setFloating}
            className={`hover-preview-card hover-preview-card--${payload.type}`}
            style={
              {
                ...floatingStyles,
                '--hover-preview-accent': payload.accent || 'var(--heritage-purple)'
              } as CSSProperties
            }
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            onPointerEnter={keepOpen}
            onPointerLeave={scheduleClose}
          >
            {payload.image ? <img src={payload.image} alt="" /> : null}
            <div className="hover-preview-card__body">
              <p className="hover-preview-card__type">{payload.kicker || getTypeLabel(payload.type)}</p>
              <h3>{payload.title}</h3>
              {payload.summary ? <p className="hover-preview-card__summary">{payload.summary}</p> : null}
              {payload.meta ? <small>{payload.meta}</small> : null}
              {payload.tags.length ? (
                <div className="hover-preview-card__tags">
                  {payload.tags.slice(0, 5).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.article>
        ) : null}
      </AnimatePresence>
    </FloatingPortal>
  );
}
