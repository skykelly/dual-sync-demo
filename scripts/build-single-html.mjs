import { mkdir, readFile, rm, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const entryModule = "src/app.js";

const moduleSources = new Map();

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

const entryHtml = await readFile(path.join(rootDir, "index.html"), "utf8");
const css = await readFile(path.join(rootDir, "styles/styles.css"), "utf8");
const modules = await collectModules(entryModule);
const script = renderRuntime(modules);
const html = entryHtml
  .replace(/<link rel="stylesheet" href="\.\/styles\/styles\.css" \/>/, `<style>\n${css}\n</style>`)
  .replace(/<script type="module" src="\.\/src\/app\.js"><\/script>/, `<script>\n${script}\n</script>`);

await writeFile(path.join(distDir, "index.html"), html);
await copyReferencedAssets();

console.log("Built dist/index.html");

async function collectModules(moduleId) {
  if (moduleSources.has(moduleId)) return moduleSources;

  const absolutePath = path.join(rootDir, moduleId);
  const source = await readFile(absolutePath, "utf8");
  moduleSources.set(moduleId, source);

  for (const importedPath of findImportPaths(source)) {
    await collectModules(resolveModuleId(moduleId, importedPath));
  }

  return moduleSources;
}

function renderRuntime(modules) {
  const factories = Array.from(modules.entries()).map(([moduleId, source]) => {
    const { code, exports } = transformModule(moduleId, source);
    const exportAssignments = exports.map((name) => `exports.${name} = ${name};`).join("\n");

    return `__factories[${JSON.stringify(moduleId)}] = function(exports) {\n${code}\n${exportAssignments}\n};`;
  }).join("\n\n");

  return `"use strict";
(function() {
const __factories = Object.create(null);
const __modules = Object.create(null);
function __require(moduleId) {
  if (!__modules[moduleId]) {
    const factory = __factories[moduleId];
    if (!factory) throw new Error("Missing bundled module: " + moduleId);
    const exports = {};
    __modules[moduleId] = exports;
    factory(exports);
  }
  return __modules[moduleId];
}

${factories}

__require(${JSON.stringify(entryModule)});
})();`;
}

function transformModule(moduleId, source) {
  const exports = [];
  let code = source.replace(/import\s+{([\s\S]*?)}\s+from\s+["']([^"']+)["'];/g, (_, specifiers, importedPath) => {
    const resolvedModuleId = resolveModuleId(moduleId, importedPath);
    return `const { ${specifiers.trim()} } = __require(${JSON.stringify(resolvedModuleId)});`;
  });

  code = code.replace(/export function\s+([A-Za-z_$][\w$]*)\s*\(/g, (_, name) => {
    exports.push(name);
    return `function ${name}(`;
  });

  code = code.replace(/export const\s+([A-Za-z_$][\w$]*)\s*=/g, (_, name) => {
    exports.push(name);
    return `const ${name} =`;
  });

  return { code, exports };
}

function findImportPaths(source) {
  return Array.from(source.matchAll(/import\s+{[\s\S]*?}\s+from\s+["']([^"']+)["'];/g), (match) => match[1]);
}

function resolveModuleId(fromModuleId, importedPath) {
  const fromDir = path.posix.dirname(fromModuleId);
  return path.posix.normalize(path.posix.join(fromDir, importedPath));
}

async function copyReferencedAssets() {
  const sourceText = Array.from(moduleSources.values()).join("\n");
  const assetPaths = new Set(Array.from(sourceText.matchAll(/["'](assets\/[^"']+)["']/g), (match) => match[1]));

  for (const assetPath of assetPaths) {
    const sourcePath = path.join(rootDir, assetPath);
    const targetPath = path.join(distDir, assetPath);

    try {
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(sourcePath, targetPath);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
}
