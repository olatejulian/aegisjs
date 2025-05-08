import type {Config} from 'jest'

const config: Config = {
    preset: 'ts-jest',
    projects: ['<rootDir>/packages/**/jest.config.ts'],
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/*.spec.ts', '**/*.test.ts'],
    collectCoverageFrom: ['<rootDir>/packages/**/*.ts'],
    coverageDirectory: '<rootDir>/coverage/',
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
}

export default config
