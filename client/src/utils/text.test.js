import { describe, it, expect } from 'vitest';
import { stripMarkdown, excerpt, readingTime, readingTimeFromLength, initial } from './text';

/*
  The text helpers.

  Post bodies are Markdown, and every card in the application renders a slice of one. Getting
  this wrong does not throw — it just prints `## Why TypeScript? **Strict mode**` where a
  sentence should be, which is what the feed used to do.
*/

describe('stripMarkdown', () => {
  it('removes the syntax and keeps the prose', () => {
    const source = '## Why TypeScript?\n\n**Strict mode** makes `any` explicit.';
    expect(stripMarkdown(source)).toBe('Why TypeScript? Strict mode makes explicit.');
  });

  it('keeps a link’s text and drops its target', () => {
    expect(stripMarkdown('See [the docs](https://example.com) for more.')).toBe(
      'See the docs for more.'
    );
  });

  it('drops an image entirely rather than leaving its alt text floating', () => {
    expect(stripMarkdown('![A diagram](/diagram.png) Below it.')).toBe('Below it.');
  });

  it('survives a non-string, which is what an unpopulated field arrives as', () => {
    expect(stripMarkdown(undefined)).toBe('');
    expect(stripMarkdown(null)).toBe('');
    expect(stripMarkdown(42)).toBe('42');
  });
});

describe('excerpt', () => {
  it('returns short text untouched, with no ellipsis', () => {
    expect(excerpt('A short line.', 160)).toBe('A short line.');
  });

  it('cuts on a word boundary rather than mid-word', () => {
    const result = excerpt('alpha beta gamma delta epsilon', 14);
    expect(result).toBe('alpha beta…');
    expect(result).not.toMatch(/gam…/);
  });

  it('strips the markdown before measuring, so the cut is on visible characters', () => {
    // The raw string is far longer than 20 characters; the prose in it is not.
    expect(excerpt('**bold** and `code` here', 20)).toBe('bold and here');
  });
});

describe('readingTime', () => {
  it('never reports less than a minute', () => {
    expect(readingTime('Three words here')).toBe(1);
    expect(readingTime('')).toBe(1);
  });

  it('scales with the number of words at 200 per minute', () => {
    expect(readingTime(Array(600).fill('word').join(' '))).toBe(3);
  });
});

describe('readingTimeFromLength', () => {
  /*
    Search results carry the length of the whole body but only a 200-character excerpt of it.
    Estimating from what they do carry gave every result on the page the same figure however
    long the story behind it was.
  */
  it('estimates from a character count', () => {
    // 5000 characters ≈ 1000 words ≈ 5 minutes.
    expect(readingTimeFromLength(5000)).toBe(5);
  });

  it('never reports less than a minute, and tolerates junk', () => {
    expect(readingTimeFromLength(0)).toBe(1);
    expect(readingTimeFromLength(undefined)).toBe(1);
    expect(readingTimeFromLength(-100)).toBe(1);
    expect(readingTimeFromLength('nonsense')).toBe(1);
  });

  it('agrees with readingTime on the same body, within a minute', () => {
    const body = Array(1000).fill('word').join(' ');
    expect(Math.abs(readingTimeFromLength(body.length) - readingTime(body))).toBeLessThanOrEqual(1);
  });
});

describe('initial', () => {
  it('takes the first letter, uppercased', () => {
    expect(initial('purvesh')).toBe('P');
    expect(initial('  ada ')).toBe('A');
  });

  it('falls back rather than rendering an empty avatar', () => {
    expect(initial('')).toBe('U');
    expect(initial(undefined)).toBe('U');
    expect(initial(null)).toBe('U');
  });
});
