import type {Config} from 'jest'

const config: Config = {
    moduleNameMapper: {
        '@core/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {useESM: true}],
    },
}

export default config
