module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    allowImportExportEverywhere: false,
    ecmaVersion: 6,
    ecmaFeatures: {
      globalReturn: true,
      jsx: true,
    },
    parser: "@babel/eslint-parser",
    sourceType: "module",
    requireConfigFile: false,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    // "prettier/prettier": "off",
  },
  parser: "vue-eslint-parser",
};
