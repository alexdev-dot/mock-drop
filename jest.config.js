module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 65,
      lines: 65,
      statements: 65
    }
  },
  testMatch: [
    '**/test/**/*.test.js'
  ]
};
