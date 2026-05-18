import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

const calloutTypes = new Set(['note', 'abstract', 'info', 'todo', 'tip', 'success', 'question', 'warning', 'failure', 'danger', 'bug', 'example', 'quote']);

export const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: false
};

export const markdownRehypePlugins = [rehypeSlug, rehypeObsidianCallouts, rehypeTableWrappers, [rehypePrettyCode, prettyCodeOptions]];

export async function renderMarkdownToHtml(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeObsidianCallouts)
    .use(rehypeTableWrappers)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
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
      const match = text.match(/^\[!(\w+)\]([+-])?\s*(.*)$/i);
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
