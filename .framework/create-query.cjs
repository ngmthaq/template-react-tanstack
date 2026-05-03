const { exec } = require("child_process");

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

module.exports.createQuery = function (queryName) {
  const fs = require("fs");
  const path = require("path");

  const queriesDir = path.join(__dirname, "..", "src", "hooks", "queries");

  if (!fs.existsSync(queriesDir)) {
    fs.mkdirSync(queriesDir, { recursive: true });
  }

  const queryFileName = `use${queryName}`;
  const queryFilePath = path.join(queriesDir, `${queryFileName}.ts`);

  const queryFileContent = `
import { queryOptions, useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import { API_ENDPOINTS } from "@/constants";
import { api, ApiException } from "@/utils";

export const ${toCamelCase(queryName)}ResponseSchema = Yup.object({
  // Define your response schema here
}).required();

export const ${toCamelCase(queryName)}QueryOptions = () => {
  return queryOptions({
    queryKey: [],
    queryFn: async () => {
      console.log({ API_ENDPOINTS, api, ApiException });
      const response = {}; // Replace with actual API call
      return ${toCamelCase(queryName)}ResponseSchema.validate(response);
    },
  });
};

export function use${queryName}() {
  return useQuery(${toCamelCase(queryName)}QueryOptions());
}
`;

  fs.writeFileSync(queryFilePath, queryFileContent);

  const indexFilePath = path.join(queriesDir, "index.ts");
  const indexFileContent = `export * from './${queryFileName}';\n`;
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
    console.log(`Query ${queryName} created successfully at ${queryFilePath}`);
  });
};
