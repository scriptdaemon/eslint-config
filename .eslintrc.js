module.exports = {
  plugins: [
    'jest'
  ],
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    'standard'
  ],
  env: {
    'jest/globals': true
  }
}
