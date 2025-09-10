module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // moduleNameMapping: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  //   '^@/(.*)$': '<rootDir>/src/$1'
  // },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      babelConfig: true
    }]
  }
};