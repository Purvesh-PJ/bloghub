import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'design-system': {
        rules: {
          'enforce-tokens': {
            meta: {
              type: 'problem',
              docs: {
                description:
                  'Enforce design system tokens and eliminate raw brackets and arbitrary values',
              },
              schema: [],
            },
            create(context) {
              function checkString(rawText, node) {
                if (!rawText || typeof rawText !== 'string') return;

                // 1. Raw HSL expressions
                if (/\[hsl\(/.test(rawText)) {
                  context.report({
                    node,
                    message:
                      'Raw [hsl(...)] brackets are forbidden. Use semantic Tailwind utility tokens (e.g. bg-primary, border-border, text-muted-foreground).',
                  });
                }

                // 2. Hardcoded HEX colors
                if (/\[#[0-9a-fA-F]{3,8}\]/.test(rawText)) {
                  context.report({
                    node,
                    message:
                      'Hardcoded HEX colors in arbitrary brackets are forbidden. Use semantic design tokens from index.css.',
                  });
                }

                // 3. Arbitrary border-radius
                if (/rounded-\[\d+px\]/.test(rawText)) {
                  context.report({
                    node,
                    message:
                      'Arbitrary border-radius is forbidden. Use design system tokens: rounded-xs through rounded-4xl.',
                  });
                }

                // 4. Arbitrary micro typography
                if (/text-\[(?:10|11)px\]/.test(rawText)) {
                  context.report({
                    node,
                    message:
                      'Arbitrary micro typography is forbidden. Use design tokens: text-2xs (10px) or text-caption (11px).',
                  });
                }
              }

              function inspectNode(node) {
                if (!node) return;
                if (node.type === 'Literal') {
                  checkString(node.value, node);
                } else if (node.type === 'TemplateLiteral') {
                  for (const quasi of node.quasis) {
                    checkString(quasi.value.raw, quasi);
                  }
                } else if (node.type === 'JSXExpressionContainer') {
                  inspectNode(node.expression);
                } else if (node.type === 'CallExpression') {
                  for (const arg of node.arguments) {
                    inspectNode(arg);
                  }
                } else if (node.type === 'ArrayExpression') {
                  for (const elem of node.elements) {
                    if (elem) inspectNode(elem);
                  }
                } else if (node.type === 'ConditionalExpression') {
                  inspectNode(node.consequent);
                  inspectNode(node.alternate);
                } else if (node.type === 'LogicalExpression') {
                  inspectNode(node.right);
                }
              }

              return {
                JSXAttribute(node) {
                  if (
                    node.name &&
                    (node.name.name === 'className' || node.name.name === 'class')
                  ) {
                    if (node.value) {
                      inspectNode(node.value);
                    }
                  }
                },
              };
            },
          },
        },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      // React 19 JSX runtime & copy settings
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',

      // React Safety & State guarantees
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-danger': 'error',
      'react/self-closing-comp': 'error',
      'react/no-array-index-key': 'off',

      // Core JavaScript & Bug Prevention guarantees
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-unneeded-ternary': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',

      // Design System & UI Consistency guarantees
      'design-system/enforce-tokens': 'error',
    },
  },
];
