const reactConfig = require('./react.js');

module.exports = [
  ...reactConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
