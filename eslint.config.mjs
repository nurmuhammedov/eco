import js from '@eslint/js'
import tslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tslint.config(
  js.configs.recommended,
  tslint.configs.recommendedTypeChecked,
  {
    ignores: ['dist/**/*.ts', 'dist/**', '**/*.mjs', 'eslint.config.mjs', '**/*.js'],
  },
  {
    extends: [js.configs.recommended, tslint.configs.recommendedTypeChecked],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-misused-promises': ['off'],
      '@typescript-eslint/no-unsafe-argument': ['off'],
      '@typescript-eslint/no-unsafe-assignment': ['off'],
      '@typescript-eslint/prefer-promise-reject-errors': ['off'],
      '@typescript-eslint/no-unsafe-member-access': ['off'],
      '@typescript-eslint/no-unsafe-call': ['off'],
      '@typescript-eslint/no-unsafe-return': ['off'],
      '@typescript-eslint/no-floating-promises': ['off'],
      '@typescript-eslint/no-unused-expressions': ['off'],
      '@typescript-eslint/ban-ts-comment': ['off'],
      'no-unsafe-negation': ['off'],
      'no-extra-boolean-cast': 'off',
    },
  },
  eslintConfigPrettier
)
