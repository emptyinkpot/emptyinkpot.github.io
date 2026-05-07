import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const rootDir = process.cwd();
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'myblog-vault-pipeline-'));
const vaultRoot = path.join(tempRoot, 'content-vault');
const postsRoot = path.join(rootDir, 'apps/web/src/content/posts');
const expectedOutput = path.join(postsRoot, 'test-vault-doc.md');

try {
  fs.mkdirSync(path.join(vaultRoot, 'history', 'korea'), { recursive: true });
  fs.mkdirSync(path.join(vaultRoot, 'drafts'), { recursive: true });
  fs.writeFileSync(
    path.join(vaultRoot, 'history', 'korea', '朝鲜全史.md'),
    [
      '---',
      'title: 朝鲜全史',
      'published: true',
      'draft: false',
      'slug: test-vault-doc',
      'date: 2026-05-06',
      'summary: 这是一篇用于验证 Vault 发布管线的测试文档，确保发布规则稳定。',
      'tags:',
      '  - 朝鲜史',
      'categories:',
      '  - 历史',
      '---',
      '',
      '正文包含 [[高丽史|高丽史链接]] 和 [[朝鲜战争]]。'
    ].join('\n'),
    'utf8'
  );
  fs.writeFileSync(
    path.join(vaultRoot, 'drafts', 'private.md'),
    [
      '---',
      'title: Private',
      'published: true',
      'slug: should-not-publish',
      'date: 2026-05-06',
      'summary: This file lives in drafts and must be skipped.',
      '---',
      '',
      'private'
    ].join('\n'),
    'utf8'
  );

  const dryRun = runPublish(['--vault', vaultRoot]);
  assertIncludes(dryRun, 'Dry run 1 vault doc(s):', 'dry-run should find one publishable doc');
  assertIncludes(dryRun, 'history/korea/朝鲜全史.md -> apps/web/src/content/posts/test-vault-doc.md', 'dry-run should report normalized output path');

  if (fs.existsSync(expectedOutput)) {
    throw new Error(`Dry-run wrote an output file unexpectedly: ${expectedOutput}`);
  }

  const writeRun = runPublish(['--vault', vaultRoot, '--write']);
  assertIncludes(writeRun, 'Published 1 vault doc(s):', 'write mode should publish one doc');

  if (!fs.existsSync(expectedOutput)) {
    throw new Error(`Write mode did not create expected output: ${expectedOutput}`);
  }

  const output = fs.readFileSync(expectedOutput, 'utf8');
  assertIncludes(output, 'slug: "test-vault-doc"', 'output should contain stable slug');
  assertIncludes(output, '  - "history"', 'output should include folder tag history');
  assertIncludes(output, '  - "korea"', 'output should include folder tag korea');
  assertIncludes(output, '  - "朝鲜史"', 'output should include explicit tag');
  assertIncludes(output, '[高丽史链接](#高丽史)', 'wikilink with label should become markdown link');
  assertIncludes(output, '[朝鲜战争](#朝鲜战争)', 'plain wikilink should become markdown link');

  console.log('Vault publish pipeline validation passed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
  fs.rmSync(expectedOutput, { force: true });
}

function runPublish(args) {
  return execFileSync(process.execPath, ['tools/publish-vault-docs.mjs', ...args], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function assertIncludes(value, expected, message) {
  if (!value.includes(expected)) {
    throw new Error(`${message}\nExpected to include: ${expected}\nActual:\n${value}`);
  }
}
