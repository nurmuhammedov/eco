import js from '@eslint/js'
import tslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintConfigPrettier from 'eslint-config-prettier'

/**
 * Feature-Sliced layers, highest first. A slice may reach down but never up, so
 * a change to `shared` cannot be held hostage by a screen that happens to sit
 * above it. Without this the direction drifts back one import at a time.
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

/**
 * One way in and out of the network. Everything goes through `apiClient` or the
 * generic hooks built on it, so the interceptors - error toasts, the 401
 * sign-out, parameter cleaning - can never be bypassed by a component reaching
 * for axios itself.
 */
const AXIOS_PATHS = [
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
]

const AXIOS_PATTERNS = [
  {
    group: ['**/axios-instance', '**/services-axios-instance', '@/shared/api/*axios*'],
    allowTypeImports: true,
    message: 'Axios instansiyasi faqat `shared/api` ichida ishlatiladi; `apiClient` dan foydalaning.',
  },
]

const AXIOS_ALLOWED = [
  'src/shared/api/**',
  // Known bypasses, kept visible rather than hidden behind inline comments.
  // Each one still has to move onto `apiClient`.
  'src/shared/components/common/editor/ui/tinymce-editor.tsx',
  'src/shared/components/common/signature/model/convert-pdf-to-base64.ts',
  // `AxiosError` is checked with `instanceof`, so the class itself is needed.
  'src/features/qr-form/api/**',
  // A separate service on another host; `apiClient` speaks only to this one.
  'src/features/reports/ui/turniket-report/**',
  'src/features/reports/ui/turniket-report-detail/**',
]

/**
 * `no-restricted-imports` is one rule, and the last matching config wins it
 * outright - so the layer direction and the axios ban have to be declared
 * together or the later one silently switches the other off.
 */
const restrictedImports = (patterns, paths = AXIOS_PATHS) => [
  'error',
  { paths, patterns: [...AXIOS_PATTERNS, ...patterns] },
]

const layerPatterns = (layer) => {
  const higher = LAYERS.slice(0, LAYERS.indexOf(layer))
  if (!higher.length) return []

  return [
    {
      group: higher.flatMap((name) => [`@/${name}`, `@/${name}/*`]),
      message: `\`${layer}\` faqat o‘zidan pastdagi qatlamlardan import qiladi (${LAYERS.join(' → ')}).`,
    },
  ]
}

const glob = (path) => (path.endsWith('/**') ? `${path}/*.{ts,tsx}` : path)

const importRules = [
  ...LAYERS.map((layer) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: { '@typescript-eslint/no-restricted-imports': restrictedImports(layerPatterns(layer)) },
  })),
  // The bypasses are excused from the axios ban only; the layer direction still
  // holds for them, so it is restated rather than dropped.
  ...LAYERS.map((layer) => ({
    files: AXIOS_ALLOWED.filter((path) => path.startsWith(`src/${layer}/`)).map(glob),
    rules: {
      '@typescript-eslint/no-restricted-imports': ['error', { paths: [], patterns: layerPatterns(layer) }],
    },
  })).filter(({ files }) => files.length),
]

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
  ...importRules,
  {
    /**
     * `endpointKey` drops the leading slash, and TanStack compares the key
     * element by element - so `invalidateQueries({ queryKey: ['/inquiries'] })`
     * matches nothing the generic hooks wrote, and fails without a sound.
     */
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/lib/query/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Property[key.name='queryKey'] > ArrayExpression > Literal[value=/^\\//]",
          message:
            'Kalitni `endpointKey(endpoint, ...)` bilan quring; bekor qilish uchun `invalidateEndpoint(queryClient, endpoint)`.',
        },
        {
          // The same address written with backticks is a TemplateLiteral, not a
          // Literal, and slipped past the rule above.
          selector:
            "Property[key.name='queryKey'] > ArrayExpression > TemplateLiteral > TemplateElement:first-child[value.raw=/^\\//]",
          message:
            'Kalitni `endpointKey(endpoint, ...)` bilan quring; bekor qilish uchun `invalidateEndpoint(queryClient, endpoint)`.',
        },
      ],
    },
  },
  eslintConfigPrettier
)
