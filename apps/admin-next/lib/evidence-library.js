import fs from "node:fs";
import path from "node:path";

const dataRoot = path.resolve(process.cwd(), "../../public-data/evidence-library");
const planPath = path.join(dataRoot, "evidence-library-plan.json");
const manifestPath = path.join(dataRoot, "manifests", "assets.json");

export function readEvidencePlan() {
  return readJson(planPath, {});
}

export function readEvidenceManifest() {
  return readJson(manifestPath, { version: "1.0.0", assets: [], clips: [] });
}

export function evidencePaths() {
  return {
    dataRoot,
    planPath,
    manifestPath,
  };
}

export async function scanOpenListDirectory(input = {}) {
  const plan = readEvidencePlan();
  const baseUrl = String(input.baseUrl || plan.actors?.openlist?.baseUrl || "http://127.0.0.1:5244").replace(/\/$/, "");
  const scanPath = normalizeOpenListPath(input.path || plan.actors?.openlist?.activeMounts?.[0] || "/");
  const response = await fetch(`${baseUrl}/api/fs/list`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      path: scanPath,
      password: "",
      page: Number(input.page || 1),
      per_page: Number(input.perPage || 50),
      refresh: Boolean(input.refresh),
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OpenList HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.code !== 200) {
    throw new Error(payload.message || "OpenList list failed");
  }

  return {
    baseUrl,
    path: scanPath,
    total: Number(payload.data?.total || 0),
    provider: payload.data?.provider || "",
    items: (payload.data?.content || []).map((item) => ({
      name: item.name,
      isDir: Boolean(item.is_dir),
      size: Number(item.size || 0),
      modified: item.modified,
      type: item.type,
      openlistPath: joinOpenListPath(scanPath, item.name),
      thumb: item.thumb || "",
    })),
  };
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeOpenListPath(value) {
  const pathValue = String(value || "/").trim().replace(/\\/g, "/");
  return pathValue.startsWith("/") ? pathValue : `/${pathValue}`;
}

function joinOpenListPath(parent, name) {
  return `${normalizeOpenListPath(parent).replace(/\/$/, "")}/${String(name || "").replace(/^\/+/, "")}`;
}
