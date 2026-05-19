import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import { RUNTIME_STORAGE_KEYS } from '../../../../../packages/runtime-kernel/src/storage-keys.mjs';

const calloutTypes = new Set([
  'note',
  'abstract',
  'info',
  'todo',
  'tip',
  'success',
  'question',
  'warning',
  'failure',
  'danger',
  'bug',
  'example',
  'quote'
]);

export const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: false
};

export function defineMyBlogPlugin(plugin) {
  if (!plugin?.name) {
    throw new Error('MyBlog plugin must define a name');
  }

  return plugin;
}

export const myblogPlugins = [
  defineMyBlogPlugin({
    name: 'myblog-markdown-core',
    markdown: {
      rehypePlugins: [
        rehypeSlug,
        rehypeObsidianCallouts,
        rehypeTableWrappers,
        [rehypePrettyCode, prettyCodeOptions]
      ]
    }
  }),
  defineMyBlogPlugin({
    name: 'myblog-build-version-resource',
    resources: ({ buildVersion }) => ({
      head: [
        {
          id: 'myblog-build-version-reload',
          html: renderBuildVersionReloadScript(buildVersion)
        }
      ]
    })
  })
];

export function getMarkdownRehypePlugins(plugins = myblogPlugins) {
  return plugins.flatMap((plugin) => plugin.markdown?.rehypePlugins ?? []);
}

export function getMyBlogRuntimeResources(ctx = {}, plugins = myblogPlugins) {
  return plugins.reduce(
    (accumulator, plugin) => {
      const resources = plugin.resources?.(ctx) ?? {};
      accumulator.head.push(...(resources.head ?? []));
      accumulator.afterBody.push(...(resources.afterBody ?? []));
      return accumulator;
    },
    { head: [], afterBody: [] }
  );
}

function renderBuildVersionReloadScript(buildVersion) {
  return `<script>
(() => {
  const buildVersion = ${JSON.stringify(buildVersion)};
  const versionKey = ${JSON.stringify(RUNTIME_STORAGE_KEYS.buildVersion)};
  const reloadKey = \`${RUNTIME_STORAGE_KEYS.buildReloadPrefix}:\${buildVersion}\`;

  try {
    const previousVersion = localStorage.getItem(versionKey);
    const hasReloadedForVersion = sessionStorage.getItem(reloadKey) === '1';

    if (previousVersion && previousVersion !== buildVersion && !hasReloadedForVersion) {
      sessionStorage.setItem(reloadKey, '1');
      localStorage.setItem(versionKey, buildVersion);
      window.location.reload();
      return;
    }

    localStorage.setItem(versionKey, buildVersion);
  } catch {
    // Ignore storage failures so page rendering stays unaffected.
  }
})();
</script>`;
}

function rehypeTableWrappers() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || index === undefined || !parent) return;
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['prose-table-wrapper'] },
        children: [node]
      };
    });
  };
}

function rehypeObsidianCallouts() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return;
      const first = firstTextElement(node);
      if (!first) return;

      const text = toString(first);
      const markerLine = text.split(/\r?\n/, 1)[0] ?? '';
      const match = markerLine.match(/^\[!(\w+)\]([+-])?\s*(.*)$/i);
      if (!match) return;

      const type = normalizeCalloutType(match[1]);
      const title = match[3]?.trim() || titleCase(type);
      first.children = removeCalloutMarker(first.children);
      node.tagName = 'aside';
      node.properties = {
        ...(node.properties ?? {}),
        className: ['prose-callout', `prose-callout--${type}`],
        'data-callout': type
      };
      if (first.children.length === 0) {
        node.children = node.children.filter((child) => child !== first);
      }
      node.children.unshift({
        type: 'element',
        tagName: 'p',
        properties: { className: ['prose-callout__title'] },
        children: [{ type: 'text', value: title }]
      });
    });
  };
}

function firstTextElement(node) {
  return node.children.find((child) => child.type === 'element' && ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(child.tagName));
}

function removeCalloutMarker(children) {
  const next = [...children];
  const first = next[0];
  if (first?.type === 'text') {
    first.value = first.value.replace(/^\[!\w+\][+-]?\s*.*/i, '').trimStart();
    if (!first.value) next.shift();
  }
  return next;
}

function normalizeCalloutType(type) {
  const normalized = type.toLowerCase();
  if (calloutTypes.has(normalized)) return normalized;
  return 'note';
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
