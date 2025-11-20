import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import importEssentials from 'eslint-plugin-import-essentials';
import jsdoc from 'eslint-plugin-jsdoc';
import reactPreferFunction from 'eslint-plugin-react-prefer-function-component';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsdoc from 'eslint-plugin-tsdoc';
import unocss from '@unocss/eslint-config/flat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

export default [
    {
        ignores: ['*.html', 'tsconfig.json', 'dist/**', 'build/**', 'node_modules/**'],
    },
    js.configs.recommended,
    ...fixupConfigRules(
        compat.extends(
            'plugin:@typescript-eslint/recommended',
            'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'plugin:storybook/recommended',
            'airbnb-base',
            'airbnb/rules/react',
            'airbnb-typescript',
            'prettier'
        )
    ),
    unocss,
    {
        plugins: {
            'import-essentials': importEssentials,
            jsdoc,
            tsdoc,
            'react-prefer-function-component': reactPreferFunction,
            'simple-import-sort': simpleImportSort,
        },

        languageOptions: {
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
                debugger: true,
                browser: true,
                context: true,
                JSX: true,
            },

            ecmaVersion: 2022,
            sourceType: 'module',

            parserOptions: {
                project: './tsconfig.json',
                ecmaFeatures: {
                    jsx: true,
                    modules: true,
                    experimentalObjectRestSpread: true,
                },
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
            jsdoc: {
                mode: 'typescript',
            },
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },

        rules: {
            // Disable rules removed in @typescript-eslint v8
            '@typescript-eslint/no-throw-literal': 'off',
            'prefer-const': [
                'off',
                {
                    destructuring: 'any',
                    ignoreReadBeforeAssign: false,
                },
            ],
            'no-plusplus': 'off',
            'no-inner-declarations': 'off',
            'sort-imports': 'off',
            'no-case-declarations': 'off',
            'no-unreachable': 'warn',
            'no-constant-condition': 'error',
            'space-before-function-paren': 'off',
            'no-undef': 'off',
            'no-return-await': 'off',
            '@typescript-eslint/return-await': 'off',
            '@typescript-eslint/no-shadow': ['off'],
            '@typescript-eslint/no-use-before-define': ['off'],
            'class-methods-use-this': 'off',
            'react-hooks/exhaustive-deps': 'warn',
            '@typescript-eslint/lines-between-class-members': 'off',
            'no-param-reassign': [
                'error',
                {
                    props: false,
                },
            ],
            'no-console': 'off',
            'consistent-return': 'off',
            'react/destructuring-assignment': 'off',
            'import/prefer-default-export': 'off',
            'no-promise-executor-return': 'off',
            'import/no-cycle': 'off',
            'import/no-extraneous-dependencies': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/jsx-no-useless-fragment': [
                'error',
                {
                    allowExpressions: true,
                },
            ],
            'keyword-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                },
            ],
            'no-continue': 'off',
            'space-before-blocks': [
                'error',
                {
                    functions: 'always',
                    keywords: 'always',
                    classes: 'always',
                },
            ],
            'react/jsx-filename-extension': [
                1,
                {
                    extensions: ['.tsx'],
                },
            ],
            'react/no-deprecated': 'warn',
            'react/prop-types': 'off',
            'react-prefer-function-component/react-prefer-function-component': [
                'warn',
                {
                    allowComponentDidCatch: false,
                },
            ],
            'react/function-component-definition': 'off',
            'react/button-has-type': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns-type': 'off',
            'jsdoc/newline-after-description': 'off',
            'react/require-default-props': 'off',
            'jsdoc/require-jsdoc': [
                'error',
                {
                    enableFixer: false,
                    publicOnly: true,
                    checkConstructors: false,
                    require: {
                        ArrowFunctionExpression: true,
                        ClassDeclaration: true,
                        ClassExpression: true,
                        FunctionExpression: true,
                    },
                    contexts: [
                        'MethodDefinition:not([key.name="componentDidMount"]):not([key.name="render"])',
                        'ArrowFunctionExpression',
                        'ClassDeclaration',
                        'ClassExpression',
                        'ClassProperty:not([key.name="state"]):not([key.name="componentDidMount"])',
                        'FunctionDeclaration',
                        'FunctionExpression',
                        'TSDeclareFunction',
                        'TSEnumDeclaration',
                        'TSInterfaceDeclaration',
                        'TSMethodSignature',
                        'TSModuleDeclaration',
                        'TSTypeAliasDeclaration',
                    ],
                },
            ],
            'tsdoc/syntax': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/naming-convention': 'off',
            '@typescript-eslint/space-before-function-paren': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-interface': 'warn',
            'import/no-restricted-paths': [
                'error',
                {
                    zones: [
                        {
                            target: './src/background',
                            from: './src/views',
                            message:
                                'You cannot import into the `background` directory from the `views` directory (i.e. content script files) because it will break the build!',
                        },
                        {
                            target: './src/views',
                            from: './src/background',
                            message:
                                'You cannot import into the `views` directory from the `background` directory (i.e. background script files) because it will break the build!',
                        },
                        {
                            target: './src/shared',
                            from: './',
                            except: ['./src/shared', './node_modules'],
                            message: 'You cannot import into `shared` from an external directory.',
                        },
                    ],
                },
            ],
            'import/extensions': 'off',
            'no-restricted-syntax': [
                'error',
                'ForInStatement',
                'LabeledStatement',
                'WithStatement',
                {
                    selector: 'TSEnumDeclaration',
                    message: "Don't declare enums",
                },
            ],
            '@typescript-eslint/consistent-type-exports': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'import-essentials/restrict-import-depth': 'error',
            'import-essentials/check-path-alias': 'error',
        },
    },
];
