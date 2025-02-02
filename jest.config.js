module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // The test environment that will be used for testing
    testEnvironment: "node",

    // The glob patterns Jest uses to detect test files
    testMatch: [
        "**/__tests__/**/*.test.[jt]s?(x)",
        "**/__tests__/**/*.spec.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)"
    ],

    // A map from regular expressions to paths to transformers
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },

    // An array of regexp pattern strings that are matched against all test files
    testPathIgnorePatterns: [
        "/node_modules/"
    ],

    // Setup files that will be run before each test
    setupFiles: ["<rootDir>/jest.setup.js"]
};