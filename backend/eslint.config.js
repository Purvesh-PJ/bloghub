module.exports = [
  // =========================================================================
  // 1. Global Ignores
  // =========================================================================
  {
    ignores: ['node_modules/**', 'uploads/**', 'dist/**', 'coverage/**'],
  },

  // =========================================================================
  // 2. Node.js & CommonJS Environment
  // =========================================================================
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
  },

  // =========================================================================
  // 3. Project Rules (JS Safety, Backend Security & Async Guarantees)
  // =========================================================================
  {
    rules: {
      // Core JavaScript & bug prevention
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-unneeded-ternary': 'error',
      'no-empty': ['error', { allowEmptyCatch: false }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',

      // Backend security & async guarantees
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
    },
  },
];
