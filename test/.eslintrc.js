module.exports = {
    "globals": {
        "Ext": false,
        "addGlobal": false,
        "setImmediate": false,
        "clearImmediate": false,
        "topSuite": false,
        "xtopSuite": false,
        "wait": false,
        "waitForSpy": false,
        "waitsForSpy": false,
        "waitForSpyCalled": false,
        "spyOnEvent": false,
        "focusAndWait": false,
        "focusAndExpect": false,
        "expectFocused": false,
        "pressKey": false,
        "pressTabKey": false,
        "simulateTabKey": false,
        "waitAWhile": false,
        "waitForEvent": false,
        "waitsForEvent": false,
        "waitForFocus": false,
        "waitsForFocus": false,
        "waitForBlur": false,
        "waitsForBlur": false,
        "waitForAnimation": false,
        "waitsForAnimation": false,
        "fireTabAndWait": false,
        "waitFor": false,
        "MockAjax": true,
        "MockAjaxManager": true,
        "spec": true,
        "specFor": false,
        "jazzman": false
    },
    "env": {
        "browser": true,
        "jasmine": true,
        "es6": false
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 5
    },
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1,
                "ArrayExpression": "first",
                "ObjectExpression": "first",
                "MemberExpression": "off",
                "FunctionDeclaration": {
                    "parameters": "first",
                    "body": 1
                },
                "CallExpression": {
                    "arguments": "first"
                },
                "outerIIFEBody": 0,
                "ignoreComments": false,
                "flatTernaryExpressions": true,
                "VariableDeclarator": 1
            }
        ],
        "id-blacklist": [
            "error",
            "abstract", "await", "byte", "char",
            "class", "const", "double", "enum", "export", "extends",
            "final", "float", "implements", "import", "int",
            "interface", "long", "native", "package", "private",
            "protected", "public", "short", "static", "super",
            "synchronized", "throws", "transient", "volatile"
        ],
        "no-floating-decimal": "error",
        "semi": ["error", "always", { omitLastInOneLineBlock: true }],
        "no-console": 0,
        "no-debugger": 0,
        "curly": ["error"],
        "nonblock-statement-body-position": ["error", "below"],
        "space-before-blocks": [
            "error",
            {
                "functions": "always",
                "keywords": "always",
                "classes": "always"
            }
        ],
        "space-infix-ops": ["error"],
        "block-spacing": ["error", "always"],
        "semi-spacing": ["error", { "before": false, "after": true }],
        "no-whitespace-before-property": ["error"],
        "keyword-spacing": ["error", { "before": true, "after": true }],
        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "always",
        }],
        "func-call-spacing": ["error", "never"],
        "space-in-parens": ["error", "never"],
        "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
        "comma-dangle": ["error", "never"],
        "comma-spacing": ["error", { "after": true }],
        "dot-notation": ["error", { "allowKeywords": true }],
        "dot-location": ["error", "property"],
        "operator-linebreak": [
            "error",
            "after",
            {
                "overrides": {
                    "?": "before",
                    ":": "before"
                }
            }
        ],
        "eqeqeq": ["error", "always", { "null": "ignore" }],
        "no-trailing-spaces": ["error", {
            "skipBlankLines": true,
            "ignoreComments": true
        }],
        "spaced-comment": [
            "error", "always",
            {
                "line": {
                    "exceptions": [
                        "<debug>",
                        "</debug>",
                    ]
                },
                "block": {
                    "balanced": true
                }
            }
        ],
        "key-spacing": [
            "error",
            { "beforeColon": false, "afterColon": true }
        ],
        "computed-property-spacing": ["error", "never"],
        "eol-last": ["error", "always"],
        "object-curly-spacing": ["error", "always"],
        "vars-on-top": ["error"],
        "no-extra-boolean-cast": "off",
        "no-unused-vars": [
            "error",
            {
                "vars": "all",
                "args": "none",
                "ignoreRestSiblings": false
            }
        ],
        "one-var-declaration-per-line": ["error", "initializations"],
        "max-len": [
            "error",
            {
                "code": 120,
                "ignoreComments": false,
                "ignoreStrings": false,
                "ignoreRegExpLiterals": true,
                "ignoreUrls": true
            }
        ],
        "comma-style": [
            "error", "last",
            {
                "exceptions": {
                    "ArrayExpression": false,
                    "CallExpression": false,
                    "FunctionDeclaration": false,
                    "FunctionExpression": false,
                    "ObjectExpression": false,
                    "VariableDeclaration": false,
                    "NewExpression": false
                }
            }
        ],
        "padding-line-between-statements": [
            "error",
            { "blankLine": "always", "prev": "*", "next": "case" },
            { "blankLine": "any", "prev": "case", "next": "case" },
            { "blankLine": "always", "prev": "break", "next": "case" },
            { "blankLine": "always", "prev": "break", "next": "default" },
            { "blankLine": "always", "prev": "var", "next": "*" },
            { "blankLine": "always", "prev": "*", "next": "block-like" },
            { "blankLine": "always", "prev": "*", "next": "return" },
            { "blankLine": "always", "prev": "block-like", "next": "block-like" },
            { "blankLine": "always", "prev": "block-like", "next": "return" },
            { "blankLine": "always", "prev": "block-like", "next": "break" },
            { "blankLine": "always", "prev": "block-like", "next": "expression" }
        ]
    },
    overrides: [{
        files: [
            "conductor/**/*.js"
        ],
        env: {
            node: true,
            es6: true,
        },
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: "module",
        },
        rules: {
            "comma-dangle": "off",
            "padding-line-between-statements": "off"
        }
    }, {
        files: [
            "specs/**/*.js"
        ],
        env: {
            "jasmine": true,
        },
        globals: {
            todo: false,
            toDo: false,
            TODO: false,
        },
        rules: {
            "dot-location": "off",
            "vars-on-top": "off",
        }
    }]
};
