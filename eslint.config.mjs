import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";

// Flat config directo (sin FlatCompat) para evitar el bug de estructura circular
// de eslint-config-next + config-validator en ESLint 9. Cubre las reglas de Next
// (core-web-vitals) y las de hooks de React, que son los guardarraíles clave.
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "fonts/**",
      "public/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
