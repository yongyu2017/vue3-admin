module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
    rules: {
        "vue/multi-word-component-names": 0,
        indent: ["error", 4],
        "no-extra-semi": "error",
    },
};
