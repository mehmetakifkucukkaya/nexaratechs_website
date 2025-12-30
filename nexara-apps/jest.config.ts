import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

const config: Config = {
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Test environment
    testEnvironment: 'jest-environment-jsdom',

    // Module name mapping for path aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },

    // Test file patterns
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'components/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        'app/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],

    // Ignore patterns
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/',
        '<rootDir>/e2e/',
    ],
};

export default createJestConfig(config);
