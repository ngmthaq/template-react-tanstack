const { exec } = require("child_process");

const VALID_ATOMIC_LEVELS = [
  "atoms",
  "molecules",
  "organisms",
  "templates",
  "pages",
];
module.exports.VALID_ATOMIC_LEVELS = VALID_ATOMIC_LEVELS;

module.exports.createComponent = function (atomicLevel, componentName) {
  const fs = require("fs");
  const path = require("path");

  if (!atomicLevel || !VALID_ATOMIC_LEVELS.includes(atomicLevel)) {
    console.error(`🛑 Invalid or missing atomic level: "${atomicLevel}"`);
    console.error(`🛑 Valid levels: ${VALID_ATOMIC_LEVELS.join(", ")}`);
    console.error(
      `Usage: node .framework/create-resource.cjs component {atomicLevel} {ComponentName}`,
    );
    process.exit(1);
  }

  const componentDir = path.join(
    __dirname,
    "..",
    "src",
    "components",
    atomicLevel,
    componentName,
  );

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const componentFileContent = `
export interface ${componentName}Props {
  // Define your props here
  exampleProp?: string;
}

export function ${componentName}({ exampleProp }: ${componentName}Props) {
  console.log(exampleProp);

  return <div>${componentName} component works!</div>;
}
`;

  const componentFilePath = path.join(componentDir, `index.tsx`);
  fs.writeFileSync(componentFilePath, componentFileContent);

  const styledFilePath = path.join(componentDir, `styled.tsx`);
  const styledFileContent = ``;
  fs.writeFileSync(styledFilePath, styledFileContent);

  const indexFilePath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    atomicLevel,
    "index.ts",
  );
  const indexFileContent = `export * from './${componentName}';\n`;
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
      `Component ${componentName} created successfully at ${componentFilePath}`,
    );
  });
};
