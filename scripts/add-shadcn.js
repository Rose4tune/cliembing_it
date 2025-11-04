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
    /^\s*import\s+\*\s+as\s+React\s+from\s+['"]react['"]\s*;?\s*\n?/gm;
  const hasReactImport = reactImportRegex.test(code);
  const updatedCode = code.replace(reactImportRegex, "");
  return { code: updatedCode, removed: hasReactImport };
};

// import 경로 업데이트
const updateImportPaths = (code) => {
  let updated = false;
  let updatedCode = code;

  // src/* -> ./* 변환
  updatedCode = updatedCode.replace(
    /(['"])src\/([\w-/]+)\1/g,
    (match, quote, path) => {
      updated = true;
      return `${quote}../${path}${quote}`;
    }
  );

  // @/* kebab-case -> PascalCase 변환
  updatedCode = updatedCode.replace(
    /(['"])@\/([\w-]+)\1/g,
    (match, quote, name) => {
      if (name.includes("-") || /^[a-z]/.test(name)) {
        updated = true;
        return `${quote}@/${kebabToPascal(name)}${quote}`;
      }
      return match;
    }
  );

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
    return newPath;
  } catch (error) {
    console.error(`❌ Rename failed for ${baseName}${ext}:`, error.message);
    return null;
  }
};

// 디렉토리 내 모든 파일 처리
const processDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    console.error(`⚠️  Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);
  const processedFiles = [];

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
          processedFiles.push(renamedFilePath);
        }
      }
    }
  });

  // 처리된 파일들을 디렉토리 구조로 재구성
  processedFiles.forEach((filePath) => {
    organizeIntoDirectory(filePath);
  });
};

// 파일을 디렉토리 구조로 재구성 (Button.tsx -> Button/Button.tsx)
const organizeIntoDirectory = (filePath) => {
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const dirPath = path.dirname(filePath);

  if (path.basename(dirPath) === baseName) {
    return filePath;
  }

  const newDirPath = path.join(dirPath, baseName);
  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath, { recursive: true });
  }

  const newFilePath = path.join(newDirPath, `${baseName}${ext}`);
  fs.renameSync(filePath, newFilePath);

  const indexPath = path.join(newDirPath, "index.ts");
  fs.writeFileSync(indexPath, `export * from "./${baseName}";\n`, "utf-8");

  return newFilePath;
};

// 잘못된 위치의 파일을 올바른 위치로 이동
const moveToCorrectLocation = () => {
  const rootDir = path.resolve(__dirname, "..");
  const wrongLocations = [path.join(rootDir, "src"), path.join(rootDir, "@")];

  wrongLocations.forEach((wrongDir) => {
    if (fs.existsSync(wrongDir)) {
      const files = fs.readdirSync(wrongDir);
      files.forEach((file) => {
        const srcPath = path.join(wrongDir, file);
        const destPath = path.join(UI_WEB_DIR, file);

        if (fs.statSync(srcPath).isFile()) {
          fs.renameSync(srcPath, destPath);
        }
      });

      // 빈 디렉토리 삭제
      fs.rmdirSync(wrongDir, { recursive: true });
    }
  });
};

// 메인 실행
const main = () => {
  const component = process.argv[2];

  if (!component) {
    console.error("❌ Usage: pnpm add:ui <component-name>");
    process.exit(1);
  }

  try {
    execSync(
      `cd packages/ui-web && pnpm dlx shadcn@latest add ${component} --yes`,
      { stdio: "inherit" }
    );
    moveToCorrectLocation();
    processDirectory(UI_WEB_DIR);

    console.log("✨ Done! Component installed and converted to PascalCase.");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

main();
