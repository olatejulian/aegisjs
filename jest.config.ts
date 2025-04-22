import type {Config} from 'jest'

const config: Config = {
    preset: 'ts-jest',
    projects: [
        '<rootDir>/packages/app/jest.config.ts',
        '<rootDir>/packages/core/jest.config.ts',
    ],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    collectCoverageFrom: ['<rootDir>/packages/app/**/*.ts', '<rootDir>/packages/core/**/*.ts'],
    coverageDirectory: '<rootDir>/coverage/',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
}

export default config
