// Flat ESLint config. Complements `astro check` (types) with lint rules that
// reach inside .astro frontmatter and templates — including a11y checks on the
// markup, which is the layer type-checking can't see.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],

  {
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // `catch (_)` is used deliberately where a failure is a no-op.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // Swallowing an error is sometimes the point (e.g. localStorage in a
      // sandboxed iframe). An empty catch is allowed; other empty blocks aren't.
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Content files are parsed from YAML/JSON, so the reader generics are
      // genuinely untyped at the boundary. Worth seeing, not worth blocking on.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Default handlers include onError/onLoad, which fire on media loading
      // rather than user interaction — an <img onerror> fallback is not an a11y
      // problem. Narrow the rule to actual mouse/keyboard interaction.
      'astro/jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          handlers: [
            'onClick',
            'onMouseDown',
            'onMouseUp',
            'onKeyPress',
            'onKeyDown',
            'onKeyUp',
          ],
        },
      ],
    },
  },
);
