import type {
  RuntimeCommandKind,
  RuntimeDrawerKind,
  RuntimeOverlayKind,
  RuntimeStorageContract
} from './types';

export type RuntimePluginScope =
  | 'content'
  | 'surface'
  | 'command'
  | 'overlay'
  | 'drawer'
  | 'storage'
  | 'resource';

export type RuntimePluginManifest = {
  id: string;
  name: string;
  version: string;
  scopes: RuntimePluginScope[];
};

export type RuntimePluginContribution = {
  commands?: RuntimeCommandKind[];
  overlays?: RuntimeOverlayKind[];
  drawers?: RuntimeDrawerKind[];
  storage?: RuntimeStorageContract[];
  resources?: string[];
};

export type RuntimePlugin<TContext = unknown> = {
  manifest: RuntimePluginManifest;
  contributes?: RuntimePluginContribution;
  setup?: (context: TContext) => void | Promise<void>;
};

export type RuntimePluginRegistry<TContext = unknown> = {
  plugins: RuntimePlugin<TContext>[];
  contributions: RuntimePluginContribution;
};

export function defineRuntimePlugin<TContext = unknown>(plugin: RuntimePlugin<TContext>): RuntimePlugin<TContext> {
  validateRuntimePlugin(plugin);
  return plugin;
}

export function createRuntimePluginRegistry<TContext = unknown>(
  plugins: RuntimePlugin<TContext>[] = []
): RuntimePluginRegistry<TContext> {
  plugins.forEach(validateRuntimePlugin);
  return {
    plugins,
    contributions: collectRuntimePluginContributions(plugins)
  };
}

export function collectRuntimePluginContributions<TContext = unknown>(
  plugins: RuntimePlugin<TContext>[]
): RuntimePluginContribution {
  return plugins.reduce<RuntimePluginContribution>(
    (accumulator, plugin) => {
      accumulator.commands?.push(...(plugin.contributes?.commands ?? []));
      accumulator.overlays?.push(...(plugin.contributes?.overlays ?? []));
      accumulator.drawers?.push(...(plugin.contributes?.drawers ?? []));
      accumulator.storage?.push(...(plugin.contributes?.storage ?? []));
      accumulator.resources?.push(...(plugin.contributes?.resources ?? []));
      return accumulator;
    },
    {
      commands: [],
      overlays: [],
      drawers: [],
      storage: [],
      resources: []
    }
  );
}

function validateRuntimePlugin<TContext = unknown>(plugin: RuntimePlugin<TContext>) {
  if (!plugin?.manifest?.id) {
    throw new Error('Runtime plugin must define manifest.id');
  }
  if (!plugin.manifest.name) {
    throw new Error(`Runtime plugin ${plugin.manifest.id} must define manifest.name`);
  }
  if (!plugin.manifest.version) {
    throw new Error(`Runtime plugin ${plugin.manifest.id} must define manifest.version`);
  }
  if (!plugin.manifest.scopes?.length) {
    throw new Error(`Runtime plugin ${plugin.manifest.id} must declare at least one scope`);
  }
}
