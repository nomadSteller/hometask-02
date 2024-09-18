module.exports = {
    testEnvironment: 'node',
    maxWorkers: 4, // Ensures tests run sequentially
    globalTeardown: './teardown.js',
    // Other Jest configuration options if needed
};