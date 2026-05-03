const { exec } = require("child_process");

module.exports.createView = function (viewName) {
  const fs = require("fs");
  const path = require("path");

  const viewDir = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "pages",
    viewName,
  );

  if (!fs.existsSync(viewDir)) {
    fs.mkdirSync(viewDir, { recursive: true });
  }

  const viewFileContent = `
export interface ${viewName}Props {
  // Define your props here
  exampleProp?: string;
}

export function ${viewName}({ exampleProp }: ${viewName}Props) {
  // Define your view logic here
  console.log(exampleProp);

  return <div>${viewName} view works!</div>;
}
`;

  const viewFilePath = path.join(viewDir, `index.tsx`);
  fs.writeFileSync(viewFilePath, viewFileContent);

  const styledFilePath = path.join(viewDir, `styled.tsx`);
  const styledFileContent = ``;
  fs.writeFileSync(styledFilePath, styledFileContent);

  const indexFilePath = path.join(viewDir, "..", "index.ts");
  const indexFileContent = `export * from './${viewName}';\n`;
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
    console.log(`View ${viewName} created successfully at ${viewFilePath}`);
  });
};
