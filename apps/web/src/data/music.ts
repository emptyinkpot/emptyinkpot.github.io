import { withBase } from '../lib/site';

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  platform: 'netease' | 'spotify' | 'bilibili' | 'local';
  href?: string;
  mood: string[];
  note: string;
}

export const musicItems: MusicItem[] = [
  {
    id: 'night-writing',
    title: 'Night Writing Loop',
    artist: 'Local playlist',
    album: 'Writing desk',
    cover: withBase('/images/branding/vita-atramenti-logo.png'),
    platform: 'local',
    href: withBase('/music/'),
    mood: ['night', 'writing'],
    note: '适合写长文和整理系统设计时循环播放的夜间歌单占位。'
  },
  {
    id: 'build-focus',
    title: 'Build Focus',
    artist: 'Instrumental set',
    album: 'Engineering flow',
    cover: withBase('/images/branding/vita-atramenti-logo.png'),
    platform: 'local',
    href: withBase('/music/'),
    mood: ['focus', 'coding'],
    note: '偏低干扰的工程专注音乐，先作为本地数据示例。'
  },
  {
    id: 'archive-air',
    title: 'Archive Air',
    artist: 'Ambient notes',
    album: 'Evidence library',
    cover: withBase('/images/branding/vita-atramenti-logo.png'),
    platform: 'local',
    href: withBase('/music/'),
    mood: ['ambient', 'archive'],
    note: '适合史料库、长文阅读和视频脚本整理的氛围向条目。'
  }
];
