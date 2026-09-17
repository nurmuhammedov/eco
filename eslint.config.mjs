import js from '@eslint/js'
import tslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tslint.config(
  {
    ignores: ['dist/**', 'dev-dist/**', 'build/**', 'node_modules/**', 'public/**', '**/*.mjs', '**/*.js'],
  },
  js.configs.recommended,
  tslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      // The new JSX transform means React is not in scope by design.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Unescaped apostrophes read fine and the Uzbek text is full of them.
      'react/no-unescaped-entities': 'off',

      // Conditional or nested hook calls break React's hook order at runtime.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Always noisy here: shadcn/ui files export cva variants next to the component.
      'react-refresh/only-export-components': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unsafe-negation': 'off',
      'no-extra-boolean-cast': 'off',

      // Leftover debugging reaches production otherwise; warn and error are
      // deliberate and survive.
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    /**
     * One way in and out of the network. Everything goes through `apiClient` or
     * the generic hooks built on it, so the interceptors - error toasts, the
     * 401 sign-out, parameter cleaning - can never be bypassed by a component
     * reaching for axios itself.
     */
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/shared/api/**',
      // Known bypasses, kept visible rather than hidden behind inline
      // comments. Each one still has to move onto `apiClient`.
      'src/shared/components/common/file-upload/**',
      'src/shared/components/common/editor/ui/tinymce-editor.tsx',
      'src/shared/components/common/signature/model/convert-pdf-to-base64.ts',
      'src/features/qr-form/api/**',
      'src/features/reports/ui/turniket-report/**',
      'src/features/reports/ui/turniket-report-detail/**',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'axios',
              // The types are fine to name; it is the client that must not be used.
              allowTypeImports: true,
              message: 'So‘rovlarni `apiClient` yoki `shared/hooks/api` dagi hooklar orqali yuboring.',
            },
            {
              // The instance is re-exported here too, which let it in unnoticed.
              name: '@/shared/api',
              importNames: ['axiosInstance', 'servicesAxiosInstance'],
              message: 'Axios instansiyasi faqat `shared/api` ichida ishlatiladi; `apiClient` dan foydalaning.',
            },
          ],
          patterns: [
            {
              group: ['**/axios-instance', '**/services-axios-instance', '@/shared/api/*axios*'],
              allowTypeImports: true,
              message: 'Axios instansiyasi faqat `shared/api` ichida ishlatiladi; `apiClient` dan foydalaning.',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier
)
