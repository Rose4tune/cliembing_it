import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  root: rootDir,
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "@pkg/ui-web": join(rootDir, "packages/ui-web/src/index.ts"),
      "@pkg/ui-web/*": join(rootDir, "packages/ui-web/src/*"),
    },
  },
  test: {
    include: [
      "packages/**/*.{test,spec}.ts",
      "packages/**/*.{test,spec}.tsx",
      "apps/**/*.{test,spec}.ts",
      "apps/**/*.{test,spec}.tsx",
    ],
    // 기본 DOM 환경으로 맞추고, Node 환경이 필요한 경우 개별 테스트에서 override
    environment: "happy-dom",
    globals: true,
    // 필요 시 전역 세팅(선택): "packages/testing/src/setup.node.ts"
    // setupFiles: ["packages/testing/src/setup.node.ts"],
    reporters: ["default"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./.coverage",
      reporter: ["text", "html"],
      include: [
        "packages/domain/src/**/*.ts",
        "packages/features/src/**/*.ts",
        "packages/shared/src/**/*.{ts,tsx}",
        "packages/ui/src/**/*.{ts,tsx}",
        "apps/web/**/*.{ts,tsx}",
      ],
    },
    passWithNoTests: false,
  },
});
