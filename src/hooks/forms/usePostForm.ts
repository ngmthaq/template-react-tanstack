import type { TFunction } from "i18next";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useCreatePost, useUpdatePost } from "../mutations";

export const createPostFormSchema = (t: TFunction) => {
  return Yup.object().shape({
    id: Yup.string().optional(),
    title: Yup.string()
      .required(t("forms.createPost.errors.titleRequired"))
      .min(20, t("forms.createPost.errors.titleMin", { min: 20 })),
    body: Yup.string()
      .required(t("forms.createPost.errors.bodyRequired"))
      .min(5, t("forms.createPost.errors.bodyMin", { min: 5 }))
      .max(100, t("forms.createPost.errors.bodyMax", { max: 100 })),
    userId: Yup.number()
      .required(t("forms.createPost.errors.userIdRequired"))
      .min(1, t("forms.createPost.errors.userIdMin", { min: 1 })),
  });
};

export type PostFormSchema = Yup.InferType<
  ReturnType<typeof createPostFormSchema>
>;

export function usePostForm(initialValues: PostFormSchema) {
  const { t } = useTranslation();
  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();

  const schema = createPostFormSchema(t);

  return useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      if (values.id) {
        updatePost(values);
      } else {
        createPost(values);
      }
    },
  });
}
