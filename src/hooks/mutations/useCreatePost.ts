import type { PostFormSchema } from "../forms";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils";

export const createPostResponseSchema = Yup.object({
  id: Yup.string().required(),
  title: Yup.string().required(),
  body: Yup.string().required(),
  userId: Yup.number().required(),
}).required();

export type CreatePostResponseSchema = Yup.InferType<
  typeof createPostResponseSchema
>;

export function useCreatePost() {
  return useMutation({
    mutationKey: [API_ENDPOINTS.post.createPost],
    mutationFn: async (postData: PostFormSchema) => {
      const response = await api.post(API_ENDPOINTS.post.createPost, postData);
      return createPostResponseSchema.validate(response.data);
    },
  });
}
