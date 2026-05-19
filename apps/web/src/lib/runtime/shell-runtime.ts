import { LEGACY_RUNTIME_BRIDGES, RUNTIME_EVENT_NAMES } from '../../../../../packages/runtime-kernel/src/events';
import type { RuntimeCommandKind, RuntimeOverlayKind } from '../../../../../packages/runtime-kernel/src/types';

export const SHELL_RUNTIME_SOURCE = 'inline-runtime';

export type ShellRuntimeOverlayIntent = {
  overlay: RuntimeOverlayKind;
  payload: Record<string, unknown>;
  source?: string;
} | null;

export function createShellRuntimeOverlayDetail(
  overlay: RuntimeOverlayKind,
  payload: Record<string, unknown> = {},
  source = SHELL_RUNTIME_SOURCE
) {
  return {
    overlay,
    source,
    payload,
    issuedAt: new Date().toISOString()
  };
}

export function createShellRuntimeOverlayCloseDetail(overlay: RuntimeOverlayKind, source = SHELL_RUNTIME_SOURCE) {
  return {
    overlay,
    source,
    issuedAt: new Date().toISOString()
  };
}

export function mapShellRuntimeCommandToOverlayIntent(
  kind: RuntimeCommandKind,
  payload: Record<string, unknown> = {},
  source = SHELL_RUNTIME_SOURCE
): ShellRuntimeOverlayIntent {
  if (kind === 'openlist.open') {
    return { overlay: 'openlist', payload, source };
  }
  if (kind === 'pinterest.open') {
    return { overlay: 'pinterest', payload, source };
  }
  return null;
}

export const shellRuntimeEvents = RUNTIME_EVENT_NAMES;
export const shellLegacyRuntimeBridges = LEGACY_RUNTIME_BRIDGES;
