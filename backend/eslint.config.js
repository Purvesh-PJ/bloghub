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
        __filename: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Date: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
      },
    },
  },

  // =========================================================================
  // 3. Jest Test Environment
  // =========================================================================
  {
    files: ['**/__tests__/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
  },

  // =========================================================================
  // 4. Project Rules (JS Safety, Bug Prevention & Backend Security)
  // =========================================================================
  {
    rules: {
      // Core JavaScript & bug prevention
      'no-undef': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-constant-condition': 'error',
      'valid-typeof': 'error',
      'use-isnan': 'error',
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
