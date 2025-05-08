import js from '@eslint/js'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        extends: ['google', 'js/recommended', 'prettier'],
        files: ['./**/*.ts', 'packages/**/*.ts'],
        plugins: {js},
    },
])
