import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import playwright from "eslint-plugin-playwright";

// ✅ Allowed groups (customize as needed)
const allowedGroups = ["smoke", "regression", "sanity", "e2e", "api", "ui"];

// ✅ Inline plugin to require and validate @groups above each test/suite
const groupsPlugin = {
  rules: {
    "require-groups": {
      meta: {
        type: "suggestion",
        docs: {
          description:
            "Require a JSDoc-style comment with @groups above each Playwright test/suite and validate allowed groups",
        },
        schema: [
          {
            type: "object",
            properties: {
              allowed: { type: "array", items: { type: "string" } },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          missing:
            "Add a JSDoc comment with `@groups` above this {{kind}} (e.g. `/** @groups smoke */`).",
          empty: "`@groups` must include at least one group.",
          invalid:
            "`@groups` contains invalid group '{{name}}'. Allowed: {{list}}",
        },
      },
      create(context) {
        const sourceCode = context.sourceCode ?? context.getSourceCode?.();
        const opts = context.options?.[0] ?? {};
        const allowed = new Set(opts.allowed ?? allowedGroups);

        function checkNode(node, kind) {
          const comments =
            sourceCode?.getCommentsBefore?.(node) ??
            sourceCode?.getComments?.(node)?.leading ??
            [];

          const text = comments.map((c) => c.value).join("\n");
          const match = /@groups\s+([^\n*]+)/i.exec(text || "");
          if (!match) {
            context.report({ node, messageId: "missing", data: { kind } });
            return;
          }

          const groups = match[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          if (groups.length === 0) {
            context.report({ node, messageId: "empty" });
            return;
          }

          for (const name of groups) {
            if (!allowed.has(name)) {
              context.report({
                node,
                messageId: "invalid",
                data: { name, list: Array.from(allowed).join(", ") },
              });
            }
          }
        }

        function isPW(node) {
          // Matches: test(...), it(...), test.describe(...), it.describe(...)
          const callee = node.callee;
          if (callee.type === "Identifier") {
            return callee.name === "test" || callee.name === "it";
          }
          if (
            callee.type === "MemberExpression" &&
            callee.object.type === "Identifier"
          ) {
            const obj = callee.object.name;
            return obj === "test" || obj === "it";
          }
          return false;
        }

        return {
          CallExpression(node) {
            if (!isPW(node)) return;

            const isDescribe =
              node.callee.type === "MemberExpression" &&
              node.callee.property.type === "Identifier" &&
              node.callee.property.name === "describe";

            checkNode(node, isDescribe ? "suite" : "test");
          },
        };
      },
    },
  },
};

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "prettier/prettier": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/consistent-type-imports": [
        "off",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["tests/**/*.ts", "e2e/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    languageOptions: {
      globals: {
        test: "readonly",
        expect: "readonly",
      },
    },
    plugins: {
      playwright,
      groups: groupsPlugin, // ⬅️ add inline groups plugin only for test files
    },
    rules: {
      // Playwright rules (unchanged)
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/expect-expect": "warn",
      "playwright/missing-playwright-await": "error",
      "playwright/no-wait-for-timeout": "warn",
      "playwright/no-networkidle": "warn",
      "playwright/prefer-to-have-length": "warn",
      "playwright/no-useless-await": "warn",

      // ✅ Require & validate @groups on every test/suite
      "groups/require-groups": ["off", { allowed: allowedGroups }],
    },
  },
];
