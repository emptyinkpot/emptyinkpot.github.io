export type SealShape = 'circle' | 'square' | 'oval' | 'vertical' | 'ticket';

export type SealTexture = 'clean' | 'rough' | 'aged' | 'ink';

export type SealDefinition = {
  id: string;
  label: string;
  subLabel: string;
  color: string;
  shape: SealShape;
  texture: SealTexture;
  summary: string;
};

export const sealDefinitionStorageKey = 'emptyinkpot-seal-definitions';

export const defaultSealDefinitions: SealDefinition[] = [
  {
    id: 'selected',
    label: '精选',
    subLabel: 'SELECTED',
    color: '#9E2A2B',
    shape: 'circle',
    texture: 'aged',
    summary: '内容价值高，值得优先回访。'
  },
  {
    id: 'important',
    label: '重要',
    subLabel: 'IMPORTANT',
    color: '#6B2D5C',
    shape: 'circle',
    texture: 'ink',
    summary: '对系统或长期主题有关键意义。'
  },
  {
    id: 'insight',
    label: '洞见',
    subLabel: 'INSIGHT',
    color: '#2F5D50',
    shape: 'square',
    texture: 'rough',
    summary: '包含可复用观点或推理。'
  },
  {
    id: 'unfinished',
    label: '未完',
    subLabel: 'DRAFT',
    color: '#6B645C',
    shape: 'vertical',
    texture: 'clean',
    summary: '仍需补写、重构或验证。'
  },
  {
    id: 'reread',
    label: '重读',
    subLabel: 'REREAD',
    color: '#C9A227',
    shape: 'oval',
    texture: 'aged',
    summary: '适合复盘和周期性重读。'
  },
  {
    id: 'archive',
    label: '归档',
    subLabel: 'ARCHIVE',
    color: '#3A3A3A',
    shape: 'ticket',
    texture: 'rough',
    summary: '保留历史价值，降低当前优先级。'
  },
  {
    id: 'done',
    label: '完成',
    subLabel: 'DONE',
    color: '#2F5D50',
    shape: 'circle',
    texture: 'aged',
    summary: '任务或阅读已经闭环。'
  },
  {
    id: 'canon',
    label: '正典',
    subLabel: 'CANON',
    color: '#6B2D5C',
    shape: 'ticket',
    texture: 'ink',
    summary: '被纳入长期知识体系的核心材料。'
  }
];
