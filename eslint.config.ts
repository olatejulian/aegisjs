import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    {
        ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**"],
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: [
                    "./tsconfig.json",
                    "./packages/*/tsconfig.json",
                    "./apps/*/tsconfig.json",
                ],
            },
        },
        rules: {
            // correctness > style
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/consistent-type-imports": "warn",

            // TS already handles this
            "no-undef": "off",
        },
    },
];
