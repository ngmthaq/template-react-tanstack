const { exec } = require("child_process");

module.exports.createLayout = function (layoutName) {
  const fs = require("fs");
  const path = require("path");

  const layoutDir = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "templates",
    layoutName,
  );

  if (!fs.existsSync(layoutDir)) {
    fs.mkdirSync(layoutDir, { recursive: true });
  }

  const layoutFileContent = `
export interface ${layoutName}Props {
  // Define your props here
  exampleProp?: string;
}

export function ${layoutName}({ exampleProp }: ${layoutName}Props) {
  console.log(exampleProp);

  return <div>${layoutName} layout works!</div>;
}
`;

  const layoutFilePath = path.join(layoutDir, `index.tsx`);
  fs.writeFileSync(layoutFilePath, layoutFileContent);

  const styledFilePath = path.join(layoutDir, `styled.tsx`);
  const styledFileContent = ``;
  fs.writeFileSync(styledFilePath, styledFileContent);

  const indexFilePath = path.join(layoutDir, "..", "index.ts");
  const indexFileContent = `export * from './${layoutName}';\n`;
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
    console.log(
      `Layout ${layoutName} created successfully at ${layoutFilePath}`,
    );
  });
};
