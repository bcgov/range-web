const packageConfig = require('./package.json')

module.exports = {
  rules: {
    'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'react/prop-types': 0
  },
  extends: ['@twostoryrobot/eslint-config/React', 'prettier'],
  settings: {
    react: {
      version: packageConfig.dependencies.react
    }
  },
  plugins: ['jsx-a11y', 'import']
}
