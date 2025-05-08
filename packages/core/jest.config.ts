import type { Config } from 'jest'

const config: Config = {
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../../coverage/',
    coveragePathIgnorePatterns: ['<rootDir>/lib'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: {
        '@core/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    testRegex: [".*\\.spec\\.ts$", ".*\\.test\\.ts$"],
    transform: {
        '^.+\\.(t|j)s?$': ['ts-jest', {useESM: true}],
    },
}

export default config
