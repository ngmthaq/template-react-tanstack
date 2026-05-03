import type { PostFormSchema } from "../forms";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { API_ENDPOINTS } from "@/constants";
import { api, ApiException } from "@/utils";
import { createPostResponseSchema } from "./useCreatePost";

export const updatePostResponseSchema = createPostResponseSchema.clone();

export type UpdatePostResponseSchema = Yup.InferType<
  typeof updatePostResponseSchema
>;

export function useUpdatePost() {
  return useMutation({
    mutationKey: [API_ENDPOINTS.put.updatePostById],
    mutationFn: async (postData: PostFormSchema) => {
      if (!postData.id) throw new ApiException("Post ID is required");
      const response = await api.put(
        API_ENDPOINTS.put.updatePostById.replace(":id", postData.id),
        postData,
      );
      return updatePostResponseSchema.validate(response.data);
    },
  });
}
