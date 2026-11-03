module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/node_modules/**'
  ],
  testMatch: [
    '**/test/**/*.test.js'
  ]
};
