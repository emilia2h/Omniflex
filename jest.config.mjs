export default {
  transform: {},
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    '@omniflex/core/?(.*)$': '<rootDir>/core/$1',
    '@omniflex/infra-express/?(.*)$': '<rootDir>/infra/infra-express/$1',
    '@omniflex/infra-postgres/?(.*)$': '<rootDir>/infra/infra-postgres/$1',
    '@/(.*)$': '<rootDir>/apps/server/$1',
  },

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
};