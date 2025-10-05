module.exports = {
      displayName: 'react',
      preset: 'ts-jest/presets/js-with-ts',
      testEnvironment: './jest.environment.js',
      testMatch: ['**/tests/**/*.(test|spec).ts?(x)'],
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs'],

      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        '^.+\\.mjs$': 'babel-jest'
      },
      setupFiles: ['<rootDir>/jest.setup.js'],

      transformIgnorePatterns: [
        'node_modules/(?!(msw|@mswjs|until-async)/)',
      ],

      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/\$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|ico)$': '<rootDir>/mocks-for-work-tests/imageMock.js',
        '\\.(svg)$': '<rootDir>/mocks-for-work-tests/svgMock.js',
      },

      globals: {
        'ts-jest': {
          useESM: true,
        },
        TextEncoder: require('util').TextEncoder,
        TextDecoder: require('util').TextDecoder
      },

      setupFilesAfterEnv: [
        './node_modules/@testing-library/jest-dom/dist/index.js',
        './msw/setup-msw.js'
      ],

      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.tsx',
        '!src/reportWebVitals.ts',
        '!src/setupTests.ts'
      ],

      testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        '/cypress/'
      ]
};