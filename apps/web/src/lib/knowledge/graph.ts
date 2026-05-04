import type { KnowledgeGraphLink, KnowledgeGraphNode } from './types';

export function buildRadialGraph(nodes: KnowledgeGraphNode[], links: KnowledgeGraphLink[]) {
  const levels = new Map<number, KnowledgeGraphNode[]>();

  for (const node of nodes) {
    levels.set(node.level, [...(levels.get(node.level) ?? []), node]);
  }

  const positioned = nodes.map((node) => {
    const ring = levels.get(node.level) ?? [];
    const index = ring.findIndex((item) => item.id === node.id);
    const count = Math.max(1, ring.length);
    const radius = [0, 140, 320, 520][node.level] ?? 680;
    const angle = (Math.PI * 2 * Math.max(0, index)) / count - Math.PI / 2;

    return {
      ...node,
      x: Number((Math.cos(angle) * radius).toFixed(2)),
      y: Number((Math.sin(angle) * radius).toFixed(2))
    };
  });

  return { nodes: positioned, links };
}
