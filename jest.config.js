/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["."],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/__fixtures__/**/*.ts",
  ],
  coveragePathIgnorePatterns: ["<rootDir>/src/__fixtures__"],
  moduleNameMapper: {
    "z@Servers/(.*)": "<rootDir>/src/servers/$1",
    "z@DBs/(.*)": "<rootDir>/src/dbs/$1",
    "z@Middlewares/(.*)": "<rootDir>/src/middlewares/$1",
    "z@Helpers/(.*)": "<rootDir>/src/helpers/$1",
    "z@Routes/(.*)": "<rootDir>/src/routes/$1",
    "z@Controllers/(.*)": "<rootDir>/src/controllers/$1",
    "z@Services/(.*)": "<rootDir>/src/services/$1",
    "z@Utils/(.*)": "<rootDir>/src/utils/$1",
    "z@Errors/(.*)": "<rootDir>/src/errors/$1",
    "z@Fixtures/(.*)": "<rootDir>/src/__fixtures__/$1",
  },
};
