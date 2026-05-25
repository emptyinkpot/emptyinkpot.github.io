import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const rootDir = process.cwd();
const remote = 'ubuntu@124.220.233.126';
const remoteTemp = '/tmp/myblog-dist-upload';
const remoteArchive = '/tmp/myblog-dist-upload.tgz';
const remoteSite = '/srv/myblog/site';
const distDir = 'apps/web/dist';
const localArchive = path.join(os.tmpdir(), `myblog-dist-${Date.now()}.tgz`);
const skipBuild = process.env.MYBLOG_DEPLOY_SKIP_BUILD === '1';

run('node', ['tools/deploy-guard.mjs']);

if (skipBuild) {
  const indexPath = path.join(rootDir, distDir, 'index.html');
  const collectionsPath = path.join(rootDir, distDir, 'collections', 'index.html');
  if (!fs.existsSync(indexPath) || !fs.existsSync(collectionsPath)) {
    console.error(`MYBLOG_DEPLOY_SKIP_BUILD=1 but ${distDir} is missing required files.`);
    process.exit(1);
  }
} else {
  fs.rmSync(path.join(rootDir, distDir), { recursive: true, force: true });
  run('npm', ['run', 'build']);
}

deployRemote();

console.log(`Deployed MyBlog static site to ${remote}:${remoteSite}`);

function deployRemote() {
  run('tar', ['-czf', localArchive, '-C', distDir, '.']);
  run('ssh', [remote, `rm -rf ${remoteTemp} ${remoteArchive} && mkdir -p ${remoteTemp}`]);
  run('scp', [localArchive, `${remote}:${remoteArchive}`]);
  run('ssh', [
    remote,
    [
      `tar -xzf ${remoteArchive} -C ${remoteTemp}`,
      `rm -f ${remoteArchive}`,
      `test -f ${remoteTemp}/index.html`,
      `test -f ${remoteTemp}/collections/index.html`,
      `rm -rf ${remoteTemp}/runtime`,
      `sudo mkdir -p ${remoteSite}/runtime`,
      `sudo find ${remoteSite} -mindepth 1 -maxdepth 1 ! -name runtime -exec rm -rf {} +`,
      `sudo rsync -a ${remoteTemp}/ ${remoteSite}/`,
      `test -f ${remoteSite}/index.html`,
      `test -f ${remoteSite}/collections/index.html`,
      `sudo chown -R www-data:www-data ${remoteSite}`,
      `sudo chown -R ubuntu:www-data ${remoteSite}/runtime`,
      `sudo chmod 775 ${remoteSite}/runtime`,
      `sudo find ${remoteSite}/runtime -type f -exec chmod 664 {} +`,
      `rm -rf ${remoteTemp}`
    ].join(' && ')
  ]);

  fs.rmSync(localArchive, { force: true });
}

function run(command, args) {
  const executable = process.platform === 'win32' && command === 'npm' ? 'cmd.exe' : command;
  const executableArgs =
    process.platform === 'win32' && command === 'npm'
      ? ['/d', '/s', '/c', ['npm', ...args].join(' ')]
      : args;
  const result = spawnSync(executable, executableArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    console.error(`Failed to run ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
