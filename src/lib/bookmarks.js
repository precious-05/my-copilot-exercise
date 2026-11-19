export const STORAGE_KEY = 'mona-bookmarks';

export function normalizeUrl(input) {
  const trimmed = String(input ?? '').trim();
  if (!trimmed) return null;

  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (!url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function parseStoredBookmarks(raw) {
  if (typeof raw !== 'string' || raw.length === 0) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((bookmark) => (
      bookmark !== null
      && typeof bookmark === 'object'
      && !Array.isArray(bookmark)
      && typeof bookmark.url === 'string'
      && bookmark.url.length > 0
      && normalizeUrl(bookmark.url) !== null
      && typeof bookmark.slug === 'string'
      && /^mona-[a-z0-9]+$/i.test(bookmark.slug)
    ));
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

export function toBase62(number) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let value = Math.max(0, Math.floor(number));
  if (value === 0) return '0';

  let encoded = '';
  while (value > 0) {
    encoded = alphabet[value % 62] + encoded;
    value = Math.floor(value / 62);
  }
  return encoded;
}
