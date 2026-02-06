import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    [globalIgnores(["./dist/*"])],
    {
        rules: {
            // disable base rule (conflicts with TS rule)
            "no-unused-vars": "off",

            // ignore args/vars starting with "_" (e.g. _req, _res, _next)
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
);
