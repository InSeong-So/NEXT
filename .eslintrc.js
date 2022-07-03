module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: [
    'airbnb',
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  plugins: ['@typescript-eslint', 'react-hooks', '@emotion'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: ['tsconfig.json', './server/tsconfig.json', './client/tsconfig.json'],
  },
  // common rules
  rules: {
    // typescript
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    // next
    '@next/next/no-html-link-for-pages': 'off',
    // react
    'react/jsx-one-expression-per-line': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-props-no-spreading': 'off',
    // 'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-filename-extension': 0,
    'react/function-component-definition': 'off',
    'max-len': 'off',
    'no-void': 'off',
    'function-paren-newline': 'off',
    'consistent-return': 'off',
    // 'jsx-a11y/label-has-associated-control': ['error', { controlComponents: ['input', 'select'] }],
    // import options
    'sort-imports': 'off',
    'import/prefer-default-export': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'off',
    'import/no-default-export': 'off',
    'import/no-named-as-default': 'off',
    'no-restricted-exports': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'object-curly-newline': 'off',
    //
    'max-params': ['error', 3],
    'jsx-quotes': 'off',
    'jsx-a11y/anchor-is-valid': 'off',

    // prettier conflict
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
