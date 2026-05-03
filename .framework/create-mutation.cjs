const { exec } = require("child_process");

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

module.exports.createMutation = function (mutationName) {
  const fs = require("fs");
  const path = require("path");

  const mutationsDir = path.join(__dirname, "..", "src", "hooks", "mutations");

  if (!fs.existsSync(mutationsDir)) {
    fs.mkdirSync(mutationsDir, { recursive: true });
  }

  const camelCaseName = toCamelCase(mutationName);
  const mutationFileName = `use${mutationName}`;
  const mutationFilePath = path.join(mutationsDir, `${mutationFileName}.ts`);

  const mutationFileContent = `
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils";

export const ${camelCaseName}ResponseSchema = Yup.object({
  // Define your response schema here
}).required();

export function use${mutationName}() {
  return useMutation({
    mutationKey: [],
    mutationFn: async (data) => {
      console.log({ API_ENDPOINTS, api, data });
      const exampleResponse = {}; // Replace with actual API call
      return ${camelCaseName}ResponseSchema.validate(exampleResponse);
    },
  });
}
`;

  fs.writeFileSync(mutationFilePath, mutationFileContent);

  const indexFilePath = path.join(mutationsDir, "index.ts");
  const indexFileContent = `export * from './${mutationFileName}';\n`;
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
      `Mutation ${mutationName} created successfully at ${mutationFilePath}`,
    );
  });
};
