// Blog Types
import { z } from 'zod';
import { DatabaseId, IResource } from '~/shared/core/types';

// Blog Authors
export type BlogAuthorData = {
  firstname: string;
  lastname: string;
  website: string;
};

export interface BlogAuthor extends BlogAuthorData, IResource {
  id: DatabaseId;
}

// Blog Categories
export type BlogCategoryData = {
  site_id: string;
  slug: string;
  title: string;
};

export interface BlogCategory extends BlogCategoryData, IResource {
  id: DatabaseId;
}

export const AuthorListParams = z.object({
  limit: z.preprocess((val) => (val ? Number(val) : 25), z.number()),
  order: z.preprocess((val) => (val ? val : 'lastname'), z.string()),
  cursor: z.string().optional()
});

export type AuthorListParamsType = z.infer<typeof CategoryListParams>;

export const CategoryListParams = z.object({
  limit: z.preprocess((val) => (val ? Number(val) : 25), z.number()),
  order: z.preprocess((val) => (val ? val : 'title'), z.string()),
  cursor: z.string().optional()
});
export type CategoryListParamsType = z.infer<typeof CategoryListParams>;
