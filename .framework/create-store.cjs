const { exec } = require("child_process");

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

module.exports.createStore = function (storeName) {
  const fs = require("fs");
  const path = require("path");

  const storesDir = path.join(__dirname, "..", "src", "hooks", "stores");

  if (!fs.existsSync(storesDir)) {
    fs.mkdirSync(storesDir, { recursive: true });
  }

  const storeFileName = `use${storeName}Store`;
  const storeFilePath = path.join(storesDir, `${storeFileName}.ts`);

  const storeFileContent = `
import { atom, useAtom } from "jotai";

export const ${toCamelCase(storeName)}Atom = atom<unknown>(null);
${toCamelCase(storeName)}Atom.debugLabel = "${toCamelCase(storeName)}Atom";

export function use${storeName}Store() {
  return useAtom(${toCamelCase(storeName)}Atom);
}
`;

  fs.writeFileSync(storeFilePath, storeFileContent);

  const indexFilePath = path.join(storesDir, "index.ts");
  const indexFileContent = `export * from './${storeFileName}';\n`;
  fs.appendFileSync(indexFilePath, indexFileContent);

  exec(`yarn prettier --write .`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error formatting file: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Prettier stderr: ${stderr}`);
      return;
    }
    console.log(`Store ${storeName} created successfully at ${storeFilePath}`);
  });
};
