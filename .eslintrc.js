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
        "no-extra-semi": "error",
        "no-useless-escape": "off",
        "indent": "off"
    },
};
