import type { BookItem } from '../lib/books/types';

export const books: BookItem[] = [
  {
    id: 'nndl-book',
    title: '神经网络与深度学习',
    author: '邱锡鹏',
    status: 'reading',
    statusLabel: '在读',
    note: '作为 AI 工具链和模型理解的基础阅读，当前通过 OpenList PDF 文件进入 reader。',
    category: '技术',
    tags: ['AI', '深度学习', 'PDF'],
    sourceType: 'pdf',
    openlistPath: '/夸克网盘/来自：分享/一周热点72分享/nndl-book.pdf',
    description: '用于补齐神经网络、训练范式和深度学习基础概念的长期参考书。'
  },
  {
    id: 'future-of-jobs-2025',
    title: 'Future of Jobs Report 2025',
    author: 'World Economic Forum',
    status: 'planned',
    statusLabel: '想读',
    note: '跟踪职业结构、AI 影响和技能迁移趋势的年度报告。',
    category: '报告',
    tags: ['AI', '职业', 'PDF'],
    sourceType: 'pdf',
    openlistPath: '/夸克网盘/来自：分享/一周热点72分享/WEF_Future_of_Jobs_Report_2025.pdf',
    description: '从宏观就业结构观察 AI 和自动化对知识工作流的影响。'
  },
  {
    id: 'kaoyan-english-vocabulary',
    title: '考研英语阅读高频词汇整理',
    author: 'OpenList 文档库',
    status: 'planned',
    statusLabel: '想读',
    note: '从 OpenList 真实文件源接入，用来验证书架、PDF reader 和阅读进度链路。',
    category: '英语',
    tags: ['英语', '词汇', 'PDF'],
    sourceType: 'pdf',
    openlistPath: '/夸克网盘/来自：分享/02.英语历年真题/考研英语阅读高频词汇整理.pdf',
    description: '作为轻量 PDF 样例，验证私有阅读系统的文件读取和进度保存。'
  }
];
