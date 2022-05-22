// Blog Types

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
