const { CLIEngine } = require('eslint')

const configFile = require.resolve('../.eslintrc')
const engine = new CLIEngine({ configFile })

test('includes required parser options', () => {
  const config = engine.getConfigForFile(configFile)
  expect(config.parserOptions.ecmaVersion).toBeGreaterThanOrEqual(6)
  expect(config.parserOptions).toHaveProperty('sourceType', 'module')
})

test('includes required environments', () => {
  const config = engine.getConfigForFile(configFile)
  expect(config.env).toHaveProperty('browser', true)
  expect(config.env).toHaveProperty('es6', true)
  expect(config.env).toHaveProperty('node', true)
})

test('includes required plugins', () => {
  const config = engine.getConfigForFile(configFile)
  expect(config.plugins).toContain('jest')
  expect(config.plugins).toContain('vue')
})
