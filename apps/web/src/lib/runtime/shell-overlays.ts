import {
  createShellRuntimeOverlayCloseDetail,
  createShellRuntimeOverlayDetail,
  mapShellRuntimeCommandToOverlayIntent,
  shellLegacyRuntimeBridges,
  shellRuntimeEvents
} from './shell-runtime';

type RuntimeEventDetail = {
  kind?: string;
  overlay?: string;
  payload?: Record<string, unknown>;
  source?: string;
  target?: EventTarget | null;
};

type PinterestShellImage = {
  image?: string;
  previewUrl?: string;
  source?: string;
  title?: string;
};

type PinterestShellCollection = {
  images?: PinterestShellImage[];
  source?: string;
  title?: string;
};

type PinterestShellPin = PinterestShellImage & {
  collectionTitle?: string;
};

type PinterestShellSource = {
  activeItems?: number;
  id?: string;
  provider?: string;
  syncStatus?: string;
  syncedItems?: number;
  type?: string;
};

function getDetail(event: Event): RuntimeEventDetail | undefined {
  return event instanceof CustomEvent ? (event.detail as RuntimeEventDetail | undefined) : undefined;
}

function initOpenListShell() {
  const layer = document.querySelector('[data-openlist-layer]');
  const frame = document.querySelector('[data-openlist-frame]');
  if (!layer || !(frame instanceof HTMLIFrameElement)) return;

  let closeTimer = 0;
  let lastFocused: Element | null = null;
  const transitionMs = 180;
  let frameObserver: MutationObserver | null = null;

  const hideOpenListLogin = () => {
    let frameDocument: Document | null | undefined;
    try {
      frameDocument = frame.contentDocument;
    } catch {
      return;
    }
    if (!frameDocument?.head || !frameDocument.body) return;

    let style = frameDocument.getElementById('emptyinkpot-openlist-embed-style');
    if (!style) {
      style = frameDocument.createElement('style');
      style.id = 'emptyinkpot-openlist-embed-style';
      style.textContent = `
        a[href$="/@login"],
        a[href$="@login"],
        a[href*="/@login"] {
          display: none !important;
        }
      `;
      frameDocument.head.appendChild(style);
    }

    const hideLoginLinks = () => {
      frameDocument.querySelectorAll('a[href$="/@login"], a[href$="@login"], a[href*="/@login"]').forEach((link) => {
        const previous = link.previousSibling;
        if (previous?.nodeType === Node.TEXT_NODE && previous.textContent?.trim() === '|') {
          previous.textContent = '';
        }
        link.parentNode?.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === '|') {
            node.textContent = '';
          }
        });
        link.setAttribute('aria-hidden', 'true');
        link.setAttribute('tabindex', '-1');
        (link as HTMLElement).hidden = true;
      });

      const separators: Node[] = [];
      const walker = frameDocument.createTreeWalker(frameDocument.body, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        if (node.textContent?.trim() === '|') {
          separators.push(node);
        }
        node = walker.nextNode();
      }
      separators.forEach((separator) => {
        separator.textContent = '';
      });
    };

    hideLoginLinks();
    frameObserver?.disconnect();
    frameObserver = new MutationObserver(hideLoginLinks);
    frameObserver.observe(frameDocument.body, { childList: true, subtree: true });
  };

  const open = (trigger?: EventTarget | null) => {
    window.clearTimeout(closeTimer);
    lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
    if (!frame.getAttribute('src')) {
      frame.setAttribute('src', frame.dataset.src || '/openlist/');
    } else {
      hideOpenListLogin();
    }
    (layer as HTMLElement).hidden = false;
    document.body.classList.add('has-openlist-embed');
    requestAnimationFrame(() => {
      layer.classList.add('is-open');
      layer.querySelector<HTMLElement>('[data-openlist-close]')?.focus({ preventScroll: true });
    });
  };

  const close = () => {
    layer.classList.remove('is-open');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      (layer as HTMLElement).hidden = true;
      document.body.classList.remove('has-openlist-embed');
      if (lastFocused instanceof HTMLElement) {
        lastFocused.focus({ preventScroll: true });
      }
    }, transitionMs);
  };

  const dispatchOverlayOpen = (payload: Record<string, unknown> = {}, source = 'inline-runtime') => {
    window.dispatchEvent(
      new CustomEvent(shellRuntimeEvents.overlayOpen, {
        detail: createShellRuntimeOverlayDetail('openlist', payload, source)
      })
    );
  };

  const dispatchOverlayClose = () => {
    window.dispatchEvent(
      new CustomEvent(shellRuntimeEvents.overlayClose, {
        detail: createShellRuntimeOverlayCloseDetail('openlist')
      })
    );
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-openlist-embed-open]') : null;
    if (!trigger) return;
    event.preventDefault();
    dispatchOverlayOpen({ trigger });
  });

  document.querySelectorAll('[data-openlist-close]').forEach((button) => {
    button.addEventListener('click', dispatchOverlayClose);
  });

  frame.addEventListener('load', hideOpenListLogin);
  window.addEventListener(shellLegacyRuntimeBridges.openListEmbedOpen, (event) => open(getDetail(event)?.target ?? event.target));
  window.addEventListener(shellRuntimeEvents.overlayOpen, (event) => {
    const detail = getDetail(event);
    if (detail?.overlay === 'openlist') open(detail?.payload?.trigger ?? event.target);
  });
  window.addEventListener(shellRuntimeEvents.overlayClose, (event) => {
    const detail = getDetail(event);
    if (detail?.overlay === 'openlist') close();
  });
  window.addEventListener(shellRuntimeEvents.command, (event) => {
    const detail = getDetail(event);
    const intent = mapShellRuntimeCommandToOverlayIntent(
      detail?.kind,
      detail?.payload || {},
      detail?.source || 'inline-runtime'
    );
    if (intent?.overlay === 'openlist') dispatchOverlayOpen(intent.payload, intent.source);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !(layer as HTMLElement).hidden) {
      dispatchOverlayClose();
    }
  });
}

function initPinterestShell() {
  const layer = document.querySelector('[data-pinterest-layer]');
  const board = document.querySelector('[data-pinterest-shell-board]');
  const status = document.querySelector('[data-pinterest-shell-status]');
  const sourceStatus = document.querySelector('[data-pinterest-shell-source]');
  if (!layer || !board) return;

  let closeTimer = 0;
  let lastFocused: Element | null = null;
  let hydrated = false;
  const transitionMs = 180;

  const setStatus = (text: string) => {
    if (status) status.textContent = text;
  };

  const setSourceStatus = (text: string) => {
    if (sourceStatus) sourceStatus.textContent = text;
  };

  const escapeHtml = (value: unknown) =>
    String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');

  const renderCollections = (collections: unknown) => {
    const pinterestCollections: PinterestShellCollection[] = Array.isArray(collections)
      ? collections.filter((collection): collection is PinterestShellCollection => collection?.source === 'pinterest')
      : [];
    const pins = pinterestCollections.flatMap((collection) =>
      Array.isArray(collection.images)
        ? collection.images.map((item) => ({ ...item, collectionTitle: collection.title }))
        : []
    );
    if (!pins.length) {
      board.innerHTML = '<p class="pinterest-shell-empty">当前没有可展示的 Pinterest 镜像。请先运行 visual sync。</p>';
      setStatus('0 pins');
      return;
    }
    board.innerHTML = pins
      .map((item: PinterestShellPin) => {
        const image = item.previewUrl || item.image || '';
        return `
          <article class="pinterest-shell-pin" data-pinterest-shell-pin>
            <img src="${escapeHtml(image)}" alt="" loading="lazy" />
            <div>
              <strong>${escapeHtml(item.title || 'Pinterest Pin')}</strong>
              <small>${escapeHtml(item.collectionTitle || item.source || 'Pinterest')}</small>
            </div>
          </article>
        `;
      })
      .join('');
    setStatus(`${pins.length} pins`);
  };

  const renderSourceStatus = (sources: unknown) => {
    const pinterestSource = Array.isArray(sources)
      ? sources.find((source: PinterestShellSource) => String(source?.type || '').includes('pinterest') || String(source?.id || '').includes('pinterest'))
      : null;
    if (!pinterestSource) {
      setSourceStatus('当前显示的是本地镜像快照，不是 Pinterest 官方页面。');
      return;
    }
    const count = pinterestSource.activeItems ?? pinterestSource.syncedItems ?? 0;
    const provider = pinterestSource.provider ? ` / ${pinterestSource.provider}` : '';
    const state = pinterestSource.syncStatus ? ` / ${pinterestSource.syncStatus}` : '';
    setSourceStatus(`当前镜像源：${count} pins${provider}${state}。如果 Pinterest 账号里更多，说明上游 browser/session/API 只同步到了这部分。`);
  };

  const hydrateSnapshot = async () => {
    if (hydrated) return;
    hydrated = true;
    setStatus('同步镜像');
    try {
      const response = await fetch('/api/runtime/visuals/snapshot', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`snapshot ${response.status}`);
      const payload = await response.json();
      renderCollections(payload.collections);
      renderSourceStatus(payload.sources);
    } catch {
      try {
        const seed = JSON.parse(document.getElementById('pinterest-shell-seed')?.textContent || '{"collections":[]}');
        renderCollections(seed.collections);
        renderSourceStatus(seed.sources);
        setStatus('构建期镜像');
      } catch {
        setStatus('镜像不可用');
      }
    }
  };

  const open = (trigger?: EventTarget | null) => {
    window.clearTimeout(closeTimer);
    lastFocused = trigger instanceof HTMLElement ? trigger : document.activeElement;
    (layer as HTMLElement).hidden = false;
    document.body.classList.add('has-openlist-embed', 'has-pinterest-embed');
    hydrateSnapshot();
    requestAnimationFrame(() => {
      layer.classList.add('is-open');
      layer.querySelector<HTMLElement>('[data-pinterest-close]')?.focus({ preventScroll: true });
    });
  };

  const close = () => {
    layer.classList.remove('is-open');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => {
      (layer as HTMLElement).hidden = true;
      document.body.classList.remove('has-openlist-embed', 'has-pinterest-embed');
      if (lastFocused instanceof HTMLElement) {
        lastFocused.focus({ preventScroll: true });
      }
    }, transitionMs);
  };

  const dispatchOverlayOpen = (payload: Record<string, unknown> = {}, source = 'inline-runtime') => {
    window.dispatchEvent(
      new CustomEvent(shellRuntimeEvents.overlayOpen, {
        detail: createShellRuntimeOverlayDetail('pinterest', payload, source)
      })
    );
  };

  const dispatchOverlayClose = () => {
    window.dispatchEvent(
      new CustomEvent(shellRuntimeEvents.overlayClose, {
        detail: createShellRuntimeOverlayCloseDetail('pinterest')
      })
    );
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-pinterest-embed-open]') : null;
    if (!trigger) return;
    event.preventDefault();
    dispatchOverlayOpen({ trigger });
  });

  document.querySelectorAll('[data-pinterest-close]').forEach((button) => {
    button.addEventListener('click', dispatchOverlayClose);
  });

  window.addEventListener(shellLegacyRuntimeBridges.pinterestEmbedOpen, (event) => open(getDetail(event)?.target ?? event.target));
  window.addEventListener(shellRuntimeEvents.overlayOpen, (event) => {
    const detail = getDetail(event);
    if (detail?.overlay === 'pinterest') open(detail?.payload?.trigger ?? event.target);
  });
  window.addEventListener(shellRuntimeEvents.overlayClose, (event) => {
    const detail = getDetail(event);
    if (detail?.overlay === 'pinterest') close();
  });
  window.addEventListener(shellRuntimeEvents.command, (event) => {
    const detail = getDetail(event);
    const intent = mapShellRuntimeCommandToOverlayIntent(
      detail?.kind,
      detail?.payload || {},
      detail?.source || 'inline-runtime'
    );
    if (intent?.overlay === 'pinterest') dispatchOverlayOpen(intent.payload, intent.source);
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !(layer as HTMLElement).hidden) {
      dispatchOverlayClose();
    }
  });
}

initOpenListShell();
initPinterestShell();
