module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts?(x)'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
