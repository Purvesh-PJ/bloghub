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
