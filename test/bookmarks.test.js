import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatBookmark,
  normalizeUrl,
  parseStoredBookmarks,
} from '../src/lib/bookmarks.js';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(
    normalizeUrl('https://www.example.com'),
    normalizeUrl('www.example.com'),
  );
  assert.equal(normalizeUrl('www.example.com'), 'https://www.example.com/');
});

test('loading malformed stored values recovers safely', () => {
  assert.deepEqual(parseStoredBookmarks(null), []);
  assert.deepEqual(parseStoredBookmarks(''), []);
  assert.deepEqual(parseStoredBookmarks('{not json'), []);
  assert.deepEqual(parseStoredBookmarks('{"url":"https://example.com","slug":"mona-a1"}'), []);
  assert.deepEqual(parseStoredBookmarks('[{"url":"https://example.com"}]'), []);
  assert.deepEqual(parseStoredBookmarks('[{"url":"https://example.com","slug":"mona-a1"},null,"bad"]'), [
    { url: 'https://example.com', slug: 'mona-a1' },
  ]);
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
