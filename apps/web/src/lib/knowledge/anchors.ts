import type { DomPathSelector, HighlightAnchor, TextPositionSelector, TextQuoteSelector } from './types';

export function normalizeAnchorText(input: string) {
  return input.replace(/\s+/g, ' ').trim();
}

export function hashText(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return String(hash);
}

export function collectTextNodes(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  return nodes;
}

export function getNodePath(root: Node, target: Node) {
  const path: number[] = [];
  let node: Node | null = target;

  while (node && node !== root && node.parentNode) {
    path.unshift(Array.from(node.parentNode.childNodes).indexOf(node));
    node = node.parentNode;
  }

  return path;
}

export function resolveNodePath(root: Node, path: number[]) {
  let node: Node | undefined = root;
  for (const index of path) {
    node = node.childNodes[index];
    if (!node) return null;
  }
  return node;
}

export function findRangeTextOffset(root: Node, target: Node, offset: number) {
  let cursor = 0;
  for (const node of collectTextNodes(root)) {
    if (node === target) return cursor + offset;
    cursor += node.nodeValue?.length ?? 0;
  }
  return cursor;
}

export function createHighlightAnchor(root: HTMLElement, range: Range): HighlightAnchor {
  const exact = range.toString();
  const fullText = root.textContent || '';
  const start = findRangeTextOffset(root, range.startContainer, range.startOffset);
  const end = start + exact.length;

  return {
    quote: {
      type: 'TextQuoteSelector',
      exact,
      prefix: fullText.slice(Math.max(0, start - 48), start),
      suffix: fullText.slice(end, Math.min(fullText.length, end + 48))
    },
    position: {
      type: 'TextPositionSelector',
      start,
      end
    },
    dom: {
      type: 'DomPathSelector',
      startPath: getNodePath(root, range.startContainer),
      startOffset: range.startOffset,
      endPath: getNodePath(root, range.endContainer),
      endOffset: range.endOffset
    },
    contentHash: hashText(normalizeAnchorText(fullText))
  };
}

export function createRangeFromTextOffsets(root: HTMLElement, position: TextPositionSelector) {
  const nodes = collectTextNodes(root);
  let cursor = 0;
  const range = document.createRange();
  let started = false;

  for (const node of nodes) {
    const textLength = node.nodeValue?.length ?? 0;
    const next = cursor + textLength;

    if (!started && position.start <= next) {
      range.setStart(node, Math.max(0, position.start - cursor));
      started = true;
    }

    if (started && position.end <= next) {
      range.setEnd(node, Math.max(0, position.end - cursor));
      return range;
    }

    cursor = next;
  }

  return null;
}

export function resolveByDomPath(root: HTMLElement, selector: DomPathSelector) {
  const startNode = resolveNodePath(root, selector.startPath);
  const endNode = resolveNodePath(root, selector.endPath);
  if (!startNode || !endNode) return null;

  try {
    const range = document.createRange();
    range.setStart(startNode, selector.startOffset);
    range.setEnd(endNode, selector.endOffset);
    return range;
  } catch {
    return null;
  }
}

export function resolveByQuote(root: HTMLElement, quote: TextQuoteSelector) {
  if (!quote.exact) return null;
  const text = root.textContent || '';
  const candidates: Array<{ start: number; end: number; score: number }> = [];
  let index = text.indexOf(quote.exact);

  while (index >= 0) {
    const end = index + quote.exact.length;
    const prefix = text.slice(Math.max(0, index - quote.prefix.length), index);
    const suffix = text.slice(end, end + quote.suffix.length);
    candidates.push({
      start: index,
      end,
      score: contextScore(prefix, quote.prefix) + contextScore(suffix, quote.suffix)
    });
    index = text.indexOf(quote.exact, index + 1);
  }

  const best = candidates.sort((a, b) => b.score - a.score)[0];
  return best ? createRangeFromTextOffsets(root, { type: 'TextPositionSelector', start: best.start, end: best.end }) : null;
}

export function resolveHighlight(root: HTMLElement, anchor: HighlightAnchor) {
  const currentHash = hashText(normalizeAnchorText(root.textContent || ''));
  if (currentHash === anchor.contentHash) {
    const byPosition = createRangeFromTextOffsets(root, anchor.position);
    if (byPosition) return byPosition;
  }

  return resolveByQuote(root, anchor.quote) || resolveByDomPath(root, anchor.dom);
}

function contextScore(actual: string, expected: string) {
  if (!expected) return 0.5;
  if (actual === expected) return 1;
  if (actual.endsWith(expected) || expected.endsWith(actual)) return 0.72;
  return 0;
}
