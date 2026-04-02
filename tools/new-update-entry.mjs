import fs from 'node:fs';
import path from 'node:path';

const args = parseArgs(process.argv.slice(2));
const title = args.title?.trim();

if (!title) {
  console.error('Missing required argument: --title "更新标题"');
  process.exit(1);
}

const targetPath = path.resolve('public-data/updates/index.md');
const marker = '<!-- UPDATE_LOG_ENTRIES -->';
const date = args.date ?? formatDate(new Date());
const commit = args.commit ?? '待补充';
const dryRun = Boolean(args['dry-run']);

if (!fs.existsSync(targetPath)) {
  console.error(`Update log source not found: ${targetPath}`);
  process.exit(1);
}

const source = fs.readFileSync(targetPath, 'utf8');
const markerIndex = source.indexOf(marker);

if (markerIndex === -1) {
  console.error(`Marker not found in ${targetPath}: ${marker}`);
  process.exit(1);
}

const entry = `## ${date} / ${title}

### 更新内容

- 待补充

### 涉及技术

- 待补充

### 关联记录

- 页面：\`待补充\`
- 文件：\`待补充\`
- 提交：\`${commit}\`

### 验证记录

- 构建验证：\`待补充\`
- 路由验证：\`待补充\`

### 实现效果

- 待补充

### 下一步

- 待补充
`;

if (dryRun) {
  process.stdout.write(`${entry}\n`);
  process.exit(0);
}

const insertAt = markerIndex + marker.length;
const updatedSource = `${source.slice(0, insertAt)}\n\n${entry}\n---${source.slice(insertAt)}`;

fs.writeFileSync(targetPath, updatedSource, 'utf8');
console.log(`Appended new update entry to ${targetPath}`);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      parsed[key] = true;
      continue;
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
