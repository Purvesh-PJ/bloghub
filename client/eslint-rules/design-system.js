/**
 * Local ESLint plugin: design-system token enforcement for Tailwind v4.
 *
 * Unlike a className-only check, this inspects every string literal and
 * template-literal chunk in the file. Class strings built in helper
 * functions, cva() calls, constants, config arrays, and cn({ 'class': cond })
 * object keys are therefore linted too.
 *
 * Rules:
 *   enforce-tokens      (use "error")  colors, radius, type size, arbitrary var()
 *   no-arbitrary-sizing (use "warn")   arbitrary spacing, sizing, z-index
 */

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const COLOR_UTILS =
  'bg|text|border|border-[xytblrse]|ring|ring-offset|outline|fill|stroke|from|via|to|divide|decoration|shadow|accent|caret|placeholder';

const RE_COLOR_FN = /\[(?:hsl|hsla|rgb|rgba|oklch|oklab|lab|lch|hwb|color-mix)\(/;
const RE_HEX = /\[#[0-9a-fA-F]{3,8}\]/;
const RE_ARBITRARY_VAR = /(?:\[var\(--|-\(--)(?!radix-|tw-)/;
const RE_PALETTE = new RegExp(`^(?:${COLOR_UTILS})-(?:${PALETTE})-\\d{2,3}(?:\\/.+)?$`);
const RE_BLACK_WHITE = new RegExp(`^(?:${COLOR_UTILS})-(?:white|black)(?:\\/.+)?$`);
const RE_RADIUS = /^rounded(?:-(?:s|e|t|r|b|l|ss|se|ee|es|tl|tr|br|bl))?-\[/;
const RE_TEXT_SIZE = /^text-\[[\d.]+(?:px|rem|em)\]/;
const RE_SIZING =
  /^(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|w|h|size|min-w|min-h|max-w|max-h|basis|z|leading|tracking)-\[(?!var\(--radix-|var\(--tw-)/;

const COLOR_STYLE_PROPS = new Set([
  'color',
  'background',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  'fill',
  'stroke',
  'boxShadow',
]);
const STYLE_VALUE_OK = /^(?:var\(|inherit|currentColor|transparent|none|unset|initial)/i;

const TOKEN_HINT =
  'Use a token utility (bg-primary, text-muted-foreground, border-border). Missing one? Add it to @theme in index.css.';

const TOKEN_CHECKS = [
  {
    test: (base) => RE_COLOR_FN.test(base),
    message: (t) => `"${t}": raw color function in arbitrary value. ${TOKEN_HINT}`,
  },
  {
    test: (base) => RE_HEX.test(base),
    message: (t) => `"${t}": hardcoded hex color. ${TOKEN_HINT}`,
  },
  {
    test: (base) => RE_ARBITRARY_VAR.test(base),
    message: (t) =>
      `"${t}": CSS variable used through arbitrary syntax. Use the registered utility (for example border-line-subtle instead of border-[var(--line-subtle)]).`,
  },
  {
    test: (base) => RE_PALETTE.test(base),
    message: (t) =>
      `"${t}": raw Tailwind palette color. It ignores the theme and dark mode. ${TOKEN_HINT}`,
  },
  {
    test: (base) => RE_BLACK_WHITE.test(base),
    message: (t) =>
      `"${t}": raw white/black. Use a token (text-primary-foreground, bg-card, ...) or add one, for example a scrim token for overlays.`,
  },
  {
    test: (base) => RE_RADIUS.test(base),
    message: (t) =>
      `"${t}": arbitrary border-radius. Use the radius scale: rounded-xs, -sm, -md, -lg, -xl, -2xl, -3xl, -4xl (or rounded-full).`,
  },
  {
    test: (base) => RE_TEXT_SIZE.test(base),
    message: (t) =>
      `"${t}": arbitrary font size. Use text-2xs (10px), text-caption (11px), or the Tailwind scale (text-xs and up).`,
  },
];

const SIZING_CHECKS = [
  {
    test: (base) => RE_SIZING.test(base),
    message: (t) =>
      `"${t}": arbitrary spacing/size/z-index value. Prefer the Tailwind scale or a named token. Keep arbitrary values only for one-off layout constraints.`,
  },
];

/** Returns the utility without variants (hover:, md:, [&>svg]:, ...) and without ! or leading -. */
function baseUtility(token) {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < token.length; i++) {
    const c = token[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (c === ':' && depth === 0) cut = i;
  }
  let base = token.slice(cut + 1);
  if (base.startsWith('!')) base = base.slice(1);
  if (base.endsWith('!')) base = base.slice(0, -1);
  if (base.startsWith('-')) base = base.slice(1);
  return base;
}

function createRule(description, checks, { checkInlineStyles = false } = {}) {
  return {
    meta: { type: 'problem', docs: { description }, schema: [] },
    create(context) {
      function checkText(text, node) {
        if (typeof text !== 'string' || text.length < 3) return;
        for (const raw of text.split(/\s+/)) {
          if (!raw) continue;
          const base = baseUtility(raw);
          for (const check of checks) {
            if (check.test(base)) {
              context.report({ node, message: check.message(raw) });
              break;
            }
          }
        }
      }

      const visitors = {
        Literal(node) {
          if (typeof node.value !== 'string') return;
          const parent = node.parent;
          if (
            parent &&
            (parent.type === 'ImportDeclaration' ||
              parent.type === 'ExportAllDeclaration' ||
              parent.type === 'ExportNamedDeclaration')
          ) {
            return;
          }
          checkText(node.value, node);
        },
        TemplateElement(node) {
          checkText(node.value.cooked ?? node.value.raw, node);
        },
      };

      if (checkInlineStyles) {
        visitors['JSXAttribute[name.name="style"] Property'] = (node) => {
          const key = node.key && (node.key.name ?? node.key.value);
          if (!COLOR_STYLE_PROPS.has(key)) return;
          const value = node.value;
          if (value && value.type === 'Literal' && typeof value.value === 'string') {
            if (!STYLE_VALUE_OK.test(value.value.trim())) {
              context.report({
                node,
                message: `Inline style "${key}: ${value.value}" hardcodes a color. Use a token utility class, or var(--token) if inline is unavoidable.`,
              });
            }
          }
        };
      }

      return visitors;
    },
  };
}

export default {
  meta: { name: 'design-system' },
  rules: {
    'enforce-tokens': createRule(
      'Forbid hardcoded colors, arbitrary radius/type sizes, and arbitrary var() usage; require design tokens.',
      TOKEN_CHECKS,
      { checkInlineStyles: true }
    ),
    'no-arbitrary-sizing': createRule(
      'Discourage arbitrary spacing, sizing, and z-index values.',
      SIZING_CHECKS
    ),
  },
};
