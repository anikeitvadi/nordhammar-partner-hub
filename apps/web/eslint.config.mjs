import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Walls, not wishes. These rules fail the lint when a module reaches past its boundary.
// The dependency-graph test in src/boundaries.test.ts covers what path patterns cannot (transitive reach, re-exports).
const dbClient = ["@neondatabase/serverless", "@/lib/db", "**/lib/db"];
const erpCreate = ["@/features/erp/erp.server", "**/features/erp/erp.server"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  { rules: { "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }] } },
  {
    // Routes and client islands never touch the database client or the ERP create path.
    files: ["src/app/**/*.{ts,tsx}", "src/**/*.client.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: dbClient, message: "Routes and client code read through a feature's *.server.ts module, never the DB client." },
        { group: erpCreate, message: "Only the Workflow ERP step may import the ERP create path." },
      ] }],
    },
  },
  {
    // Nothing outside the execution feature may import the ERP create path.
    files: ["src/features/**/*.{ts,tsx}"],
    ignores: ["src/features/execution/**", "src/features/erp/**"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { group: erpCreate, message: "Only the Workflow ERP step may import the ERP create path." },
      ] }],
    },
  },
]);

export default eslintConfig;
