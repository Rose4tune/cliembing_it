import baseConfig from '@config/eslint.base';

export default [
  ...baseConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
