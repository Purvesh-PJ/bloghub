module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'coverage',
    collectCoverage: true,
    collectCoverageFrom: [
        'backend/**/*.js',
        '!backend/index.js', // Exclude the entry point
    ],
};
