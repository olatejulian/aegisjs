import {defineConfig, mergeConfig} from 'vitest/config'
import base from '../../vitest.config'

export default mergeConfig(
    base,
    defineConfig({
        test: {
            name: 'core',

            include: ['src/**/*.spec.ts'],

            coverage: {
                reportsDirectory: '../../coverage/core',
            },
        },
    })
)
