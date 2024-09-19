module.exports = {
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
      "node_modules",
      "dist",
      "test-config",
      "interfaces",
      "jestGlobalMocks.ts",
      ".module.ts",
      "<rootDir>/src/server.ts",
      ".mock.ts",
      "<rootDir>/src/clients/kafka",
      "<rootDir>/src/clients/db",
      ".env",
      ".json",
      "migrations",
      "config"
  ],
};