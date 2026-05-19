import { RUNTIME_EVENT_NAMES } from '../../../../../packages/runtime-kernel/src/events';
import type {
  RuntimeCommand,
  RuntimeCommandKind,
  RuntimeDrawerIntent,
  RuntimeDrawerKind,
  RuntimeOverlayIntent,
  RuntimeOverlayKind
} from '../../../../../packages/runtime-kernel/src/types';

export type RuntimeCapabilityAction = 'search' | 'openlist' | 'pinterest';

type RuntimeDispatchOptions = {
  source?: string;
  payload?: Record<string, unknown>;
  legacyTarget?: EventTarget | null;
};

export function dispatchRuntimeCommand(kind: RuntimeCommandKind, options: RuntimeDispatchOptions = {}) {
  if (typeof window === 'undefined') return;

  const detail: RuntimeCommand = {
    kind,
    source: options.source ?? 'react-island',
    payload: options.payload,
    issuedAt: new Date().toISOString()
  };

  window.dispatchEvent(new CustomEvent(RUNTIME_EVENT_NAMES.command, { detail }));
}

export function runRuntimeCapabilityAction(action: RuntimeCapabilityAction, options: RuntimeDispatchOptions = {}) {
  switch (action) {
    case 'search':
      dispatchRuntimeCommand('search.open', options);
      return;
    case 'openlist':
      dispatchRuntimeCommand('openlist.open', options);
      return;
    case 'pinterest':
      dispatchRuntimeCommand('pinterest.open', options);
      return;
  }
}

export function dispatchRuntimeOverlayOpen(overlay: RuntimeOverlayKind, options: RuntimeDispatchOptions = {}) {
  dispatchRuntimeOverlay(RUNTIME_EVENT_NAMES.overlayOpen, overlay, options);
}

export function dispatchRuntimeOverlayClose(overlay: RuntimeOverlayKind, options: RuntimeDispatchOptions = {}) {
  dispatchRuntimeOverlay(RUNTIME_EVENT_NAMES.overlayClose, overlay, options);
}

export function dispatchRuntimeDrawerOpen(
  drawer: RuntimeDrawerKind,
  objectId: string,
  objectType: RuntimeDrawerIntent['objectType'] = 'knowledge-object',
  options: RuntimeDispatchOptions = {}
) {
  if (typeof window === 'undefined') return;

  const detail: RuntimeDrawerIntent = {
    drawer,
    objectId,
    objectType,
    source: options.source ?? 'react-island',
    payload: options.payload,
    issuedAt: new Date().toISOString()
  };

  window.dispatchEvent(new CustomEvent(RUNTIME_EVENT_NAMES.drawerOpen, { detail }));
}

export function dispatchRuntimeDrawerClose(drawer: RuntimeDrawerKind, options: RuntimeDispatchOptions = {}) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(RUNTIME_EVENT_NAMES.drawerClose, {
      detail: {
        drawer,
        source: options.source ?? 'react-island',
        payload: options.payload,
        issuedAt: new Date().toISOString()
      }
    })
  );
}

export function openRuntimeReader(objectId: string, options: RuntimeDispatchOptions = {}) {
  dispatchRuntimeCommand('reader.open', {
    ...options,
    payload: {
      ...options.payload,
      objectId,
      highlightId: options.payload?.highlightId
    }
  });
  dispatchRuntimeDrawerOpen('article', objectId, 'knowledge-object', options);
}

export function closeRuntimeReader(options: RuntimeDispatchOptions = {}) {
  dispatchRuntimeCommand('reader.close', options);
  dispatchRuntimeDrawerClose('article', options);
}

export function focusRuntimeGraphNode(nodeId: string, options: RuntimeDispatchOptions = {}) {
  dispatchRuntimeCommand('graph.focus', {
    ...options,
    payload: {
      ...options.payload,
      nodeId
    }
  });
}

export function dispatchLegacyRuntimeBridge(name: string, legacyTarget?: EventTarget | null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail: { target: legacyTarget ?? null } }));
}

function dispatchRuntimeOverlay(name: string, overlay: RuntimeOverlayKind, options: RuntimeDispatchOptions = {}) {
  if (typeof window === 'undefined') return;

  const detail: RuntimeOverlayIntent = {
    overlay,
    source: options.source ?? 'react-island',
    payload: options.payload,
    issuedAt: new Date().toISOString()
  };

  window.dispatchEvent(new CustomEvent(name, { detail }));
}
