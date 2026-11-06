const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  eslintPluginPrettierRecommended,
  {
    ignores: ['node_modules/**', 'uploads/**', 'dist/**', 'coverage/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Date: 'readonly',
      },
    },
    rules: {
      // Core JavaScript & Bug Prevention guarantees
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-unneeded-ternary': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',

      // Backend & Security Guarantees
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',

      // Formatting
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
