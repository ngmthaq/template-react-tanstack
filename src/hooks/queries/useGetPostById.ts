import { queryOptions, useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import { API_ENDPOINTS } from "@/constants";
import type { DefaultQueryOptions } from "@/types";
import { api, ApiException } from "@/utils";

export type GetPostByIdQueryOptions = DefaultQueryOptions & {
  postId?: string;
};

export const getPostByIdResponseSchema = Yup.object({
  id: Yup.string().required(),
  title: Yup.string().required(),
  body: Yup.string().required(),
  userId: Yup.number().required(),
}).required();

export type GetPostByIdResponseSchema = Yup.InferType<
  typeof getPostByIdResponseSchema
>;

export function getPostByIdQueryOptions(params: GetPostByIdQueryOptions) {
  const enabled = (params.enabled ?? true) && !!params.postId;
  return queryOptions({
    enabled: enabled,
    queryKey: [API_ENDPOINTS.get.getPostById, params],
    queryFn: async () => {
      if (!params.postId) throw new ApiException("Post ID is required");
      const response = await api.get(
        API_ENDPOINTS.get.getPostById.replace(":id", params.postId),
      );
      return getPostByIdResponseSchema.validate(response.data);
    },
  });
}

export function useGetPostById(params: GetPostByIdQueryOptions = {}) {
  return useQuery(getPostByIdQueryOptions(params));
}
