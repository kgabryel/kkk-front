import tseslint from 'typescript-eslint';

import {
  createConfig,
  angularRules,
  templateConfig,
  angularExtends,
  angularPlugins,
} from '@kgabryel-dev/code-quality/eslint/AngularConfigBuilder';
import globals from 'globals';

const config = createConfig()
  .useTsConfig('./tsconfig.eslint.json')
  .setRules(angularRules)
  .setExtends(angularExtends)
  .setPlugins(angularPlugins)
  .setLanguageOptions({
    globals: {
      ...globals.browser,
    },
    parserOptions: {
      project: ['./tsconfig.eslint.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  })
  .setPrefixes(['app', 'account', 'auth', 'ingredients', 'layout', 'main', 'recipes', 'seasons', 'shared', 'tags', 'timers'])
  .addOverride(templateConfig)
  .addOverride({
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  });

export default tseslint.config(
  ...config.get(),
);
