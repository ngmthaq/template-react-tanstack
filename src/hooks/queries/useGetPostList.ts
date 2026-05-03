import { queryOptions, useQuery } from "@tanstack/react-query";
import * as Yup from "yup";
import { API_ENDPOINTS } from "@/constants";
import type { DefaultQueryOptions } from "@/types";
import { api } from "@/utils";
import { getPostByIdResponseSchema } from "./useGetPostById";

export const getPostListResponseSchema = Yup.array()
  .of(getPostByIdResponseSchema.clone())
  .required();

export type GetPostListResponseSchema = Yup.InferType<
  typeof getPostListResponseSchema
>;

export function getPostListQueryOptions(params: DefaultQueryOptions) {
  return queryOptions({
    enabled: params.enabled,
    queryKey: [API_ENDPOINTS.get.getAllPosts, params],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.get.getAllPosts);
      return getPostListResponseSchema.validate(response.data);
    },
  });
}

export function useGetPostList(params: DefaultQueryOptions = {}) {
  return useQuery(getPostListQueryOptions(params));
}
