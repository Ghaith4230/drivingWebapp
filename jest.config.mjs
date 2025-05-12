// jest.config.mjs
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',  // Add babel-jest transformation for JavaScript files
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',  // Adjust alias if you use one
    },
    transformIgnorePatterns: [
        '/node_modules/(?!jose)/',  // Make sure 'jose' is transformed by Jest if needed
    ],
};
