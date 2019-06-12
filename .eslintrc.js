const packageConfig = require('./package.json')

module.exports = {
  rules: {
    'no-unused-vars': ['warn', { ignoreRestSiblings: true }]
  },
  extends: ['@twostoryrobot/eslint-config/React', 'prettier'],
  settings: {
    react: {
      version: packageConfig.dependencies.react
    }
  }
}
