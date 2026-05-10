export type ReaderMemoryRecord = {
  id: string;
  objectId: string;
  objectType: 'article' | 'book';
  title: string;
  href?: string;
  progress?: number;
  location?: unknown;
  scrollTop?: number;
  timestamp?: number;
  lastReadAt?: number;
  updatedAt?: number;
};

export type RuntimeHighlightRecord = {
  id: string;
  articleId: string;
  objectId?: string;
  objectType?: 'article' | 'book';
  title: string;
  text: string;
  color: string;
  note?: string;
  anchor?: unknown;
  createdAt: number;
  updatedAt: number;
};

export async function listReaderMemory(limit = 20): Promise<ReaderMemoryRecord[]> {
  const response = await fetch(`/api/runtime/reader/memory?limit=${encodeURIComponent(String(limit))}`, { cache: 'no-store' });
  const data = await response.json();
  if (!response.ok || data?.ok === false) throw new Error(data?.error || 'Failed to load reader memory.');
  return Array.isArray(data.items) ? data.items : [];
}

export async function getReaderMemory(objectId: string): Promise<ReaderMemoryRecord | null> {
  const response = await fetch(`/api/runtime/reader/memory?objectId=${encodeURIComponent(objectId)}`, { cache: 'no-store' });
  const data = await response.json();
  if (!response.ok || data?.ok === false) throw new Error(data?.error || 'Failed to load reader memory.');
  return data.item || null;
}

export async function saveReaderMemory(record: Partial<ReaderMemoryRecord> & { objectId: string; title: string }) {
  const response = await fetch('/api/runtime/reader/memory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  const data = await response.json();
  if (!response.ok || data?.ok === false) throw new Error(data?.error || 'Failed to save reader memory.');
  return data.item as ReaderMemoryRecord;
}

export async function listRuntimeHighlights(objectId?: string, limit = 100): Promise<RuntimeHighlightRecord[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (objectId) params.set('objectId', objectId);
  const response = await fetch(`/api/runtime/reader/highlights?${params.toString()}`, { cache: 'no-store' });
  const data = await response.json();
  if (!response.ok || data?.ok === false) throw new Error(data?.error || 'Failed to load reader highlights.');
  return Array.isArray(data.items) ? data.items : [];
}

export async function saveRuntimeHighlight(record: RuntimeHighlightRecord) {
  const response = await fetch('/api/runtime/reader/highlights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  const data = await response.json();
  if (!response.ok || data?.ok === false) throw new Error(data?.error || 'Failed to save reader highlight.');
  return data.item as RuntimeHighlightRecord;
}
