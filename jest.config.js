module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/node_modules/**'
  ],
  testMatch: [
    '**/test/**/*.test.js'
  ]
};
