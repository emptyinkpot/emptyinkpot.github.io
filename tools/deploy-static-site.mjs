import { spawnSync } from 'node:child_process';
const rootDir = process.cwd();
const remote = 'ubuntu@124.220.233.126';
const remoteTemp = '/tmp/myblog-dist-upload';
const remoteSite = '/srv/myblog/site';
const distDot = 'apps/web/dist/.';

run('node', ['tools/deploy-guard.mjs']);
run('npm', ['run', 'build']);
run('ssh', [remote, `rm -rf ${remoteTemp} && mkdir -p ${remoteTemp}`]);
run('scp', ['-r', distDot, `${remote}:${remoteTemp}`]);
run('ssh', [
  remote,
  `sudo rm -rf ${remoteSite}/* && sudo cp -r ${remoteTemp}/. ${remoteSite}/ && sudo chown -R www-data:www-data ${remoteSite} && rm -rf ${remoteTemp}`
]);

console.log(`Deployed MyBlog static site to ${remote}:${remoteSite}`);

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
