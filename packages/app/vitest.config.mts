import { defineConfig, mergeConfig } from 'vitest/config'
import base from '../../vitest.config'

export default mergeConfig(
  base,
  defineConfig({
    test: {
      name: 'app',

      include: ['./src/**/*.spec.ts', './test/**/*.spec.ts'],

      coverage: {
        reportsDirectory: '../../coverage/app',
      },
    },
  }),
)
