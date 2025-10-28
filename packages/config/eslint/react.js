const baseConfig = require('./base.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    settings: {
      react: {
        version: '19',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed in React 19
      'react/prop-types': 'off', // Use TypeScript for prop validation
    },
  },
];
