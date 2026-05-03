const { exec } = require("child_process");

module.exports.createForm = function (formName) {
  const fs = require("fs");
  const path = require("path");

  const formsDir = path.join(__dirname, "..", "src", "hooks", "forms");

  if (!fs.existsSync(formsDir)) {
    fs.mkdirSync(formsDir, { recursive: true });
  }

  const formFileName = `use${formName}Form`;
  const formFilePath = path.join(formsDir, `${formFileName}.ts`);

  const formFileContent = `
import type { TFunction } from "i18next";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

export const create${formName}FormSchema = (t: TFunction) => {
  return Yup.object().shape({
    // Define your schema here
    exampleField: Yup.string()
      .required(t("forms.${formName.toLowerCase()}Form.errors.exampleFieldRequired"))
      .min(5, t("forms.${formName.toLowerCase()}Form.errors.exampleFieldMin", { min: 5 })),
  });
};

export type ${formName}FormSchema = Yup.InferType<
  ReturnType<typeof create${formName}FormSchema>
>;

export function use${formName}Form(initialValues: ${formName}FormSchema) {
  const { t } = useTranslation();
  const schema = useMemo(() => create${formName}FormSchema(t), [t]);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      // Handle submit
      console.log(values);
    },
  });
}
`;

  fs.writeFileSync(formFilePath, formFileContent);

  const indexFilePath = path.join(formsDir, "index.ts");
  const indexFileContent = `export * from './${formFileName}';\n`;
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
    console.log(`Form ${formName} created successfully at ${formFilePath}`);
  });
};
