import { LEGACY_RUNTIME_BRIDGES, RUNTIME_EVENT_NAMES } from '../../../../../packages/runtime-kernel/src/events';
import type { RuntimeCommandKind, RuntimeDrawerKind, RuntimeOverlayKind } from '../../../../../packages/runtime-kernel/src/types';

export const HOME_RUNTIME_SOURCE = 'inline-runtime';

export type HomeRuntimeReaderCommand =
  | { type: 'openArticle'; articleId?: string }
  | { type: 'openHighlight'; articleId?: string; highlightId?: string }
  | { type: 'searchTag'; tag?: string }
  | { type: 'focusGraphNode'; nodeId?: string };

export type HomeRuntimeReaderCommandIntent = {
  kind: RuntimeCommandKind;
  payload: Record<string, unknown>;
} | null;

export function createRuntimeCommandDetail(
  kind: RuntimeCommandKind,
  payload: Record<string, unknown> = {},
  source = HOME_RUNTIME_SOURCE
) {
  return {
    kind,
    source,
    payload,
    issuedAt: new Date().toISOString()
  };
}

export function createRuntimeOverlayDetail(
  overlay: RuntimeOverlayKind,
  payload: Record<string, unknown> = {},
  source = HOME_RUNTIME_SOURCE
) {
  return {
    overlay,
    source,
    payload,
    issuedAt: new Date().toISOString()
  };
}

export function createRuntimeDrawerOpenDetail(
  drawer: RuntimeDrawerKind,
  objectId: string,
  objectType = 'knowledge-object',
  payload: Record<string, unknown> = {},
  source = HOME_RUNTIME_SOURCE
) {
  return {
    drawer,
    objectId,
    objectType,
    source,
    payload,
    issuedAt: new Date().toISOString()
  };
}

export function createRuntimeDrawerCloseDetail(drawer: RuntimeDrawerKind, source = HOME_RUNTIME_SOURCE) {
  return {
    drawer,
    source,
    issuedAt: new Date().toISOString()
  };
}

export function mapLegacyReaderCommandToRuntimeIntent(command: HomeRuntimeReaderCommand): HomeRuntimeReaderCommandIntent {
  if (command.type === 'openArticle' && command.articleId) {
    return { kind: 'reader.open', payload: { objectId: command.articleId } };
  }
  if (command.type === 'openHighlight' && command.articleId) {
    return { kind: 'reader.open', payload: { objectId: command.articleId, highlightId: command.highlightId } };
  }
  if (command.type === 'searchTag' && command.tag) {
    return { kind: 'search.open', payload: { query: command.tag, tag: command.tag, kind: 'all' } };
  }
  if (command.type === 'focusGraphNode' && command.nodeId) {
    return { kind: 'graph.focus', payload: { nodeId: command.nodeId } };
  }
  return null;
}

export const homeRuntimeEvents = RUNTIME_EVENT_NAMES;
export const homeLegacyRuntimeBridges = LEGACY_RUNTIME_BRIDGES;
