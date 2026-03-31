import { config as nextJsConfig } from "@repo/eslint-config/next";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: ["src/components/ui/**"],
  },
];
