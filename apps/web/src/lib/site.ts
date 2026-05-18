const RAW_BASE = import.meta.env.BASE_URL ?? '/';
const NORMALIZED_BASE = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/$/, '');

export function withBase(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${NORMALIZED_BASE}${normalizedPath}` || '/';
}

export function stripBase(pathname: string) {
  if (!NORMALIZED_BASE) {
    return pathname;
  }

  if (pathname === NORMALIZED_BASE) {
    return '/';
  }

  if (pathname.startsWith(`${NORMALIZED_BASE}/`)) {
    return pathname.slice(NORMALIZED_BASE.length) || '/';
  }

  return pathname;
}

export function absoluteUrl(path: string, site?: URL | string) {
  const origin = typeof site === 'string' ? site : site?.toString() ?? 'https://emptyinkpot.github.io';
  return new URL(withBase(path), origin).toString();
}
