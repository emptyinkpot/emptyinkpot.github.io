import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  Boxes,
  CircleUserRound,
  Code2,
  ExternalLink,
  Library,
  Music2,
  Search,
  Settings,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type HomeCommand = {
  id: string;
  label: string;
  description: string;
  href?: string;
  action?: 'search';
  icon: string;
};

type HomeCommandPaletteProps = {
  commands: HomeCommand[];
};

const iconMap = {
  search: Search,
  posts: BookOpen,
  projects: Boxes,
  github: ExternalLink,
  books: Library,
  music: Music2,
  knowledge: Code2,
  settings: Settings,
  profile: CircleUserRound,
  external: ExternalLink
};

export default function HomeCommandPalette({ commands }: HomeCommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const safeCommands = useMemo(() => commands.filter((command) => command.href || command.action), [commands]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const runCommand = (command: HomeCommand) => {
    setOpen(false);

    if (command.action === 'search') {
      document.querySelector<HTMLElement>('[data-search-open]')?.click();
      return;
    }

    if (command.href) {
      window.location.href = command.href;
    }
  };

  return (
    <div className="home-command">
      <button className="home-command__trigger" type="button" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" size={15} />
        <span>Command</span>
        <kbd>Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="home-command__layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <button
              className="home-command__backdrop"
              type="button"
              aria-label="关闭命令面板"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="home-command__panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <Command label="Home Command Palette">
                <div className="home-command__input-row">
                  <Search aria-hidden="true" size={17} />
                  <Command.Input placeholder="跳转文章、项目工坊、书架、音乐、GitHub、Knowledge..." autoFocus />
                  <button type="button" aria-label="关闭" onClick={() => setOpen(false)}>
                    <X aria-hidden="true" size={16} />
                  </button>
                </div>

                <Command.List className="home-command__list">
                  <Command.Empty className="home-command__empty">没有匹配的入口。</Command.Empty>
                  <Command.Group heading="Content OS">
                    {safeCommands.map((command) => {
                      const Icon = iconMap[command.icon as keyof typeof iconMap] ?? ExternalLink;

                      return (
                        <Command.Item
                          key={command.id}
                          value={`${command.label} ${command.description}`}
                          onSelect={() => runCommand(command)}
                        >
                          <span className="home-command__icon">
                            <Icon aria-hidden="true" size={16} />
                          </span>
                          <span>
                            <strong>{command.label}</strong>
                            <small>{command.description}</small>
                          </span>
                          <em>{command.action === 'search' ? 'open' : 'go'}</em>
                        </Command.Item>
                      );
                    })}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
