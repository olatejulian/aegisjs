import type { Config } from "prettier";

const config: Config = {
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    printWidth: 100,

    // modern defaults
    arrowParens: "always",
    bracketSpacing: true,
};

export default config;
