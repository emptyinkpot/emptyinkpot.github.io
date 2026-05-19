import type { KnowledgeGraphLink, KnowledgeGraphNode } from './types';

const clusterSectors: Record<string, [number, number]> = {
  writing: [-150, -60],
  engineering: [-40, 40],
  reading: [55, 130],
  media: [140, 205],
  visual: [215, 275],
  github: [285, 335],
  archive: [345, 405]
};

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

export function buildClusteredRadialGraph(nodes: KnowledgeGraphNode[], links: KnowledgeGraphLink[]) {
  const clusterGroups = new Map<string, KnowledgeGraphNode[]>();

  for (const node of nodes) {
    if (node.level <= 0) continue;
    const cluster = node.cluster ?? 'archive';
    clusterGroups.set(cluster, [...(clusterGroups.get(cluster) ?? []), node]);
  }

  const positioned = nodes.map((node) => {
    if (node.level === 0) return { ...node, x: 0, y: 0 };

    const cluster = node.cluster ?? 'archive';
    const group = clusterGroups.get(cluster) ?? [];
    const levelGroup = group.filter((item) => item.level === node.level);
    const index = Math.max(0, levelGroup.findIndex((item) => item.id === node.id));
    const count = Math.max(1, levelGroup.length);
    const [start, end] = clusterSectors[cluster] ?? [0, 360];
    const angleDeg = start + ((end - start) * (index + 0.5)) / count;
    const angle = (angleDeg * Math.PI) / 180;
    const radius = [0, 150, 340, 540][node.level] ?? 680;

    return {
      ...node,
      x: Number((Math.cos(angle) * radius).toFixed(2)),
      y: Number((Math.sin(angle) * radius).toFixed(2))
    };
  });

  return { nodes: positioned, links };
}
