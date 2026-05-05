import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
        globals: true,
        environment: 'node',

        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
        },
    },
})
