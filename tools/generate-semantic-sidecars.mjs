import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const defaultVaultRoot = process.env.MYBLOG_VAULT_ROOT || (process.platform === 'win32' ? 'E:/Vaults/Obsidian/docs' : '/home/vault/Obsidian/docs');
const defaultBaseUrl =
  process.env.MYBLOG_SEMANTIC_LLM_BASE_URL ||
  process.env.MORTIS_QQ_LLM_BASE_URL ||
  'https://sub2api.tengokukk.com/v1';
const defaultModel =
  process.env.MYBLOG_SEMANTIC_LLM_MODEL ||
  process.env.MORTIS_QQ_LLM_MODEL ||
  'coze-shell';
const maxInputChars = Number(process.env.MYBLOG_SEMANTIC_MAX_CHARS || 8000);
const requestTimeoutMs = Number(process.env.MYBLOG_SEMANTIC_LLM_TIMEOUT_MS || 180000);

async function main() {
  const options = readOptions();
  const vaultRoot = path.resolve(options.vault || defaultVaultRoot);
  const apiKey = readApiKey();

  if (!fs.existsSync(vaultRoot)) {
    throw new Error(`Vault root not found: ${vaultRoot}`);
  }

  if (!apiKey) {
    throw new Error('Missing semantic LLM API key. Set MYBLOG_SEMANTIC_LLM_API_KEY, MORTIS_QQ_LLM_API_KEY, OPENAI_API_KEY, or local codex secret.');
  }

  const candidates = listMarkdownFiles(vaultRoot)
    .map((absolutePath) => ({
      absolutePath,
      relativePath: toSlash(path.relative(vaultRoot, absolutePath)),
      source: fs.readFileSync(absolutePath, 'utf8')
    }))
    .filter((item) => !isPrivatePath(item.relativePath))
    .filter((item) => hasPublishableBody((parseFrontmatter(item.source)?.body || item.source).trim()))
    .filter((item) => !options.only || item.relativePath === toSlash(options.only))
    .filter((item) => options.force || !fs.existsSync(toSidecarPath(item.absolutePath)))
    .slice(0, options.limit || undefined);

  if (!candidates.length) {
    console.log('No semantic sidecar candidates.');
    return;
  }

  let generated = 0;
  let failed = 0;
  for (const candidate of candidates) {
    try {
      const markdown = candidate.source;
      const source = parseFrontmatter(markdown)?.body || markdown;
      const sidecar = await generateSidecar({
        apiKey,
        baseUrl: options.baseUrl || defaultBaseUrl,
        model: options.model || defaultModel,
        relativePath: candidate.relativePath,
        title: readTitle(source, candidate.relativePath),
        markdown: source.slice(0, maxInputChars)
      });

      const outputPath = toSidecarPath(candidate.absolutePath);
      writeJsonAtomic(outputPath, {
        ...sidecar,
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        model: options.model || defaultModel,
        source: 'glm-openai-compatible',
        runtime: 'mortis-glm',
        authority: false,
        sourceDocument: {
          relativePath: candidate.relativePath,
          sha256: hash(markdown)
        }
      });
      generated += 1;
      console.log(`WROTE ${toSlash(path.relative(vaultRoot, outputPath))}`);
    } catch (error) {
      failed += 1;
      console.error(`FAILED ${candidate.relativePath}: ${error.message}`);
    }
  }

  console.log(`Generated ${generated} semantic sidecar(s); failed ${failed}.`);
  if (generated === 0 && failed > 0) process.exitCode = 1;
}

async function generateSidecar({ apiKey, baseUrl, model, relativePath, title, markdown }) {
  const payload = {
    model,
    messages: [
      {
        role: 'system',
        content: [
          'You generate non-authoritative semantic sidecar JSON for an Obsidian digital garden.',
          'Return strict JSON only. Do not use markdown fences.',
          'Never rewrite the source Markdown. Never invent personal data.',
          'Use concise Chinese or source-language labels when appropriate.'
        ].join(' ')
      },
      {
        role: 'user',
        content: JSON.stringify({
          task: 'Extract semantic metadata for a sidecar projection.',
          requiredJsonShape: {
            entities: ['string'],
            topics: ['string'],
            relations: [{ type: 'string', target: 'string', label: 'string', confidence: 0.0 }],
            collections: ['string'],
            clusters: ['string']
          },
          rules: [
            'entities: named tools, systems, people, places, concepts, works, projects',
            'topics: broader semantic topics, not folder names unless semantically meaningful',
            'relations: max 12; confidence between 0 and 1',
            'collections: narrative or knowledge collections this note belongs to',
            'clusters: similarity cluster labels for future graph/search',
            'omit empty or uncertain items'
          ],
          document: {
            relativePath,
            title,
            markdown
          }
        })
      }
    ],
    temperature: 0.2,
    max_tokens: 1200
  };

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(requestTimeoutMs)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Semantic LLM request failed: ${response.status} ${text.slice(0, 300)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Semantic LLM returned empty content.');
  return sanitizeSidecar(JSON.parse(extractJson(content)));
}

function sanitizeSidecar(value) {
  return {
    entities: readStringList(value?.entities).slice(0, 40),
    topics: readStringList(value?.topics).slice(0, 40),
    relations: Array.isArray(value?.relations)
      ? value.relations.slice(0, 20).map((relation) => ({
          type: readString(relation?.type),
          target: readString(relation?.target || relation?.to || relation?.id),
          label: readString(relation?.label),
          confidence: typeof relation?.confidence === 'number' ? Math.max(0, Math.min(1, relation.confidence)) : undefined
        })).filter((relation) => relation.type && relation.target)
      : [],
    collections: readStringList(value?.collections).slice(0, 30),
    clusters: readStringList(value?.clusters || value?.similarityCluster).slice(0, 30)
  };
}

function readApiKey() {
  return (
    process.env.MYBLOG_SEMANTIC_LLM_API_KEY ||
    process.env.MORTIS_QQ_LLM_API_KEY ||
    process.env.OPENAI_API_KEY ||
    readLocalSecret('C:/Users/ASUS-KL/.codex/auth.json', 'MORTIS_QQ_LLM_API_KEY') ||
    readLocalSecret('C:/Users/ASUS-KL/.codex/auth.json', 'OPENAI_API_KEY') ||
    readLocalSecret('C:/Users/ASUS-KL/.codex-secrets/auth.json', 'MORTIS_QQ_LLM_API_KEY') ||
    readLocalSecret('C:/Users/ASUS-KL/.codex-secrets/auth.json', 'OPENAI_API_KEY') ||
    ''
  ).trim();
}

function readLocalSecret(secretPath, key) {
  if (process.env.MYBLOG_SEMANTIC_SECRET_FILE) {
    secretPath = process.env.MYBLOG_SEMANTIC_SECRET_FILE;
  }
  if (!fs.existsSync(secretPath)) return '';
  try {
    const data = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
    return typeof data[key] === 'string' ? data[key] : '';
  } catch {
    return '';
  }
}

function readOptions() {
  const args = process.argv.slice(2);
  return {
    vault: readArgValue(args, '--vault'),
    limit: Number(readArgValue(args, '--limit') || 0),
    only: readArgValue(args, '--only'),
    model: readArgValue(args, '--model'),
    baseUrl: readArgValue(args, '--base-url'),
    force: args.includes('--force')
  };
}

function listMarkdownFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(absolutePath);
      return /\.mdx?$/i.test(entry.name) ? [absolutePath] : [];
    });
}

function isPrivatePath(relativePath) {
  return relativePath
    .split('/')
    .some((segment) => segment.startsWith('.') || segment === 'assets' || segment === 'private' || segment === 'drafts');
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return null;
  return { frontmatter: match[1], body: source.slice(match[0].length) };
}

function readTitle(markdown, relativePath) {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1];
  return readString(heading) || path.basename(relativePath, path.extname(relativePath));
}

function hasPublishableBody(markdown) {
  return getExcerpt(markdown, 1).length > 0;
}

function getExcerpt(markdown, maxLength) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~|>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length <= maxLength ? text : text.slice(0, maxLength).trim();
}

function extractJson(content) {
  const trimmed = String(content).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('Semantic LLM response did not contain a JSON object.');
  return trimmed.slice(start, end + 1);
}

function toSidecarPath(markdownPath) {
  return markdownPath.replace(/\.mdx?$/i, '.semantic.json');
}

function writeJsonAtomic(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function readArgValue(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : '';
}

function readString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function readStringList(value) {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map(readString).filter(Boolean)));
}

function toSlash(value) {
  return value.replace(/\\/g, '/');
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
