import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

/**
 * Sanitisation for rendered post bodies.
 *
 * `@uiw/react-md-editor` enables `rehype-raw` unconditionally in its default plugin chain,
 * so raw HTML written inside a post reaches the DOM. Anything the `rehypePlugins` prop
 * supplies is appended *after* `rehype-raw`, which is what makes this work: the raw HTML is
 * parsed into the tree first, then this pass strips everything dangerous out of it.
 *
 * Without it, publishing `<img src=x onerror=...>` runs script in every reader's browser —
 * and since auth tokens live in localStorage, that is an account takeover rather than a
 * defacement.
 */
export const markdownSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Fenced code blocks carry a `language-*` class from the Markdown parser, and the
    // alert/anchor plugins add their own class names. Stripping these would leave every
    // code block unstyled. Class names cannot execute anything on their own.
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    pre: [...(defaultSchema.attributes?.pre ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
    div: [...(defaultSchema.attributes?.div ?? []), 'className'],
    p: [...(defaultSchema.attributes?.p ?? []), 'className'],
  },
};

/** Pass to every `MDEditor.Markdown` that renders content the server sent us. */
export const markdownRehypePlugins = [[rehypeSanitize, markdownSanitizeSchema]];

/**
 * Loads syntax highlighting, but only for a post that has code in it.
 *
 * The highlighted build of the renderer carries `refractor`, which registers every language
 * Prism supports — 1 MB minified, 350 kB over the wire, on the one action the whole site
 * exists for. Most posts contain no code at all and paid for it anyway.
 *
 * The read path uses the `nohighlight` renderer and calls this when it sees a fenced block,
 * so the article is on screen immediately and the colouring arrives a moment later. A failure
 * here leaves plain, readable code rather than breaking the page.
 *
 * @returns {Promise<Function|null>} the rehype plugin, or null if it could not be loaded
 */
export const loadSyntaxHighlighting = async () => {
  try {
    const module = await import('rehype-prism-plus');
    return module.default ?? null;
  } catch {
    return null;
  }
};

/** True when `content` contains a fenced code block (CommonMark allows 3 spaces of indent). */
export const hasCodeBlock = (content) => /^ {0,3}```/m.test(String(content ?? ''));
