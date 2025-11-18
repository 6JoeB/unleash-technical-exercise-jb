const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg
  },
  testMatch: ["**/tests/**/*.test.ts"],       // only run test files in tests/ folder
  testPathIgnorePatterns: ["<rootDir>/dist/"] // ignore compiled files
};
