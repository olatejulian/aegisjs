import type { Config } from 'jest'

const config: Config = {
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../../coverage/',
    moduleFileExtensions: ['js', 'json', 'ts'],
    moduleNameMapper: {
        '@core/(.*)$': '<rootDir>/src/$1',
    },
    rootDir: 'src',
    testEnvironment: 'node',
    transform: {
        '^.+\\.(t|j)s?$': ['ts-jest', {useESM: true}],
    },
}

export default config
