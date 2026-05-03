const { exec } = require("child_process");

module.exports.createHook = function (hookName) {
  const fs = require("fs");
  const path = require("path");

  const hooksDir = path.join(__dirname, "..", "src", "hooks", "common");

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookFilePath = path.join(hooksDir, `${hookName}.ts`);

  const hookFileContent = `export function ${hookName}() {
  // Define your hook logic here
}
`;

  fs.writeFileSync(hookFilePath, hookFileContent);

  const indexFilePath = path.join(hooksDir, "index.ts");
  const indexFileContent = `export * from './${hookName}';\n`;
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
    console.log(`Hook ${hookName} created successfully at ${hookFilePath}`);
  });
};
