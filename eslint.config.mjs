import noLoops from "eslint-plugin-no-loops";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
), {
    plugins: {
        "no-loops": noLoops,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".ts"],
            },
        },
    },

    rules: {
        "no-restricted-imports": ["error", {
            patterns: ["**/react/**/*", "**/html/**/**"],
        }],

        "no-loops/no-loops": "error",
        "linebreak-style": ["error", "unix"],
        semi: ["error", "never"],

        "@typescript-eslint/array-type": [2, {
            default: "generic",
            readonly: "generic",
        }],

        "comma-dangle": ["error", "never"],
        camelcase: "off",

        "@typescript-eslint/consistent-type-assertions": [2, {
            assertionStyle: "as",
            objectLiteralTypeAssertions: "allow",
        }],

        "@typescript-eslint/no-magic-numbers": "off",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

        "@typescript-eslint/explicit-function-return-type": ["error", {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
        }],

        "func-call-spacing": "off",
        indent: "off",

        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "error",

        "@typescript-eslint/no-empty-interface": ["error", {
            allowSingleExtends: false,
        }],

        "no-extra-parens": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-for-in-array": "error",
        "no-magic-numbers": "off",

        "@typescript-eslint/no-misused-promises": ["error", {
            checksVoidReturn: false,
        }],

        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-arguments": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            vars: "all",
            args: "all",
            ignoreRestSiblings: false,
            argsIgnorePattern: "^_",
        }],

        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",

        quotes: ["error", "single", {
            avoidEscape: true,
        }],

        "@typescript-eslint/require-array-sort-compare": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/strict-boolean-expressions": "error",
    },
}];