import type { Config } from 'jest'

const config: Config = {
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../../coverage',
    coveragePathIgnorePatterns: ['<rootDir>/dist'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testEnvironment: 'node',
    testRegex: ['.*\\.spec\\.ts$', '.*\\.e2e-spec\\.ts$'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
}

export default config
