/**
 * Text helpers.
 *
 * Post bodies are Markdown. Rendering a raw slice of one as a card excerpt leaks syntax —
 * `## Why TypeScript? **Strict mode** ...` — which is what the feed was doing.
 */

const MARKDOWN_PATTERNS = [
  [/!\[[^\]]*\]\([^)]*\)/g, ''], // images
  [/\[([^\]]*)\]\([^)]*\)/g, '$1'], // links → their text
  [/`{1,3}[^`]*`{1,3}/g, ''], // inline and fenced code
  [/^#{1,6}\s+/gm, ''], // headings
  [/^\s*>\s?/gm, ''], // blockquotes
  [/^\s*[-*+]\s+/gm, ''], // bullets
  [/^\s*\d+\.\s+/gm, ''], // ordered list markers
  [/(\*\*|__)(.*?)\1/g, '$2'], // bold
  [/(\*|_)(.*?)\1/g, '$2'], // italic
  [/~~(.*?)~~/g, '$1'], // strikethrough
  [/^\s*([-*_]\s*){3,}$/gm, ''], // horizontal rules
];

/** Strip Markdown down to plain prose. */
export function stripMarkdown(input = '') {
  const str = typeof input === 'string' ? input : String(input || '');
  return MARKDOWN_PATTERNS.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    str
  )
    .replace(/\s+/g, ' ')
    .trim();
}

/** Plain-text excerpt of a Markdown body, cut on a word boundary. */
export function excerpt(body = '', maxLength = 160) {
  const plain = stripMarkdown(body);
  if (plain.length <= maxLength) return plain;

  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

/** Rough reading time in minutes, at 200 words per minute. */
export function readingTime(body = '') {
  const words = stripMarkdown(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Reading time from a character count rather than from the text itself.
 *
 * Search results carry the length of the whole body but only a 200-character excerpt of it,
 * so `readingTime` applied to what they do carry reported the same minute for every result
 * however long the story was. Five characters per word is the usual English average.
 *
 * @param {number} characters length of the full body
 */
export function readingTimeFromLength(characters = 0) {
  const words = Math.max(0, Number(characters) || 0) / 5;
  return Math.max(1, Math.round(words / 200));
}

/** First letter of a name, for avatar fallbacks. */
export function initial(name = '') {
  const str = typeof name === 'string' ? name : String(name || '');
  return str.trim().charAt(0).toUpperCase() || 'U';
}
