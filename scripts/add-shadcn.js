#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_WEB_DIR = path.resolve(__dirname, "../packages/ui-web/src");

// kebab-case를 PascalCase로 변환
const kebabToPascal = (str) => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

// "use client" 뒤에 개행 추가
const addNewLineAfterUseClient = (code) => {
  return code.replace(/^(\s*['"]use client['"])(;?)(\s*)$/m, "$1$2\n");
};

// React import 제거 (React 19에서 불필요)
const removeReactImport = (code) => {
  const reactImportRegex =
    /^\s*import\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;\s*\n?/gm;
  const hasReactImport = reactImportRegex.test(code);
  const updatedCode = code.replace(reactImportRegex, "");
  return { code: updatedCode, removed: hasReactImport };
};

// import 경로 업데이트 (kebab-case -> PascalCase)
const updateImportPaths = (code) => {
  const importRegex = /(['"])@\/([\w-]+)\1/g;
  let updated = false;
  const updatedCode = code.replace(importRegex, (match, quote, name) => {
    if (name.includes("-") || /^[a-z]/.test(name)) {
      updated = true;
      return `${quote}@/${kebabToPascal(name)}${quote}`;
    }
    return match;
  });
  return { code: updatedCode, updated };
};

// 파일 내용 업데이트
const updateFileContent = (filePath, fileName) => {
  const content = fs.readFileSync(filePath, "utf-8");

  const { code: withoutReactImport, removed: reactRemoved } =
    removeReactImport(content);
  const { code: withUpdatedImports, updated: importsUpdated } =
    updateImportPaths(withoutReactImport);
  const finalCode = addNewLineAfterUseClient(withUpdatedImports);

  if (reactRemoved) {
    console.log(`🗑️  Removed React import: ${fileName}`);
  }
  if (importsUpdated) {
    console.log(`🔧 Updated imports in: ${fileName}`);
  }

  if (finalCode !== content) {
    fs.writeFileSync(filePath, finalCode.trimStart(), "utf-8");
  }
};

// 파일명 변환 (kebab-case -> PascalCase)
const renameFile = (baseName, ext, pascalName, dir) => {
  const oldPath = path.join(dir, `${baseName}${ext}`);
  const tempPath = path.join(dir, `${pascalName}__temp${ext}`);
  const newPath = path.join(dir, `${pascalName}${ext}`);

  try {
    fs.renameSync(oldPath, tempPath);
    fs.renameSync(tempPath, newPath);
    console.log(`✅ Renamed: ${baseName}${ext} → ${pascalName}${ext}`);
    return newPath;
  } catch (error) {
    console.error(`❌ Rename failed for ${baseName}${ext}:`, error.message);
    return null;
  }
};

// 디렉토리 내 모든 파일 처리
const processDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // 디렉토리는 재귀 처리
    if (stat.isDirectory()) {
      processDirectory(filePath);
      return;
    }

    const ext = path.extname(file);
    const baseName = path.basename(file, ext);

    // .ts, .tsx 파일만 처리 (index 제외)
    if ((ext === ".tsx" || ext === ".ts") && baseName !== "index") {
      // kebab-case이거나 소문자로 시작하면 변환
      if (baseName.includes("-") || /^[a-z]/.test(baseName)) {
        const pascalName = kebabToPascal(baseName);
        const renamedFilePath = renameFile(baseName, ext, pascalName, dir);

        if (renamedFilePath) {
          updateFileContent(renamedFilePath, `${pascalName}${ext}`);
        }
      }
    }
  });
};

// 메인 실행
const main = () => {
  const component = process.argv[2];

  if (!component) {
    console.error("❌ Usage: pnpm add:ui <component-name>");
    console.error("   Example: pnpm add:ui button");
    process.exit(1);
  }

  console.log(`\n📦 Installing shadcn component: ${component}\n`);

  try {
    // shadcn add 실행 (packages/ui-web에서)
    execSync(
      `cd packages/ui-web && pnpm dlx shadcn@latest add ${component} --yes`,
      { stdio: "inherit" }
    );

    console.log(`\n🔄 Converting to PascalCase...\n`);

    // 변환 처리
    processDirectory(UI_WEB_DIR);

    console.log(
      `\n✨ Done! Component installed and converted to PascalCase.\n`
    );
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
};

main();
