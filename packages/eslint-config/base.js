import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig } from "eslint/config";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = defineConfig(
  eslint.configs.recommended,
  tseslint.configs.stylistic,
  tseslint.configs.strictTypeChecked,
  {
    rules: {
      "no-restricted-imports": ["error", {
        "patterns": [".*"],
      }]
    },
  },
  {
    ignores: [
      'dist/*',
      '.next/*',
      'next-env.d.ts',
      '--docs/*'
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
