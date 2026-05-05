import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  Clock3,
  Code2,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  GitCommitHorizontal,
  LayoutDashboard,
  Search,
  Users,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ProjectCommand = {
  id: string;
  label: string;
  description: string;
  href: string;
  kind: 'internal' | 'external';
  icon: string;
};

type ProjectWorkbenchCommandProps = {
  commands: ProjectCommand[];
};

const iconMap = {
  dashboard: LayoutDashboard,
  wiki: BookOpen,
  timeline: Clock3,
  modules: Code2,
  issues: GitBranch,
  pulls: GitPullRequest,
  commits: GitCommitHorizontal,
  contributors: Users,
  github: ExternalLink
};

export default function ProjectWorkbenchCommand({ commands }: ProjectWorkbenchCommandProps) {
  const [open, setOpen] = useState(false);
  const safeCommands = useMemo(() => commands.filter((command) => command.href), [commands]);

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

  const runCommand = (command: ProjectCommand) => {
    setOpen(false);

    if (command.kind === 'external') {
      window.open(command.href, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.hash = command.href;
  };

  return (
    <div className="project-command">
      <button className="project-command__trigger" type="button" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" size={15} />
        <span>Command</span>
        <kbd>Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="project-command__layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <button
              className="project-command__backdrop"
              type="button"
              aria-label="关闭命令面板"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="project-command__panel"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <Command label="Project Workbench Command">
                <div className="project-command__input-row">
                  <Search aria-hidden="true" size={17} />
                  <Command.Input placeholder="跳转到 Wiki、Issues、Commits 或 GitHub 编辑..." autoFocus />
                  <button type="button" aria-label="关闭" onClick={() => setOpen(false)}>
                    <X aria-hidden="true" size={16} />
                  </button>
                </div>

                <Command.List className="project-command__list">
                  <Command.Empty className="project-command__empty">没有匹配的工作台命令。</Command.Empty>
                  <Command.Group heading="Project Workbench">
                    {safeCommands.map((command) => {
                      const Icon = iconMap[command.icon as keyof typeof iconMap] ?? LayoutDashboard;

                      return (
                        <Command.Item
                          key={command.id}
                          value={`${command.label} ${command.description}`}
                          onSelect={() => runCommand(command)}
                        >
                          <span className="project-command__icon">
                            <Icon aria-hidden="true" size={16} />
                          </span>
                          <span>
                            <strong>{command.label}</strong>
                            <small>{command.description}</small>
                          </span>
                          <em>{command.kind === 'external' ? 'open' : 'jump'}</em>
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
